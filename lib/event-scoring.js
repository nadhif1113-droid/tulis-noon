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
//
// Math design (untuk jackpot 4000 XP juara 1):
//   - 8 fitur × cap (rata-rata 45/hari) = 360 XP base
//   - + 50 diversity (7+ fitur dalam 1 hari) = 410 XP/hari max
//   - × 10 hari = 4,100 XP
//   - + 200 streak diversity bonus (5+ fitur × 7 hari) = 4,300 XP max
//   - Reachable hanya untuk user yang aktif 4-5 jam/hari penuh 10 hari berturut.
export const EVENT_FEATURES = {
  lesson:       { name: 'Lesson Modul',         emoji: '📘', capPerDay: 70, category: 'learning' },
  hafalan:      { name: 'Hafalan Juz 30',       emoji: '📿', capPerDay: 70, category: 'learning' },
  nahwu_shorf:  { name: 'Nahwu / Shorf',        emoji: '🧮', capPerDay: 60, category: 'learning' },
  perkenalan:   { name: 'Perkenalan Diri',      emoji: '👋', capPerDay: 40, category: 'learning' },
  game:         { name: 'Game (Tebak/Cerita/Ngomong)', emoji: '🎮', capPerDay: 50, category: 'practice' },
  tanya_cepat:  { name: 'Tanya Cepat AI',       emoji: '🤖', capPerDay: 30, category: 'practice' },
  community:    { name: 'Komunitas (post/komen)', emoji: '💬', capPerDay: 20, category: 'social' },
  friend:       { name: 'Friend & Chat',        emoji: '👥', capPerDay: 20, category: 'social' },
};

export const EVENT_FEATURE_KEYS = Object.keys(EVENT_FEATURES);
export const MAX_DAILY_BASE = Object.values(EVENT_FEATURES).reduce((s, f) => s + f.capPerDay, 0); // = 360

// Diversity bonus — fitur dihitung HANYA kalau dipakai ≥30% cap (anti tap-and-go)
export const DIVERSITY_BONUS_5_FEATURES = 20; // pakai 5+ fitur dalam 1 hari
export const DIVERSITY_BONUS_7_FEATURES = 50; // pakai 7+ fitur (jackpot)
export const STREAK_DIVERSITY_BONUS = 200; // 5+ fitur selama 7 hari berturut
export const DIVERSITY_MIN_CAP_RATIO = 0.3; // fitur dihitung kalau ≥30% cap

// Eligibility thresholds — baseline buat masuk leaderboard juara 2 & 3
export const MIN_STREAK_DAYS = 10;
export const MIN_FEATURES_USED = 5;
export const MIN_TOTAL_SCORE = 500;

// 🏆 GRAND PRIZE — Juara 1 punya threshold extra:
//   (a) capai 4000 XP, AND
//   (b) punya minimal 1 sertifikat path (proof-of-depth, bukan farm dangkal)
// Kalau gak ada user yang lulus dua syarat ini, hadiah juara 1 di-rollover ke
// juara 2 (admin discretion).
export const GRAND_PRIZE_MIN_SCORE = 4000;
export const GRAND_PRIZE_MIN_CERTIFICATES = 1;

// Theoretical maximum yang bisa dicapai (untuk UI progress bar)
// = 10 days × (360 + 50 diversity) + 200 streak bonus = 4,300
export const MAX_POSSIBLE_SCORE = 10 * (MAX_DAILY_BASE + DIVERSITY_BONUS_7_FEATURES) + STREAK_DIVERSITY_BONUS;

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
  // Anti-cheat: hanya fitur yang dipakai ≥30% cap dihitung untuk diversity bonus
  const oldBonus = today.bonus || 0;
  const newBonus = computeDailyDiversityBonus(today);
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

/**
 * Diversity bonus dihitung dari fitur yang MEANINGFUL — yaitu fitur yang
 * dipakai minimal 30% cap-nya hari itu. Anti tap-and-go (komen 1 huruf
 * cuma buat dapat bonus).
 *
 * @param {object} today — daily stats { feature_key: xp, total, features, bonus }
 */
