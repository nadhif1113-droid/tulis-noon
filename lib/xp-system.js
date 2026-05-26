// lib/xp-system.js
// XP → Level progression system. Tier-based (5 tier mengikuti CEFR-adapted curriculum).
// XP_total untuk reach Level N = 50 * N * (N-1) (quadratic — easier early, harder later).

export const TIERS = [
  {
    id: 'mubtadi',
    label: 'Mubtadi',
    subtitle: 'Pemula',
    emoji: '🌱',
    description: 'Baru mulai kenal huruf & frasa dasar.',
    minLevel: 1,
    maxLevel: 5,
    color: '#0a4d3c',
    bgGradient: 'linear-gradient(135deg, #0a4d3c, #1a6b56)',
  },
  {
    id: 'daris',
    label: 'Daris',
    subtitle: 'Pelajar',
    emoji: '📖',
    description: 'Bisa baca, mulai paham percakapan sederhana.',
    minLevel: 6,
    maxLevel: 15,
    color: '#1a6b56',
    bgGradient: 'linear-gradient(135deg, #1a6b56, #2e8869)',
  },
  {
    id: 'mutawassith',
    label: 'Mutawassith',
    subtitle: 'Menengah',
    emoji: '🎯',
    description: 'Lancar percakapan sehari-hari, nawar di pasar.',
    minLevel: 16,
    maxLevel: 30,
    color: '#c9a961',
    bgGradient: 'linear-gradient(135deg, #c9a961, #d4b876)',
  },
  {
    id: 'faaheem',
    label: 'Faaheem',
    subtitle: 'Paham',
    emoji: '✨',
    description: 'Ngerti idiom & ekspresi khas Hijazi.',
    minLevel: 31,
    maxLevel: 50,
    color: '#a05536',
    bgGradient: 'linear-gradient(135deg, #a05536, #c46a3f)',
  },
  {
    id: 'mahir',
    label: 'Mahir',
    subtitle: 'Ahli',
    emoji: '🏆',
    description: 'Bisa diskusi topik kompleks dgn fasih.',
    minLevel: 51,
    maxLevel: 999,
    color: '#8b6b3d',
    bgGradient: 'linear-gradient(135deg, #8b6b3d, #a87f47)',
  },
];

/**
 * Hitung total XP yang dibutuhkan untuk reach level N.
 * Formula: 50 * N * (N-1)
 *  - Lv 1: 0 XP (starting)
 *  - Lv 2: 100 XP
 *  - Lv 3: 300 XP (+200)
 *  - Lv 5: 1000 XP
 *  - Lv 10: 4500 XP
 *  - Lv 20: 19000 XP
 *  - Lv 50: 122500 XP
 */
export function xpForLevel(level) {
  if (level <= 1) return 0;
  return 50 * level * (level - 1);
}

/**
 * Hitung level user dari total XP-nya.
 * Inverse dari xpForLevel: N = floor((50 + sqrt(2500 + 200*xp)) / 100)
 */
export function levelFromXp(xp) {
  const X = Math.max(0, xp || 0);
  const N = Math.floor((50 + Math.sqrt(2500 + 200 * X)) / 100);
  return Math.max(1, N);
}

/**
 * Get tier object untuk level tertentu.
 */
export function getTierForLevel(level) {
  return TIERS.find((t) => level >= t.minLevel && level <= t.maxLevel) || TIERS[0];
}

/**
 * Comprehensive progress info untuk display.
 * Returns: { currentLevel, nextLevel, tier, xpInLevel, xpNeeded, xpRemaining, percent }
 */
export function getXpProgress(xp) {
  const safeXp = Math.max(0, xp || 0);
  const currentLevel = levelFromXp(safeXp);
  const xpAtCurrentLevel = xpForLevel(currentLevel);
  const xpForNextLevel = xpForLevel(currentLevel + 1);
  const xpInLevel = safeXp - xpAtCurrentLevel;
  const xpNeeded = xpForNextLevel - xpAtCurrentLevel;
  const percent = xpNeeded > 0 ? Math.min(100, (xpInLevel / xpNeeded) * 100) : 0;
  return {
    currentLevel,
    nextLevel: currentLevel + 1,
    tier: getTierForLevel(currentLevel),
    nextTier: getTierForLevel(currentLevel + 1),
    xpInLevel,
    xpNeeded,
    xpRemaining: xpForNextLevel - safeXp,
    percent,
    totalXp: safeXp,
  };
}

/**
 * Daftar cara dapet XP — buat ditampilin di profil "Cara Naik Level".
 */
export const XP_SOURCES = [
  { icon: 'BookOpen', label: 'Selesaikan lesson', xp: '10-50 XP' },
  { icon: 'Target', label: 'Lulus tantangan harian', xp: '30-525 XP' },
  { icon: 'Trophy', label: 'Skor perfect di Challenge', xp: '+bonus' },
  { icon: 'Award', label: 'Tulis Arab level perfect', xp: '50-100 XP' },
  { icon: 'MessageCircle', label: 'Latihan Ngobrol Mumtaaz', xp: '0-75 XP' },
  { icon: 'Sparkles', label: 'Selesaikan onboarding tour', xp: '50 XP' },
  { icon: 'Flame', label: 'Daily streak (segera)', xp: 'TBA' },
];
