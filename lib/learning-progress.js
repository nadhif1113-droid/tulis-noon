// lib/learning-progress.js
// Helper terpusat untuk track completion semua materi (kecuali games).
//
// Sources yang dilacak:
//   - lesson    : Modul Umrah/Profesional/Pelajar (path-based)
//   - perkenalan: Perkenalan Diri (12 materi)
//   - nahwu     : Nahwu (35 pelajaran)
//   - shorf     : Shorf (29 pelajaran)
//   - cerita    : Cerita Interaktif (21 cerita)
//   - hafalan   : Hafalan Juz 30 (37 surat) — granular per chunk
//
// Field di Firestore userProfile:
//   - completedLessonModules: { umrah: [], beasiswa: [], profesi: [] }
//   - completedPerkenalanMateri: [materiId, ...]
//   - completedNahwuShorf: { nahwu: [lessonId, ...], shorf: [...] }
//   - completedCeritaStories: [storyId, ...]
//   - hafalanProgress: { suratId: [chunkIdx, ...] }
//
// Anti-replay (event scoring) di-handle separately via lib/anti-cheat.js
// (completedActivities[]). Tracking ini bertujuan UX checklist + sertifikat.

// ============================================================================
// READ HELPERS — Cek apakah suatu item sudah complete
// ============================================================================

export function isLessonCompleted(profile, pathId, moduleId) {
  const map = profile?.completedLessonModules || {};
  const arr = map[pathId] || [];
  return arr.includes(moduleId);
}

export function isPerkenalanCompleted(profile, materiId) {
  return (profile?.completedPerkenalanMateri || []).includes(materiId);
}

export function isNahwuShorfCompleted(profile, pathId, lessonId) {
  const map = profile?.completedNahwuShorf || {};
  const arr = map[pathId] || [];
  return arr.includes(lessonId);
}

export function isCeritaCompleted(profile, storyId) {
  return (profile?.completedCeritaStories || []).includes(storyId);
}

export function isHafalanFullyCompleted(profile, suratId, totalChunks) {
  const map = profile?.hafalanProgress || {};
  const arr = map[suratId] || [];
  return totalChunks > 0 && arr.length >= totalChunks;
}

export function getHafalanChunkCount(profile, suratId) {
  return ((profile?.hafalanProgress || {})[suratId] || []).length;
}

// ============================================================================
// WRITE HELPERS — Build Firestore update objects (immutable)
// ============================================================================

/**
 * Mark lesson modul completed. Returns update object atau null kalau udah selesai.
 */
export function buildLessonCompletionUpdate(profile, pathId, moduleId) {
  const map = profile?.completedLessonModules || {};
  const arr = map[pathId] || [];
  if (arr.includes(moduleId)) return null;
  return {
    completedLessonModules: { ...map, [pathId]: [...arr, moduleId] },
  };
}

export function buildPerkenalanCompletionUpdate(profile, materiId) {
  const arr = profile?.completedPerkenalanMateri || [];
  if (arr.includes(materiId)) return null;
  return { completedPerkenalanMateri: [...arr, materiId] };
}

export function buildNahwuShorfCompletionUpdate(profile, pathId, lessonId) {
  const map = profile?.completedNahwuShorf || {};
  const arr = map[pathId] || [];
  if (arr.includes(lessonId)) return null;
  return {
    completedNahwuShorf: { ...map, [pathId]: [...arr, lessonId] },
  };
}

export function buildCeritaCompletionUpdate(profile, storyId) {
  const arr = profile?.completedCeritaStories || [];
  if (arr.includes(storyId)) return null;
  return { completedCeritaStories: [...arr, storyId] };
}

// ============================================================================
// STATS — Untuk render progress bar di list + dashboard
// ============================================================================

/**
 * Hitung stats kompletion untuk satu source.
 * @returns { completed, total, percent, isCompleted }
 */
export function getCompletionStats(completedCount, totalCount) {
  const total = Math.max(0, totalCount || 0);
  const completed = Math.min(total, Math.max(0, completedCount || 0));
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { completed, total, percent, isCompleted: total > 0 && completed >= total };
}

/**
 * Get progress untuk lesson path tertentu.
 */
export function getLessonPathProgress(profile, pathId, totalModules) {
  const map = profile?.completedLessonModules || {};
  return getCompletionStats((map[pathId] || []).length, totalModules);
}

