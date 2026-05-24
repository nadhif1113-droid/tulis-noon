// pages/api/cron/send-prayer-notifications.js
// CRON job to send prayer reminders
// Call this endpoint from Vercel Cron or external service daily

import { sendPrayerRemindersToUsers, sendPrayerReminder } from '@/lib/send-prayer-notification';
import { adminFirestore } from '@/lib/firebase-admin';
import { getPrayerTimes, timeToMinutes, getNextPrayer } from '@/pages/api/prayer-times';
import axios from 'axios';

/**
 * Verify cron request is authorized
 * @param {string} authHeader - Authorization header
 * @returns {boolean}
 */
function verifyAuth(authHeader) {
  const token = authHeader?.replace('Bearer ', '');
  return token === process.env.CRON_SECRET;
}

/**
 * Get current time in minutes
 * @returns {number}
 */
function getCurrentTimeInMinutes() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

/**
 * Format date as DD-MM-YYYY
 * @param {Date} date
 * @returns {string}
 */
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

/**
 * Get users who need prayer reminders
 * @returns {Promise<Array>}
 */
async function getUsersForReminders() {
  try {
    const usersRef = adminFirestore.collection('users');
    const snapshot = await usersRef
      .where('prayerReminder.enabled', '==', true)
      .where('fcmTokens', '!=', [])
      .get();

    const users = [];
    snapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return users;
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    return [];
  }
}

/**
 * Determine which prayers should be sent now
 * @param {string} currentTime - HH:MM format
 * @returns {string[]} - Array of prayer names
 */
function getPrayersToSendNow(currentTime) {
  const [hours, minutes] = currentTime.split(':').map(Number);
  const currentMinutes = hours * 60 + minutes;

  // Check if current time matches any prayer (within 2-minute window)
  const prayerTimes = {
    'Fajr': [4, 30],      // 04:30
    'Dhuhr': [12, 30],    // 12:30
    'Asr': [15, 30],      // 15:30
    'Maghrib': [18, 30],  // 18:30
    'Isha': [20, 0],      // 20:00
  };

  const prayersToSend = [];

  for (const [prayer, [h, m]] of Object.entries(prayerTimes)) {
    const prayerMinutes = h * 60 + m;
    // Check if current time is within 2 minutes of prayer time
    if (Math.abs(currentMinutes - prayerMinutes) <= 2) {
      prayersToSend.push(prayer);
    }
  }

  return prayersToSend;
}

/**
 * Send prayer notifications for the current time
 * @param {Array} users - Users to notify
 * @param {Array} prayers - Prayers to send
 * @returns {Promise<Object>} - Summary of sent notifications
 */
async function sendPrayerNotifications(users, prayers) {
  const results = {
    total: 0,
    successful: 0,
    failed: 0,
    details: [],
  };

  for (const prayer of prayers) {
    console.log(`\n📣 Sending ${prayer} reminders...`);

    for (const user of users) {
      results.total++;

      try {
        const result = await sendPrayerReminder(user, prayer);

        if (result.success) {
          results.successful++;
        } else {
          results.failed++;
        }

        results.details.push({
          userId: user.id,
          prayer,
          status: result.success ? 'sent' : 'failed',
          message: result.error || result.messageId,
        });
      } catch (error) {
        results.failed++;
        results.details.push({
          userId: user.id,
          prayer,
          status: 'error',
          message: error.message,
        });
      }
    }
  }

  return results;
}

/**
 * Main CRON handler
 */
export default async function handler(req, res) {
  // Verify request is authorized (from Vercel CRON or your service)
  if (!verifyAuth(req.headers.authorization)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('\n═════════════════════════════════════════════');
  console.log('🕌 PRAYER REMINDER CRON JOB STARTED');
  console.log('═════════════════════════════════════════════');

  const startTime = Date.now();

  try {
    // Get current time
    const now = new Date();
    const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const currentDate = formatDate(now);

    console.log(`⏰ Current time: ${currentTimeStr}`);
    console.log(`📅 Current date: ${currentDate}`);

    // Check which prayers should be sent
    // In production, you would get actual prayer times from Aladhan API
    // For now, we use hardcoded times (you can enhance this)
    const prayersToSend = getPrayersToSendNow(currentTimeStr);

    if (prayersToSend.length === 0) {
      console.log('ℹ️ No prayers to send at this time');
      return res.status(200).json({
        message: 'No prayers scheduled for this time',
        currentTime: currentTimeStr,
        totalTime: `${Date.now() - startTime}ms`,
      });
    }

    console.log(`📤 Prayers to send: ${prayersToSend.join(', ')}`);

    // Get users with prayer reminders enabled
    const users = await getUsersForReminders();
    console.log(`👥 Found ${users.length} users with prayer reminders enabled`);

    if (users.length === 0) {
      console.log('⚠️ No users to notify');
      return res.status(200).json({
        message: 'No users to notify',
        totalTime: `${Date.now() - startTime}ms`,
      });
    }

    // Send notifications
    const results = await sendPrayerNotifications(users, prayersToSend);

    // Log summary
    console.log('\n═════════════════════════════════════════════');
    console.log('📊 SUMMARY');
    console.log('═════════════════════════════════════════════');
    console.log(`✅ Successful: ${results.successful}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`📦 Total: ${results.total}`);
    console.log(`⏱️ Duration: ${Date.now() - startTime}ms`);
    console.log('═════════════════════════════════════════════\n');

    // Store cron job log in Firestore
    try {
      await adminFirestore.collection('cron-logs').add({
        type: 'prayer-reminders',
        timestamp: new Date(),
        prayers: prayersToSend,
        userCount: users.length,
        results: {
          successful: results.successful,
          failed: results.failed,
          total: results.total,
        },
        duration: Date.now() - startTime,
      });
    } catch (logError) {
      console.warn('⚠️ Could not log cron job:', logError.message);
    }

    return res.status(200).json({
      success: true,
      message: `Sent reminders for: ${prayersToSend.join(', ')}`,
      stats: {
        successful: results.successful,
        failed: results.failed,
        total: results.total,
      },
      totalTime: `${Date.now() - startTime}ms`,
    });
  } catch (error) {
    console.error('❌ CRON ERROR:', error);

    // Log error
    try {
      await adminFirestore.collection('cron-logs').add({
        type: 'prayer-reminders',
        timestamp: new Date(),
        status: 'error',
        error: error.message,
        stack: error.stack,
      });
    } catch (logError) {
      console.warn('⚠️ Could not log error:', logError.message);
    }

    return res.status(500).json({
      success: false,
      error: error.message,
      totalTime: `${Date.now() - startTime}ms`,
    });
  }
}

// SETUP INSTRUCTIONS:
// ==================
// For Vercel:
// 1. Add cron trigger in vercel.json:
//    {
//      "crons": [{
//        "path": "/api/cron/send-prayer-notifications",
//        "schedule": "*/1 * * * *"  // Every minute
//      }]
//    }
//
// For external service (like EasyCron):
// 1. Call POST https://your-domain.com/api/cron/send-prayer-notifications
// 2. Add header: Authorization: Bearer YOUR_CRON_SECRET
// 3. Set frequency to run every minute
//
// Generate CRON_SECRET:
// openssl rand -base64 32
