// lib/match-system.js
// Logic untuk Match Arena — game kompetitif vs bot atau user lain.
// Bot punya 3 level kesulitan dgn accuracy & speed berbeda.

export const MATCH_DIFFICULTIES = [
  {
    id: 'easy',
    label: 'Pemula',
    botName: 'Robot Pemula',
    botAvatar: '🤖',
    description: 'Bot baru belajar. Cocok buat coba-coba & pemula.',
    accuracy: 0.30,        // 30% kemungkinan bot jawab benar
    minDelayMs: 4000,      // bot minimal "mikir" 4 detik
    maxDelayMs: 7500,
    color: '#0a4d3c',
    bgGradient: 'linear-gradient(135deg, #0a4d3c, #1a6b56)',
    xpReward: { win: 30, lose: 10, tie: 20 },
    coinReward: 1,
  },
  {
    id: 'medium',
    label: 'Menengah',
    botName: 'Robot Pintar',
    botAvatar: '🤖',
    description: 'Bot udah pernah belajar. Lawan yang seimbang.',
    accuracy: 0.60,
    minDelayMs: 2500,
    maxDelayMs: 5000,
    color: '#c9a961',
    bgGradient: 'linear-gradient(135deg, #c9a961, #d4b876)',
    xpReward: { win: 50, lose: 15, tie: 30 },
    coinReward: 2,
  },
  {
    id: 'hard',
    label: 'Mahir',
    botName: 'Robot Master',
    botAvatar: '🤖',
    description: 'Bot udah lancar Hijazi. Bakal nantang kamu beneran.',
    accuracy: 0.85,
    minDelayMs: 1500,
    maxDelayMs: 3500,
    color: '#a05536',
    bgGradient: 'linear-gradient(135deg, #a05536, #c46a3f)',
    xpReward: { win: 80, lose: 20, tie: 40 },
    coinReward: 3,
  },
];

export function getDifficulty(id) {
  return MATCH_DIFFICULTIES.find((d) => d.id === id) || MATCH_DIFFICULTIES[0];
}

/**
 * Simulasi 1 jawaban bot.
 * Returns { isCorrect, delayMs } — kapan bot "jawab" dan apakah benar.
 */
export function simulateBotAnswer(difficulty) {
  const diff = getDifficulty(difficulty);
  const isCorrect = Math.random() < diff.accuracy;
  const delayMs = Math.floor(
    diff.minDelayMs + Math.random() * (diff.maxDelayMs - diff.minDelayMs)
  );
  return { isCorrect, delayMs };
}

/**
 * Hitung skor untuk 1 jawaban.
 * Formula: kalau benar, base 100 + bonus speed (max +100 untuk respond <2s).
 * Kalau salah, 0.
 */
export function calculateScore(isCorrect, responseMs, maxResponseMs = 8000) {
  if (!isCorrect) return 0;
  const speedFactor = Math.max(0, 1 - responseMs / maxResponseMs);
  const speedBonus = Math.floor(speedFactor * 100);
  return 100 + speedBonus;
}

/**
 * Determine winner & reward.
 * Returns { result: 'win'|'lose'|'tie', xpEarned, coinEarned, message }
 */
export function determineMatchOutcome(userScore, botScore, difficulty) {
  const diff = getDifficulty(difficulty);
  let result;
  if (userScore > botScore) result = 'win';
  else if (userScore < botScore) result = 'lose';
  else result = 'tie';

  const xpEarned = diff.xpReward[result];
  const coinEarned = result === 'win' ? diff.coinReward : 0;

  const messages = {
    win: ['Mantap! Kamu menang 🎉', 'Skill jago — bot menyerah!', 'Mumtaaz! Lawan robot ke-tackle.'],
    lose: ['Bot lebih cepat kali ini. Coba lagi yuk!', 'Hampir! Latihan lagi biar bisa menang.', 'Robot lagi beruntung — rematch?'],
    tie: ['Seri! Pertarungan ketat 🔥', 'Imbang — ronde berikutnya?'],
  };
  const message = messages[result][Math.floor(Math.random() * messages[result].length)];

  return { result, xpEarned, coinEarned, message };
}

export const ROUNDS_PER_MATCH = 5;
export const ROUND_TIMEOUT_MS = 8000;
