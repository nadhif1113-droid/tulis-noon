// scripts/grant-koin.js
// Utility one-off: kasih/set koin ke user tertentu (by email) di Firestore.
//
// Pakai:
//   node scripts/grant-koin.js <email> <jumlah>            → SET koin jadi <jumlah>
//   node scripts/grant-koin.js test@example.com 1000        → set jadi 1000
//   node scripts/grant-koin.js test@example.com +500 --add  → TAMBAH 500
//
// Aman: baca FIREBASE_SERVICE_ACCOUNT dari .env.local, TIDAK pernah nge-print isinya.
// Cuma dipakai lokal (dev). Jangan commit perubahan koin ke prod sembarangan.

const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

// --- Parse .env.local manual (tanpa dotenv) ---
function loadEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local tidak ditemukan. Jalankan dari root project tulis-noon.');
    process.exit(1);
  }
  const raw = fs.readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    // Strip surrounding quotes (single/double) kalau ada
    if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
  return env;
}

async function main() {
  const [, , email, amountArg, flag] = process.argv;
  if (!email || !amountArg) {
    console.error('Usage: node scripts/grant-koin.js <email> <jumlah> [--add]');
    process.exit(1);
  }
  const amount = parseInt(String(amountArg).replace('+', ''), 10);
  if (isNaN(amount)) {
    console.error('❌ Jumlah harus angka. Contoh: 1000');
    process.exit(1);
  }
  const isAdd = flag === '--add';

  const env = loadEnvLocal();
  if (!env.FIREBASE_SERVICE_ACCOUNT) {
    console.error('❌ FIREBASE_SERVICE_ACCOUNT tidak ada di .env.local');
    process.exit(1);
  }

  let sa;
  try {
    sa = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT);
  } catch (e) {
    console.error('❌ FIREBASE_SERVICE_ACCOUNT bukan JSON valid:', e.message);
    process.exit(1);
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(sa),
      projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || sa.project_id,
    });
  }

  const auth = admin.auth();
  const db = admin.firestore();

  // 1. Cari user by email
  let userRecord;
  try {
    userRecord = await auth.getUserByEmail(email);
  } catch (e) {
    console.error(`❌ User dengan email "${email}" tidak ditemukan di Firebase Auth.`);
    console.error('   (Pastikan akun itu sudah pernah register/login di app.)');
    process.exit(1);
  }
  const uid = userRecord.uid;

  // 2. Baca koin sekarang
  const userRef = db.collection('users').doc(uid);
  const snap = await userRef.get();
  const current = snap.exists ? (snap.data().coins || 0) : 0;
  const next = isAdd ? current + amount : amount;

  // 3. Update (merge supaya field lain aman)
  await userRef.set({ coins: next }, { merge: true });

  console.log('✅ Berhasil!');
  console.log(`   Email : ${email}`);
  console.log(`   UID   : ${uid}`);
  console.log(`   Koin  : ${current} → ${next}${isAdd ? ' (ditambah ' + amount + ')' : ' (di-set)'}`);
  process.exit(0);
}

main().catch((e) => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});
