// lib/social.js
// Sistem sosial Tulis Noon — Fase 1: Teman (friend code + add + list).
// Client-side, pakai Firebase JS SDK (jalan di WebView).
//
// Model pertemanan: MUTUAL & langsung (tanpa accept) — kamu cuma bisa di-add
// kalau orang tau friend code-mu, jadi friksinya rendah tapi tetap aman.
//
// Firestore:
//   users/{uid}.friendCode : string (6 char unik, mis. "TN7K2A")
//   users/{uid}.friends    : array of uid

import { firestore } from './firebase';
import {
  doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs,
  arrayUnion, arrayRemove, documentId,
} from 'firebase/firestore';

// Karakter aman (tanpa 0/O/1/I biar gak ketuker)
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CODE_PREFIX = 'TN';

function randomCode(len = 4) {
  let s = '';
  for (let i = 0; i < len; i++) s += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  return CODE_PREFIX + s; // mis. "TN7K2A"
}

/**
 * Pastikan user punya friendCode unik. Kalau belum ada, generate & simpan.
 * Returns: friendCode (string)
 */
export async function ensureFriendCode(uid) {
  if (!uid) return null;
  const userRef = doc(firestore, 'users', uid);

  // Baca doc sendiri (selalu diizinkan). Kalau udah ada code, pakai itu.
  try {
    const snap = await getDoc(userRef);
    const existing = snap.exists() ? snap.data().friendCode : null;
    if (existing) return existing;
  } catch (e) {
    console.warn('ensureFriendCode read error:', e);
  }

  // Generate code. Cek keunikan best-effort — kalau query ke collection diblok
  // Firestore rules, skip aja & pakai random (collision di 32^5 negligible).
  let code = randomCode(5);
  try {
    for (let attempt = 0; attempt < 5; attempt++) {
      const candidate = randomCode();
      const q = query(collection(firestore, 'users'), where('friendCode', '==', candidate));
      const dup = await getDocs(q);
      if (dup.empty) { code = candidate; break; }
    }
  } catch (e) {
    console.warn('ensureFriendCode uniqueness query blocked (pakai random):', e);
  }

  // Tulis ke doc sendiri (selalu diizinkan kalau auth.uid == userId).
  await setDoc(userRef, { friendCode: code }, { merge: true });
  return code;
}

/**
 * Cari user berdasarkan friend code.
 * Returns: { uid, displayName, photoURL, xp, level, friendCode } atau null
 */
export async function findUserByCode(code) {
  if (!code) return null;
  const clean = code.trim().toUpperCase();
  const q = query(collection(firestore, 'users'), where('friendCode', '==', clean));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { uid: d.id, ...d.data() };
}

/**
 * Tambah teman by code (mutual). Returns: { success, friend?, error? }
 */
export async function addFriendByCode(myUid, code) {
  if (!myUid) return { success: false, error: 'Belum login' };
  const clean = (code || '').trim().toUpperCase();
  if (!clean) return { success: false, error: 'Kode kosong' };

  const target = await findUserByCode(clean);
  if (!target) return { success: false, error: 'Kode teman tidak ditemukan' };
  if (target.uid === myUid) return { success: false, error: 'Itu kode kamu sendiri 😅' };

  try {
    // Nulis ke doc SENDIRI aja (aman dari Firestore rules yang batasi write ke own doc).
    // Model: tiap user add teman dari sisinya. Biar mutual, dua-duanya saling add kode.
    await updateDoc(doc(firestore, 'users', myUid), { friends: arrayUnion(target.uid) });
    return {
      success: true,
      friend: {
        uid: target.uid,
        displayName: target.displayName || 'Teman',
        photoURL: target.photoURL || null,
        xp: target.xp || 0,
        level: target.level || 1,
      },
    };
  } catch (e) {
    console.error('addFriendByCode error:', e);
    return { success: false, error: 'Gagal menambah teman, coba lagi' };
  }
}

/**
 * Hapus teman (mutual).
 */
export async function removeFriend(myUid, friendUid) {
  if (!myUid || !friendUid) return { success: false };
  try {
    // Write ke doc sendiri aja (aman dari Firestore rules).
    await updateDoc(doc(firestore, 'users', myUid), { friends: arrayRemove(friendUid) });
    return { success: true };
  } catch (e) {
    console.error('removeFriend error:', e);
    return { success: false, error: e.message };
  }
}

/**
 * Ambil daftar teman (full user docs). Firestore 'in' query max 30 id per batch.
 * Returns: array of { uid, displayName, photoURL, xp, level, streak, countryCode }
 */
export async function getFriends(uid) {
  if (!uid) return [];
  const snap = await getDoc(doc(firestore, 'users', uid));
  if (!snap.exists()) return [];
  const ids = snap.data().friends || [];
  if (ids.length === 0) return [];

  const results = [];
  // batch per 30 (limit 'in' query)
  for (let i = 0; i < ids.length; i += 30) {
    const batch = ids.slice(i, i + 30);
    const q = query(collection(firestore, 'users'), where(documentId(), 'in', batch));
    const qs = await getDocs(q);
    qs.forEach((d) => {
      const data = d.data();
      results.push({
        uid: d.id,
        displayName: data.displayName || 'Teman',
        photoURL: data.photoURL || null,
        xp: data.xp || 0,
        level: data.level || 1,
        streak: data.streak || 0,
        countryCode: data.location?.countryCode || null,
      });
    });
  }
  // urutkan by XP desc
  results.sort((a, b) => (b.xp || 0) - (a.xp || 0));
  return results;
}
