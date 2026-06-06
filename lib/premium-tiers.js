// lib/premium-tiers.js
// Tier premium "Tulis Noon Mahir". Tiap tier = akses penuh selama durasinya.
// Bayar via lynk.id (sementara) — link dibuka di browser, user kirim bukti ke
// admin chatbot di Profile, admin manual aktifkan di Firestore.
//
// Cara ganti URL lynk.id setelah punya akun beneran: edit field `payUrl` di
// tiap tier di bawah.

export const PREMIUM_TIERS = [
  {
    id: 'coba-3bulan',
    name: 'Coba 3 Bulan',
    tagline: 'Cicipi dulu sebelum komit panjang',
    priceLabel: 'Rp 49.000',
    priceCompare: null,
    durationDays: 90,
    durationLabel: '3 bulan akses penuh',
    isLifetime: false,
    isRecommended: false,
    isPendiri: false,
    payUrl: 'https://lynk.id/future/rg1019v27lx8',
    perks: [
      'Semua materi belajar terbuka',
      'Hafalan Quran Juz 1-29',
      'Tanya Cepat AI Hijazi unlimited',
      'Belajar Ngomong semua materi',
    ],
  },
  {
    id: 'mahir-1tahun',
    name: 'Mahir 1 Tahun',
    tagline: 'Paling laris — untuk yang serius lancar',
    priceLabel: 'Rp 99.000',
    priceCompare: 'Rp 196.000', // (49k × 4 = 196k, jadi hemat 49%)
    durationDays: 365,
    durationLabel: '1 tahun akses penuh',
    isLifetime: false,
    isRecommended: true,
    isPendiri: false,
    payUrl: 'https://lynk.id/future/qdvnv746lrg8',
    perks: [
      'Semua materi belajar terbuka',
      'Hafalan Quran Juz 1-29',
      'Tanya Cepat AI Hijazi unlimited',
      'Belajar Ngomong semua materi',
      'Prioritas update fitur baru',
    ],
  },
  {
    id: 'pendiri-lifetime',
    name: 'Pendiri Lifetime',
    tagline: 'Bayar sekali, akses selamanya',
    priceLabel: 'Rp 199.000',
    priceCompare: null,
    durationDays: null, // null = lifetime
    durationLabel: 'Selamanya — tanpa perpanjangan',
    isLifetime: true,
    isRecommended: false,
    isPendiri: true,
    payUrl: 'https://lynk.id/future/my4m40mlmj8m',
    perks: [
      'Semua materi belajar terbuka',
      'Hafalan Quran Juz 1-29',
      'Tanya Cepat AI Hijazi unlimited',
      'Belajar Ngomong semua materi',
      'Akses fitur baru selamanya',
      'Badge "Pendiri" di profilmu',
    ],
  },
];

// Limited slot untuk Pendiri Lifetime — bikin urgency. Naikin/turunin sesuai realitas.
export const PENDIRI_SLOT_LIMIT = 500;

export function getTierById(id) {
  return PREMIUM_TIERS.find((t) => t.id === id) || null;
}

// Free tier — list ringkas buat ditampilkan di bagian "Setelah trial habis kamu tetap punya:"
export const FREE_TIER_PERKS = [
  '3 modul awal tiap jalur belajar',
  'Hafalan Al-Fatihah + Juz 30',
  'Semua fitur sosial (teman, komunitas, chat, papan peringkat)',
  '3 Tanya Cepat per hari',
  '3 soal Ngomong per materi',
  'Semua game cepat & tantangan harian',
];
