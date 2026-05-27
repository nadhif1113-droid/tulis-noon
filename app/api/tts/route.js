// app/api/tts/route.js
// Server-side Text-to-Speech untuk teks Arab.
// Pakai Google Cloud Text-to-Speech REST API, auth via FIREBASE_SERVICE_ACCOUNT
// (service account yang sama dgn Firebase Admin — reuse kredensial GCP yang udah ada).
//
// Kenapa server-side?
//   Web Speech API (speechSynthesis) butuh voice Arab terinstall di device.
//   Banyak Android (terutama HP murah / target jamaah) GAK punya voice Arab → bisu.
//   Server TTS jamin suara Arab konsisten di SEMUA device.
//
// Voice: ar-XA (Arabic, multi-region) Wavenet — natural & jelas.
// Free tier Google Cloud TTS: 1 juta char/bulan (Wavenet) — lebih dari cukup.

import { NextResponse } from 'next/server';
import { GoogleAuth } from 'google-auth-library';

const TTS_ENDPOINT = 'https://texttospeech.googleapis.com/v1/text:synthesize';
const TTS_SCOPE = 'https://www.googleapis.com/auth/cloud-platform';

// Rate limit ringan: 60 request per IP per 5 menit (cegah abuse).
const rateLimitMap = new Map();
const RATE_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT = 60;

function checkRateLimit(key) {
  const now = Date.now();
  const e = rateLimitMap.get(key);
  if (!e || now > e.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (e.count >= RATE_LIMIT) return false;
  e.count++;
  return true;
}

// Cache access token (berlaku ~1 jam) supaya gak request token tiap kali.
let cachedAuth = null;
function getAuthClient() {
  if (cachedAuth) return cachedAuth;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT not set');
  const sa = JSON.parse(raw);
  cachedAuth = new GoogleAuth({
    credentials: {
      client_email: sa.client_email,
      private_key: sa.private_key,
    },
    scopes: [TTS_SCOPE],
  });
  return cachedAuth;
}

// Pilihan voice Arab. Default ke Wavenet-B (laki, jelas).
// Bisa override dari client lewat body.voice (mis. untuk variasi).
const VOICES = {
  'male':   { languageCode: 'ar-XA', name: 'ar-XA-Wavenet-B', ssmlGender: 'MALE' },
  'female': { languageCode: 'ar-XA', name: 'ar-XA-Wavenet-A', ssmlGender: 'FEMALE' },
  'male2':  { languageCode: 'ar-XA', name: 'ar-XA-Wavenet-C', ssmlGender: 'MALE' },
};

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const text = (body.text || '').toString().trim();
    const voiceKey = body.voice || 'male';
    const rate = typeof body.rate === 'number' ? body.rate : 0.85;

    if (!text) {
      return NextResponse.json({ error: 'text required' }, { status: 400 });
    }
    // Batasi panjang (cegah abuse & biaya). 500 char cukup untuk kalimat/frasa.
    if (text.length > 500) {
      return NextResponse.json({ error: 'text too long (max 500 chars)' }, { status: 400 });
    }

    // Rate limit by IP
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anon';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'rate limit exceeded' }, { status: 429 });
    }

    const voice = VOICES[voiceKey] || VOICES.male;

    // Dapatkan access token dari service account
    const auth = getAuthClient();
    const client = await auth.getClient();
    const tokenResp = await client.getAccessToken();
    const accessToken = tokenResp?.token;
    if (!accessToken) {
      return NextResponse.json({ error: 'auth failed' }, { status: 500 });
    }

    // Panggil Google Cloud TTS
    const ttsResp = await fetch(TTS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: { text },
        voice: { languageCode: voice.languageCode, name: voice.name, ssmlGender: voice.ssmlGender },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: rate,
          pitch: 0,
        },
      }),
    });

    if (!ttsResp.ok) {
      const errText = await ttsResp.text().catch(() => '');
      console.error('Google TTS error:', ttsResp.status, errText);
      // 403 = API belum di-enable atau service account ga punya akses
      const hint = ttsResp.status === 403
        ? 'Cloud Text-to-Speech API belum di-enable atau service account belum punya akses.'
        : undefined;
      return NextResponse.json(
        { error: 'tts upstream failed', status: ttsResp.status, hint },
        { status: 502 }
      );
    }

    const data = await ttsResp.json();
    const audioContent = data?.audioContent; // base64 MP3
    if (!audioContent) {
      return NextResponse.json({ error: 'no audio returned' }, { status: 502 });
    }

    return NextResponse.json(
      { audioContent, mime: 'audio/mp3' },
      {
        status: 200,
        // Cache di CDN Vercel + browser: teks Arab sama → audio sama (immutable).
        headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=604800' },
      }
    );
  } catch (e) {
    console.error('TTS route error:', e);
    return NextResponse.json({ error: 'internal error' }, { status: 500 });
  }
}
