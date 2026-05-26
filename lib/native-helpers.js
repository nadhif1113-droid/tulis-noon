// lib/native-helpers.js
// Helper untuk integrasi Capacitor native features.
// Pakai dynamic import biar gak crash di web (kalau Capacitor gak terinstall).

let cachedPlatform = null;

/**
 * Deteksi apakah app jalan di native (iOS/Android) atau di browser web.
 * Return: 'ios' | 'android' | 'web'
 */
export async function getPlatform() {
  if (cachedPlatform) return cachedPlatform;
  if (typeof window === 'undefined') return 'web';
  try {
    const { Capacitor } = await import('@capacitor/core');
    cachedPlatform = Capacitor.getPlatform();
    return cachedPlatform;
  } catch (e) {
    cachedPlatform = 'web';
    return 'web';
  }
}

export async function isNative() {
  const p = await getPlatform();
  return p === 'ios' || p === 'android';
}

export async function isIOS() {
  return (await getPlatform()) === 'ios';
}

export async function isAndroid() {
  return (await getPlatform()) === 'android';
}

/**
 * Setup native back button — pas user tekan back hardware:
 *  - Kalau ada history WebView (di game/lesson), pop history dulu
 *  - Kalau di root (home), tunjukkan exit confirmation
 */
export async function setupNativeBackButton({ onRootBack } = {}) {
  if (typeof window === 'undefined') return () => {};
  try {
    const { App } = await import('@capacitor/app');
    const listener = await App.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
      } else {
        if (onRootBack) onRootBack();
        else App.exitApp();
      }
    });
    return () => listener.remove();
  } catch (e) {
    return () => {};
  }
}

/**
 * Haptic feedback (tap getar pendek).
 */
export async function hapticTap() {
  try {
    const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch (e) {}
}

export async function hapticSuccess() {
  try {
    const { Haptics, NotificationType } = await import('@capacitor/haptics');
    await Haptics.notification({ type: NotificationType.Success });
  } catch (e) {}
}

export async function hapticError() {
  try {
    const { Haptics, NotificationType } = await import('@capacitor/haptics');
    await Haptics.notification({ type: NotificationType.Error });
  } catch (e) {}
}

/**
 * Sembunyiin splash screen secara manual setelah app fully loaded.
 */
export async function hideSplashScreen() {
  try {
    const { SplashScreen } = await import('@capacitor/splash-screen');
    await SplashScreen.hide();
  } catch (e) {}
}

/**
 * Set status bar style — light/dark text on bg.
 */
export async function setStatusBarStyle(style = 'dark') {
  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar');
    await StatusBar.setStyle({ style: style === 'dark' ? Style.Dark : Style.Light });
  } catch (e) {}
}

/**
 * Tampilkan toast (snackbar native).
 */
export async function showToast(text, duration = 'short') {
  try {
    const { Toast } = await import('@capacitor/toast');
    await Toast.show({ text, duration });
  } catch (e) {
    // Web fallback: console
    console.log('Toast:', text);
  }
}

/**
 * Cek koneksi internet.
 */
export async function getNetworkStatus() {
  try {
    const { Network } = await import('@capacitor/network');
    return await Network.getStatus();
  } catch (e) {
    return {
      connected: typeof navigator !== 'undefined' ? navigator.onLine : true,
      connectionType: 'unknown',
    };
  }
}
