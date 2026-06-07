// lib/certificate.js
// Sistem sertifikat Tulis Noon — user dapat sertifikat saat menyelesaikan
// SELURUH pelajaran di satu jalur belajar.
//
// 7 jalur yang bisa diraih sertifikatnya:
//   - umrah (15 modul)
//   - profesi (20 modul Profesional)
//   - beasiswa (10 modul Pelajar)
//   - nahwu (30 pelajaran Sintaksis Arab)
//   - shorf (24 pelajaran Morfologi Arab)
//   - perkenalan (12 materi Perkenalan Diri)
//   - hafalan-juz30 (Al-Fatihah + Juz 30 — Hafidz Juz Amma)
//
// Data tracking di userProfile (sudah ada per field):
//   - progress.umrah/profesi/beasiswa (integer level terakhir)
//   - completedNahwuShorf.{nahwu,shorf} (array lesson IDs)
//   - completedPerkenalanMateri (array materi IDs)
//   - hafalanProgress[suratNum] (object dgn status)
//
// Field BARU yang kita simpan saat user dapat sertifikat:
//   - earnedCertificates: array of { pathId, earnedAt, certNumber }

import { LEARNING_UMRAH } from '@/data/learning-umrah';
import { LEARNING_PELAJAR } from '@/data/learning-pelajar';
import { LEARNING_PROFESIONAL } from '@/data/learning-profesional';
import { NAHWU_LESSONS } from '@/data/learning-nahwu';
import { SHORF_LESSONS } from '@/data/learning-shorf';
import { PERKENALAN_MATERI } from '@/data/perkenalan-diri-materi';

// Metadata tiap sertifikat
export const CERTIFICATE_PATHS = [
  {
    id: 'umrah',
    title: 'Bahasa Umrah & Haji',
    arabicTitle: 'لِلْعُمْرَةِ وَالْحَجِّ',
    subtitle: 'Jamaah siap berkomunikasi di tanah suci',
    emoji: '🕋',
    color: '#0a4d3c',
    gradient: 'linear-gradient(135deg, #0a4d3c, #1a6b56)',
    totalUnits: 15,
    unitLabel: 'modul',
    description: 'Telah menyelesaikan seluruh modul belajar Bahasa Arab untuk umrah dan haji — dari persiapan bandara, kehidupan di Madinah, sampai ibadah di Masjidil Haram.',
  },
  {
    id: 'profesi',
    title: 'Bahasa Arab Profesional',
    arabicTitle: 'لِلْمِهَنِيِّيْنَ',
    subtitle: 'Komunikasi bisnis di Timur Tengah',
    emoji: '💼',
    color: '#8b6b3d',
    gradient: 'linear-gradient(135deg, #8b6b3d, #a08555)',
    totalUnits: 20,
    unitLabel: 'modul',
    description: 'Telah menguasai 20 modul Bahasa Arab profesional — dari percakapan kantor, negosiasi bisnis, sampai komunikasi formal di lingkungan kerja Timur Tengah.',
  },
  {
    id: 'beasiswa',
    title: 'Bahasa Arab Pelajar',
    arabicTitle: 'لِلطُّلَّابِ',
    subtitle: 'Survival mode untuk pelajar di negara Arab',
    emoji: '🎓',
    color: '#7a3d2a',
    gradient: 'linear-gradient(135deg, #7a3d2a, #a05536)',
    totalUnits: 10,
    unitLabel: 'modul',
    description: 'Telah menyelesaikan kurikulum Fusha untuk pelajar dan mahasiswa — dari komunikasi kampus, urusan akademik, sampai kehidupan sehari-hari di asrama.',
  },
  {
    id: 'nahwu',
    title: 'Nahwu — Sintaksis Arab Fasiha',
    arabicTitle: 'النَّحْوُ',
    subtitle: 'Fondasi i\'rab dan struktur kalimat',
    emoji: '🧮',
    color: '#0a4d3c',
    gradient: 'linear-gradient(135deg, #062e25, #0a4d3c)',
    totalUnits: 30,
    unitLabel: 'pelajaran',
    description: 'Telah menyelesaikan 30 pelajaran Nahwu — dari pembagian kata, i\'rab dasar, jumlah ismiyyah/fi\'liyyah, sampai kaana, inna, hal, taukid, dan i\'rab ayat kompleks Al-Qur\'an.',
  },
  {
    id: 'shorf',
    title: 'Shorf — Morfologi Arab Fasiha',
    arabicTitle: 'الصَّرْفُ',
    subtitle: 'Tasrif dan derivasi kata',
    emoji: '🌿',
    color: '#7a3d2a',
    gradient: 'linear-gradient(135deg, #5a2d1f, #7a3d2a)',
    totalUnits: 24,
    unitLabel: 'pelajaran',
    description: 'Telah menyelesaikan 24 pelajaran Shorf — dari tasrif madhi/mudhori\'/amr, wazan mazid, fi\'il mu\'tal, sampai i\'lal, mubaalaghah, tashghir, dan sintesis derivasi kata Qur\'ani.',
  },
  {
    id: 'perkenalan',
    title: 'Perkenalan Diri',
    arabicTitle: 'التَّعَارُفُ',
    subtitle: 'Memperkenalkan diri di berbagai konteks',
    emoji: '👋',
    color: '#c9a961',
    gradient: 'linear-gradient(135deg, #b58f4d, #c9a961)',
    totalUnits: 12,
    unitLabel: 'materi',
    description: 'Telah menyelesaikan 12 materi Perkenalan Diri — bisa memperkenalkan diri secara komprehensif: profesi, asal, hobi, keluarga, dan tujuan hidup dalam Bahasa Arab.',
  },
  {
    id: 'hafalan-juz30',
    title: 'Hafidz Juz \'Amma',
    arabicTitle: 'حَافِظُ جُزْءِ عَمَّ',
    subtitle: 'Al-Fatihah + Juz 30 lengkap',
    emoji: '📿',
    color: '#c9a961',
    gradient: 'linear-gradient(135deg, #a87f47, #c9a961)',
    totalUnits: 37,
    unitLabel: 'surat',
    description: 'Telah menyelesaikan hafalan Al-Fatihah dan seluruh surat Juz 30 (Juz \'Amma) — modal utama untuk imam shalat dan amalan harian.',
  },
];

