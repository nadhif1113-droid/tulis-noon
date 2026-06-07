// lib/analytics.js
// Wrapper Firebase Analytics yang SSR-safe + Capacitor-safe.
//
// Strategi: lazy-init di browser. Kalau bukan browser (SSR / Node), no-op.
// Logging gak akan throw kalau Firebase gak ready.
//
// EVENT TAXONOMY (penting — konsisten biar mudah analisis di Firebase Console):
//
//   USER LIFECYCLE
//     signup, login, logout, persona_set, profile_complete
//
//   LESSON / CONTENT
//     screen_view (Firebase auto), lesson_start, lesson_complete,
//     conversation_complete, vocab_view,
//     hafalan_surat_start, hafalan_surat_complete,
//     nahwu_lesson_complete, shorf_lesson_complete,
//     perkenalan_materi_complete
//
//   QUIZ / GAME
//     quiz_start, quiz_complete (params: score, total, passed),
//     tebak_gambar_play, tebak_gambar_complete,
//     match_arena_play, ngomong_play, cerita_complete
//
//   PROGRESS / GAMIFICATION
//     xp_earned (params: amount, source),
//     streak_milestone (params: days),
//     cert_earned (params: pathId),
//     master_earned, level_up
//
//   PREMIUM / MONETIZATION
//     premium_view, premium_tier_clicked (params: tierId),
//     premium_pay_initiated, premium_purchased,
//     trial_started, trial_expired
//
//   FEATURE USAGE
//     tanya_cepat_used, recommendation_clicked,
//     insight_viewed, next_action_chosen (params: action),
//     ai_validate_used, social_post, friend_added
//
//   RETENTION
//     daily_goal_set, daily_goal_met, session_started,
//     comeback (params: days_absent), notification_opened

import app from '@/lib/firebase';

let analytics = null;
let initialized = false;
let initPromise = null;

// Lazy init — cuma sekali, di browser
async function initAnalytics() {
  if (initialized) return analytics;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      if (typeof window === 'undefined') return null;
      // Capacitor native = treat sebagai web (server.url mode)
      const { getAnalytics, isSupported } = await import('firebase/analytics');
      const supported = await isSupported();
      if (!supported) {
        console.warn('[analytics] not supported in this environment');
        return null;
      }
      analytics = getAnalytics(app);
      initialized = true;
      return analytics;
    } catch (e) {
      console.warn('[analytics] init failed (non-fatal):', e.message);
      return null;
    }
  })();
  return initPromise;
}

/**
 * Log an event. Safe to call from anywhere.
 * Tidak akan throw — di-design buat fire-and-forget.
 *
 * @param {string} eventName — pakai snake_case (Firebase convention)
 * @param {object} params — flat properties (string/number/bool)
 */
export async function trackEvent(eventName, params = {}) {
  try {
    const a = await initAnalytics();
    if (!a) return;
    const { logEvent } = await import('firebase/analytics');
    // Cleanup undefined/null values (Firebase reject)
    const clean = {};
    for (const [k, v] of Object.entries(params || {})) {
      if (v !== undefined && v !== null) clean[k] = v;
    }
    logEvent(a, eventName, clean);
  } catch (e) {
    console.warn(`[analytics] trackEvent(${eventName}) failed:`, e.message);
  }
}

/**
 * Set user ID untuk join-an event ke user (jangan PII).
 * Panggil saat user login.
 */
export async function setAnalyticsUser(userId) {
  try {
    const a = await initAnalytics();
    if (!a) return;
    const { setUserId } = await import('firebase/analytics');
    setUserId(a, userId || null);
  } catch (e) {
    console.warn('[analytics] setUser failed:', e.message);
  }
}

/**
 * Set user properties untuk segmentasi (persona, level, dll).
 * Bisa dipanggil multiple kali — properti di-override.
 */
