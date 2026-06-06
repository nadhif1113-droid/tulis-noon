// lib/learning-pricing.js
// Pricing & gating untuk learning paths (Umrah, Profesional, Pelajar).

import { isPremiumUnlocked } from '@/lib/feature-flags';
//
// Rules:
// UMRAH:
//   - 3 modul awal FREE (#1, #2, #3)
//   - Modul 4-15: 15 koin per modul (one-time unlock)
//   - Per modul: 5 percakapan pertama FREE, percakapan ke-6+ = 10 koin masing-masing
//
// PROFESIONAL:
//   - 5 modul awal FREE (#1-#5)
//   - Modul 6-20: 20 koin per modul
//   - Per modul: 5 percakapan pertama FREE, sisanya 10 koin
//
// PELAJAR (Beasiswa/Siswa/Mahasiswa):
//   - SEMUA FREE — bantu pelajar yang lagi survival mode

export const LEARNING_PRICING = {
  umrah: {
    label: 'Umrah',
    freeModulesCount: 3,
    modulePriceCoins: 15,
    perModuleFreeConvs: 5,
    conversationPriceCoins: 10,
    isFullyFree: false,
  },
  profesi: {
    label: 'Profesional',
    freeModulesCount: 5,
    modulePriceCoins: 20,
    perModuleFreeConvs: 5,
    conversationPriceCoins: 10,
    isFullyFree: false,
  },
  beasiswa: {
    label: 'Pelajar',
    freeModulesCount: 999,
    modulePriceCoins: 0,
    perModuleFreeConvs: 999,
    conversationPriceCoins: 0,
    isFullyFree: true,
  },
};

export function getPricing(pathId) {
  return LEARNING_PRICING[pathId] || LEARNING_PRICING.beasiswa;
}

/**
 * Apakah modul ini termasuk modul gratis (berdasarkan order)?
 */
export function isModuleFree(module) {
  const pricing = getPricing(module.pathId);
  if (pricing.isFullyFree) return true;
  return module.order <= pricing.freeModulesCount;
}

/**
 * Apakah user sudah unlock modul ini?
 */
export function isModuleUnlocked(module, userProfile) {
  if (isModuleFree(module)) return true;
  const key = unlockedModulesKey(module.pathId);
  const unlocked = userProfile?.[key] || [];
  // Hormati global flag LAUNCH_OPEN_ALL_PREMIUM (semua premium kebuka untuk launch/test).
  return isPremiumUnlocked(unlocked.includes(module.id));
}

/**
 * Apakah percakapan ke-N gratis?
 */
export function isConversationFree(module, convIdx) {
  const pricing = getPricing(module.pathId);
  if (pricing.isFullyFree) return true;
  return convIdx < pricing.perModuleFreeConvs;
}

/**
 * Apakah user sudah unlock percakapan tertentu?
 */
export function isConversationUnlocked(module, convIdx, userProfile) {
  if (isConversationFree(module, convIdx)) return true;
  const all = userProfile?.unlockedConversations || {};
  const arr = all[module.id] || [];
  return isPremiumUnlocked(arr.includes(convIdx));
}

/**
 * Storage key untuk array module yang dibuka per-path.
 */
export function unlockedModulesKey(pathId) {
  return pathId === 'umrah' ? 'unlockedUmrahModules'
    : pathId === 'profesi' ? 'unlockedProfesiModules'
    : 'unlockedBeasiswaModules';
}

/**
 * Hitung jumlah modul yg masih terkunci untuk satu path.
 */
export function countLockedModules(modules, userProfile) {
  return modules.filter(m => !isModuleUnlocked(m, userProfile)).length;
}
