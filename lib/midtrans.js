// lib/midtrans.js
// Midtrans Snap helper — sentral untuk config & paket koin.
// Setup keys: MIDTRANS_SERVER_KEY, MIDTRANS_CLIENT_KEY (env vars).
// Sandbox vs production controlled via MIDTRANS_IS_PRODUCTION env var.

export const MIDTRANS_IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === 'true';

export const MIDTRANS_API_BASE = MIDTRANS_IS_PRODUCTION
  ? 'https://app.midtrans.com'
  : 'https://app.sandbox.midtrans.com';

export const MIDTRANS_SNAP_URL = MIDTRANS_IS_PRODUCTION
  ? 'https://app.midtrans.com/snap/snap.js'
  : 'https://app.sandbox.midtrans.com/snap/snap.js';

// Pricing baseline: Rp 450 per koin.
// Paket besar dapet BONUS koin (effective harga per koin lebih murah).
export const COIN_PRICE_PER_UNIT_IDR = 450;

// Paket top-up koin — semua dalam IDR.
// Strategi: paket Starter exact baseline, paket besar incentive bonus.
export const COIN_PACKAGES = [
  {
    id: 'koin-50',
    coins: 50,
    bonusCoins: 0,
    price: 22500,            // 50 × 450 = Rp 22.500
    label: 'Starter',
    desc: '50 koin — buat coba-coba',
    popular: false,
  },
  {
    id: 'koin-100',
    coins: 100,
    bonusCoins: 20,          // +20 bonus → 120 koin total
    price: 45000,            // 100 × 450 = Rp 45.000 · eff Rp 375/koin (hemat ~17%)
    label: 'Hemat',
    desc: '100 + 20 bonus = 120 koin',
    popular: true,
  },
  {
    id: 'koin-250',
    coins: 250,
    bonusCoins: 75,          // +75 bonus → 325 koin total
    price: 112500,           // 250 × 450 = Rp 112.500 · eff Rp 346/koin (hemat ~23%)
    label: 'Power',
    desc: '250 + 75 bonus = 325 koin',
    popular: false,
  },
  {
    id: 'koin-600',
    coins: 600,
    bonusCoins: 200,         // +200 bonus → 800 koin total
    price: 270000,           // 600 × 450 = Rp 270.000 · eff Rp 337/koin (hemat ~25%)
    label: 'Pilgrim',
    desc: '600 + 200 bonus = 800 koin · paket jamaah lengkap',
    popular: false,
  },
];

/**
 * Helper: hitung harga IDR untuk N koin (baseline tanpa bonus).
 */
export function priceForCoins(coinCount) {
  return coinCount * COIN_PRICE_PER_UNIT_IDR;
}

export function getPackageById(id) {
  return COIN_PACKAGES.find((p) => p.id === id);
}