export async function setUserProperties(props = {}) {
  try {
    const a = await initAnalytics();
    if (!a) return;
    const { setUserProperties } = await import('firebase/analytics');
    setUserProperties(a, props);
  } catch (e) {
    console.warn('[analytics] setUserProperties failed:', e.message);
  }
}

// ============================================================================
// Convenience helpers — semantic events untuk consistency
// ============================================================================

export const Analytics = {
  // --- User lifecycle ---
  signup: (method) => trackEvent('signup', { method }),
  login: (method) => trackEvent('login', { method }),
  logout: () => trackEvent('logout'),
  personaSet: (persona) => trackEvent('persona_set', { persona }),

  // --- Lesson / content ---
  lessonStart: (pathId, moduleId, moduleTitle) =>
    trackEvent('lesson_start', { path: pathId, module_id: moduleId, module_title: moduleTitle }),
  lessonComplete: (pathId, moduleId, xpEarned) =>
    trackEvent('lesson_complete', { path: pathId, module_id: moduleId, xp_earned: xpEarned }),
  conversationComplete: (moduleId, convIdx) =>
    trackEvent('conversation_complete', { module_id: moduleId, conv_idx: convIdx }),
  hafalanSuratComplete: (suratNum, suratName) =>
    trackEvent('hafalan_surat_complete', { surat_num: suratNum, surat_name: suratName }),
  nahwuLessonComplete: (lessonId) =>
    trackEvent('nahwu_lesson_complete', { lesson_id: lessonId }),
  shorfLessonComplete: (lessonId) =>
    trackEvent('shorf_lesson_complete', { lesson_id: lessonId }),
  perkenalanComplete: (materiId) =>
    trackEvent('perkenalan_materi_complete', { materi_id: materiId }),

  // --- Quiz / Game ---
  quizComplete: (moduleId, score, total, passed) =>
    trackEvent('quiz_complete', { module_id: moduleId, score, total, passed }),
  tebakGambarComplete: (category, score, total) =>
    trackEvent('tebak_gambar_complete', { category, score, total }),
  matchArenaPlay: (level, result) =>
    trackEvent('match_arena_play', { level, result }),
  ngomongPlay: (level) =>
    trackEvent('ngomong_play', { level }),
  ceritaComplete: (storyId) =>
    trackEvent('cerita_complete', { story_id: storyId }),

  // --- Progress / gamification ---
  xpEarned: (amount, source) =>
    trackEvent('xp_earned', { amount, source }),
  streakMilestone: (days) =>
    trackEvent('streak_milestone', { days }),
  certEarned: (pathId) =>
    trackEvent('cert_earned', { path_id: pathId }),
  masterEarned: () =>
    trackEvent('master_earned'),

  // --- Premium ---
  premiumView: (source) =>
    trackEvent('premium_view', { source }),
  premiumTierClicked: (tierId) =>
    trackEvent('premium_tier_clicked', { tier_id: tierId }),
  premiumPayInitiated: (tierId) =>
    trackEvent('premium_pay_initiated', { tier_id: tierId }),
  trialStarted: () =>
    trackEvent('trial_started'),
  trialExpired: () =>
    trackEvent('trial_expired'),

  // --- Feature usage ---
  tanyaCepatUsed: () =>
    trackEvent('tanya_cepat_used'),
  recommendationClicked: (pathId) =>
    trackEvent('recommendation_clicked', { path_id: pathId }),
  insightViewed: (moduleId, cached) =>
    trackEvent('insight_viewed', { module_id: moduleId, cached: cached ? 1 : 0 }),
  nextActionChosen: (action) =>
    trackEvent('next_action_chosen', { action }),

  // --- Retention ---
  sessionStarted: () => trackEvent('session_started'),
  dailyGoalSet: (minutes) => trackEvent('daily_goal_set', { minutes }),
  dailyGoalMet: () => trackEvent('daily_goal_met'),
  comeback: (daysAbsent) => trackEvent('comeback', { days_absent: daysAbsent }),
  notificationOpened: (notifType) => trackEvent('notification_opened', { type: notifType }),
};
