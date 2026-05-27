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
  arrayUnion, arrayRemove, documentId, addDoc, serverTimestamp, orderBy, limit,
  increment, deleteDoc, getCountFromServer, onSnapshot,
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
        avatarEmoji: data.avatarEmoji || null,
        xp: data.xp || 0,
        level: data.level || 1,
        streak: data.streak || 0,
        countryCode: data.location?.countryCode || null,
        online: isOnline(data.lastSeen),
      });
    });
  }
  // urutkan by XP desc
  results.sort((a, b) => (b.xp || 0) - (a.xp || 0));
  return results;
}

// ============================================================================
// CHAT TEMAN (DM) — wajib Arab & bermakna
// ============================================================================

/**
 * ID room DM antara 2 user (urut biar konsisten).
 */
export function dmPairId(a, b) {
  return [a, b].sort().join('_');
}

/**
 * Validasi teks Arab via server (cepat: cek Arab + no latin, lalu cek makna AI).
 * Returns: { valid, reason }
 */
export async function validateArabicText(text) {
  try {
    const res = await fetch('/api/validate-arabic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    return await res.json();
  } catch (e) {
    return { valid: false, reason: 'Gagal validasi, coba lagi' };
  }
}

/**
 * Kirim pesan DM. sender: { uid, name, avatarEmoji }
 */
export async function sendDmMessage(pairId, sender, text) {
  const clean = (text || '').trim().slice(0, 500);
  if (!pairId || !sender?.uid || !clean) return { success: false };
  try {
    await addDoc(collection(firestore, 'dms', pairId, 'messages'), {
      senderId: sender.uid,
      senderName: sender.name || 'Pengguna',
      senderAvatar: sender.avatarEmoji || null,
      text: clean,
      createdAt: serverTimestamp(),
    });
    // Simpan meta room (anggota + pesan terakhir) untuk daftar chat nanti.
    // lastSenderId dipakai buat tau pesan terakhir dari siapa (unread badge).
    // reads.{uid} = waktu terakhir si pengirim "baca" — pengirim otomatis dianggap udah baca.
    await setDoc(doc(firestore, 'dms', pairId), {
      members: pairId.split('_'),
      lastText: clean.slice(0, 80),
      lastAt: serverTimestamp(),
      lastSenderId: sender.uid,
      reads: { [sender.uid]: serverTimestamp() },
    }, { merge: true }).catch(() => {});
    return { success: true };
  } catch (e) {
    console.warn('sendDmMessage error:', e);
    return { success: false, error: e.message };
  }
}

/**
 * Listen pesan DM real-time. cb(messages[]). Returns unsubscribe fn.
 */
export function listenDmMessages(pairId, cb, n = 80) {
  try {
    const q = query(collection(firestore, 'dms', pairId, 'messages'), orderBy('createdAt', 'asc'), limit(n));
    return onSnapshot(q, (snap) => {
      const msgs = snap.docs.map((d) => {
        const m = d.data();
        return {
          id: d.id,
          senderId: m.senderId,
          senderName: m.senderName || 'Pengguna',
          senderAvatar: m.senderAvatar || null,
          text: m.text || '',
          time: relativeTime(m.createdAt?.toDate ? m.createdAt.toDate() : null),
        };
      });
      cb(msgs);
    }, (err) => console.warn('listenDmMessages error:', err));
  } catch (e) {
    console.warn('listenDmMessages setup error:', e);
    return () => {};
  }
}

/**
 * Tandai room sudah dibaca oleh user (uid) — set reads.{uid} = sekarang.
 * Dipanggil saat user buka/ada di layar chat.
 */
export async function markDmRead(pairId, uid) {
  if (!pairId || !uid) return;
  try {
    await setDoc(doc(firestore, 'dms', pairId), {
      members: pairId.split('_'),
      reads: { [uid]: serverTimestamp() },
    }, { merge: true });
  } catch (e) {
    console.warn('markDmRead error:', e);
  }
}

function _ms(ts) {
  try { return ts?.toMillis ? ts.toMillis() : (ts?.toDate ? ts.toDate().getTime() : 0); }
  catch { return 0; }
}

/**
 * Listen daftar room DM milik user (semua chat yg dia ikut).
 * cb(threads[]) — tiap thread: { pairId, otherId, lastText, lastAt, lastAtMs,
 *   lastSenderId, time, unread }. Diurut terbaru dulu (client-side).
 * Returns unsubscribe fn.
 */
export function listenDmThreads(uid, cb) {
  if (!uid) { cb?.([]); return () => {}; }
  try {
    const q = query(collection(firestore, 'dms'), where('members', 'array-contains', uid));
    return onSnapshot(q, (snap) => {
      const threads = snap.docs.map((d) => {
        const t = d.data();
        const members = t.members || d.id.split('_');
        const otherId = members.find((m) => m !== uid) || null;
        const lastAtMs = _ms(t.lastAt);
        const myReadMs = _ms(t.reads?.[uid]);
        // Unread kalau pesan terakhir BUKAN dari aku & belum aku baca.
        const unread = !!t.lastSenderId && t.lastSenderId !== uid && lastAtMs > myReadMs;
        return {
          pairId: d.id,
          otherId,
          lastText: t.lastText || '',
          lastSenderId: t.lastSenderId || null,
          lastAtMs,
          time: relativeTime(t.lastAt?.toDate ? t.lastAt.toDate() : null),
          unread,
        };
      })
      // cuma room yg udah ada pesannya
      .filter((t) => t.lastAtMs > 0)
      .sort((a, b) => b.lastAtMs - a.lastAtMs);
      cb?.(threads);
    }, (err) => console.warn('listenDmThreads error:', err));
  } catch (e) {
    console.warn('listenDmThreads setup error:', e);
    return () => {};
  }
}

// ============================================================================
// PRESENCE — status online/offline
// ============================================================================

/**
 * Update "denyut" presence user — dipanggil berkala saat app aktif.
 * Simpan lastSeen di user doc (write doc sendiri, aman dari rules).
 */
export async function updatePresence(uid) {
  if (!uid) return;
  try {
    await updateDoc(doc(firestore, 'users', uid), { lastSeen: serverTimestamp() });
  } catch (e) {
    // doc mungkin belum ada / offline — abaikan
  }
}

/**
 * Apakah user dianggap online? (lastSeen < 2 menit lalu)
 */
export function isOnline(lastSeen) {
  if (!lastSeen) return false;
  const d = lastSeen?.toDate ? lastSeen.toDate() : (lastSeen instanceof Date ? lastSeen : null);
  if (!d) return false;
  return Date.now() - d.getTime() < 2 * 60 * 1000;
}

// ============================================================================
// FASE 2 — ACTIVITY FEED KOMUNITAS
// ============================================================================

/**
 * Format waktu relatif: "baru saja", "5 menit lalu", "2 jam lalu", "3 hari lalu".
 */
function relativeTime(date) {
  if (!date) return 'baru saja';
  const diff = Date.now() - date.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'baru saja';
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} hari lalu`;
  return `${Math.floor(d / 7)} minggu lalu`;
}

/**
 * Tulis 1 activity ke feed komunitas.
 * user: { uid, name, photoURL }
 * activity: { type, text, emoji }
 */
export async function postActivity(user, activity) {
  if (!user?.uid || !activity?.text) return;
  try {
    await addDoc(collection(firestore, 'activities'), {
      uid: user.uid,
      name: user.name || 'Pengguna',
      photoURL: user.photoURL || null,
      type: activity.type || 'info',
      text: activity.text,
      emoji: activity.emoji || '✨',
      createdAt: serverTimestamp(),
    });
  } catch (e) {
    console.warn('postActivity error:', e);
  }
}

/**
 * Ambil feed komunitas terbaru (semua user). Returns array siap render:
 * { id, type, text, emoji, user, photoURL, time }
 */
export async function getCommunityFeed(n = 25) {
  try {
    const q = query(collection(firestore, 'activities'), orderBy('createdAt', 'desc'), limit(n));
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const a = d.data();
      return {
        id: d.id,
        type: a.type || 'info',
        text: a.text || '',
        emoji: a.emoji || '✨',
        user: a.name || 'Pengguna',
        photoURL: a.photoURL || null,
        time: relativeTime(a.createdAt?.toDate ? a.createdAt.toDate() : null),
      };
    });
  } catch (e) {
    console.warn('getCommunityFeed error:', e);
    return [];
  }
}

/**
 * Feed khusus teman (+ diri sendiri). uid + friendIds.
 */
export async function getFriendsFeed(uid, friendIds = [], n = 25) {
  try {
    const ids = [uid, ...friendIds].filter(Boolean).slice(0, 30);
    if (ids.length === 0) return [];
    const q = query(
      collection(firestore, 'activities'),
      where('uid', 'in', ids),
      orderBy('createdAt', 'desc'),
      limit(n)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const a = d.data();
      return {
        id: d.id, type: a.type || 'info', text: a.text || '', emoji: a.emoji || '✨',
        user: a.name || 'Pengguna', photoURL: a.photoURL || null,
        time: relativeTime(a.createdAt?.toDate ? a.createdAt.toDate() : null),
      };
    });
  } catch (e) {
    console.warn('getFriendsFeed error:', e);
    return [];
  }
}

// ============================================================================
// FASE 5 — LEADERBOARD (global / teman / regional)
// ============================================================================

function mapLbUser(d) {
  return {
    id: d.id,
    displayName: d.displayName || 'Anonim',
    avatarEmoji: d.avatarEmoji || null,
    photoURL: d.photoURL || null,
    xp: d.xp || 0,
    level: d.level || 1,
    countryCode: d.location?.countryCode || null,
  };
}

/**
 * Ambil leaderboard sesuai scope.
 *  - 'global'   : top XP semua user
 *  - 'friends'  : diri + teman, urut XP
 *  - 'regional' : user di negara yg sama (countryCode), urut XP
 */
export async function getLeaderboard({ scope = 'global', uid = null, friendIds = [], countryCode = null, n = 20 } = {}) {
  try {
    if (scope === 'friends') {
      const ids = [uid, ...(friendIds || [])].filter(Boolean).slice(0, 30);
      if (ids.length === 0) return [];
      const docs = [];
      for (let i = 0; i < ids.length; i += 30) {
        const batch = ids.slice(i, i + 30);
        const qs = await getDocs(query(collection(firestore, 'users'), where(documentId(), 'in', batch)));
        qs.forEach((d) => docs.push({ id: d.id, ...d.data() }));
      }
      docs.sort((a, b) => (b.xp || 0) - (a.xp || 0));
      return docs.slice(0, n).map(mapLbUser);
    }

    if (scope === 'regional' && countryCode) {
      const qs = await getDocs(query(collection(firestore, 'users'), where('location.countryCode', '==', countryCode), limit(100)));
      const docs = [];
      qs.forEach((d) => docs.push({ id: d.id, ...d.data() }));
      docs.sort((a, b) => (b.xp || 0) - (a.xp || 0));
      return docs.slice(0, n).map(mapLbUser);
    }

    // global
    const qs = await getDocs(query(collection(firestore, 'users'), orderBy('xp', 'desc'), limit(n)));
    const docs = [];
    qs.forEach((d) => docs.push({ id: d.id, ...d.data() }));
    return docs.map(mapLbUser);
  } catch (e) {
    console.warn('getLeaderboard error:', e);
    return [];
  }
}

/**
 * Hitung peringkat global user (1-based) berdasarkan jumlah user dgn XP lebih tinggi.
 * Pakai count aggregate (hemat — gak download semua doc).
 */
export async function getUserGlobalRank(myXp) {
  try {
    const q = query(collection(firestore, 'users'), where('xp', '>', myXp || 0));
    const snap = await getCountFromServer(q);
    return (snap.data().count || 0) + 1;
  } catch (e) {
    console.warn('getUserGlobalRank error:', e);
    return null;
  }
}

// ============================================================================
// FASE 3 — FEED KOMUNITAS (posts + like + komentar)
// ============================================================================

/**
 * Bikin post baru. user: { uid, name, avatarEmoji }
 */
export async function createPost(user, text) {
  if (!user?.uid || !text?.trim()) return { success: false, error: 'Kosong' };
  try {
    const ref = await addDoc(collection(firestore, 'posts'), {
      authorId: user.uid,
      authorName: user.name || 'Pengguna',
      authorAvatar: user.avatarEmoji || null,
      text: text.trim().slice(0, 500),
      likes: [],
      likeCount: 0,
      commentCount: 0,
      createdAt: serverTimestamp(),
    });
    return { success: true, id: ref.id };
  } catch (e) {
    console.warn('createPost error:', e);
    return { success: false, error: e.message };
  }
}

/**
 * Ambil post terbaru. Returns array siap render.
 */
export async function getPosts(n = 30) {
  try {
    const q = query(collection(firestore, 'posts'), orderBy('createdAt', 'desc'), limit(n));
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const p = d.data();
      return {
        id: d.id,
        authorId: p.authorId,
        authorName: p.authorName || 'Pengguna',
        authorAvatar: p.authorAvatar || null,
        text: p.text || '',
        likes: p.likes || [],
        likeCount: p.likeCount != null ? p.likeCount : (p.likes ? p.likes.length : 0),
        commentCount: p.commentCount || 0,
        time: relativeTime(p.createdAt?.toDate ? p.createdAt.toDate() : null),
      };
    });
  } catch (e) {
    console.warn('getPosts error:', e);
    return [];
  }
}

/**
 * Like / unlike post. liked = status sekarang (true kalau udah like → bakal di-unlike).
 */
export async function toggleLikePost(postId, uid, liked) {
  if (!postId || !uid) return { success: false };
  try {
    const ref = doc(firestore, 'posts', postId);
    if (liked) {
      await updateDoc(ref, { likes: arrayRemove(uid), likeCount: increment(-1) });
    } else {
      await updateDoc(ref, { likes: arrayUnion(uid), likeCount: increment(1) });
    }
    return { success: true };
  } catch (e) {
    console.warn('toggleLikePost error:', e);
    return { success: false };
  }
}

/**
 * Hapus post (cuma penulisnya — divalidasi rules).
 */
export async function deletePost(postId) {
  try {
    await deleteDoc(doc(firestore, 'posts', postId));
    return { success: true };
  } catch (e) {
    console.warn('deletePost error:', e);
    return { success: false };
  }
}

/**
 * Tambah komentar ke post. user: { uid, name, avatarEmoji }
 */
export async function addComment(postId, user, text) {
  if (!postId || !user?.uid || !text?.trim()) return { success: false };
  try {
    await addDoc(collection(firestore, 'posts', postId, 'comments'), {
      authorId: user.uid,
      authorName: user.name || 'Pengguna',
      authorAvatar: user.avatarEmoji || null,
      text: text.trim().slice(0, 300),
      createdAt: serverTimestamp(),
    });
    await updateDoc(doc(firestore, 'posts', postId), { commentCount: increment(1) }).catch(() => {});
    return { success: true };
  } catch (e) {
    console.warn('addComment error:', e);
    return { success: false, error: e.message };
  }
}

/**
 * Ambil komentar 1 post (urut lama → baru).
 */
export async function getComments(postId, n = 50) {
  try {
    const q = query(collection(firestore, 'posts', postId, 'comments'), orderBy('createdAt', 'asc'), limit(n));
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const c = d.data();
      return {
        id: d.id,
        authorId: c.authorId,
        authorName: c.authorName || 'Pengguna',
        authorAvatar: c.authorAvatar || null,
        text: c.text || '',
        time: relativeTime(c.createdAt?.toDate ? c.createdAt.toDate() : null),
      };
    });
  } catch (e) {
    console.warn('getComments error:', e);
    return [];
  }
}
