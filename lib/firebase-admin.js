// lib/firebase-admin.js
// Firebase Admin SDK initialization for backend operations
// Used for: sending notifications, accessing Firestore, managing users

import admin from 'firebase-admin';

// Initialize Firebase Admin SDK only once
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT || '{}'
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

// Export Firebase services
export const adminAuth = admin.auth();
export const adminFirestore = admin.firestore();
export const adminMessaging = admin.messaging();
export const adminStorage = admin.storage();

/**
 * Send push notification via FCM
 */
export async function sendNotification(token, options) {
  const {
    title = '',
    body = '',
    image = '',
    data = {},
    sound = 'default',
  } = options;

  const message = {
    notification: {
      title,
      body,
      ...(image && { image }),
    },
    data,
    android: {
      priority: 'high',
      notification: {
        sound,
        channelId: 'prayer-reminder',
      },
    },
    apns: {
      headers: {
        'apns-priority': '10',
      },
      payload: {
        aps: {
          alert: {
            title,
            body,
          },
          sound,
          badge: 1,
        },
      },
    },
    webpush: {
      notification: {
        title,
        body,
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        sound,
      },
    },
    token,
  };

  try {
    const response = await adminMessaging.send(message);
    console.log('✅ Notification sent:', response);
    return response;
  } catch (error) {
    console.error('❌ Notification error:', error);
    throw error;
  }
}

/**
 * Send notification to multiple tokens
 */
export async function sendMulticastNotification(tokens, options) {
  const {
    title = '',
    body = '',
    image = '',
    data = {},
  } = options;

  const message = {
    notification: {
      title,
      body,
      ...(image && { image }),
    },
    data,
  };

  try {
    const response = await adminMessaging.sendMulticast({
      ...message,
      tokens,
    });
    console.log('✅ Multicast sent:', response);
    return response;
  } catch (error) {
    console.error('❌ Multicast error:', error);
    throw error;
  }
}

/**
 * Store FCM token in Firestore
 */
export async function storeFCMToken(userId, token) {
  try {
    const userRef = adminFirestore.collection('users').doc(userId);
    await userRef.update({
      fcmTokens: admin.firestore.FieldValue.arrayUnion(token),
      updatedAt: admin.firestore.Timestamp.now(),
    });
    console.log('✅ FCM token stored for user:', userId);
  } catch (error) {
    console.error('❌ Error storing FCM token:', error);
    throw error;
  }
}

/**
 * Get user FCM tokens
 */
export async function getUserFCMTokens(userId) {
  try {
    const userRef = await adminFirestore.collection('users').doc(userId).get();
    if (!userRef.exists) {
      console.warn('⚠️ User not found:', userId);
      return [];
    }
    return userRef.data()?.fcmTokens || [];
  } catch (error) {
    console.error('❌ Error getting FCM tokens:', error);
    return [];
  }
}

/**
 * Get all users with prayer reminders enabled
 */
export async function getUsersWithPrayerReminders() {
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

    console.log(`✅ Found ${users.length} users with prayer reminders`);
    return users;
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    return [];
  }
}

/**
 * Log notification in Firestore for analytics
 */
export async function logNotification(userId, notificationData) {
  try {
    const logsRef = adminFirestore.collection('notifications').doc();
    await logsRef.set({
      userId,
      ...notificationData,
      createdAt: admin.firestore.Timestamp.now(),
    });
  } catch (error) {
    console.error('❌ Error logging notification:', error);
  }
}

export default admin;