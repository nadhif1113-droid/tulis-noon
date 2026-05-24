// lib/firebase.js
// Firebase client-side initialization
// Used for: authentication, real-time updates, cloud messaging

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore
export const firestore = getFirestore(app);

// Initialize Cloud Messaging (if supported)
let messaging = null;
(async () => {
  if (await isSupported()) {
    messaging = getMessaging(app);
  }
})();

export { messaging };

// Service Worker registration for notifications
export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js'
      );
      console.log('✅ Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
      return null;
    }
  }
}

// Request notification permission and get FCM token
export async function requestNotificationPermission() {
  try {
    // Check if Notifications are supported and not already granted
    if (!('Notification' in window)) {
      console.warn('⚠️ Notifications not supported in this browser');
      return null;
    }

    if (Notification.permission === 'granted') {
      console.log('✅ Notification permission already granted');
      return await getFCMToken();
    }

    // Request permission
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      console.log('✅ Notification permission granted');
      return await getFCMToken();
    }

    console.warn('⚠️ Notification permission denied');
    return null;
  } catch (error) {
    console.error('❌ Error requesting notification permission:', error);
    return null;
  }
}

// Get FCM token
export async function getFCMToken() {
  try {
    if (!messaging) {
      console.warn('⚠️ Cloud Messaging not supported');
      return null;
    }

    const { getToken } = await import('firebase/messaging');
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    if (token) {
      console.log('✅ FCM Token obtained:', token.substring(0, 50) + '...');
      return token;
    } else {
      console.warn('⚠️ No FCM token available');
      return null;
    }
  } catch (error) {
    console.error('❌ Error getting FCM token:', error);
    return null;
  }
}

// Store FCM token on backend
export async function storeFCMToken(userId, token) {
  try {
    const response = await fetch('/api/user/fcm-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        token,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ FCM token stored:', data);
    return data;
  } catch (error) {
    console.error('❌ Error storing FCM token:', error);
    return null;
  }
}

// Listen for incoming notifications (foreground)
export function listenToNotifications(onNotification) {
  if (!messaging) {
    console.warn('⚠️ Cloud Messaging not available');
    return;
  }

  const { onMessage } = require('firebase/messaging');

  onMessage(messaging, (payload) => {
    console.log('📬 Foreground notification received:', payload);

    // Call user's callback
    if (onNotification) {
      onNotification(payload);
    }

    // Show browser notification if app is in foreground
    if ('Notification' in window && Notification.permission === 'granted') {
      const notificationTitle = payload.notification?.title || 'Tulis Noon';
      const notificationOptions = {
        body: payload.notification?.body || '',
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        tag: payload.data?.prayer || 'notification',
        requireInteraction: false,
        data: payload.data,
      };

      new Notification(notificationTitle, notificationOptions);
    }
  });
}

// Handle notification click
export function handleNotificationClick(onNotificationClick) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'notification-click') {
        console.log('🔔 Notification clicked:', event.data.payload);
        if (onNotificationClick) {
          onNotificationClick(event.data.payload);
        }
      }
    });
  }
}

export default app;
