// lib/event-scoring.js
// Engine scoring untuk "Event 10 Hari Aktif" — anti-farming dgn multi-feature cap.
//
// Filosofi:
//   - User yang utilize SEMUA fitur menang dari yang spam 1 fitur
//   - Cap per fitur per hari memaksa diversity
//   - Bonus untuk daily diversity 5+ atau 7+ fitur
//
// Data tracking di userProfile.eventStats:
//   {
//     eventId: 'aktif-10hari-juni-2026',
//     joinedAt: timestamp,
//     daysActive: 5,
//     dailyXp: {
//       '2026-06-13': { lesson: 30, hafalan: 25, game: 10, ..., total: 65, features: ['lesson', 'hafalan', 'game'], bonus: 0 },
//       '2026-06-14': {...},
//     },
//     totalScore: 540,  // capped XP across all days
//     featuresUsedOverall: ['lesson', 'hafalan', 'game', 'cerita', 'komunitas'], // unique features
//   }

// ============================================================================
// FEATURE CONFIGURATION
// ============================================================================

// 8 fitur core yang dilacak untuk event. Tiap fitur punya cap XP per hari.
// XP yang melebihi cap masih dapat untuk total XP user tapi gak dihitung event.
export const EVENT_FEATURES = {
  lesson: { name: 'Lesson Modul', emoji: '📘', capPerDay: 50, category: 'learning' },
  hafalan: { name: 'Hafalan Juz 30', emoji: '📿', capPerDay: 50, category: 'learning' },
  nahwu_shorf: { name: 'Nahwu / Shorf', emoji: '🧮', capPerDay: 40, category: 'learning' },
  perkenalan: { name: 'Perkenalan Diri', emoji: '👋', capPerDay: 30, category: 'learning' },
  game: { name: 'Game (Tebak/Cerita/Ngomong)', emoji: '🎮', capPerDay: 30, category: 'practice' },
  tanya_cepat: { name: 'Tanya Cepat AI', emoji: '🤖', capPerDay: 20, category: 'practice' },
  community: { name: 'Komunitas (post/komen)', emoji: '💬', capPerDay: 15, category: 'social' },
  friend: { name: 'Friend & Chat', emoji: '👥', capPerDay: 15, category: 'social' },
};

export const EVENT_FEATURE_KEYS = Object.keys(EVENT_FEATURES);
export const MAX_DAILY_BASE = Object.values(EVENT_FEATURES).reduce((s, f) => s + f.capPerDay, 0); // = 250

// Diversity bonus
export const DIVERSITY_BONUS_5_FEATURES = 20; // pakai 5+ fitur dalam 1 hari
export const DIVERSITY_BONUS_7_FEATURES = 50; // pakai 7+ fitur (jackpot)
export const STREAK_DIVERSITY_BONUS = 200; // 5+ fitur selama 7 hari berturut

// Eligibility thresholds
export const MIN_STREAK_DAYS = 10;
export const MIN_FEATURES_USED = 5;
export const MIN_TOTAL_SCORE = 500;

// ============================================================================
// DATE HELPERS
// ============================================================================

function getTodayKey(now = Date.now()) {
  const d = new Date(now);
  // Pakai WIB date string (YYYY-MM-DD)
  const wib = new Date(d.getTime() + 7 * 60 * 60 * 1000);
  return wib.toISOString().slice(0, 10);
}

export function getEventDateKey(date) {
  return getTodayKey(date instanceof Date ? date.getTime() : date);
}

// ============================================================================
// CORE SCORING FUNCTIONS
// ============================================================================

/**
 * Compute event stats baru setelah award XP dari satu fitur.
 *
 * @param {object} existingStats — userProfile.eventStats (or null)
 * @param {string} feature — feature key (see EVENT_FEATURES)
 * @param {number} xpAmount — raw XP yang user dapat dari aksi
 * @param {string} eventId — current event ID
 * @param {number} now — timestamp (default now)
 * @returns {object} updated eventStats (atau null kalau feature invalid)
 */
