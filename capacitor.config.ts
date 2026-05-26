import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Capacitor config — wrap Next.js app jadi native iOS + Android.
 *
 * IMPORTANT: Next.js perlu di-export sebagai static atau pakai server URL.
 *  - Mode A (recommended): pakai webDir 'out' setelah `next build && next export`
 *  - Mode B (simpler, butuh internet): point server.url ke production Vercel URL
 *
 * Untuk launch awal pakai Mode B (poin ke Vercel), nanti pas mau full offline pindah ke Mode A.
 */

const config: CapacitorConfig = {
  appId: 'app.tulisnoon.app',          // reverse-DNS unique ID — daftar ini di App Store + Play Console
  appName: 'Tulis Noon',
  webDir: 'out',                       // dipakai untuk Mode A (offline-capable static)
  server: {
    // Mode B: load app dari Vercel — perlu internet, tapi langsung up-to-date tanpa rebuild native
    // Ganti ke URL production lo:
    url: 'https://tulis-noon.vercel.app',
    cleartext: false,
    // androidScheme: 'https',
  },
  ios: {
    contentInset: 'always',
    backgroundColor: '#faf6ee',
  },
  android: {
    backgroundColor: '#faf6ee',
    allowMixedContent: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: '#0a4d3c',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
    StatusBar: {
      backgroundColor: '#faf6ee',
      style: 'dark',
    },
  },
};

export default config;