// ============================================================================
// MASTER SERTIFIKAT (Capstone ke-8) — dapat saat semua 7 sertifikat lain earned
// Sengaja terpisah dari CERTIFICATE_PATHS biar gak ikut count regular 7.
// ============================================================================
export const MASTER_CERTIFICATE = {
  id: 'master',
  title: 'Master Tulis Noon',
  arabicTitle: 'الْمَاهِرُ الشَّامِلُ',
  subtitle: 'Penyelesai Lengkap 7 Sertifikat',
  emoji: '🏅',
  color: '#c9a961',
  gradient: 'linear-gradient(135deg, #b58f4d, #d4b876)',
  totalUnits: 7,
  unitLabel: 'sertifikat',
  description: 'Telah menyelesaikan seluruh kurikulum Tulis Noon — dari fondasi perkenalan, semua jalur use-case (Umrah, Profesi, Beasiswa), hafalan Juz \'Amma, sampai mastery Nahwu dan Shorf. Pencapaian luar biasa.',
};

// Master path TIDAK ikut CERTIFICATE_PATHS — di-handle khusus.
export function getMasterCertificate() {
  return MASTER_CERTIFICATE;
}

// ============================================================================
// PERSONA-BASED PRIORITY QUEUES
// Tiap persona punya urutan path yang direkomendasiin.
// ============================================================================
export const PERSONA_GOALS = [
  {
    id: 'umrah',
    label: 'Mau Umrah/Haji',
    sublabel: 'Belajar Arab buat jamaah',
    emoji: '🕋',
    color: '#0a4d3c',
  },
  {
    id: 'profesi',
    label: 'Kerja di Saudi/Timteng',
    sublabel: 'Untuk TKI/profesional',
    emoji: '💼',
    color: '#8b6b3d',
  },
  {
    id: 'pelajar',
    label: 'Pelajar/Mahasiswa',
    sublabel: 'Beasiswa atau studi',
    emoji: '🎓',
    color: '#7a3d2a',
  },
  {
    id: 'serius',
    label: 'Belajar Bahasa Serius',
    sublabel: 'Lengkap sampai Nahwu-Shorf',
    emoji: '📚',
    color: '#c9a961',
  },
  {
    id: 'all',
    label: 'Mau Pelajari Semua',
    sublabel: 'Belum tau prioritas',
    emoji: '⛅',
    color: '#a05536',
  },
];

