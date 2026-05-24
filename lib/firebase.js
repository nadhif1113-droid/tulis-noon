// lib/firebase.js
// Firebase client-side initialization

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

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);

let messaging = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(app);
    }
  });
}

export { messaging };

export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js'
      );
      console.log('SW registered:', registration);
      return registration;
    } catch (error) {
      console.error('SW registration failed:', error);
      return null;
    }
  }
}

export async function requestNotificationPermission() {
  try {
    if (typeof window === 'undefined') return null;
    if (!('Notification' in window)) return null;

    if (Notification.permission === 'granted') {
      return await getFCMToken();
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      return await getFCMToken();
    }
    return null;
  } catch (error) {
    console.error('Permission error:', error);
    return null;
  }
}

export async function getFCMToken() {
  try {
    if (!messaging) return null;
    const { getToken } = await import('firebase/messaging');
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });
    return token || null;
  } catch (error) {
    console.error('Token error:', error);
    return null;
  }
}

export async function storeFCMToken(userId, token) {
  try {
    const response = await fetch('/api/user/fcm-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, token }),
    });
    return await response.json();
  } catch (error) {
    console.error('Store token error:', error);
    return null;
  }
}

export function listenToNotifications(onNotification) {
  if (!messaging) return;
  import('firebase/messaging').then(({ onMessage }) => {
    onMessage(messaging, (payload) => {
      console.log('Notification received:', payload);
      if (onNotification) onNotification(payload);
    });
  });
}

export default app;