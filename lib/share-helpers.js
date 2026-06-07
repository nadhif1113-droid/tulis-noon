// lib/share-helpers.js
// Helper untuk share progress event ke berbagai platform sosmed.
// Strategi: pre-written captions + native share fallback ke clipboard.

const BASE_URL = 'https://tulis-noon.vercel.app';

/**
 * Generate referral URL (track siapa bawa siapa).
 * @param {string} userId — UID user yang share
 * @returns {string} URL dengan ?ref=USER_ID
 */
export function buildReferralUrl(userId) {
  if (!userId) return BASE_URL;
  return `${BASE_URL}?ref=${encodeURIComponent(userId.slice(0, 12))}`;
}

/**
 * Replace placeholders di template.
 */
function fillTemplate(template, data) {
  let out = template;
  for (const [k, v] of Object.entries(data || {})) {
    out = out.replaceAll(`{${k}}`, String(v));
  }
  return out;
}

/**
 * Caption templates per platform.
 * Variables: {score}, {rank}, {day}, {daysLeft}, {streak}, {url}
 */
export const CAPTION_TEMPLATES = {
  whatsapp: `🏆 Hari ke-{day} di *Tantangan 10 Hari Aktif* Tulis Noon!

📊 Skor saya: *{score} XP*
🔥 Streak: *{streak} hari*
🏅 Peringkat: *#{rank}*

Saya lagi belajar Bahasa Arab praktis 5 menit/hari — buat umrah, kerja di Saudi, atau studi.

Tinggal *{daysLeft} hari lagi* — top 3 paling aktif menang total *Rp 1.000.000* 💰

Yuk join sebelum tutup pendaftaran!
👉 {url}`,

  instagram: `🏆 Day {day}/10 · Tantangan Tulis Noon

📊 {score} XP · 🔥 Streak {streak} hari · 🏅 Rank #{rank}

Belajar Arab praktis 5 menit/hari → hadiah total Rp 1jt 🤲

Link di bio · {url}

#BelajarArab #TulisNoon #TantanganArab #UmrahHajji #BahasaArab #BelajarOnline #IslamicLearning`,

  twitter: `🏆 Hari ke-{day} di Tantangan Tulis Noon — belajar Arab praktis 5 menit/hari.

📊 {score} XP · Rank #{rank} · {daysLeft} hari tersisa

Top 3 paling aktif menang total Rp 1jt 💰

Daftar: {url}`,

  generic: `🏆 Saya ikut Tantangan 10 Hari Aktif Tulis Noon — belajar Arab praktis dengan hadiah total Rp 1.000.000!

📊 Skor: {score} XP · Day {day}/10 · Rank #{rank}

Yuk daftar juga sebelum berakhir!
{url}

Barakallahu fiikum 🤲`,
};

/**
 * Generate caption siap pakai untuk platform tertentu.
 */
export function generateCaption(platform, data) {
  const tmpl = CAPTION_TEMPLATES[platform] || CAPTION_TEMPLATES.generic;
  return fillTemplate(tmpl, data);
}

/**
 * Share native (Web Share API) atau fallback ke clipboard.
 * @returns {Promise<{success: boolean, method: 'native' | 'clipboard' | 'cancel'}>}
 */
export async function shareNative({ title, text, url }) {
  if (typeof navigator === 'undefined') return { success: false, method: 'unsupported' };

  // Try Web Share API (modern browsers + Capacitor)
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return { success: true, method: 'native' };
    } catch (e) {
      // User cancelled atau permission denied
      if (e?.name === 'AbortError') return { success: false, method: 'cancel' };
      // Fall through to clipboard
    }
  }

  // Fallback: copy text + URL ke clipboard
  try {
    const combined = url ? `${text}\n\n${url}` : text;
    await navigator.clipboard.writeText(combined);
    return { success: true, method: 'clipboard' };
  } catch (e) {
    return { success: false, method: 'failed' };
  }
}

/**
 * Buka WhatsApp dengan pre-filled message (deep link).
 * Bekerja di mobile (buka app WA) + desktop (buka WA Web).
 */
export function shareToWhatsApp(text) {
  const encoded = encodeURIComponent(text);
  const url = `https://wa.me/?text=${encoded}`;
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Buka Twitter/X dengan pre-filled tweet.
 */
export function shareToTwitter(text, url) {
  const params = new URLSearchParams({ text });
  if (url) params.set('url', url);
  const shareUrl = `https://twitter.com/intent/tweet?${params.toString()}`;
  if (typeof window !== 'undefined') {
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Buka Facebook share dialog.
 */
export function shareToFacebook(url, quote) {
  const params = new URLSearchParams({ u: url });
  if (quote) params.set('quote', quote);
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
  if (typeof window !== 'undefined') {
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Telegram share (sticker / forward).
 */
export function shareToTelegram(text, url) {
  const params = new URLSearchParams({ url: url || '', text });
  const shareUrl = `https://t.me/share/url?${params.toString()}`;
  if (typeof window !== 'undefined') {
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Copy text ke clipboard.
 */
export async function copyToClipboard(text) {
  if (typeof navigator === 'undefined' || !navigator.clipboard) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
