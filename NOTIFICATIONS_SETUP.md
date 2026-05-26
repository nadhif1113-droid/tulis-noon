# 🔔 Notifikasi Waktu Sholat — Setup Guide

Tulis Noon kirim notifikasi otomatis 5x sehari sesuai waktu sholat, lengkap dengan hadis pilihan rotasi.

## 🏗️ Arsitektur

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Vercel Cron     │ ──> │ /api/cron/send-  │ ──> │ Firebase FCM    │
│ (every 10 min)  │     │ prayer-notifs    │     │ (push to phones)│
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                │                          │
                                │                          ↓
                                │            ┌─────────────────────────┐
                                │            │ iOS + Android + Web app │
                                │            │ (terima notif + hadis)  │
                                │            └─────────────────────────┘
                                ↓
                       ┌──────────────────┐
                       │ Firestore        │
                       │ Users dgn        │
                       │ prayerReminder   │
                       │ enabled=true     │
                       └──────────────────┘
```

## 📋 Yang Sudah Dibikin (Code)

- ✅ `lib/fcm-helper.js` — Web push setup
- ✅ `lib/send-prayer-notification.js` — Generator notifikasi (hadis, doa, tips)
- ✅ `data/islamic-content.js` — Database 20+ hadis, 30+ doa, tips, ayat Quran
- ✅ `pages/api/cron/send-prayer-notifications.js` — Cron endpoint
- ✅ `public/firebase-messaging-sw.js` — Service worker untuk web push
- ✅ `vercel.json` — Schedule cron tiap 10 menit
- ✅ `lib/native-helpers.js` — `setupPushNotifications()` untuk iOS/Android native
- ✅ Capacitor `@capacitor/push-notifications` + `@capacitor/local-notifications` plugins

## 🚀 Setup Steps (User Action)

### 1. Set CRON_SECRET di Vercel

Cron endpoint butuh auth biar gak bisa di-hit dari sembarang orang.

1. Generate random secret: `openssl rand -base64 32` di Terminal
2. Vercel Dashboard → Project Settings → Environment Variables
3. Add: `CRON_SECRET=<value yang di-generate>`
4. Redeploy app

### 2. Pastikan FIREBASE_SERVICE_ACCOUNT Set

Firebase Admin SDK butuh credentials untuk kirim FCM.

- Vercel env vars: `FIREBASE_SERVICE_ACCOUNT` = full JSON service account dari Firebase Console
- (Harusnya udah set untuk Midtrans webhook)

### 3. Push Vercel.json + Redeploy

Setelah push commit, Vercel akan auto-deploy + register cron job.

Cek cron aktif di:
**Vercel Dashboard → Project → Crons tab**

Harus muncul:
```
/api/cron/send-prayer-notifications | */10 * * * * | Last run: ...
```

### 4. Setup Native Push (iOS)

Untuk iPhone:
1. Apple Developer Account ($99/year) — perlu untuk APNs
2. Di Apple Developer portal → Certificates → buat APNs Auth Key
3. Download .p8 file
4. Upload ke Firebase Console → Project Settings → Cloud Messaging → APNs
5. Bundle ID di Firebase harus match `app.tulisnoon.app`

Untuk Android: otomatis pakai Firebase, gak perlu setup tambahan.

⚠️ **Untuk launch awal (sebelum Apple Dev account)**, notifikasi iOS akan **fallback ke web push** (PWA). Tetap jalan tapi cuma kalau user buka app sekali.

### 5. Test Notification

Trigger cron manual untuk test:
```bash
curl -X GET "https://tulis-noon.vercel.app/api/cron/send-prayer-notifications" \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

Akan return JSON dengan jumlah notifikasi yang dikirim.

## 🕌 Konten Notifikasi

Tiap notifikasi punya:
- **Title**: "Waktu Subuh!" / "Waktu Dzuhur!" dll
- **Body**: Hadis pendek (rotasi dari 20+ hadis)
- **Data**: `{ prayer, hadisId, doa, arabicQuote }` untuk in-app display

Contoh:
```
🕌 Waktu Subuh!
"Sholat adalah tiang agama. Barangsiapa menegakkannya, 
sungguh ia telah menegakkan agama." 
— HR. Baihaqi
```

## ⏰ Logika Waktu Sholat

Cron jalan **setiap 10 menit**. Tiap eksekusi:

1. Ambil semua user dgn `prayerReminder.enabled=true` & punya `fcmTokens`
2. Untuk tiap user, hitung waktu sholat hari ini berdasarkan `location.latitude/longitude` (pakai metode Umm al-Qura untuk Saudi, atau MWL/ISNA default)
3. Cek apakah ada waktu sholat dalam 10 menit terakhir
4. Kalau ya → kirim FCM ke semua device user

## 🐛 Troubleshooting

**Notifikasi gak masuk**:
- Cek Vercel Cron tab — harus muncul "Last run" yg recent
- Cek user.fcmTokens di Firestore — harus ada minimal 1 token
- Cek log Vercel Functions → `/api/cron/send-prayer-notifications`

**iOS notif gak nyampe**:
- Pastikan APNs key di Firebase Console udah set (butuh Apple Dev account)
- Pastikan permission diizinkan di iPhone Settings → Notifications → Tulis Noon

**Hadis sama terus**:
- `getRandomHadis()` ambil random tiap kirim. Kalau pool kecil, tambahkan hadis di `data/islamic-content.js`

## 📝 ENV VARS YANG DIPERLUKAN

Tambah di Vercel:

```bash
CRON_SECRET=<random base64>
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}   # (sudah ada untuk Midtrans)
NEXT_PUBLIC_FIREBASE_VAPID_KEY=<dari Firebase Console>    # (sudah ada untuk web push)
```
