// lib/feature-flags.js
// Global feature flags & helper akses premium.
//
// Model premium (sejak overhaul dari koin):
//   - User baru otomatis dapat TRIAL 10 hari (semua kebuka).
//   - Setelah trial habis → balik ke FREE TIER GENEROUS (3 modul awal tiap path,
//     Al-Fatihah + Juz 30, semua sosial, 3 Tanya Cepat/hari, 3 soal Ngomong/materi).
//   - Upgrade ke "Tulis Noon Mahir" → semua kebuka selama masa aktif:
//       * Coba 3 Bulan / Mahir 1 Tahun / Pendiri Lifetime.
//
// Field di userProfile yg dipakai:
//   - trialExpiresAt : Date / timestamp ms (di-set saat user pertama daftar)
//   - premiumExpiresAt : Date / timestamp ms (di-set saat user bayar tier non-lifetime)
//   - premiumLifetime : boolean (true kalau user beli Pendiri Lifetime)
//   - premiumPlanId : 'coba-3bulan' | 'mahir-1tahun' | 'pendiri-lifetime' | null
//
// Flag launch-phase di bawah ini override semuanya — semua user dianggap premium.
// Nanti pas premium udah ready & mau monetize: LAUNCH_OPEN_ALL_PREMIUM = false.

export const LAUNCH_OPEN_ALL_PREMIUM = true;

// Berapa hari trial otomatis untuk user baru.
export const TRIAL_DAYS = 10;

/**
 * Helper lama — dipertahankan untuk kompatibilitas kode yg masih panggil ini.
 * Sebaiknya pindah ke isUserPremium(userProfile).
 */
export function isPremiumUnlocked(userFlag) {
  if (LAUNCH_OPEN_ALL_PREMIUM) return true;
  return !!userFlag;
}

function _ms(v) {
  if (!v) return 0;
  if (typeof v === 'number') return v;
  if (typeof v === 'string') { const d = Date.parse(v); return isNaN(d) ? 0 : d; }
  if (v?.toMillis) return v.toMillis(); // Firestore Timestamp
  if (v?.toDate) return v.toDate().getTime();
  if (v instanceof Date) return v.getTime();
  return 0;
}

/**
 * Cek apakah user saat ini punya akses premium.
 * Urutan: launch flag → lifetime → premium aktif → trial aktif → false.
 */
export function isUserPremium(userProfile) {
  if (LAUNCH_OPEN_ALL_PREMIUM) return true;
  if (!userProfile) return false;
  if (userProfile.premiumLifetime) return true;
  const now = Date.now();
  if (_ms(userProfile.premiumExpiresAt) > now) return true;
  if (_ms(userProfile.trialExpiresAt) > now) return true;
  return false;
}

/**
 * Cek apakah user lagi di masa trial (bukan paid).
 * Berguna untuk nampilin countdown "X hari trial tersisa".
 */
export function isUserInTrial(userProfile) {
  if (!userProfile) return false;
  if (userProfile.premiumLifetime) return false;
  const now = Date.now();
  if (_ms(userProfile.premiumExpiresAt) > now) return false;
  return _ms(userProfile.trialExpiresAt) > now;
}

/**
 * Sisa hari trial. 0 kalau udah habis / udah upgrade.
 */
export function trialDaysRemaining(userProfile) {
  if (!isUserInTrial(userProfile)) return 0;
  const ms = _ms(userProfile.trialExpiresAt) - Date.now();
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}

/**
 * Sumber akses premium user sekarang — buat ditampilkan di Profile.
 * Returns: 'launch' | 'lifetime' | 'paid' | 'trial' | 'free'
 */
export function premiumSource(userProfile) {
  if (LAUNCH_OPEN_ALL_PREMIUM) return 'launch';
  if (!userProfile) return 'free';
  if (userProfile.premiumLifetime) return 'lifetime';
  const now = Date.now();
  if (_ms(userProfile.premiumExpiresAt) > now) return 'paid';
  if (_ms(userProfile.trialExpiresAt) > now) return 'trial';
  return 'free';
}
