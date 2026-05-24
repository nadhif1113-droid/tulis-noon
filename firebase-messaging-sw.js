// public/firebase-messaging-sw.js
// Service Worker for Firebase Cloud Messaging
// Handles notifications even when app is closed

// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

// Initialize Firebase in the Service Worker
firebase.initializeApp({
  apiKey: 'AIzaSyAtZDoozHNjZ-eXm53TNKGEm8c2xceeNbU',
  authDomain: 'tulis-noon.firebaseapp.com',
  projectId: 'tulis-noon',
  storageBucket: 'tulis-noon.firebasestorage.app',
  messagingSenderId: '854815287659',
  appId: '1:854815287659:web:669824e9022e622892842e',
});

// Get Cloud Messaging service
const messaging = firebase.messaging();

// Handle background notifications
messaging.onBackgroundMessage((payload) => {
  console.log('📬 Background notification received:', payload);

  const notificationTitle = payload.notification.title || 'Tulis Noon';
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: payload.data?.prayer || 'notification',
    requireInteraction: false,
    data: payload.data,
    actions: [
      {
        action: 'read',
        title: 'Baca Doa',
      },
      {
        action: 'close',
        title: 'Tutup',
      },
    ],
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  console.log('🔔 Notification clicked:', event.notification);

  // Handle action buttons
  if (event.action === 'read') {
    // Open app to show prayer details
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // Check if app is already open
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window if app not open
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  } else if (event.action === 'close') {
    // Just close notification
    event.notification.close();
  } else {
    // Default action - open app
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if ('focus' in client) {
            client.focus();
            // Send notification data to client
            client.postMessage({
              type: 'notification-click',
              payload: event.notification.data,
            });
            return;
          }
        }
        // Open new window if app not open
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event.notification.tag);
});

// Periodic sync for prayer reminders (future enhancement)
self.addEventListener('sync', (event) => {
  if (event.tag === 'prayer-reminder-sync') {
    event.waitUntil(
      // Sync with server for prayer times
      fetch('/api/prayer-times')
        .then(() => console.log('✅ Prayer sync successful'))
        .catch((error) => console.error('❌ Prayer sync failed:', error))
    );
  }
});

// Push event (if using Web Push API directly)
self.addEventListener('push', (event) => {
  console.log('📨 Push notification received:', event);

  if (!event.data) {
    console.log('No data in push event');
    return;
  }

  const data = event.data.json();
  const title = data.notification?.title || 'Tulis Noon';
  const options = {
    body: data.notification?.body || '',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    data: data.data || {},
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Service Worker lifecycle
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting(); // Activate immediately
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  event.waitUntil(clients.claim()); // Claim clients immediately
});

// Periodic background sync for prayer times
// This will run periodically even if app is closed
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-prayer-times') {
    event.waitUntil(
      fetch('/api/prayer-times')
        .then(() => console.log('✅ Prayer times updated'))
        .catch((error) =>
          console.error('❌ Failed to update prayer times:', error)
        )
    );
  }
});

console.log('🔧 Firebase Cloud Messaging Service Worker loaded');
