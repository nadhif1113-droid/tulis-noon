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

// Paket top-up koin — semua dalam IDR.
// Pricing strategy: makin gede paket, makin hemat per koin.
export const COIN_PACKAGES = [
  {
    id: 'koin-50',
    coins: 50,
    bonusCoins: 0,
    price: 15000,            // IDR 15.000 (≈ 1 USD)
    label: 'Starter',
    desc: '50 koin — buat coba-coba',
    popular: false,
  },
  {
    id: 'koin-150',
    coins: 150,
    bonusCoins: 25,          // bonus 25 koin
    price: 39000,            // IDR 39.000
    label: 'Hemat',
    desc: '150 + 25 bonus = 175 koin',
    popular: true,
  },
  {
    id: 'koin-500',
    coins: 500,
    bonusCoins: 100,         // bonus 100 koin
    price: 99000,            // IDR 99.000
    label: 'Power',
    desc: '500 + 100 bonus = 600 koin',
    popular: false,
  },
  {
    id: 'koin-1500',
    coins: 1500,
    bonusCoins: 500,         // bonus 500 koin
    price: 249000,           // IDR 249.000
    label: 'Pilgrim',
    desc: '1500 + 500 bonus = 2000 koin · lifetime ready',
    popular: false,
  },
];

export function getPackageById(id) {
  return COIN_PACKAGES.find((p) => p.id === id);
}
