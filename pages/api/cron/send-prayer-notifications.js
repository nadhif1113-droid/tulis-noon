// pages/api/cron/send-prayer-notifications.js
// CRON job to send prayer reminders

import { sendPrayerReminder } from '../../../lib/send-prayer-notification';
import { adminFirestore } from '../../../lib/firebase-admin';

function verifyAuth(authHeader) {
  if (!authHeader) return false;
  const token = authHeader.replace('Bearer ', '');
  return token === process.env.CRON_SECRET;
}

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return day + '-' + month + '-' + year;
}

async function getUsersForReminders() {
  try {
    const usersRef = adminFirestore.collection('users');
    const snapshot = await usersRef
      .where('prayerReminder.enabled', '==', true)
      .get();

    const users = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.fcmTokens && data.fcmTokens.length > 0) {
        users.push({
          id: doc.id,
          ...data,
        });
      }
    });

    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

function getPrayersToSendNow(currentTime) {
  const parts = currentTime.split(':');
  const hours = parseInt(parts[0]);
  const minutes = parseInt(parts[1]);
  const currentMinutes = hours * 60 + minutes;

  const prayerTimes = {
    Fajr: [4, 30],
    Dhuhr: [12, 30],
    Asr: [15, 30],
    Maghrib: [18, 30],
    Isha: [20, 0],
  };

  const prayersToSend = [];

  for (const prayer in prayerTimes) {
    const h = prayerTimes[prayer][0];
    const m = prayerTimes[prayer][1];
    const prayerMinutes = h * 60 + m;
    if (Math.abs(currentMinutes - prayerMinutes) <= 2) {
      prayersToSend.push(prayer);
    }
  }

  return prayersToSend;
}

async function sendPrayerNotifications(users, prayers) {
  const results = {
    total: 0,
    successful: 0,
    failed: 0,
  };

  for (const prayer of prayers) {
    console.log('Sending ' + prayer + ' reminders...');

    for (const user of users) {
      results.total++;
      try {
        const result = await sendPrayerReminder(user, prayer);
        if (result.success) {
          results.successful++;
        } else {
          results.failed++;
        }
      } catch (error) {
        results.failed++;
      }
    }
  }

  return results;
}

export default async function handler(req, res) {
  if (!verifyAuth(req.headers.authorization)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('Prayer Reminder CRON started');

  const startTime = Date.now();

  try {
    const now = new Date();
    const currentTimeStr =
      String(now.getHours()).padStart(2, '0') +
      ':' +
      String(now.getMinutes()).padStart(2, '0');
    const currentDate = formatDate(now);

    console.log('Current time:', currentTimeStr);
    console.log('Current date:', currentDate);

    const prayersToSend = getPrayersToSendNow(currentTimeStr);

    if (prayersToSend.length === 0) {
      return res.status(200).json({
        message: 'No prayers scheduled for this time',
        currentTime: currentTimeStr,
      });
    }

    console.log('Prayers to send:', prayersToSend.join(', '));

    const users = await getUsersForReminders();
    console.log('Found ' + users.length + ' users');

    if (users.length === 0) {
      return res.status(200).json({
        message: 'No users to notify',
      });
    }

    const results = await sendPrayerNotifications(users, prayersToSend);

    try {
      await adminFirestore.collection('cron-logs').add({
        type: 'prayer-reminders',
        timestamp: new Date(),
        prayers: prayersToSend,
        userCount: users.length,
        results: results,
        duration: Date.now() - startTime,
      });
    } catch (logError) {
      console.warn('Could not log cron:', logError.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Sent reminders for: ' + prayersToSend.join(', '),
      stats: results,
      totalTime: (Date.now() - startTime) + 'ms',
    });
  } catch (error) {
    console.error('CRON ERROR:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
