// lib/event-registration.js
// Pendaftaran resmi user untuk Event Tantangan 10 Hari Aktif.
//
// User WAJIB:
//   1. Isi data diri sesuai KTP (untuk verifikasi pemenang & transfer hadiah)
//   2. Isi info rekening (bank/e-wallet) atas nama sendiri
//   3. Menyetujui pernyataan komitmen anti-cheat & terms event
//
// Tanpa registrasi, user TIDAK MUNCUL di leaderboard event meskipun XP-nya tinggi.
//
// Data di-store di Firestore: userProfile.eventRegistration = {
//   eventId: 'aktif-10hari-juni-2026',
//   agreedAt: timestamp,
//   fullName: 'Ahmad Fauzi',           // sesuai KTP
//   phone: '+628123456789',            // WhatsApp aktif untuk verifikasi
//   email: 'ahmad@example.com',
//   province: 'Jawa Tengah',
//   city: 'Semarang',
//   address: 'Jl. Pemuda no 1',
//   birthYear: 1990,                   // verifikasi umur (≥18)
//   payoutMethod: 'bank' | 'ewallet',
//   payoutProvider: 'BCA' | 'Mandiri' | 'GoPay' | 'OVO' | 'DANA',
//   accountNumber: '1234567890',
//   accountName: 'Ahmad Fauzi',        // wajib match fullName
//   signature: 'Ahmad Fauzi',          // ketik nama sebagai tanda tangan
//   agreedPoints: ['commit-10days', 'no-cheat', 'no-multi-account', ...],
//   ipAddress: '...',                  // optional, anti-fraud
//   userAgent: '...',                  // optional
// }

import { EVENT_ID } from '@/lib/challenge-launch';

// ============================================================================
// AGREEMENT POINTS (yang harus dicentang)
// ============================================================================

export const AGREEMENT_POINTS = [
  {
    id: 'commit-10days',
    title: 'Komitmen 10 hari penuh',
    text: 'Saya berkomitmen aktif belajar selama 10 hari event (13–22 Juni 2026 WIB) dengan jujur dan konsisten.',
    required: true,
  },
  {
    id: 'no-cheat',
    title: 'Tidak menggunakan bot atau script',
    text: 'Saya menyatakan tidak akan menggunakan bot, automation, script, modifikasi aplikasi, atau cara curang lainnya untuk mendapatkan XP.',
    required: true,
  },
  {
    id: 'no-multi-account',
    title: 'Hanya satu akun',
    text: 'Saya hanya mendaftar dengan satu akun. Saya tidak akan membuat akun lain atau "akun bayangan" untuk mengikuti event.',
    required: true,
  },
  {
    id: 'data-accurate',
    title: 'Data benar & dapat diverifikasi',
    text: 'Data diri yang saya isi (nama, alamat, rekening) BENAR dan sesuai KTP/identitas resmi. Saya siap diverifikasi via WhatsApp jika menang.',
    required: true,
  },
  {
    id: 'admin-final',
    title: 'Keputusan admin final',
    text: 'Saya menerima keputusan tim Tulis Noon sebagai final terkait pemenang. Admin berhak mendiskualifikasi user yang terbukti curang tanpa pemberitahuan.',
    required: true,
  },
  {
    id: 'payout-self',
    title: 'Rekening atas nama sendiri',
    text: 'Hadiah HANYA dikirim ke rekening/e-wallet atas nama saya sendiri (sesuai data KTP). Tidak melalui perantara.',
    required: true,
  },
  {
    id: 'audit-consent',
    title: 'Setuju aktivitas diaudit',
    text: 'Saya menyetujui semua aktivitas belajar saya (XP, waktu, pattern) dapat di-audit oleh tim Tulis Noon untuk fairness.',
    required: true,
  },
  {
    id: 'tax-self',
    title: 'Pajak hadiah tanggung jawab pemenang',
    text: 'Saya memahami pajak hadiah (jika ada, sesuai aturan PPh 4 ayat 2) ditanggung pemenang sendiri.',
    required: true,
  },
];

// ============================================================================
// PAYOUT METHODS (bank + e-wallet)
// ============================================================================

export const PAYOUT_BANKS = [
  'BCA', 'Mandiri', 'BNI', 'BRI', 'CIMB Niaga', 'BTN', 'Permata', 'Danamon',
  'BSI (Bank Syariah Indonesia)', 'Muamalat', 'BTPN/Jenius', 'Bank Mega', 'OCBC NISP',
];

export const PAYOUT_EWALLETS = [
  'GoPay', 'OVO', 'DANA', 'ShopeePay', 'LinkAja', 'Sakuku',
];

// ============================================================================
// VALIDATION
// ============================================================================

const PHONE_REGEX = /^(\+62|62|0)8\d{8,12}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ACCOUNT_NUMBER_REGEX = /^[0-9]{8,20}$/;

