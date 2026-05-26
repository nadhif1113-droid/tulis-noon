// lib/hafalan-tier.js
// Gating logic untuk Hafalan Quran — siapa free, siapa premium.

import { isPremiumUnlocked } from '@/lib/feature-flags';

export const PREMIUM_UNLOCK_COST = 120;     // koin one-time payment
export const FREE_SURAT_NUMBERS = [1];      // Al-Fatihah always free as starter
export const FREE_JUZ_NUMBERS = [30];       // Juz 30 (Juz Amma) full free

/**
 * Apakah surat ini gratis tanpa unlock premium?
 *  - Al-Fatihah (surat 1) → free starter
 *  - Surat di Juz 30 (78-114) → free Juz Amma
 *  - Sisanya → premium
 */
export function isSuratFree(suratMetadata) {
  if (!suratMetadata) return false;
  // Special starter: Al-Fatihah
  if (FREE_SURAT_NUMBERS.includes(suratMetadata.number)) return true;
  // Juz Amma (30) — bisa span multiple juz, cek apakah juz 30 ada di list
  if (Array.isArray(suratMetadata.juz)) {
    return suratMetadata.juz.some((j) => FREE_JUZ_NUMBERS.includes(j));
  }
  return false;
}

/**
 * Apakah user udah unlock surat ini?
 *  - Free surat: selalu unlocked
 *  - Premium surat: unlocked kalau user.hafalanFullUnlocked === true
 */
export function isSuratUnlocked(suratMetadata, userProfile) {
  if (isSuratFree(suratMetadata)) return true;
  return isPremiumUnlocked(userProfile?.hafalanFullUnlocked);
}

/**
 * Hitung total surat free vs premium (untuk display).
 */
export function countTiers(allSurat) {
  let free = 0;
  let premium = 0;
  for (const s of allSurat) {
    if (isSuratFree(s)) free++;
    else premium++;
  }
  return { free, premium, total: allSurat.length };
}
