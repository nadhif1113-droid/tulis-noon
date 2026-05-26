// lib/tournament-system.js
// Daily Tournament: track XP earned PER HARI per user.
// Top 3 user di-rank, dapat reward koin + bonus XP saat hari berganti.
// Reset otomatis tiap hari (00:00 Asia/Riyadh).

import { getTodayDateStr } from './streak-system';

/**
 * Update XP user di tournament hari ini.
 * Returns new dailyXp object: { date: 'YYYY-MM-DD', xp: <number> }
 */
export function updateDailyXp(currentDailyXp, xpEarned) {
  const today = getTodayDateStr();
  if (!currentDailyXp || currentDailyXp.date !== today) {
    // Hari baru atau pertama kali → start dari xpEarned
    return { date: today, xp: xpEarned };
  }
  // Hari yang sama → tambah XP
  return { date: today, xp: (currentDailyXp.xp || 0) + xpEarned };
}

/**
 * Reward podium top 3 tournament harian.
 */
export const TOURNAMENT_REWARDS = {
  1: { coins: 10, xp: 100, label: '🥇 Juara 1' },
  2: { coins: 5, xp: 60, label: '🥈 Juara 2' },
  3: { coins: 3, xp: 40, label: '🥉 Juara 3' },
};

/**
 * Get tournament leaderboard untuk hari ini dari Firestore.
 * Returns array of users { id, displayName, photoURL, dailyXp.xp } sorted desc.
 */
export async function fetchTournamentLeaderboard(currentUserId) {
  try {
    const { firestore } = await import('./firebase');
    const { collection, query, where, orderBy, limit, getDocs } = await import('firebase/firestore');
    const today = getTodayDateStr();

    // Query: users yang aktif hari ini (dailyXp.date == today)
    const q = query(
      collection(firestore, 'users'),
      where('dailyXp.date', '==', today),
      orderBy('dailyXp.xp', 'desc'),
      limit(10)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d, i) => {
      const data = d.data();
      return {
        id: d.id,
        rank: i + 1,
        displayName: data.displayName || 'Anonim',
        photoURL: data.photoURL,
        xp: data.dailyXp?.xp || 0,
        isCurrentUser: d.id === currentUserId,
      };
    });
  } catch (e) {
    console.error('Tournament leaderboard fetch error:', e);
    return [];
  }
}
