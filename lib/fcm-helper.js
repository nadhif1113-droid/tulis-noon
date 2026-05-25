// lib/fcm-helper.js
// Helper untuk FCM Token management

import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { firestore } from './firebase';

export async function initFCM(userId) {
  try {
    // Check browser support
    if (!('serviceWorker' in navigator) || !('Notification' in window)) {
      console.log('Browser tidak support notifications');
      return null;
    }

    // Request permission
    if (Notification.permission === 'granted') {
      return await getFCMToken(userId);
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        return await getFCMToken(userId);
      }
    }
  } catch (error) {
    console.error('FCM init error:', error);
  }
  return null;
}

export async function getFCMToken(userId) {
  try {
    const messaging = getMessaging();
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    if (token) {
      // Save ke Firestore
      await saveFCMToken(userId, token);
      console.log('✅ FCM Token saved:', token);
      return token;
    }
  } catch (error) {
    console.error('Get FCM token error:', error);
  }
  return null;
}

export async function saveFCMToken(userId, token) {
  try {
    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, {
      fcmTokens: arrayUnion(token),
      lastTokenUpdate: new Date(),
    });
  } catch (error) {
    console.error('Save FCM token error:', error);
  }
}

export function onFCMMessage(callback) {
  try {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log('📨 Message received:', payload);
      callback(payload);
    });
  } catch (error) {
    console.error('onMessage error:', error);
  }
}
