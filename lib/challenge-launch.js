// lib/challenge-launch.js
// "Tantangan 15 Hari" — kompetisi launch berhadiah uang jajan.
// Periode terbatas: top user di leaderboard menang transfer uang dari admin.
//
// Cara setup:
//   1. Ubah CHALLENGE_START/END sesuai jadwal launch kamu.
//   2. Ubah CHALLENGE_PRIZES sesuai budget hadiah.
//   3. Banner & leaderboard otomatis muncul kalau Date.now() ada di antara dua tanggal.
//   4. Pas periode habis, banner hilang sendirinya. Admin manual kontak top user
//      via email/admin chat lalu transfer hadiah.

// Format ISO biar gampang dibaca. WIB (Asia/Jakarta) = UTC+7.
// 2026-06-08 00:00 WIB = 2026-06-07T17:00:00.000Z
export const CHALLENGE_START_MS = Date.parse('2026-06-08T00:00:00+07:00');
// 2026-06-22 23:59 WIB = 2026-06-22T16:59:00.000Z
export const CHALLENGE_END_MS = Date.parse('2026-06-22T23:59:59+07:00');

export const CHALLENGE_TITLE = 'Tantangan 15 Hari';
export const CHALLENGE_TAGLINE = 'Kumpulkan XP terbanyak, menang uang jajan!';

// Hadiah uang jajan — admin manual transfer ke pemenang.
// Total hadiah default: Rp 350.000.
export const CHALLENGE_PRIZES = [
  { rank: 1, amount: 200000, label: 'Rp 200.000', emoji: '🥇' },
  { rank: 2, amount: 100000, label: 'Rp 100.000', emoji: '🥈' },
  { rank: 3, amount: 50000, label: 'Rp 50.000', emoji: '🥉' },
];

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

export function getPrizeForRank(rank) {
  return CHALLENGE_PRIZES.find((p) => p.rank === rank) || null;
}

export function challengeTotalPrize() {
  return CHALLENGE_PRIZES.reduce((s, p) => s + p.amount, 0);
}