/**
 * Validasi data registrasi.
 * Returns: { ok: boolean, errors: { field: message } }
 */
export function validateRegistration(data) {
  const errors = {};

  // === STEP 1: Data Diri ===
  if (!data.fullName || data.fullName.trim().length < 3) {
    errors.fullName = 'Nama lengkap minimal 3 karakter.';
  } else if (data.fullName.trim().split(' ').length < 2) {
    errors.fullName = 'Tulis nama lengkap (minimal 2 kata, sesuai KTP).';
  }

  if (!data.phone || !PHONE_REGEX.test(data.phone.replace(/\s|-/g, ''))) {
    errors.phone = 'Nomor HP/WhatsApp tidak valid (contoh: 08123456789).';
  }

  if (!data.email || !EMAIL_REGEX.test(data.email)) {
    errors.email = 'Email tidak valid.';
  }

  if (!data.province || data.province.trim().length < 2) {
    errors.province = 'Provinsi wajib diisi.';
  }

  if (!data.city || data.city.trim().length < 2) {
    errors.city = 'Kota wajib diisi.';
  }

  if (!data.address || data.address.trim().length < 10) {
    errors.address = 'Alamat lengkap minimal 10 karakter.';
  }

  if (!data.birthYear || data.birthYear < 1940 || data.birthYear > new Date().getFullYear() - 13) {
    errors.birthYear = 'Tahun lahir tidak valid (minimal usia 13 tahun).';
  }

  // === STEP 2: Payout ===
  if (!data.payoutMethod || !['bank', 'ewallet'].includes(data.payoutMethod)) {
    errors.payoutMethod = 'Pilih metode hadiah.';
  }

  if (!data.payoutProvider) {
    errors.payoutProvider = 'Pilih bank / e-wallet.';
  }

  if (!data.accountNumber || !ACCOUNT_NUMBER_REGEX.test(data.accountNumber.replace(/\s|-/g, ''))) {
    errors.accountNumber = 'Nomor rekening/e-wallet tidak valid (angka 8–20 digit).';
  }

  if (!data.accountName || data.accountName.trim().length < 3) {
    errors.accountName = 'Nama pemilik rekening wajib diisi.';
  } else if (data.fullName && normalizeNameForCompare(data.accountName) !== normalizeNameForCompare(data.fullName)) {
    errors.accountName = 'Nama pemilik rekening harus PERSIS sama dengan nama lengkap KTP.';
  }

  // === STEP 3: Agreement ===
  const requiredPoints = AGREEMENT_POINTS.filter((p) => p.required).map((p) => p.id);
  const agreed = data.agreedPoints || [];
  const missingAgreement = requiredPoints.filter((id) => !agreed.includes(id));
  if (missingAgreement.length > 0) {
    errors.agreedPoints = `Centang semua ${requiredPoints.length} pernyataan untuk lanjut.`;
  }

  if (!data.signature || normalizeNameForCompare(data.signature) !== normalizeNameForCompare(data.fullName)) {
    errors.signature = 'Tanda tangan harus persis sama dengan nama lengkap di atas.';
  }

  return { ok: Object.keys(errors).length === 0, errors };
}

function normalizeNameForCompare(s) {
  return String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Build registrasi payload final yang akan di-store ke Firestore.
 */
export function buildRegistrationPayload(formData, meta = {}) {
  return {
    eventId: EVENT_ID,
    agreedAt: Date.now(),
    fullName: formData.fullName.trim(),
    phone: formData.phone.replace(/\s|-/g, ''),
    email: formData.email.trim().toLowerCase(),
    province: formData.province.trim(),
    city: formData.city.trim(),
    address: formData.address.trim(),
    birthYear: Number(formData.birthYear),
    payoutMethod: formData.payoutMethod,
    payoutProvider: formData.payoutProvider,
    accountNumber: formData.accountNumber.replace(/\s|-/g, ''),
    accountName: formData.accountName.trim(),
    signature: formData.signature.trim(),
    agreedPoints: formData.agreedPoints || [],
    // Meta untuk audit trail
    userAgent: meta.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : ''),
    registeredFromScreen: meta.fromScreen || 'event-dashboard',
  };
}

/**
 * Cek apakah user sudah terdaftar untuk event INI.
 */
export function isRegisteredForCurrentEvent(profile) {
  const reg = profile?.eventRegistration;
  if (!reg) return false;
  return reg.eventId === EVENT_ID && !!reg.agreedAt;
}

/**
 * Display name dari registrasi (untuk leaderboard).
 */
export function getRegisteredName(profile) {
  const reg = profile?.eventRegistration;
  if (!reg || reg.eventId !== EVENT_ID) return null;
  return reg.fullName || null;
}
