// lib/lives-system.js
// Duolingo-style lives/nyawa system dengan refresh BERTAHAP.
// Model: +3 nyawa per 24 jam (BUKAN full reset). Dari 0 ke max (10) butuh ~4 hari.
// Habis sebelum cukup terkumpul? Beli pakai koin: 1 koin = 1 nyawa, atau 5 koin = refill semua.

export const DEFAULT_MAX_LIVES = 10;
export const LIVES_PER_REFRESH = 3;       // tambah 3 nyawa per cycle
export const REFRESH_PERIOD_HOURS = 24;   // satu cycle = 24 jam
export const COIN_PER_LIFE = 1;            // 1 koin = 1 nyawa extra
export const REFILL_ALL_COST = 5;          // 5 koin refill semua

/**
 * Hitung berapa cycle refresh yang udah lewat sejak livesResetAt.
 * Tiap cycle = 24 jam, kasih +3 nyawa (cap di maxLives).
 *
 * Returns { newLives, newResetAt, refreshed, cycles }
 *  - newLives: nyawa setelah refresh
 *  - newResetAt: ISO timestamp baru (kalau ada refresh) — sisa cycle dipertahankan
 *  - refreshed: boolean — true kalau ada penambahan
 *  - cycles: berapa cycle yang udah lewat
 */
export function checkLivesRefresh(currentLives, maxLives, livesResetAt) {
  const safeMax = maxLives || DEFAULT_MAX_LIVES;
  const safeCurrent = Math.max(0, currentLives ?? safeMax);

  // Nyawa full → tidak perlu refresh, clock dimatiin
  if (safeCurrent >= safeMax) {
    return { newLives: safeCurrent, newResetAt: null, refreshed: false, cycles: 0 };
  }

  // Belum pernah set clock → set sekarang (mulai counting)
  if (!livesResetAt) {
    return { newLives: safeCurrent, newResetAt: new Date().toISOString(), refreshed: false, cycles: 0 };
  }

  const lastReset = new Date(livesResetAt);
  const now = new Date();
  const msElapsed = now - lastReset;
  const hoursElapsed = msElapsed / (1000 * 60 * 60);
  const cycles = Math.floor(hoursElapsed / REFRESH_PERIOD_HOURS);

  if (cycles <= 0) {
    // Belum ada cycle penuh — clock unchanged
    return { newLives: safeCurrent, newResetAt: livesResetAt, refreshed: false, cycles: 0 };
  }

  // Hitung nyawa baru — tambah 3 per cycle, cap di max
  const livesToAdd = cycles * LIVES_PER_REFRESH;
  const newLives = Math.min(safeMax, safeCurrent + livesToAdd);

  // Geser clock maju sebanyak cycle yang udah "delivered"
  // Sisa <24h dipertahankan untuk cycle berikutnya
  const usedMs = cycles * REFRESH_PERIOD_HOURS * 60 * 60 * 1000;
  const newResetMs = lastReset.getTime() + usedMs;

  // Kalau nyawa udah full setelah refresh ini → matiin clock (null)
  if (newLives >= safeMax) {
    return { newLives, newResetAt: null, refreshed: true, cycles };
  }

  return { newLives, newResetAt: new Date(newResetMs).toISOString(), refreshed: true, cycles };
}

/**
 * Hitung waktu tersisa sampai +3 nyawa berikutnya. Format display.
 * Returns string seperti "5j 23m" atau "Sekarang" atau "Nyawa penuh".
 */
export function timeUntilNextRefresh(lives, maxLives, livesResetAt) {
  const safeMax = maxLives || DEFAULT_MAX_LIVES;
  if ((lives ?? safeMax) >= safeMax) return 'Penuh';
  if (!livesResetAt) return 'Memulai...';
  const lastReset = new Date(livesResetAt);
  const now = new Date();
  const hoursElapsed = (now - lastReset) / (1000 * 60 * 60);
  const remainingHours = REFRESH_PERIOD_HOURS - (hoursElapsed % REFRESH_PERIOD_HOURS);
  const totalMinutes = Math.ceil(remainingHours * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours}j ${minutes}m`;
  return `${minutes}m`;
}

/**
 * Estimasi total jam yang dibutuhkan dari nyawa saat ini ke max.
 * Untuk display "Dari 0 nyawa ke penuh butuh X hari".
 */
export function hoursUntilFull(currentLives, maxLives) {
  const safeMax = maxLives || DEFAULT_MAX_LIVES;
  const needed = safeMax - (currentLives ?? safeMax);
  if (needed <= 0) return 0;
  const cyclesNeeded = Math.ceil(needed / LIVES_PER_REFRESH);
  return cyclesNeeded * REFRESH_PERIOD_HOURS;
}

/**
 * Status nyawa: 'full' | 'partial' | 'empty'
 */
export function getLivesStatus(lives, maxLives = DEFAULT_MAX_LIVES) {
  if (lives >= maxLives) return 'full';
  if (lives <= 0) return 'empty';
  return 'partial';
}

/**
 * Cara dapet nyawa (display di modal).
 */
export const LIVES_SOURCES = [
  { icon: '🌅', label: '+3 nyawa tiap 24 jam', detail: 'Otomatis terkumpul — sabar dikit' },
  { icon: '🪙', label: 'Beli pakai koin', detail: '1 koin = 1 nyawa instan' },
  { icon: '💎', label: 'Refill semua sekaligus', detail: '5 koin = isi penuh (hemat 50%)' },
  { icon: '⭐', label: 'Skor perfect di game', detail: 'Refund 1 nyawa (segera)' },
  { icon: '💫', label: 'Premium subscription', detail: 'Unlimited nyawa (segera)' },
];

/**
 * Kapan nyawa berkurang.
 */
export const LIVES_RULES = [
  { icon: '✓', label: 'Skor perfect (semua benar)', detail: 'Nyawa AMAN — tidak berkurang' },
  { icon: '✗', label: 'Skor tidak perfect (ada salah)', detail: '-1 nyawa per percobaan' },
  { icon: '↻', label: 'Ulangi level yang gagal', detail: '-1 nyawa lagi' },
];