const PERSONA_PRIORITIES = {
  umrah:   ['perkenalan', 'umrah', 'hafalan-juz30', 'nahwu', 'shorf', 'profesi', 'beasiswa'],
  profesi: ['perkenalan', 'profesi', 'hafalan-juz30', 'umrah', 'nahwu', 'shorf', 'beasiswa'],
  pelajar: ['perkenalan', 'beasiswa', 'nahwu', 'shorf', 'hafalan-juz30', 'umrah', 'profesi'],
  serius:  ['perkenalan', 'nahwu', 'shorf', 'umrah', 'profesi', 'beasiswa', 'hafalan-juz30'],
  all:     ['perkenalan', 'umrah', 'profesi', 'beasiswa', 'hafalan-juz30', 'nahwu', 'shorf'],
};

export function getPersonaPriority(personaGoal) {
  return PERSONA_PRIORITIES[personaGoal] || PERSONA_PRIORITIES.all;
}

export function getCertificatePath(pathId) {
  if (pathId === 'master') return MASTER_CERTIFICATE;
  return CERTIFICATE_PATHS.find((p) => p.id === pathId) || null;
}

/**
 * Status kelulusan setiap jalur: { pathId, completed, total, percent, isCertified }
 */
export function getPathProgress(pathId, userProfile) {
  const meta = getCertificatePath(pathId);
  if (!meta || !userProfile) return { pathId, completed: 0, total: meta?.totalUnits || 0, percent: 0, isCertified: false };

  // Master sertifikat: completed = jumlah sertifikat reguler yang udah earned
  if (pathId === 'master') {
    const completed = CERTIFICATE_PATHS.filter((p) => hasEarnedCertificate(p.id, userProfile)).length;
    const total = CERTIFICATE_PATHS.length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { pathId, completed, total, percent, isCertified: completed >= total };
  }

  let completed = 0;
  const total = meta.totalUnits;

  if (pathId === 'umrah') {
    // progress.umrah = level terakhir (integer). Kalau sudah >= 15 → selesai.
    completed = Math.min(userProfile?.progress?.umrah || 0, total);
  } else if (pathId === 'profesi') {
    completed = Math.min(userProfile?.progress?.profesi || 0, total);
  } else if (pathId === 'beasiswa') {
    completed = Math.min(userProfile?.progress?.beasiswa || 0, total);
  } else if (pathId === 'nahwu') {
    const arr = userProfile?.completedNahwuShorf?.nahwu || [];
    // count unique IDs yg masuk di NAHWU_LESSONS
    const validIds = new Set(NAHWU_LESSONS.map((l) => l.id));
    completed = arr.filter((id) => validIds.has(id)).length;
  } else if (pathId === 'shorf') {
    const arr = userProfile?.completedNahwuShorf?.shorf || [];
    const validIds = new Set(SHORF_LESSONS.map((l) => l.id));
    completed = arr.filter((id) => validIds.has(id)).length;
  } else if (pathId === 'perkenalan') {
    const arr = userProfile?.completedPerkenalanMateri || [];
    const validIds = new Set(PERKENALAN_MATERI.map((m) => m.id));
    completed = arr.filter((id) => validIds.has(id)).length;
  } else if (pathId === 'hafalan-juz30') {
    // Hafalan: hitung surat Juz 30 + Al-Fatihah yang status-nya done.
    // hafalanProgress = { [suratNum]: { completed: true } } atau struktur sejenis.
    const prog = userProfile?.hafalanProgress || {};
    // Surat number 1 (Al-Fatihah) + 78-114 (Juz 30 = 37 surat)
    const targetNums = [1, ...Array.from({ length: 114 - 78 + 1 }, (_, i) => 78 + i)];
    completed = targetNums.filter((n) => {
      const v = prog[n] || prog[String(n)];
      if (!v) return false;
      if (v === true) return true;
      if (v.completed) return true;
      if (v.done) return true;
      if (v.fullyMemorized) return true;
      return false;
    }).length;
  }

  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const isCertified = completed >= total && total > 0;
  return { pathId, completed, total, percent, isCertified };
}

/**
 * Apakah user sudah dapat sertifikat untuk jalur ini?
 * (sudah disimpan di earnedCertificates ATAU progress sudah 100%)
 */
export function hasEarnedCertificate(pathId, userProfile) {
  const earned = userProfile?.earnedCertificates || [];
  if (earned.find((c) => c.pathId === pathId)) return true;
  return getPathProgress(pathId, userProfile).isCertified;
}