export function applyEventXp(existingStats, feature, xpAmount, eventId, now = Date.now()) {
  if (!EVENT_FEATURES[feature]) {
    console.warn(`[event-scoring] unknown feature: ${feature}`);
    return existingStats || null;
  }
  if (!xpAmount || xpAmount <= 0) return existingStats || null;

  const todayKey = getTodayKey(now);
  const cap = EVENT_FEATURES[feature].capPerDay;

  // Init stats kalau belum ada (atau eventId beda → reset)
  let stats = existingStats;
  if (!stats || stats.eventId !== eventId) {
    stats = {
      eventId,
      joinedAt: now,
      daysActive: 0,
      dailyXp: {},
      totalScore: 0,
      featuresUsedOverall: [],
    };
  }

  // Ambil/init data hari ini
  const today = stats.dailyXp[todayKey] || {
    total: 0,
    features: [],
    bonus: 0,
  };

  // Hitung XP yang masuk hari ini untuk fitur ini
  const currentFeatureXp = today[feature] || 0;
  const remainingCap = Math.max(0, cap - currentFeatureXp);
  const eventXpToAdd = Math.min(xpAmount, remainingCap);

  if (eventXpToAdd > 0) {
    today[feature] = currentFeatureXp + eventXpToAdd;
    today.total = (today.total || 0) + eventXpToAdd;
    if (!today.features.includes(feature)) {
      today.features.push(feature);
    }
  }

  // Recompute diversity bonus untuk hari ini
  const oldBonus = today.bonus || 0;
  const newBonus = computeDailyDiversityBonus(today.features.length);
  if (newBonus !== oldBonus) {
    today.bonus = newBonus;
    today.total = today.total - oldBonus + newBonus;
  }

  stats.dailyXp[todayKey] = today;

  // Update aggregates
  stats.totalScore = Object.values(stats.dailyXp).reduce((s, d) => s + (d.total || 0), 0);
  stats.daysActive = Object.values(stats.dailyXp).filter((d) => d.features.length > 0).length;

  // Update featuresUsedOverall (unique union)
  const allFeatures = new Set(stats.featuresUsedOverall || []);
  for (const d of Object.values(stats.dailyXp)) {
    for (const f of d.features) allFeatures.add(f);
  }
  stats.featuresUsedOverall = Array.from(allFeatures);

  return stats;
}

function computeDailyDiversityBonus(featuresCount) {
  if (featuresCount >= 7) return DIVERSITY_BONUS_7_FEATURES;
  if (featuresCount >= 5) return DIVERSITY_BONUS_5_FEATURES;
  return 0;
}

// ============================================================================
// QUERY HELPERS (untuk UI)
// ============================================================================

/**
 * Today's progress per feature untuk daily checklist UI.
 * Returns: [{ feature, name, emoji, currentXp, capPerDay, percent }]
 */
export function getTodayProgress(stats, now = Date.now()) {
  const todayKey = getTodayKey(now);
  const today = stats?.dailyXp?.[todayKey] || { features: [] };
  return EVENT_FEATURE_KEYS.map((key) => {
    const meta = EVENT_FEATURES[key];
    const xp = today[key] || 0;
    return {
      feature: key,
      name: meta.name,
      emoji: meta.emoji,
      category: meta.category,
      currentXp: xp,
      capPerDay: meta.capPerDay,
      percent: Math.min(100, Math.round((xp / meta.capPerDay) * 100)),
      used: xp > 0,
    };
  });
}

/**
 * Hitung daily streak — berapa hari berturut user aktif sebelum hari ini (inclusive).
 * Streak putus = ada hari di dalam event yang gak ada activity.
 */
export function computeEventStreak(stats, eventStartMs, now = Date.now()) {
  if (!stats?.dailyXp) return 0;
  const today = new Date(now);
  let streak = 0;
  let cursor = new Date(today);
  while (cursor.getTime() >= eventStartMs) {
    const key = getTodayKey(cursor.getTime());
    const day = stats.dailyXp[key];
    if (day && day.features.length > 0) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      // Today doesn't count if no activity yet — only check past days
      if (key === getTodayKey(now)) {
        cursor.setDate(cursor.getDate() - 1);
        continue;
      }
      break;
    }
  }
  return streak;
}

/**
 * Cek eligibility — semua 4 syarat harus dipenuhi.
 * Returns: { eligible, reasons: [] }
 */
export function checkEligibility(profile, eventStartMs, now = Date.now()) {
  const stats = profile?.eventStats;
  const reasons = [];

  // 1. Streak 10 hari
  const streak = computeEventStreak(stats, eventStartMs, now);
  if (streak < MIN_STREAK_DAYS) {
    reasons.push(`Streak baru ${streak}/${MIN_STREAK_DAYS} hari`);
  }

  // 2. Min 5 fitur dipakai
  const featuresUsed = (stats?.featuresUsedOverall || []).length;
  if (featuresUsed < MIN_FEATURES_USED) {
    reasons.push(`Baru pakai ${featuresUsed}/${MIN_FEATURES_USED} fitur berbeda`);
  }

  // 3. Min total score
  const totalScore = stats?.totalScore || 0;
  if (totalScore < MIN_TOTAL_SCORE) {
    reasons.push(`Score ${totalScore}/${MIN_TOTAL_SCORE} XP`);
  }

  // 4. Akun terdaftar sebelum event
  const accountCreated = profile?.createdAt || profile?.signupDate;
  if (!accountCreated || accountCreated > eventStartMs) {
    reasons.push('Akun terdaftar setelah event mulai');
  }

  return { eligible: reasons.length === 0, reasons, streak, featuresUsed, totalScore };
}

/**
 * Total score yang dipakai untuk leaderboard ranking.
 */
export function getEventScore(stats) {
  return stats?.totalScore || 0;
}

/**
 * Reset event stats (untuk admin atau end-of-event cleanup).
 */
export function resetEventStats(eventId, now = Date.now()) {
  return {
    eventId,
    joinedAt: now,
    daysActive: 0,
    dailyXp: {},
    totalScore: 0,
    featuresUsedOverall: [],
  };
}
