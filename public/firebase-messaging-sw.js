// public/firebase-messaging-sw.js
// Service Worker for Firebase Cloud Messaging

importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyAtZDoozHNjZ-eXm53TNKGEm8c2xceeNbU',
  authDomain: 'tulis-noon.firebaseapp.com',
  projectId: 'tulis-noon',
  storageBucket: 'tulis-noon.firebasestorage.app',
  messagingSenderId: '854815287659',
  appId: '1:854815287659:web:669824e9022e622892842e',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Background notification received:', payload);

  const notificationTitle = payload.notification.title || 'Tulis Noon';
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: payload.data && payload.data.prayer ? payload.data.prayer : 'notification',
    requireInteraction: false,
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  console.log('Notification clicked:', event.notification);

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if ('focus' in client) {
          client.focus();
          client.postMessage({
            type: 'notification-click',
            payload: event.notification.data,
          });
          return;
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event.notification.tag);
});

self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);

  if (!event.data) {
    console.log('No data in push event');
    return;
  }

  const data = event.data.json();
  const title = data.notification && data.notification.title ? data.notification.title : 'Tulis Noon';
  const options = {
    body: data.notification && data.notification.body ? data.notification.body : '',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    data: data.data || {},
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  event.waitUntil(clients.claim());
});

console.log('Firebase Cloud Messaging Service Worker loaded');
