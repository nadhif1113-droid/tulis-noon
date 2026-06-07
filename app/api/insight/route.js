// app/api/insight/route.js
// POST endpoint untuk generate "Pemahaman" pasca-percakapan.
// User udah selesai 1 percakapan → dapet card insight: frasa kunci, konteks budaya, tip praktis.
//
// Pakai Claude Haiku (cheap + cepat). Cache di Firestore biar 1 percakapan = 1x generate.

import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import { adminFirestore } from '@/lib/firebase-admin';

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 800;
const CACHE_COLLECTION = 'insightCache';

// Rate limit: 30 request per user per 5 menit (insight gak butuh spam)
const rateLimitMap = new Map();
const RATE_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT = 30;

function checkRateLimit(userId) {
  const now = Date.now();
  const e = rateLimitMap.get(userId);
  if (!e || now > e.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (e.count >= RATE_LIMIT) return false;
  e.count++;
  return true;
}

const SYSTEM_PROMPT = `Kamu adalah "Pemahaman Coach" — kasih insight pasca-percakapan untuk pelajar bahasa Arab Indonesia.

KONTEKS: User baru selesai latihan 1 percakapan modul belajar. Dia perlu insight singkat biar gak cuma hafal kalimat, tapi paham KONTEKS.

INPUT: JSON dengan field { moduleTitle, convTitle, situation, vocab[], dialog[] }.

OUTPUT: WAJIB JSON valid (no code fence), format persis ini:
{
  "keyPhrases": [
    { "ar": "...", "latin": "...", "meaning": "..." },
    { "ar": "...", "latin": "...", "meaning": "..." }
  ],
  "cultural": "1-2 kalimat tentang konteks budaya/Saudi/penggunaan praktis — kenapa frasa ini dipakai begini di situasi tsb",
  "tip": "1 kalimat tip praktis — variasi/alternatif/tata bahasa singkat yang aktionable",
  "grammar": "OPSIONAL: 1 kalimat tata bahasa singkat KALAU ADA pola menarik (i'rab, struktur), kalo gak ada string kosong"
}

ATURAN:
1. Bahasa Indonesia santai tapi sopan. Jangan formal kaku.
2. keyPhrases: pilih 2-3 frasa Arab paling penting/kerap-pakai dari dialog/vocab. Format harakat lengkap.
3. cultural: insight nyata tentang konvensi Saudi/Hijazi (mis. "Di Saudi, X biasanya dipanggil Y"), BUKAN reword definisi.
4. tip: actionable. Mis. "Untuk lebih sopan, tambahin min fadhlik di akhir" — bukan "ini penting".
5. grammar: opsional. Kalau ada pola i'rab atau sintaksis menarik dari dialog → jelasin singkat. Kalau gak, return "".
6. JANGAN copy-paste dari vocab/dialog yang udah ada — kasih VALUE tambahan.
7. JANGAN over-explain. Singkat tapi padat.

CONTOH OUTPUT:
{
  "keyPhrases": [
    { "ar": "الطَّابِق الثَّانِي", "latin": "ath-thaabiq ats-tsaani", "meaning": "lantai dua" },
    { "ar": "عَلَى الْيَمِين", "latin": "'alaa al-yamiin", "meaning": "di sebelah kanan" }
  ],
  "cultural": "Di Saudi, 'HRD' lebih dikenal sebagai qism al-mawaarid al-basyariyyah (قِسْم الْمَوَارِد الْبَشَرِيَّة). Staf lokal biasanya gak paham singkatan Inggris — pakai istilah Arab supaya gak miscom.",
  "tip": "Untuk tanya arah, mulai dengan 'ayna' (di mana), bukan 'min ayna' (dari mana). Bedanya tipis tapi penting biar gak salah paham.",
  "grammar": "Kata الثَّانِي (kedua) adalah sifat untuk الطَّابِق, jadi i'rab-nya ngikut — sama-sama jar (ujungnya kasrah)."
}`;

async function generateInsight(payload) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');
  const client = new Anthropic({ apiKey });

  const userMessage = `Generate insight untuk percakapan ini:\n${JSON.stringify(payload, null, 2)}`;

  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  });

  const text = msg.content?.[0]?.type === 'text' ? msg.content[0].text : '';
  // Strip markdown code fence if model accidentally adds it
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('[insight] JSON parse fail:', cleaned.substring(0, 200));
    throw new Error('AI returned invalid JSON');
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { moduleId, convId, payload, userId } = body;

    if (!moduleId || !convId || !payload) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (userId && !checkRateLimit(userId)) {
      return NextResponse.json({ error: 'Rate limit exceeded — coba 5 menit lagi' }, { status: 429 });
    }

    const cacheKey = `${moduleId}__${convId}`;
    const cacheRef = adminFirestore.collection(CACHE_COLLECTION).doc(cacheKey);

    // 1. Cek cache
    try {
      const cached = await cacheRef.get();
      if (cached.exists) {
        const data = cached.data();
        return NextResponse.json({ ...data.insight, cached: true });
      }
    } catch (e) {
      console.warn('[insight] cache read fail (continuing):', e.message);
    }

    // 2. Generate via AI
    const insight = await generateInsight(payload);

    // 3. Save cache (best-effort, non-blocking error)
    try {
      await cacheRef.set({
        moduleId,
        convId,
        insight,
        generatedAt: Date.now(),
      });
    } catch (e) {
      console.warn('[insight] cache write fail (continuing):', e.message);
    }

    return NextResponse.json({ ...insight, cached: false });
  } catch (e) {
    console.error('[insight] error:', e);
    return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
  }
}
