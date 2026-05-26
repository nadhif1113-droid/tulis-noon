// lib/geo-detect.js
// Deteksi lokasi user untuk feature flags geo-restricted (e.g. Tanya Cepat hanya untuk Saudi/Timur Tengah).
//
// Strategi: pakai timezone browser (Intl.DateTimeFormat) — gak butuh permission, instant.
// Akurat 95%+ kalau device timezone gak di-override secara manual.

// Timezone Middle East / Arab world
const MIDDLE_EAST_TIMEZONES = [
  // Saudi Arabia
  'Asia/Riyadh',
  // UAE
  'Asia/Dubai',
  // Qatar
  'Asia/Qatar',
  // Bahrain
  'Asia/Bahrain',
  // Kuwait
  'Asia/Kuwait',
  // Oman
  'Asia/Muscat',
  // Yemen
  'Asia/Aden',
  // Iraq
  'Asia/Baghdad',
  // Jordan
  'Asia/Amman',
  // Lebanon
  'Asia/Beirut',
  // Syria
  'Asia/Damascus',
  // Palestine / Israel
  'Asia/Hebron',
  'Asia/Gaza',
  'Asia/Jerusalem',
  'Asia/Tel_Aviv',
  // Egypt (Mesir — banyak jamaah ke sini juga)
  'Africa/Cairo',
];

const INDONESIA_TIMEZONES = [
  'Asia/Jakarta',
  'Asia/Pontianak',
  'Asia/Makassar',
  'Asia/Jayapura',
];

/**
 * Deteksi timezone user.
 * SSR-safe: return null kalau di server.
 */
export function getUserTimezone() {
  if (typeof window === 'undefined') return null;
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (e) {
    return null;
  }
}

/**
 * Apakah user sekarang berada di Timur Tengah / negara Arab?
 * Dipakai untuk gate fitur "Tanya Cepat" (cuma berguna kalau user benar2 lagi di sana).
 */
export function isInMiddleEast() {
  const tz = getUserTimezone();
  if (!tz) return false;
  return MIDDLE_EAST_TIMEZONES.includes(tz);
}

/**
 * Apakah user di Indonesia?
 */
export function isInIndonesia() {
  const tz = getUserTimezone();
  if (!tz) return false;
  return INDONESIA_TIMEZONES.includes(tz);
}

/**
 * Override flag — kalau user manual aktifin "I'm in Saudi" (dari setting),
 * override deteksi otomatis. Disimpan di userProfile.locationOverride.
 */
export function shouldShowTanyaCepat(userProfile) {
  // Manual override (user kasih tau dirinya lagi di ME via settings)
  if (userProfile?.locationOverride === 'middle-east') return true;
  if (userProfile?.locationOverride === 'indonesia') return false;
  // Auto-detect
  return isInMiddleEast();
}

/**
 * Cek apakah user di Indonesia (untuk hide FAB tapi tetep ada entry di Profile).
 */
export function isLikelyInIndonesia(userProfile) {
  if (userProfile?.locationOverride === 'indonesia') return true;
  if (userProfile?.locationOverride === 'middle-east') return false;
  return isInIndonesia();
}
