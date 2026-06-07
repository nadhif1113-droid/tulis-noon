// lib/challenge-launch.js
// "Tantangan 10 Hari Aktif" — event berhadiah uang tunai Rp 1jt.
// Beda dari Tantangan Launch sebelumnya: pakai SCORING DIVERSITY (multi-feature with cap)
// supaya gak bisa di-farm dari 1 fitur aja. Pemenang adalah user yang utilize
// semua fitur app dengan konsisten.
//
// Scoring engine ada di lib/event-scoring.js
//
// Cara setup:
//   1. Ubah EVENT_START/END sesuai jadwal.
//   2. Ubah PRIZES sesuai budget.
//   3. EVENT_ID di-bump tiap event baru (biar stats reset otomatis).
//   4. Banner & dashboard otomatis muncul saat Date.now() di antara start-end.
//   5. Admin manual kontak top 3 user via email/admin chat untuk transfer hadiah.

// Period: Sabtu 13 Juni 2026 00:00 WIB — Senin 22 Juni 2026 23:59 WIB
// = 10 hari penuh (inclusive)
export const CHALLENGE_START_MS = Date.parse('2026-06-13T00:00:00+07:00');
export const CHALLENGE_END_MS = Date.parse('2026-06-22T23:59:59+07:00');

// Unique ID — bump untuk event berikutnya supaya stats user reset otomatis
export const EVENT_ID = 'aktif-10hari-juni-2026';

export const CHALLENGE_TITLE = 'Tantangan 10 Hari Aktif';
export const CHALLENGE_TAGLINE = 'Aktif di semua fitur — menang Rp 1.000.000!';
export const CHALLENGE_SUBTITLE = 'Total hadiah Rp 1jt untuk 3 pemenang utama';

// Eligibility cut-off: user yang daftar SESUDAH tanggal ini tidak eligible
// (anti-fraud: cegah alt-account dadakan)
export const ELIGIBILITY_CUTOFF_MS = CHALLENGE_START_MS;

// Hadiah uang tunai — total Rp 1.000.000
export const CHALLENGE_PRIZES = [
  { rank: 1, amount: 500000, label: 'Rp 500.000', emoji: '🥇' },
  { rank: 2, amount: 300000, label: 'Rp 300.000', emoji: '🥈' },
  { rank: 3, amount: 200000, label: 'Rp 200.000', emoji: '🥉' },
];

// ============================================================================
// STATUS HELPERS
// ============================================================================

export function isChallengeActive(now = Date.now()) {
  return now >= CHALLENGE_START_MS && now <= CHALLENGE_END_MS;
}

export function challengeDaysRemaining(now = Date.now()) {
  if (now > CHALLENGE_END_MS) return 0;
  const ms = CHALLENGE_END_MS - Math.max(now, CHALLENGE_START_MS);
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}

export function challengeTotalDays() {
  return Math.ceil((CHALLENGE_END_MS - CHALLENGE_START_MS) / (24 * 60 * 60 * 1000));
}

export function challengePercentRemaining(now = Date.now()) {
  const total = CHALLENGE_END_MS - CHALLENGE_START_MS;
  if (total <= 0) return 0;
  const remaining = CHALLENGE_END_MS - Math.max(now, CHALLENGE_START_MS);
  return Math.max(0, Math.min(100, (remaining / total) * 100));
}

export function challengePercentElapsed(now = Date.now()) {
  return 100 - challengePercentRemaining(now);
}

// Hari ke berapa user sekarang dalam event (1-10)
export function challengeCurrentDay(now = Date.now()) {
  if (now < CHALLENGE_START_MS) return 0;
  const elapsedMs = Math.min(now, CHALLENGE_END_MS) - CHALLENGE_START_MS;
  return Math.min(challengeTotalDays(), Math.floor(elapsedMs / (24 * 60 * 60 * 1000)) + 1);
}

// Berapa hari lagi sebelum event mulai (untuk countdown pre-event)
export function challengeDaysUntilStart(now = Date.now()) {
  if (now >= CHALLENGE_START_MS) return 0;
  return Math.ceil((CHALLENGE_START_MS - now) / (24 * 60 * 60 * 1000));
}

// ============================================================================
// REWARDS
// ============================================================================

export function getPrizeForRank(rank) {
  return CHALLENGE_PRIZES.find((p) => p.rank === rank) || null;
}

export function challengeTotalPrize() {
  return CHALLENGE_PRIZES.reduce((s, p) => s + p.amount, 0);
}

// ============================================================================
// ELIGIBILITY CHECK
// ============================================================================

/**
 * Apakah user-akun ini eligible berdasarkan tanggal pendaftaran?
 * (Cek tambahan tetap di lib/event-scoring.js untuk syarat lain)
 */
export function isAccountEligibleForChallenge(profile) {
  const accountCreated = profile?.createdAt || profile?.signupDate || 0;
  if (!accountCreated) return false; // gak ada timestamp → safe assume invalid
  return accountCreated < ELIGIBILITY_CUTOFF_MS;
}