/**
 * Generate nomor sertifikat unik: TN-{pathPrefix}-{userId6}-{YYMMDD}
 * Konsisten — kalau dipanggil ulang utk path+user+date yang sama, hasilnya sama.
 */
export function generateCertNumber(pathId, userId, earnedAt) {
  const prefix = (pathId || 'xx').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
  const uid = (userId || '000000').toString().slice(-6).toUpperCase();
  const d = earnedAt ? new Date(earnedAt) : new Date();
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `TN-${prefix}-${uid}-${yy}${mm}${dd}`;
}

/**
 * Data lengkap untuk render sertifikat (dipakai CertificateView).
 */
export function getCertificateData(pathId, userProfile, userId) {
  const meta = getCertificatePath(pathId);
  if (!meta) return null;
  const earned = userProfile?.earnedCertificates || [];
  const existing = earned.find((c) => c.pathId === pathId);
  const earnedAt = existing?.earnedAt || Date.now();
  const certNumber = existing?.certNumber || generateCertNumber(pathId, userId || userProfile?.uid, earnedAt);
  return {
    meta,
    recipientName: userProfile?.displayName || 'Pengguna Tulis Noon',
    earnedAt,
    certNumber,
  };
}

/**
 * Hitung berapa sertifikat yang sudah diraih user (untuk badge di Profile).
 */
export function countEarnedCertificates(userProfile) {
  if (!userProfile) return 0;
  return CERTIFICATE_PATHS.filter((p) => hasEarnedCertificate(p.id, userProfile)).length;
}

/**
 * Format tanggal Hijriah pakai Umm al-Qura (sama dgn kalender Saudi).
 */
export function formatHijriDate(ms) {
  try {
    const d = new Date(ms);
    return new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura', {
      day: 'numeric', month: 'long', year: 'numeric',
    }).format(d).replace(' H', '') + ' H';
  } catch (e) {
    return '';
  }
}

export function formatGregorianDate(ms) {
  try {
    const d = new Date(ms);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
    }).format(d);
  } catch (e) {
    return '';
  }
}

// ============================================================================
// RECOMMENDATION ENGINE — Lesson-level "Lanjutkan: X"
// ============================================================================

/**
 * Return next specific lesson user should continue, berdasarkan persona + progress.
 *
 * Output:
 *   {
 *     pathId, pathTitle, pathEmoji, pathColor, pathGradient,
 *     lessonId, lessonTitle, lessonIndex,   // urutan 1-based
 *     pathCompleted, pathTotal, pathPercent,
 *     isStart,                              // true = baru mulai path ini
 *     deeplink: { screen, ...params }        // untuk routing
 *   }
 *   atau null kalau semua udah selesai (= master earned)
 */
export function getRecommendedNextLesson(userProfile) {
  if (!userProfile) return null;
  const persona = userProfile.personaGoal || 'all';
  const priority = getPersonaPriority(persona);

  for (const pathId of priority) {
    const next = getNextLessonForPath(pathId, userProfile);
    if (next) {
      const meta = getCertificatePath(pathId);
      const progress = getPathProgress(pathId, userProfile);
      return {
        pathId,
        pathTitle: meta.title,
        pathEmoji: meta.emoji,
        pathColor: meta.color,
        pathGradient: meta.gradient,
        lessonId: next.lessonId,
        lessonTitle: next.lessonTitle,
        lessonIndex: next.lessonIndex,
        pathCompleted: progress.completed,
        pathTotal: progress.total,
        pathPercent: progress.percent,
        isStart: progress.completed === 0,
        deeplink: next.deeplink,
      };
    }
  }
  return null; // semua 7 selesai → master earned, no more recommendations
}

/**
 * Internal: cari next lesson di 1 path. Return null kalau path udah complete.
 */
