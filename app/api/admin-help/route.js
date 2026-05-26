// app/api/admin-help/route.js
// AI Admin chatbot — customer service untuk Tulis Noon.
// Jawab keluhan, pertanyaan tentang fitur, koin, payment, hafalan, dll.
// Kalau AI gak tahu jawabannya → flag `needs_human = true` dan escalate ke email founder.

import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 600;

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

const SYSTEM_PROMPT = `Kamu adalah "Admin AI" — asisten customer service resmi untuk aplikasi Tulis Noon.

TENTANG TULIS NOON:
Tulis Noon adalah aplikasi belajar bahasa Arab untuk jamaah Indonesia (umrah/haji/TKI) yang akan atau sedang berada di Saudi Arabia. Didirikan oleh Nadhif Azikra di Madinah.

FITUR-FITUR APLIKASI:
1. **Hafalan Quran** — Hafalan surat dgn 5-stage method (intro, listen, repeat, recall, perfect). Audio Syekh Mishary Alafasy. Voice recognition untuk validasi bacaan. 30 Juz lengkap (Al-Fatihah + Juz 30 gratis, sisanya 120 koin one-time atau sekarang semua dibuka di launch phase).
2. **Perkenalan Diri** — 12 materi pelajaran Arab Hijazi: Nama, Asal, Umur, Pekerjaan (FREE) + Keluarga, Pendidikan, Hobi, Tujuan, Bahasa, Kontak, Status, Jamaah Haji (PREMIUM 5 koin/materi atau bundle 150 koin lifetime).
3. **Tanya Cepat** — Chat AI Hijazi (cuma muncul kalau user di Saudi/Timur Tengah). Free 5 percakapan, bundle 10 percakapan = 5 koin.
4. **Tebak Gambar** — Game visual quiz 5 kategori.
5. **Cerita Interaktif** — 21 cerita: 5 Mudah + 6 Sedang + 10 Lanjut (sejarah Islam & sahabat).
6. **Match Arena** — PvP multiplayer (mock saat ini).
7. **Daily Challenge** — Skenario harian rotasi.
8. **Roleplay AI** — Chat dgn AI Hijazi (Pasar Madinah, Tanya Arah, dll).

SISTEM:
- **XP & Level**: 5 tier (Mubtadi/Daris/Mutawassith/Faaheem/Mahir)
- **Streak**: tracking harian, ada milestone reward
- **Lives**: max 10/hari, +3 per 24 jam refresh, atau beli 1 koin = 1 nyawa
- **Koin**: top-up via Midtrans (QRIS, VA Bank, GoPay, ShopeePay, OVO, DANA, Apple Pay, Google Pay)
- **Paket koin**: Starter 50 koin Rp 15rb · Hemat 175 koin Rp 39rb · Power 600 koin Rp 99rb · Pilgrim 2000 koin Rp 249rb

PEMBAYARAN:
- Provider: Midtrans (Indonesia). Aman, terenkripsi, PCI-DSS Level 1.
- Koin auto-credit setelah pembayaran berhasil (1-5 menit, kalau VA Bank menunggu konfirmasi transfer).
- Refund: hubungi support, kasus per kasus.

CARA JAWAB:
1. Bahasa Indonesia santai tapi sopan. Singkat (3-5 kalimat).
2. Kalau user keluhan/bug → minta maaf, kasih saran troubleshooting (refresh, cek koneksi, logout-login).
3. Kalau pertanyaan tentang fitur → jawab langsung dari knowledge di atas.
4. Kalau pertanyaan tentang pembayaran yg gagal → arahkan cek status di "Riwayat Transaksi" (kalau ada), atau "Tunggu 5-15 menit, kalau belum masuk koinnya, escalate".
5. Kalau user marah/keluhan serius/bug spesifik yg butuh investigasi/refund request → set needs_human = true dan kasih tau "saya akan teruskan ke founder via email".
6. KALAU KAMU GAK YAKIN JAWABANNYA → set needs_human = true.

OUTPUT WAJIB JSON valid (tanpa code fence):
{
  "answer": "Jawaban kamu dalam Bahasa Indonesia, 3-5 kalimat",
  "needs_human": false,
  "category": "fitur" | "payment" | "bug" | "akun" | "saran" | "lainnya",
  "tip_links": []  // optional: array of {label, screen} — misal "Buka Hafalan", screen: "hafalan"
}

CONTOH:

User: "Koinku belum masuk padahal sudah bayar via QRIS"
Output: {"answer":"Halo, mohon maaf atas ketidaknyamanannya. Pembayaran QRIS biasanya 1-5 menit untuk konfirmasi. Coba refresh app dulu (tutup & buka lagi). Kalau dalam 15 menit belum masuk, saya akan teruskan ke founder buat dicek manual ya — boleh share order ID-nya (di email Midtrans Anda).","needs_human":true,"category":"payment","tip_links":[]}

User: "Cara mulai hafalan?"
Output: {"answer":"Di home, tap kartu hijau 'Hafalan Quran' (ada simbol 📖). Mulai dari Al-Fatihah dulu (sudah gratis), lalu Juz 30 (semua surat pendek). Tiap surat ada 5-stage method: dengar audio Syekh Alafasy → ucap ulang → quiz. Konsisten tiap hari, pelan-pelan!","needs_human":false,"category":"fitur","tip_links":[{"label":"Buka Hafalan","screen":"hafalan"}]}

User: "App-nya crash terus pas buka Tanya Cepat"
Output: {"answer":"Mohon maaf nih. Bisa share device & browser yang dipakai? Sementara coba: 1) tutup tab & buka lagi, 2) clear cache browser, 3) cek internet. Saya teruskan ke tim developer untuk diinvestigasi.","needs_human":true,"category":"bug","tip_links":[]}`;

export async function POST(request) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'AI Admin belum dikonfigurasi.' }, { status: 500 });
    }

    const body = await request.json();
    const { messages = [], userId } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'messages array required' }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    if (!checkRateLimit(userId)) {
      return NextResponse.json({ error: 'Terlalu banyak request. Coba lagi nanti.' }, { status: 429 });
    }

    const anthropic = new Anthropic({ apiKey });

    // Convert client messages to Anthropic format
    const convoMessages = messages
      .filter((m) => m.role && m.content)
      .map((m) => ({ role: m.role === 'admin' ? 'assistant' : 'user', content: String(m.content).slice(0, 1500) }));

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT,
      messages: convoMessages,
    });

    const text = response.content?.[0]?.text || '';

    let parsed;
    try {
      const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (e) {
      // Fallback: return raw text sebagai answer
      return NextResponse.json({
        answer: text || 'Maaf, saya tidak bisa menjawab saat ini. Coba lagi atau hubungi founder via tombol di bawah.',
        needs_human: true,
        category: 'lainnya',
        tip_links: [],
      });
    }

    return NextResponse.json({
      answer: parsed.answer || '',
      needs_human: !!parsed.needs_human,
      category: parsed.category || 'lainnya',
      tip_links: Array.isArray(parsed.tip_links) ? parsed.tip_links.slice(0, 3) : [],
    });
  } catch (err) {
    console.error('Admin Help API error:', err);
    return NextResponse.json({ error: 'Server error: ' + (err.message || 'unknown') }, { status: 500 });
  }
}