export function getPerkenalanProgress(profile, totalMateri) {
  return getCompletionStats((profile?.completedPerkenalanMateri || []).length, totalMateri);
}

export function getNahwuShorfProgress(profile, pathId, totalLessons) {
  const map = profile?.completedNahwuShorf || {};
  return getCompletionStats((map[pathId] || []).length, totalLessons);
}

export function getCeritaProgress(profile, totalStories) {
  return getCompletionStats((profile?.completedCeritaStories || []).length, totalStories);
}

export function getHafalanProgress(profile, totalSurat) {
  // "Completed" surat = surat dengan ≥1 chunk selesai (sebagai indicator started/done)
  const map = profile?.hafalanProgress || {};
  const startedCount = Object.values(map).filter((arr) => Array.isArray(arr) && arr.length > 0).length;
  return getCompletionStats(startedCount, totalSurat);
}

// ============================================================================
// AGGREGATED DASHBOARD — untuk halaman Profile
// ============================================================================

/**
 * Build snapshot lengkap semua progress untuk dashboard Profile.
 * Caller harus pass total per source (biasanya dari data files).
 *
 * @param {object} profile
 * @param {object} totals — { umrah, profesi, pelajar, perkenalan, nahwu, shorf, cerita, hafalan }
 * @returns {object} dashboard data structured untuk render
 */
export function buildLearningDashboard(profile, totals) {
  const t = totals || {};
  const lesson = {
    umrah:    getLessonPathProgress(profile, 'umrah', t.umrah || 0),
    profesi:  getLessonPathProgress(profile, 'profesi', t.profesi || 0),
    pelajar:  getLessonPathProgress(profile, 'pelajar', t.pelajar || 0),
    beasiswa: getLessonPathProgress(profile, 'beasiswa', t.pelajar || 0), // pelajar pathId alias
  };
  const perkenalan = getPerkenalanProgress(profile, t.perkenalan || 0);
  const nahwu = getNahwuShorfProgress(profile, 'nahwu', t.nahwu || 0);
  const shorf = getNahwuShorfProgress(profile, 'shorf', t.shorf || 0);
  const cerita = getCeritaProgress(profile, t.cerita || 0);
  const hafalan = getHafalanProgress(profile, t.hafalan || 0);

  // Overall % across all sources (weighted by total)
  const all = [
    { name: 'Umrah', ...lesson.umrah },
    { name: 'Profesi', ...lesson.profesi },
    { name: 'Pelajar', ...lesson.pelajar },
    { name: 'Perkenalan', ...perkenalan },
    { name: 'Nahwu', ...nahwu },
    { name: 'Shorf', ...shorf },
    { name: 'Cerita', ...cerita },
    { name: 'Hafalan', ...hafalan },
  ];
  const totalAllCompleted = all.reduce((s, a) => s + a.completed, 0);
  const totalAllItems = all.reduce((s, a) => s + a.total, 0);
  const overall = getCompletionStats(totalAllCompleted, totalAllItems);

  return {
    lesson,
    perkenalan,
    nahwu,
    shorf,
    cerita,
    hafalan,
    overall,
    sections: all.filter((a) => a.total > 0),
  };
}

// ============================================================================
// LEGACY MIGRATION
// ============================================================================

/**
 * Kalau profile masih pakai field lama (`progress` object dengan max-order),
 * migrate ke `completedLessonModules` dengan inferred IDs.
 * Caller harus pass mapping pathId → array modul (dari data files) untuk inferring.
 *
 * Returns: { migrated: boolean, update: object | null }
 */
export function migrateLegacyProgress(profile, pathModulesMap) {
  if (!profile?.progress || profile?.completedLessonModules) return { migrated: false, update: null };
  const completedLessonModules = {};
  for (const [pathId, maxOrder] of Object.entries(profile.progress)) {
    const modules = pathModulesMap?.[pathId] || [];
    const completed = modules
      .filter((m) => (m.order || 0) <= maxOrder)
      .map((m) => m.id);
    if (completed.length > 0) completedLessonModules[pathId] = completed;
  }
  if (Object.keys(completedLessonModules).length === 0) return { migrated: false, update: null };
  return { migrated: true, update: { completedLessonModules } };
}
