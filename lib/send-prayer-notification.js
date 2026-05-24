// lib/send-prayer-notification.js
// Generate and send prayer reminder notifications

import { sendNotification, logNotification } from './firebase-admin';
import {
  getRandomHadis,
  getRandomDoa,
  getRandomTip,
  getRandomArabicQuote,
} from '../data/islamic-content';

export function generateNotificationContent(prayer, user = {}) {
  const hadis = getRandomHadis();
  const doa = getRandomDoa(prayer.toLowerCase());
  const tip = getRandomTip();
  const arabicQuote = getRandomArabicQuote();

  const prayerEmoji = {
    fajr: 'sunrise',
    dhuhr: 'sun',
    asr: 'clock',
    maghrib: 'sunset',
    isha: 'moon',
  };

  const emoji = prayerEmoji[prayer.toLowerCase()] || 'mosque';

  return {
    title: 'Waktu ' + prayer + '!',
    hadis,
    doa,
    tip,
    arabicQuote,
    prayerName: prayer,
    userName: user.name || 'Friend',
    userLevel: user.level || 'Beginner',
  };
}

export async function sendPrayerReminder(user, prayer) {
  if (!user.fcmToken && (!user.fcmTokens || user.fcmTokens.length === 0)) {
    console.warn('No FCM token for user:', user.id);
    return { success: false, reason: 'No FCM token' };
  }

  try {
    const content = generateNotificationContent(prayer, user);

    const notificationPayload = {
      title: content.title,
      body: content.hadis.text + ' - ' + content.hadis.source,
      data: {
        prayer: prayer.toLowerCase(),
        hadisId: content.hadis.id,
        doaArabic: content.doa ? content.doa.arabic : '',
        doaIndonesian: content.doa ? content.doa.indonesian : '',
        tip: content.tip.text,
        xpReward: '20',
        action: 'prayer-reminder',
      },
    };

    const token = user.fcmToken || user.fcmTokens[0];
    const result = await sendNotification(token, notificationPayload);

    await logNotification(user.id, {
      type: 'prayer-reminder',
      prayer,
      content,
      status: 'sent',
      messageId: result,
    });

    console.log('Prayer reminder sent to ' + user.id + ' for ' + prayer);

    return {
      success: true,
      userId: user.id,
      prayer,
      messageId: result,
    };
  } catch (error) {
    console.error('Error sending prayer reminder to ' + user.id + ':', error);

    await logNotification(user.id, {
      type: 'prayer-reminder',
      prayer,
      status: 'failed',
      error: error.message,
    });

    return {
      success: false,
      userId: user.id,
      prayer,
      error: error.message,
    };
  }
}

export async function sendPrayerRemindersToUsers(users, prayer) {
  console.log('Sending ' + prayer + ' reminder to ' + users.length + ' users');

  const results = await Promise.allSettled(
    users.map((user) => sendPrayerReminder(user, prayer))
  );

  const successful = results.filter(
    (r) => r.status === 'fulfilled' && r.value.success
  ).length;
  const failed = results.length - successful;

  console.log('Success: ' + successful + ', Failed: ' + failed);

  return results.map((r) => (r.status === 'fulfilled' ? r.value : r.reason));
}

export default {
  generateNotificationContent,
  sendPrayerReminder,
  sendPrayerRemindersToUsers,
};
