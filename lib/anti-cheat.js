// lib/anti-cheat.js
// 4 layer anti-cheat untuk fairness Event 10 Hari Aktif (4000 XP jackpot):
//
//   Layer 1: ANTI-REPLAY
//     Activity yang sama (modul/level/cerita yang sudah pernah selesai)
//     di-replay dapat 30% XP saja. Mendorong eksplor konten baru, bukan
//     spam yang gampang.
//
//   Layer 2: QUALITY GATE
//     Kuis score < 40% = 0 XP. 40-69% = 50% XP. ≥70% = full XP.
//     Anti click-next tanpa baca.
//
//   Layer 3: DIVERSITY THRESHOLD (di-enforce di event-scoring.js)
//     Diversity bonus 5+/7+ fitur HANYA dihitung kalau tiap fitur dipakai
//     ≥30% cap-nya. Tap-and-go 1 XP gak masuk hitungan.
//
//   Layer 4: PROOF-OF-DEPTH (di-enforce di event-scoring.js)
//     Eligible Juara 1 (Rp 500k) wajib udah dapat ≥1 sertifikat path.
//     Bukti user beneran selesai konten, bukan farm aktivitas dangkal.

// ============================================================================
// LAYER 1: ANTI-REPLAY
// ============================================================================

// Replay = 30% XP. Cukup ada incentive replay buat hafalan, tapi gak farmable.
export const REPLAY_XP_MULTIPLIER = 0.3;

/**
 * Build canonical activity ID untuk tracking replay.
 * Format: "{feature}:{contentId}"
 * Examples:
 *   - "lesson:umrah-perkenalan-jamaah"
 *   - "game:tebak-gambar-makanan-1"
 *   - "game:cerita-cerita-1"
 *   - "game:tulis-arab-level-1"
 *   - "perkenalan:bismillah"
 *   - "nahwu_shorf:nahwu-isim-marfu"
 */
export function buildActivityId(feature, contentId) {
  if (!feature || !contentId) return null;
  return `${feature}:${String(contentId)}`;
}

/**
 * Cek apakah activity sudah pernah diselesaikan.
 */
export function isActivityCompleted(profile, activityId) {
  if (!activityId) return false;
  const completed = profile?.completedActivities || [];
  return completed.includes(activityId);
}

/**
 * Apply replay multiplier kalau activity sudah pernah diselesaikan.
 * Returns: { xp: adjustedXp, isReplay: boolean }
 */
export function applyReplayMultiplier(profile, activityId, rawXp) {
  const isReplay = isActivityCompleted(profile, activityId);
  const xp = isReplay ? Math.round(rawXp * REPLAY_XP_MULTIPLIER) : rawXp;
  return { xp, isReplay };
}

/**
 * Build updated completedActivities array — append activityId kalau baru.
 * Returns new array (immutable), atau null kalau gak perlu update.
 */
export function appendCompletedActivity(profile, activityId) {
  if (!activityId) return null;
  const existing = profile?.completedActivities || [];
  if (existing.includes(activityId)) return null; // gak perlu update
  return [...existing, activityId];
}

// ============================================================================
// LAYER 2: QUALITY GATE
// ============================================================================

// Threshold accuracy untuk award XP
export const QUALITY_GATE_PASS = 0.7;   // ≥70% benar = full XP
export const QUALITY_GATE_HALF = 0.4;   // 40-69% benar = 50% XP, <40% = 0

/**
 * Apply quality gate berdasarkan accuracy (correct / total).
 *
 * @param {number} rawXp — XP yang sudah dihitung dari component (biasanya proportional)
 * @param {number} correctRatio — score / totalQuestions, range [0, 1]
 * @returns {object} { xp, tier: 'fail' | 'half' | 'full', reason }
 */
export function applyQualityGate(rawXp, correctRatio) {
  if (typeof correctRatio !== 'number' || correctRatio < 0) {
    return { xp: rawXp, tier: 'full', reason: 'no quality data — pass through' };
  }
  if (correctRatio < QUALITY_GATE_HALF) {
    return {
      xp: 0,
      tier: 'fail',
      reason: `Score ${Math.round(correctRatio * 100)}% — minimum 40% untuk dapat XP. Coba ulangi.`,
    };
  }
  if (correctRatio < QUALITY_GATE_PASS) {
    return {
      xp: Math.round(rawXp * 0.5),
      tier: 'half',
      reason: `Score ${Math.round(correctRatio * 100)}% — half reward. Target 70%+ untuk full XP.`,
    };
  }
  return {
    xp: rawXp,
    tier: 'full',
    reason: `Score ${Math.round(correctRatio * 100)}% — full XP. Mantap!`,
  };
}

// ============================================================================
// COMBINED HELPER — apply both layers + return audit info
// ============================================================================

/**
 * One-shot helper buat call site di TulisNoonApp.
 *
 * @param {object} profile — userProfile
 * @param {string} feature — event feature key
 * @param {string} contentId — unique content ID (modul ID, level ID, dst)
 * @param {number} rawXp — XP yang user dapat dari component
 * @param {number} correctRatio — optional, dari quiz score
 * @returns {object} {
 *   xp: final XP after both gates,
 *   activityId, isReplay, quality: { tier, reason },
 *   shouldUpdateCompletedActivities: boolean,
 *   newCompletedActivities: array | null
 * }
 */
export function processActivityXp(profile, feature, contentId, rawXp, correctRatio = null) {
  const activityId = buildActivityId(feature, contentId);

  // Layer 2: quality gate dulu (sebelum replay multiplier)
  const quality = applyQualityGate(rawXp, correctRatio);
  let xp = quality.xp;

  // Layer 1: replay multiplier
  const replay = applyReplayMultiplier(profile, activityId, xp);
  xp = replay.xp;

  // Update completedActivities kalau bukan replay & passed quality (≥half tier)
  const shouldRecord = !replay.isReplay && quality.tier !== 'fail';
  const newCompletedActivities = shouldRecord ? appendCompletedActivity(profile, activityId) : null;

  return {
    xp,
    activityId,
    isReplay: replay.isReplay,
    quality,
    shouldUpdateCompletedActivities: !!newCompletedActivities,
    newCompletedActivities,
  };
}
