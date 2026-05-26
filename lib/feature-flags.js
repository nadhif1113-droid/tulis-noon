// lib/feature-flags.js
// Global feature flags — paling utama dipakai untuk launch phase
// dimana semua fitur premium DIBUKA buat semua user (existing + new).
//
// Nanti pas mau monetize ulang:
//   1. Set LAUNCH_OPEN_ALL_PREMIUM = false
//   2. Reset existing users hafalanFullUnlocked, perkenalanBundleUnlocked via migration
//      (atau biarin existing user tetep dapet bonus, monetize cuma user baru)

export const LAUNCH_OPEN_ALL_PREMIUM = true;

/**
 * Wrapper utility — pakai ini di semua premium gate check.
 * Return true kalau global flag aktif ATAU user beneran sudah unlock.
 */
export function isPremiumUnlocked(userFlag) {
  if (LAUNCH_OPEN_ALL_PREMIUM) return true;
  return !!userFlag;
}