function getNextLessonForPath(pathId, userProfile) {
  const progress = getPathProgress(pathId, userProfile);
  if (progress.isCertified) return null;

  if (pathId === 'umrah') {
    const idx = (userProfile?.progress?.umrah || 0); // 0-based index lesson berikutnya
    const lesson = LEARNING_UMRAH[idx];
    if (!lesson) return null;
    return {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      lessonIndex: idx + 1,
      deeplink: { screen: 'lesson-detail', track: 'umrah', lessonId: lesson.id },
    };
  }

  if (pathId === 'profesi') {
    const idx = (userProfile?.progress?.profesi || 0);
    const lesson = LEARNING_PROFESIONAL[idx];
    if (!lesson) return null;
    return {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      lessonIndex: idx + 1,
      deeplink: { screen: 'lesson-detail', track: 'profesi', lessonId: lesson.id },
    };
  }

  if (pathId === 'beasiswa') {
    const idx = (userProfile?.progress?.beasiswa || 0);
    const lesson = LEARNING_PELAJAR[idx];
    if (!lesson) return null;
    return {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      lessonIndex: idx + 1,
      deeplink: { screen: 'lesson-detail', track: 'beasiswa', lessonId: lesson.id },
    };
  }

  if (pathId === 'nahwu') {
    const done = new Set(userProfile?.completedNahwuShorf?.nahwu || []);
    const next = NAHWU_LESSONS.findIndex((l) => !done.has(l.id));
    if (next < 0) return null;
    const lesson = NAHWU_LESSONS[next];
    return {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      lessonIndex: next + 1,
      deeplink: { screen: 'nahwu-shorf', subject: 'nahwu', lessonId: lesson.id },
    };
  }

  if (pathId === 'shorf') {
    const done = new Set(userProfile?.completedNahwuShorf?.shorf || []);
    const next = SHORF_LESSONS.findIndex((l) => !done.has(l.id));
    if (next < 0) return null;
    const lesson = SHORF_LESSONS[next];
    return {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      lessonIndex: next + 1,
      deeplink: { screen: 'nahwu-shorf', subject: 'shorf', lessonId: lesson.id },
    };
  }

  if (pathId === 'perkenalan') {
    const done = new Set(userProfile?.completedPerkenalanMateri || []);
    const next = PERKENALAN_MATERI.findIndex((m) => !done.has(m.id));
    if (next < 0) return null;
    const materi = PERKENALAN_MATERI[next];
    return {
      lessonId: materi.id,
      lessonTitle: materi.title || materi.context || `Materi ${next + 1}`,
      lessonIndex: next + 1,
      deeplink: { screen: 'perkenalan-diri', materiId: materi.id },
    };
  }

  if (pathId === 'hafalan-juz30') {
    // Order: Al-Fatihah (1) → An-Naas (114) → An-Naba (78) — reverse Juz 30
    // Itu cara hafidz tradisional belajar
    const prog = userProfile?.hafalanProgress || {};
    const isDone = (n) => {
      const v = prog[n] || prog[String(n)];
      return v === true || v?.completed || v?.done || v?.fullyMemorized;
    };
    const order = [1, ...Array.from({ length: 114 - 78 + 1 }, (_, i) => 114 - i)];
    const nextNum = order.find((n) => !isDone(n));
    if (!nextNum) return null;
    const suratNames = {
      1: 'Al-Fatihah', 78: 'An-Naba\'', 79: 'An-Nazi\'at', 80: '\'Abasa', 81: 'At-Takwir',
      82: 'Al-Infithar', 83: 'Al-Muthaffifin', 84: 'Al-Insyiqaq', 85: 'Al-Buruj', 86: 'At-Thariq',
      87: 'Al-A\'la', 88: 'Al-Ghasyiyah', 89: 'Al-Fajr', 90: 'Al-Balad', 91: 'Asy-Syams',
      92: 'Al-Layl', 93: 'Adh-Dhuha', 94: 'Asy-Syarh', 95: 'At-Tin', 96: 'Al-\'Alaq',
      97: 'Al-Qadr', 98: 'Al-Bayyinah', 99: 'Az-Zalzalah', 100: 'Al-\'Adiyat', 101: 'Al-Qari\'ah',
      102: 'At-Takatsur', 103: 'Al-\'Asr', 104: 'Al-Humazah', 105: 'Al-Fil', 106: 'Quraisy',
      107: 'Al-Ma\'un', 108: 'Al-Kautsar', 109: 'Al-Kafirun', 110: 'An-Nasr', 111: 'Al-Lahab',
      112: 'Al-Ikhlas', 113: 'Al-Falaq', 114: 'An-Naas',
    };
    return {
      lessonId: String(nextNum),
      lessonTitle: `${suratNames[nextNum] || `Surat ${nextNum}`}`,
      lessonIndex: order.indexOf(nextNum) + 1,
      deeplink: { screen: 'hafalan-detail', suratNum: nextNum },
    };
  }

  return null;
}
