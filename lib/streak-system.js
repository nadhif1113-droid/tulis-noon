// lib/streak-system.js
// Auto-track streak harian: jumlah hari berurutan user aktif (belajar/main).
// Reset kalau skip 1 hari. Pakai lastStreakDate (YYYY-MM-DD) untuk compare.

/**
 * Get tanggal sekarang format YYYY-MM-DD (local time, bukan UTC).
 * Pakai Asia/Riyadh timezone karena audience utama jamaah Saudi.
 */
export function getTodayDateStr(timezone = 'Asia/Riyadh') {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(new Date()); // returns YYYY-MM-DD
}

/**
 * Get tanggal kemarin format YYYY-MM-DD.
 */
export function getYesterdayDateStr(timezone = 'Asia/Riyadh') {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(yesterday);
}

/**
 * Hitung update streak berdasarkan tanggal terakhir aktif.
 * Returns:
 *   - null kalau streak ga perlu di-update (already done today)
 *   - { streak, lastStreakDate, isNewDay, isMilestone } kalau ada update
 */
export function calculateStreakUpdate(currentStreak = 0, lastStreakDate = null) {
  const today = getTodayDateStr();
  const yesterday = getYesterdayDateStr();

  // Pertama kali aktif: mulai dari 1
  if (!lastStreakDate) {
    return {
      streak: 1,
      lastStreakDate: today,
      isNewDay: true,
      isMilestone: false,
      reset: false,
    };
  }

  // Same day → no update
  if (lastStreakDate === today) {
    return null;
  }

  // Yesterday → increment streak
  if (lastStreakDate === yesterday) {
    const newStreak = currentStreak + 1;
    return {
      streak: newStreak,
      lastStreakDate: today,
      isNewDay: true,
      isMilestone: STREAK_MILESTONES.includes(newStreak),
      reset: false,
    };
  }

  // Skip hari → reset streak
  return {
    streak: 1,
    lastStreakDate: today,
    isNewDay: true,
    isMilestone: false,
    reset: true,
  };
}

// Milestone hari yang kasih reward khusus
export const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100, 200, 365];

/**
 * Reward koin untuk milestone tertentu.
 */
export function getStreakMilestoneReward(streakDay) {
  if (streakDay === 3) return { coins: 2, xp: 25, label: 'Mulai Konsisten' };
  if (streakDay === 7) return { coins: 5, xp: 50, label: 'Seminggu Penuh' };
  if (streakDay === 14) return { coins: 10, xp: 100, label: 'Dua Pekan' };
  if (streakDay === 30) return { coins: 20, xp: 200, label: 'Sebulan Lurus' };
  if (streakDay === 60) return { coins: 50, xp: 400, label: 'Dua Bulan' };
  if (streakDay === 100) return { coins: 100, xp: 800, label: '100 Hari!' };
  if (streakDay === 200) return { coins: 200, xp: 1500, label: '200 Hari Legend' };
  if (streakDay === 365) return { coins: 500, xp: 5000, label: 'Setahun Penuh' };
  return null;
}