function computeDailyDiversityBonus(today) {
  if (!today || !today.features) return 0;
  const meaningful = today.features.filter((f) => {
    const xp = today[f] || 0;
    const cap = EVENT_FEATURES[f]?.capPerDay || Infinity;
    return xp >= cap * DIVERSITY_MIN_CAP_RATIO;
  });
  const count = meaningful.length;
  if (count >= 7) return DIVERSITY_BONUS_7_FEATURES;
  if (count >= 5) return DIVERSITY_BONUS_5_FEATURES;
  return 0;
}

/**
 * Helper: berapa fitur "meaningful" (≥30% cap) yang sudah dipakai hari ini.
 * Untuk UI feedback.
 */
export function countMeaningfulFeaturesToday(stats, now = Date.now()) {
  const todayKey = (() => {
    const d = new Date(now);
    const wib = new Date(d.getTime() + 7 * 60 * 60 * 1000);
    return wib.toISOString().slice(0, 10);
  })();
  const today = stats?.dailyXp?.[todayKey];
  if (!today) return 0;
  return (today.features || []).filter((f) => {
    const xp = today[f] || 0;
    const cap = EVENT_FEATURES[f]?.capPerDay || Infinity;
    return xp >= cap * DIVERSITY_MIN_CAP_RATIO;
  }).length;
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

  // 0. Wajib daftar event (isi data diri + setuju anti-cheat)
  const isRegistered = !!profile?.eventRegistration?.agreedAt;
  if (!isRegistered) {
    reasons.push('Belum daftar event (isi data diri & setuju komitmen)');
  }

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

  return { eligible: reasons.length === 0, reasons, streak, featuresUsed, totalScore, isRegistered };
}

/**
 * 🏆 Apakah user eligible untuk JUARA 1 (Rp 500.000)?
 * Syarat: lulus eligibility dasar + total score ≥ GRAND_PRIZE_MIN_SCORE.
 *
 * Returns: { eligible, reason, currentScore, requiredScore, gap, percent }
 */
export function checkGrandPrizeEligibility(profile, eventStartMs, now = Date.now()) {
  const baseCheck = checkEligibility(profile, eventStartMs, now);
  const currentScore = profile?.eventStats?.totalScore || 0;
  const certCount = (profile?.certificates || profile?.earnedCertificates || []).length || 0;
  const gap = Math.max(0, GRAND_PRIZE_MIN_SCORE - currentScore);
  const percent = Math.min(100, Math.round((currentScore / GRAND_PRIZE_MIN_SCORE) * 100));

  const result = {
    currentScore,
    requiredScore: GRAND_PRIZE_MIN_SCORE,
    gap, percent,
    certCount,
    requiredCerts: GRAND_PRIZE_MIN_CERTIFICATES,
  };

  if (!baseCheck.eligible) {
    return { ...result, eligible: false, reason: 'Belum lulus syarat dasar (lihat eligibility utama)' };
  }
  if (currentScore < GRAND_PRIZE_MIN_SCORE) {
    return {
      ...result, eligible: false,
      reason: `Kurang ${gap.toLocaleString('id-ID')} XP lagi untuk Juara 1 (Rp 500rb)`,
    };
  }
  if (certCount < GRAND_PRIZE_MIN_CERTIFICATES) {
    return {
      ...result, eligible: false,
      reason: `Wajib punya min ${GRAND_PRIZE_MIN_CERTIFICATES} sertifikat path (bukti penyelesaian beneran). Selesaikan satu path apa saja: Umrah/Profesi/Pelajar/Nahwu/Shorf/dst.`,
    };
  }
  return {
    ...result, eligible: true,
    reason: '🏆 Eligible Juara 1! Pertahankan posisi top 1 di leaderboard.',
  };
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
