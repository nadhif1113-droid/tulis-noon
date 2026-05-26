// lib/lives-system.js
// Duolingo-style lives/nyawa system.
// User punya 10 nyawa per hari. Reset otomatis 24 jam setelah pertama habis.
// Habis sebelum reset? Beli pakai koin (1 koin = 1 nyawa) atau tunggu.

export const DEFAULT_MAX_LIVES = 10;
export const COIN_PER_LIFE = 1;     // 1 koin = 1 nyawa extra
export const REFILL_ALL_COST = 5;   // 5 koin refill semua (hemat 5 kalau habis total)
export const REFRESH_PERIOD_HOURS = 24;

/**
 * Cek apakah lives perlu di-refill (sudah 24 jam sejak terakhir reset).
 * Returns { needsRefresh, hoursElapsed, nextRefreshAt }
 */
export function checkLivesRefresh(livesResetAt) {
  if (!livesResetAt) {
    // Belum pernah reset → langsung refresh
    return { needsRefresh: true, hoursElapsed: 0, nextRefreshAt: null };
  }
  const lastReset = new Date(livesResetAt);
  const now = new Date();
  const hoursElapsed = (now - lastReset) / (1000 * 60 * 60);
  const needsRefresh = hoursElapsed >= REFRESH_PERIOD_HOURS;
  const nextRefreshAt = new Date(lastReset.getTime() + REFRESH_PERIOD_HOURS * 60 * 60 * 1000);
  return { needsRefresh, hoursElapsed, nextRefreshAt };
}

/**
 * Hitung waktu tersisa sampai refresh dalam format display.
 * Returns string seperti "5j 23m" atau "Sekarang" kalau udah lewat.
 */
export function timeUntilRefresh(livesResetAt) {
  if (!livesResetAt) return 'Sekarang';
  const { nextRefreshAt } = checkLivesRefresh(livesResetAt);
  if (!nextRefreshAt) return 'Sekarang';
  const now = new Date();
  const diffMs = nextRefreshAt - now;
  if (diffMs <= 0) return 'Sekarang';
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}j ${minutes}m`;
  return `${minutes}m`;
}

/**
 * Status nyawa user. Berguna untuk gating game start.
 * Returns 'full' | 'partial' | 'empty'
 */
export function getLivesStatus(lives, maxLives = DEFAULT_MAX_LIVES) {
  if (lives >= maxLives) return 'full';
  if (lives <= 0) return 'empty';
  return 'partial';
}

/**
 * Cara dapet nyawa (untuk display di modal).
 */
export const LIVES_SOURCES = [
  { icon: '🌅', label: 'Reset otomatis tiap 24 jam', detail: 'Balik ke 10 nyawa' },
  { icon: '🪙', label: 'Beli pakai koin', detail: '1 koin = 1 nyawa' },
  { icon: '💎', label: 'Refill semua sekaligus', detail: '5 koin = 10 nyawa (hemat 5)' },
  { icon: '⭐', label: 'Skor perfect di game', detail: 'Refund 1 nyawa (segera)' },
  { icon: '💫', label: 'Premium subscription', detail: 'Unlimited nyawa (segera)' },
];

/**
 * Kapan nyawa berkurang (di game).
 */
export const LIVES_RULES = [
  { icon: '✓', label: 'Skor perfect (semua benar)', detail: 'Nyawa AMAN — tidak berkurang' },
  { icon: '✗', label: 'Skor tidak perfect (ada salah)', detail: '-1 nyawa per percobaan' },
  { icon: '↻', label: 'Ulangi level yang gagal', detail: '-1 nyawa lagi (pakai koin)' },
];
