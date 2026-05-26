// lib/match-system.js
// Match Arena — 10 bot personas progressive (Lv 1-10) + smart matchmaking.
// User baru auto-pair dgn bot mudah (Lv 1-3), naik tier setelah 3+ match.
// Plus opsi lawan user real (pick random dari Firestore, simulate sbg bot).

/**
 * 10 bot personas — dari paling mudah ke paling sulit.
 * accuracy = probability bot jawab benar
 * delayMs = waktu "mikir" bot (lower = faster)
 */
export const BOTS = [
  { id: 'bot-1',  level: 1,  name: 'Hasan',   avatar: '🧒🏽', accuracy: 0.20, minDelay: 5500, maxDelay: 8000, tier: 'easy',   subtitle: 'Anak Pesantren Baru' },
  { id: 'bot-2',  level: 2,  name: 'Khalid',  avatar: '👦🏽', accuracy: 0.28, minDelay: 5000, maxDelay: 7500, tier: 'easy',   subtitle: 'Murid TPA' },
  { id: 'bot-3',  level: 3,  name: 'Yusuf',   avatar: '🧑🏽', accuracy: 0.38, minDelay: 4500, maxDelay: 7000, tier: 'easy',   subtitle: 'Santri Yunior' },
  { id: 'bot-4',  level: 4,  name: 'Aisha',   avatar: '👧🏽', accuracy: 0.48, minDelay: 4000, maxDelay: 6500, tier: 'medium', subtitle: 'Pelajar SMP' },
  { id: 'bot-5',  level: 5,  name: 'Fatimah', avatar: '👩🏽', accuracy: 0.58, minDelay: 3500, maxDelay: 6000, tier: 'medium', subtitle: 'Mahasiswi LIPIA' },
  { id: 'bot-6',  level: 6,  name: 'Omar',    avatar: '🧔🏽', accuracy: 0.66, minDelay: 3000, maxDelay: 5500, tier: 'medium', subtitle: 'Ust. Muda' },
  { id: 'bot-7',  level: 7,  name: 'Bilal',   avatar: '🧔🏿', accuracy: 0.74, minDelay: 2500, maxDelay: 4500, tier: 'hard',   subtitle: 'Alumni Madinah' },
  { id: 'bot-8',  level: 8,  name: 'Salman',  avatar: '👳🏽‍♂️', accuracy: 0.82, minDelay: 2000, maxDelay: 4000, tier: 'hard',   subtitle: 'Mukim Saudi 5thn' },
  { id: 'bot-9',  level: 9,  name: 'Maryam',  avatar: '🧕🏽', accuracy: 0.88, minDelay: 1500, maxDelay: 3500, tier: 'hard',   subtitle: 'Hafidzah & Ustadzah' },
  { id: 'bot-10', level: 10, name: 'Hassan',  avatar: '👴🏽', accuracy: 0.93, minDelay: 1200, maxDelay: 3000, tier: 'hard',   subtitle: 'Syaikh Senior' },
];

// Tier visual config
export const TIER_CONFIG = {
  easy:   { color: '#0a4d3c', bgGradient: 'linear-gradient(135deg, #0a4d3c, #1a6b56)', label: 'Mudah' },
  medium: { color: '#c9a961', bgGradient: 'linear-gradient(135deg, #c9a961, #d4b876)', label: 'Sedang' },
  hard:   { color: '#a05536', bgGradient: 'linear-gradient(135deg, #a05536, #c46a3f)', label: 'Sulit' },
};

/**
 * Smart matchmaking — pick bot sesuai jumlah match user.
 * User baru (< 3 match): bot Lv 1-3 (mudah)
 * Match 3-5: bot Lv 2-5
 * Match 6-10: bot Lv 4-7
 * Match 11+: bot Lv 5-10
 */
export function pickBotForUser(matchesPlayed = 0) {
  let pool;
  if (matchesPlayed < 3) {
    pool = BOTS.filter((b) => b.level <= 3);
  } else if (matchesPlayed < 6) {
    pool = BOTS.filter((b) => b.level >= 2 && b.level <= 5);
  } else if (matchesPlayed < 11) {
    pool = BOTS.filter((b) => b.level >= 4 && b.level <= 7);
  } else {
    pool = BOTS.filter((b) => b.level >= 5);
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Apakah user boleh lawan user manusia? Unlock setelah 3+ match.
 */
export function canMatchHuman(matchesPlayed = 0) {
  return matchesPlayed >= 3;
}

/**
 * Convert real Firestore user jadi "bot opponent" — pakai data XP mereka
 * untuk derive accuracy + delay yang mirip bot.
 */
export function userToOpponent(user) {
  const xp = user.xp || 0;
  // Map XP ke accuracy: 0 XP = 30%, 5000 XP = 90%
  const accuracy = Math.min(0.90, 0.30 + (xp / 8000));
  // Higher XP = faster delay
  const baseDelay = Math.max(1500, 6000 - xp / 5);
  return {
    id: user.id || user.uid,
    level: Math.floor((user.level || 1)),
    name: user.displayName || 'Anonim',
    avatar: '👤',
    photoURL: user.photoURL,
    accuracy,
    minDelay: baseDelay,
    maxDelay: baseDelay + 2500,
    tier: xp < 1000 ? 'easy' : xp < 5000 ? 'medium' : 'hard',
    subtitle: `${xp.toLocaleString('id-ID')} XP · Level ${user.level || 1}`,
    isHuman: true,
  };
}

/**
 * Simulasi 1 jawaban bot.
 */
export function simulateBotAnswer(opponent) {
  const isCorrect = Math.random() < opponent.accuracy;
  const delayMs = Math.floor(opponent.minDelay + Math.random() * (opponent.maxDelay - opponent.minDelay));
  return { isCorrect, delayMs };
}

/**
 * Hitung skor untuk 1 jawaban.
 */
export function calculateScore(isCorrect, responseMs, maxResponseMs = 8000) {
  if (!isCorrect) return 0;
  const speedFactor = Math.max(0, 1 - responseMs / maxResponseMs);
  const speedBonus = Math.floor(speedFactor * 100);
  return 100 + speedBonus;
}

/**
 * Reward by opponent tier.
 */
function getRewardByTier(tier) {
  if (tier === 'easy')   return { win: 30, lose: 10, tie: 20, coin: 1 };
  if (tier === 'medium') return { win: 50, lose: 15, tie: 30, coin: 2 };
  return { win: 80, lose: 20, tie: 40, coin: 3 };
}

/**
 * Determine winner & reward.
 */
export function determineMatchOutcome(userScore, botScore, opponent) {
  let result;
  if (userScore > botScore) result = 'win';
  else if (userScore < botScore) result = 'lose';
  else result = 'tie';

  const rewards = getRewardByTier(opponent.tier);
  const xpEarned = rewards[result];
  const coinEarned = result === 'win' ? rewards.coin : 0;

  const messages = {
    win: ['Mantap! Kamu menang 🎉', 'Skill jago — lawan menyerah!', 'Mumtaaz! Lawan ke-tackle.'],
    lose: ['Lawan lebih cepat. Coba lagi yuk!', 'Hampir! Latihan lagi biar bisa menang.', 'Lawan beruntung — rematch?'],
    tie: ['Seri! Pertarungan ketat 🔥', 'Imbang — ronde berikutnya?'],
  };
  const message = messages[result][Math.floor(Math.random() * messages[result].length)];

  return { result, xpEarned, coinEarned, message };
}

export const ROUNDS_PER_MATCH = 5;
export const ROUND_TIMEOUT_MS = 8000;
