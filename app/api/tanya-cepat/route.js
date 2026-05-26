// app/api/tanya-cepat/route.js
// POST endpoint untuk Tanya Cepat — user ngomong/ngetik Indonesia → AI jawab Arab Hijazi + transliterasi + Indo.
// Khusus konteks Saudi Arabia (Mekkah/Madinah) untuk jamaah umrah/haji/TKI.

import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 600;

// Rate limit: 40 request per user per 5 menit
const rateLimitMap = new Map();
const RATE_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT = 40;

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

const SYSTEM_PROMPT = `Kamu adalah "Tanya Cepat" — asisten bahasa Arab Hijazi untuk jamaah Indonesia (umrah/haji/TKI) di Saudi Arabia.

PERAN: Bantu user (orang Indonesia) untuk tahu CARA NGOMONG sesuatu dalam bahasa Arab Hijazi (dialek Mekkah/Madinah), bukan Fusha (formal). Contoh skenario: tanya arah, nawar harga di pasar, order makanan, tanya waktu, minta bantuan, bicara dengan polisi/jamaah lokal, dll.

INPUT user: pertanyaan dalam Bahasa Indonesia (kadang campur Arab). Contoh: "Gimana cara tanya 'di mana toilet?' ke orang Saudi?"

OUTPUT: Selalu balas dengan format JSON valid (tanpa code fence), persis seperti ini:
{
  "ar": "النص بالعربية الحجازية",
  "latin": "transliterasi latin (mudah dibaca orang Indonesia)",
  "indo": "Terjemahan ke bahasa Indonesia",
  "tips": "Tips singkat 1 kalimat tentang konteks/pengucapan/situasi (boleh kosong jika gak relevan)",
  "alternatif": [
    { "ar": "...", "latin": "...", "indo": "..." }
  ]
}

ATURAN PENTING:
1. WAJIB pakai dialek HIJAZI (Mekkah/Madinah), BUKAN Fusha. Contoh: pakai "وين" bukan "أين", "كم" tetap, "ايش" bukan "ماذا", "تبي" bukan "تريد"
2. Maksimal 2 alternatif. Jika cuma 1 cara umum, "alternatif" boleh kosong [].
3. Latin transliterasi: gunakan tanda yang mudah dibaca orang Indonesia. Contoh: "wein" (bukan "ayna"), "kam" (bukan "kayfa"), "syukran" (bukan "shukran").
4. Output WAJIB JSON valid. JANGAN tulis penjelasan di luar JSON.
5. Jika user nanya hal yang BUKAN translation request (misal: "gimana cuaca?"), respond JSON dengan ar:"", indo:"Saya khusus bantu translate ke Arab Hijazi. Coba tanya: 'Gimana cara bilang X dalam Arab?'", tips:"", alternatif:[]
6. Jika user pakai bahasa kasar / topik haram, tolak dengan polite dalam JSON yang sama.

CONTOH INPUT-OUTPUT:

Input: "Gimana cara tanya di mana masjid Nabawi?"
Output:
{
  "ar": "وين المسجد النبوي؟",
  "latin": "wein al-masjid an-nabawi?",
  "indo": "Di mana Masjid Nabawi?",
  "tips": "Pakai 'wein' (dialek Hijazi) lebih natural daripada 'ayna' (Fusha)",
  "alternatif": [
    { "ar": "فين المسجد النبوي؟", "latin": "fein al-masjid an-nabawi?", "indo": "Di mana Masjid Nabawi? (lebih casual)" }
  ]
}

Input: "Aku mau bilang terima kasih banyak ke driver taksi"
Output:
{
  "ar": "شكراً جزيلاً يا أخي",
  "latin": "syukran jaziilan ya akhi",
  "indo": "Terima kasih banyak, saudaraku",
  "tips": "'Ya akhi' (saudaraku) bikin terdengar ramah ke laki Arab. Untuk perempuan, 'ya ukhti'.",
  "alternatif": [
    { "ar": "الله يعطيك العافية", "latin": "Allah yi'tik al-'afiya", "indo": "Semoga Allah beri kamu kesehatan (cara halus thanks)" }
  ]
}`;

export async function POST(request) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API belum dikonfigurasi.' }, { status: 500 });
    }

    const body = await request.json();
    const { question, userId } = body;

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'question required (string)' }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }
    if (question.length > 500) {
      return NextResponse.json({ error: 'Pertanyaan terlalu panjang (max 500 char).' }, { status: 400 });
    }

    if (!checkRateLimit(userId)) {
      return NextResponse.json(
        { error: 'Terlalu banyak request. Coba lagi nanti.' },
        { status: 429 }
      );
    }

    const anthropic = new Anthropic({ apiKey });

    // Prefill technique: paksa Claude output JSON dengan prefill '{'
    // Ini reliable banget — Claude akan otomatis lanjutin sebagai JSON valid.
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: question.trim() },
        { role: 'assistant', content: '{' },  // prefill — forces JSON continuation
      ],
    });

    const rawText = response.content?.[0]?.text || '';
    // Prepend the '{' we used as prefill (Claude continues AFTER it)
    const fullText = '{' + rawText;

    // Robust JSON extraction — handle case where Claude adds explanation after JSON
    let parsed;
    try {
      // Strategy 1: Try direct parse
      parsed = JSON.parse(fullText.trim());
    } catch (e1) {
      try {
        // Strategy 2: Extract first balanced { ... } block
        const match = fullText.match(/\{[\s\S]*?\}(?=\s*$|[^}])/);
        if (match) {
          parsed = JSON.parse(match[0]);
        } else {
          throw new Error('No JSON block found');
        }
      } catch (e2) {
        try {
          // Strategy 3: Find largest balanced { ... }
          const firstBrace = fullText.indexOf('{');
          const lastBrace = fullText.lastIndexOf('}');
          if (firstBrace !== -1 && lastBrace > firstBrace) {
            parsed = JSON.parse(fullText.slice(firstBrace, lastBrace + 1));
          } else {
            throw new Error('No JSON braces');
          }
        } catch (e3) {
          // Final fallback: treat the raw text as a plain answer in indo
          console.error('Tanya Cepat JSON parse failed. Raw:', fullText.slice(0, 500));
          parsed = {
            ar: '',
            latin: '',
            indo: fullText.replace(/[{}"]/g, '').replace(/\s+/g, ' ').trim().slice(0, 400) || 'AI gak ngasih jawaban yang valid. Coba reformulate pertanyaan kamu.',
            tips: '',
            alternatif: [],
          };
        }
      }
    }

    return NextResponse.json({
      ar: parsed.ar || '',
      latin: parsed.latin || '',
      indo: parsed.indo || '',
      tips: parsed.tips || '',
      alternatif: Array.isArray(parsed.alternatif) ? parsed.alternatif.slice(0, 2) : [],
    });
  } catch (err) {
    console.error('Tanya Cepat API error:', err);
    return NextResponse.json(
      { error: 'Server error: ' + (err.message || 'unknown') },
      { status: 500 }
    );
  }
}
