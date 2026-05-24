// lib/send-prayer-notification.js
// Generate and send prayer reminder notifications

import { sendNotification, logNotification } from './firebase-admin';
import {
  getRandomHadis,
  getRandomDoa,
  getRandomTip,
  getRandomArabicQuote,
} from '@/data/islamic-content';

/**
 * Get notification content for prayer time
 * @param {string} prayer - Prayer name (Fajr, Dhuhr, Asr, Maghrib, Isha)
 * @param {Object} user - User object
 * @returns {Object} - Notification content
 */
export function generateNotificationContent(prayer, user = {}) {
  const hadis = getRandomHadis();
  const doa = getRandomDoa(prayer);
  const tip = getRandomTip();
  const arabicQuote = getRandomArabicQuote();

  const prayerEmoji = {
    fajr: '🌅',
    dhuhr: '☀️',
    asr: '🕰️',
    maghrib: '🌆',
    isha: '🌙',
  };

  const emoji = prayerEmoji[prayer.toLowerCase()] || '🕌';

  return {
    title: `Waktu ${prayer}! ${emoji}`,
    hadis,
    doa,
    tip,
    arabicQuote,
    prayerName: prayer,
    userName: user.name || 'Friend',
    userLevel: user.level || 'Beginner',
  };
}

/**
 * Send prayer reminder notification to a user
 * @param {Object} user - User object with fcmToken
 * @param {string} prayer - Prayer name
 * @returns {Promise<Object>} - Send result
 */
export async function sendPrayerReminder(user, prayer) {
  if (!user.fcmToken && (!user.fcmTokens || user.fcmTokens.length === 0)) {
    console.warn('⚠️ No FCM token for user:', user.id);
    return { success: false, reason: 'No FCM token' };
  }

  try {
    // Generate content
    const content = generateNotificationContent(prayer, user);

    // Prepare notification payload
    const notificationPayload = {
      title: content.title,
      body: `${content.hadis.text} - ${content.hadis.source}`,
      image: `/prayer-${prayer.toLowerCase()}.jpg`, // Optional: add prayer images
      data: {
        prayer: prayer.toLowerCase(),
        hadisId: content.hadis.id,
        doaArabic: content.doa.arabic,
        doaIndonesian: content.doa.indonesian,
        tip: content.tip.text,
        xpReward: '20',
        action: 'prayer-reminder',
      },
    };

    // Get token(s)
    const token = user.fcmToken || user.fcmTokens[0];

    // Send notification
    const result = await sendNotification(token, notificationPayload);

    // Log notification
    await logNotification(user.id, {
      type: 'prayer-reminder',
      prayer,
      content,
      status: 'sent',
      messageId: result,
    });

    // Award XP to user (optional - can integrate with your XP system)
    if (user.id) {
      try {
        // You'll implement this in your database update function
        // await awardXPToUser(user.id, 20, 'prayer-reminder-received');
      } catch (xpError) {
        console.warn('⚠️ Could not award XP:', xpError.message);
      }
    }

    console.log(`✅ Prayer reminder sent to ${user.id} for ${prayer}`);

    return {
      success: true,
      userId: user.id,
      prayer,
      messageId: result,
    };
  } catch (error) {
    console.error(`❌ Error sending prayer reminder to ${user.id}:`, error);

    // Log failed notification
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

/**
 * Send prayer reminder to multiple users
 * @param {Array} users - Array of user objects
 * @param {string} prayer - Prayer name
 * @returns {Promise<Array>} - Array of send results
 */
export async function sendPrayerRemindersToUsers(users, prayer) {
  console.log(
    `📤 Sending ${prayer} reminder to ${users.length} users...`
  );

  const results = await Promise.allSettled(
    users.map((user) => sendPrayerReminder(user, prayer))
  );

  // Analyze results
  const successful = results.filter(
    (r) => r.status === 'fulfilled' && r.value.success
  ).length;
  const failed = results.filter(
    (r) => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success)
  ).length;

  console.log(`✅ Success: ${successful}, ❌ Failed: ${failed}`);

  return results.map((r) => (r.status === 'fulfilled' ? r.value : r.reason));
}

/**
 * Format notification for debugging
 * @param {Object} content - Notification content
 * @returns {string} - Formatted notification preview
 */
export function previewNotification(content) {
  return `
═══════════════════════════════════════════
📬 NOTIFICATION PREVIEW
═══════════════════════════════════════════
📱 Title: ${content.title}

📖 Hadis:
"${content.hadis.text}"
- ${content.hadis.source}

🤲 Doa (Indonesian):
${content.doa.indonesian}

💡 Daily Tip:
${content.tip.text}

✨ Arabic Quote:
${content.arabicQuote.arabic}
"${content.arabicQuote.indonesian}"

⭐ XP Reward: +20 XP
═══════════════════════════════════════════
  `;
}

export default {
  generateNotificationContent,
  sendPrayerReminder,
  sendPrayerRemindersToUsers,
  previewNotification,
};
