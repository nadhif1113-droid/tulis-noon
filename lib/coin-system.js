// lib/coin-system.js
// Koin = mata uang dalam game Tulis Noon.
// Pay-per-use alternatif untuk subscription Premium.
// Konversi base: Rp 500 = 1 koin (basic price, ada paket bonus).

export const COIN_PACKAGES = [
  {
    id: 'starter',
    label: 'Starter',
    coins: 10,
    bonus: 0,
    price: 5000,
    popular: false,
    description: 'Cobain dulu — cukup buat 1-2 level premium',
  },
  {
    id: 'basic',
    label: 'Basic',
    coins: 25,
    bonus: 5,
    price: 10000,
    popular: true,
    description: 'Paling populer — 30 koin, +5 bonus',
  },
  {
    id: 'value',
    label: 'Value',
    coins: 60,
    bonus: 15,
    price: 25000,
    popular: false,
    description: '75 koin, hemat 25%',
  },
  {
    id: 'best',
    label: 'Best Deal',
    coins: 150,
    bonus: 50,
    price: 50000,
    popular: false,
    description: '200 koin, hemat 35% — bisa main 1-2 bulan',
  },
];

/**
 * Cara dapet koin GRATIS — buat ditampilin di info modal.
 */
export const COIN_SOURCES = [
  { icon: '🌅', label: 'Daily login bonus', coins: '+1 koin/hari' },
  { icon: '🔥', label: 'Streak 7 hari', coins: '+5 koin' },
  { icon: '🔥', label: 'Streak 30 hari', coins: '+20 koin' },
  { icon: '🏆', label: 'Selesaikan Phase Tulis Arab', coins: '+10 koin' },
  { icon: '👥', label: 'Refer teman (signup)', coins: '+5 koin' },
  { icon: '💳', label: 'Beli paket koin', coins: 'Top up' },
];

/**
 * Penggunaan koin — fokus ke BELI NYAWA EXTRA + bonus features.
 * Model: semua konten game GRATIS, tapi user dibatasi 10 nyawa/hari.
 * Habis sebelum reset 24 jam? Pakai koin.
 */
export const COIN_USES = [
  { icon: '❤️', label: 'Tambah 1 nyawa', cost: 1 },
  { icon: '💖', label: 'Refill semua 10 nyawa', cost: 5, save: '50%' },
  { icon: '💡', label: 'Hint extra saat main game', cost: 1 },
  { icon: '⏭️', label: 'Skip soal yang susah', cost: 2 },
  { icon: '💬', label: 'Tambah 5 turn Latihan Ngobrol', cost: 2 },
  { icon: '🎁', label: 'Buka konten tantangan exclusive', cost: 3 },
];

/**
 * Format angka jadi format Rupiah Indonesia.
 */
export function formatRupiah(amount) {
  return 'Rp ' + amount.toLocaleString('id-ID');
}

/**
 * Hitung total koin dari paket (coins + bonus).
 */
export function totalCoinsForPackage(pkg) {
  return (pkg.coins || 0) + (pkg.bonus || 0);
}

/**
 * Hitung harga per koin (untuk display "per koin").
 */
export function pricePerCoin(pkg) {
  const total = totalCoinsForPackage(pkg);
  if (total === 0) return 0;
  return Math.round(pkg.price / total);
}
