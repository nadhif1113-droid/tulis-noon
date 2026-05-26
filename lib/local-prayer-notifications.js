// lib/local-prayer-notifications.js
// Schedule notifikasi waktu sholat secara LOKAL di device (iOS/Android).
// Tidak butuh server — semua dijadwal di device. Lebih akurat & gak ada delay.
//
// Strategi:
// 1. Hit Aladhan API (gratis, no auth) untuk dapet prayer times next 7 hari
// 2. Schedule 5 notif/hari x 7 hari = 35 notif via Capacitor LocalNotifications
// 3. Setiap notif: title "Waktu <prayer>!" + body random hadis
// 4. Re-schedule otomatis tiap minggu (saat user buka app)

import { islamicContent } from '@/data/islamic-content';

const ALADHAN_API = 'https://api.aladhan.com/v1/timings';
const PRAYER_NAMES = ['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'];
const PRAYER_KEYS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']; // dari Aladhan API
const NOTIF_ID_BASE = 100000; // hindarin conflict dgn notif lain

/**
 * Ambil prayer times untuk satu tanggal & lokasi.
 * Method 2 = Islamic Society of North America (akurat untuk Indonesia + Saudi).
 */
async function fetchPrayerTimes(date, lat, lon) {
  // Format date: DD-MM-YYYY
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const dateStr = `${day}-${month}-${year}`;

  try {
    const res = await fetch(`${ALADHAN_API}/${dateStr}?latitude=${lat}&longitude=${lon}&method=2`);
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data?.timings || null;
  } catch (e) {
    console.error('Aladhan API error:', e);
    return null;
  }
}

/**
 * Pilih hadis random dari islamic-content.
 */
function getRandomHadis() {
  const hadisList = islamicContent.hadis || [];
  if (hadisList.length === 0) return null;
  return hadisList[Math.floor(Math.random() * hadisList.length)];
}

/**
 * Schedule notifications untuk N hari ke depan.
 * userProfile.location: { latitude, longitude, city }
 * Returns: jumlah notif yang berhasil di-schedule
 */
export async function schedulePrayerNotifications(userProfile, days = 7) {
  if (typeof window === 'undefined') return 0;

  // Cek native
  try {
    const { Capacitor } = await import('@capacitor/core');
    if (!Capacitor.isNativePlatform()) {
      console.log('Local notifications cuma jalan di native app');
      return 0;
    }

    const { LocalNotifications } = await import('@capacitor/local-notifications');

    // Permission check
    const permStatus = await LocalNotifications.checkPermissions();
    if (permStatus.display !== 'granted') {
      const newPerm = await LocalNotifications.requestPermissions();
      if (newPerm.display !== 'granted') {
        console.log('Local notif permission denied');
        return 0;
      }
    }

    // Cancel old scheduled prayer notifs (re-schedule fresh setiap kali)
    try {
      const pending = await LocalNotifications.getPending();
      const toCancel = pending.notifications.filter(n => n.id >= NOTIF_ID_BASE && n.id < NOTIF_ID_BASE + 10000);
      if (toCancel.length > 0) {
        await LocalNotifications.cancel({ notifications: toCancel.map(n => ({ id: n.id })) });
      }
    } catch (e) {
      console.warn('Cancel old notifs error:', e);
    }

    // Default ke Madinah kalau location gak ada
    const lat = userProfile?.location?.latitude || 24.4686;
    const lon = userProfile?.location?.longitude || 39.6142;

    const notifications = [];
    const now = new Date();

    // Loop tiap hari sampai N hari ke depan
    for (let d = 0; d < days; d++) {
      const targetDate = new Date(now);
      targetDate.setDate(now.getDate() + d);

      const timings = await fetchPrayerTimes(targetDate, lat, lon);
      if (!timings) continue;

      // Schedule 5 sholat untuk hari ini
      for (let p = 0; p < PRAYER_KEYS.length; p++) {
        const prayerKey = PRAYER_KEYS[p];
        const prayerName = PRAYER_NAMES[p];
        const timeStr = timings[prayerKey]; // format "HH:MM"
        if (!timeStr) continue;

        const [hour, minute] = timeStr.split(':').map(Number);
        const scheduledTime = new Date(targetDate);
        scheduledTime.setHours(hour, minute, 0, 0);

        // Skip kalau waktu udah lewat
        if (scheduledTime <= now) continue;

        const hadis = getRandomHadis();
        const notifId = NOTIF_ID_BASE + (d * 10) + p;

        notifications.push({
          id: notifId,
          title: `🕌 Waktu ${prayerName}`,
          body: hadis ? `"${hadis.text}" — ${hadis.source}` : `Tunaikan sholat ${prayerName} di awal waktu.`,
          schedule: { at: scheduledTime },
          sound: 'default',
          channelId: 'prayer-times',
          extra: { prayer: prayerKey, hadisId: hadis?.id, type: 'prayer-reminder' },
        });
      }
    }

    if (notifications.length === 0) return 0;

    // Batch schedule (Capacitor support max ~64 sekaligus, kita aman dgn 35)
    await LocalNotifications.schedule({ notifications });
    console.log(`Scheduled ${notifications.length} prayer notifications`);
    return notifications.length;
  } catch (e) {
    console.error('schedulePrayerNotifications error:', e);
    return 0;
  }
}

/**
 * Cancel semua prayer notifications (kalau user disable di settings).
 */
export async function cancelPrayerNotifications() {
  if (typeof window === 'undefined') return;
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    const pending = await LocalNotifications.getPending();
    const toCancel = pending.notifications.filter(n => n.id >= NOTIF_ID_BASE && n.id < NOTIF_ID_BASE + 10000);
    if (toCancel.length > 0) {
      await LocalNotifications.cancel({ notifications: toCancel.map(n => ({ id: n.id })) });
    }
  } catch (e) {
    console.error('Cancel notifs error:', e);
  }
}

/**
 * Get count of pending prayer notifications (debugging).
 */
export async function getPendingPrayerNotifsCount() {
  if (typeof window === 'undefined') return 0;
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    const pending = await LocalNotifications.getPending();
    return pending.notifications.filter(n => n.id >= NOTIF_ID_BASE && n.id < NOTIF_ID_BASE + 10000).length;
  } catch (e) {
    return 0;
  }
}
