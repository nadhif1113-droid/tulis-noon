// app/api/validate-arabic/route.js
// Validasi: apakah teks adalah bahasa Arab yang BERMAKNA (bukan ngasal/acak).
// Dipakai chat teman — pesan harus Arab & punya arti, kalau ngasal ditolak.

import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const MODEL = 'claude-haiku-4-5-20251001';

// Rate limit ringan per IP
const rateLimitMap = new Map();
const RATE_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT = 80;
function checkRateLimit(key) {
  const now = Date.now();
  const e = rateLimitMap.get(key);
  if (!e || now > e.resetAt) { rateLimitMap.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS }); return true; }
  if (e.count >= RATE_LIMIT) return false;
  e.count++; return true;
}

// Cek dasar (cepat, tanpa AI): harus ada huruf Arab & tanpa huruf Latin.
const ARABIC_RE = /[؀-ۿ]/;
const LATIN_RE = /[a-zA-Z]/;

export async function POST(req) {
  try {
    const { text } = await req.json().catch(() => ({}));
    const clean = (text || '').toString().trim();

    if (!clean) return NextResponse.json({ valid: false, reason: 'Pesan kosong' }, { status: 200 });
    if (clean.length > 500) return NextResponse.json({ valid: false, reason: 'Terlalu panjang' }, { status: 200 });

    // 1) Cek cepat: harus mengandung huruf Arab & tidak ada huruf Latin.
    if (!ARABIC_RE.test(clean)) {
      return NextResponse.json({ valid: false, reason: 'Harus pakai huruf Arab' }, { status: 200 });
    }
    if (LATIN_RE.test(clean)) {
      return NextResponse.json({ valid: false, reason: 'Jangan campur huruf latin — Arab saja' }, { status: 200 });
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anon';
    if (!checkRateLimit(ip)) {
      // Kalau rate limit kena, lolosin aja (jangan blokir user) — cek dasar udah lewat.
      return NextResponse.json({ valid: true, reason: 'ok' }, { status: 200 });
    }

    // 2) Cek makna pakai AI (anti ngasal: "اااا", "كككك", huruf acak).
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const resp = await client.messages.create({
      model: MODEL,
      max_tokens: 20,
      system: 'Kamu validator teks Arab. Tentukan apakah teks adalah bahasa Arab yang BERMAKNA (kata/kalimat asli yang punya arti), BUKAN huruf acak/diulang-ulang/ngasal. Salam & frasa pendek umum (mis. السلام عليكم، كيف حالك) = bermakna. Jawab HANYA satu kata: "VALID" atau "INVALID".',
      messages: [{ role: 'user', content: clean }],
    });

    const out = (resp.content?.[0]?.text || '').trim().toUpperCase();
    const valid = out.includes('VALID') && !out.includes('INVALID');
    return NextResponse.json({ valid, reason: valid ? 'ok' : 'Sepertinya bukan kalimat Arab yang bermakna' }, { status: 200 });
  } catch (e) {
    console.error('validate-arabic error:', e);
    // Kalau AI error, jangan blokir total — cek dasar (Arab, no latin) udah lolos.
    return NextResponse.json({ valid: true, reason: 'ok (skip ai)' }, { status: 200 });
  }
}
