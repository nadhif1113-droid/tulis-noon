import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Capacitor config — wrap Next.js (Vercel) jadi native iOS + Android.
 *
 * MODE: Server URL (Mode B) — app native load content dari Vercel.
 * Setiap deploy Vercel = update otomatis ke semua app native (tanpa rebuild & resubmit ke store).
 * Cuma butuh rebuild kalau:
 *  - Ubah app icon / splash / nama
 *  - Update Capacitor plugins
 *  - Submit versi baru ke App Store / Play Store
 */

const config: CapacitorConfig = {
  appId: 'app.tulisnoon.app',
  appName: 'Tulis Noon',
  webDir: 'out',                                  // dipakai kalau switch ke Mode A (offline static export)
  server: {
    url: 'https://tulis-noon.vercel.app',          // production URL — semua request load dari sini
    cleartext: false,
    androidScheme: 'https',
    iosScheme: 'https',
  },
  ios: {
    contentInset: 'always',
    backgroundColor: '#faf6ee',
    // Bahasa Arab perlu RTL support
    preferredContentMode: 'mobile',
    // Allow inline mic capture without user gesture confirmation each time
    handleApplicationURL: true,
    limitsNavigationsToAppBoundDomains: false,
  },
  android: {
    backgroundColor: '#faf6ee',
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    // Untuk Android 12+: theme color status bar
    appendUserAgent: 'TulisNoonAndroid',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      launchFadeOutDuration: 300,
      backgroundColor: '#0a4d3c',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      backgroundColor: '#faf6ee',
      style: 'DARK',          // dark text on light bg (matching app theme)
      overlaysWebView: false,
    },
    Keyboard: {
      resize: 'body',
      style: 'LIGHT',
      resizeOnFullScreen: true,
    },
    App: {
      // Saat back button native ditekan, biarkan WebView handle history dulu
      // (jadi user gak langsung exit app pas tekan back dari game).
    },
  },
};

export default config;
