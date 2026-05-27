// data/ngomong-materi.js
// Game #6 "Belajar Ngomong" — tangga produksi: Kata → Susun Kalimat → Susun Cerita.
// FASE 1 (sekarang): Level "Kata" terisi penuh — barang sehari-hari, bahasa baku (fusha).
// Level "kalimat" & "cerita" rangkanya udah disiapin, kontennya nyusul.
//
// Model gratis/bayar:
//   - Tiap materi: 3 soal pertama GRATIS (dicoba dulu).
//   - "Sesi lanjutan" (sisa soal yang lebih seru) buka dengan 5 koin per materi.

export const NGOMONG_FREE_ITEMS = 3; // jumlah soal gratis per materi
export const NGOMONG_SESSION_COST = 5; // koin untuk buka sesi lanjutan

// Tangga 3 level. Yang "comingSoon" belum aktif (rangka untuk fase berikutnya).
export const NGOMONG_LEVELS = [
  { id: 'kata', label: 'Kata', emoji: '🔤', desc: 'Ucapkan nama barang sehari-hari' },
  { id: 'kalimat', label: 'Susun Kalimat', emoji: '📝', desc: 'Rangkai kata jadi kalimat utuh', comingSoon: true },
  { id: 'cerita', label: 'Susun Cerita', emoji: '📖', desc: 'Ceritakan kegiatan harianmu', comingSoon: true },
];

// LEVEL 1 — KATA. Tiap materi punya items: { ar (berharakat), latin, id, emoji }.
// ar dipakai buat TTS + target pengucapan; pencocokan suara mengabaikan harakat.
export const NGOMONG_MATERI = [
  {
    id: 'kata-dapur',
    level: 'kata',
    title: 'Barang di Dapur',
    emoji: '🍽️',
    desc: 'Peralatan makan & masak',
    items: [
      { ar: 'صَحْن', latin: 'sahn', id: 'piring', emoji: '🍽️' },
      { ar: 'كُوب', latin: 'kuub', id: 'gelas', emoji: '🥤' },
      { ar: 'مِلْعَقَة', latin: "mil'aqah", id: 'sendok', emoji: '🥄' },
      { ar: 'شَوْكَة', latin: 'syaukah', id: 'garpu', emoji: '🍴' },
      { ar: 'سِكِّين', latin: 'sikkiin', id: 'pisau', emoji: '🔪' },
      { ar: 'قِدْر', latin: 'qidr', id: 'panci', emoji: '🍲' },
    ],
  },
  {
    id: 'kata-tas',
    level: 'kata',
    title: 'Isi Tas Perjalanan',
    emoji: '🎒',
    desc: 'Barang penting saat bepergian & umrah',
    items: [
      { ar: 'حَقِيبَة', latin: 'haqiibah', id: 'tas', emoji: '🎒' },
      { ar: 'جَوَاز', latin: 'jawaaz', id: 'paspor', emoji: '🛂' },
      { ar: 'مِفْتَاح', latin: 'miftaah', id: 'kunci', emoji: '🔑' },
      { ar: 'هَاتِف', latin: 'haatif', id: 'telepon', emoji: '📱' },
      { ar: 'نُقُود', latin: 'nuquud', id: 'uang', emoji: '💵' },
      { ar: 'نَظَّارَة', latin: 'nazhzhaarah', id: 'kacamata', emoji: '👓' },
    ],
  },
  {
    id: 'kata-kamar',
    level: 'kata',
    title: 'Barang di Kamar',
    emoji: '🛏️',
    desc: 'Perabot kamar tidur',
    items: [
      { ar: 'سَرِير', latin: 'sariir', id: 'tempat tidur', emoji: '🛏️' },
      { ar: 'مِخَدَّة', latin: 'mikhaddah', id: 'bantal', emoji: '🛌' },
      { ar: 'سَاعَة', latin: "saa'ah", id: 'jam', emoji: '⏰' },
      { ar: 'مِصْبَاح', latin: 'mishbaah', id: 'lampu', emoji: '💡' },
      { ar: 'خِزَانَة', latin: 'khizaanah', id: 'lemari', emoji: '🗄️' },
      { ar: 'مِرْآة', latin: "mir'aah", id: 'cermin', emoji: '🪞' },
    ],
  },
  {
    id: 'kata-belajar',
    level: 'kata',
    title: 'Alat Tulis & Belajar',
    emoji: '✏️',
    desc: 'Perlengkapan sekolah & kuliah',
    items: [
      { ar: 'قَلَم', latin: 'qalam', id: 'pena', emoji: '🖊️' },
      { ar: 'كِتَاب', latin: 'kitaab', id: 'buku', emoji: '📖' },
      { ar: 'دَفْتَر', latin: 'daftar', id: 'buku tulis', emoji: '📓' },
      { ar: 'مِسْطَرَة', latin: 'mistharah', id: 'penggaris', emoji: '📏' },
      { ar: 'مِقَصّ', latin: 'miqass', id: 'gunting', emoji: '✂️' },
      { ar: 'مِمْحَاة', latin: 'mimhaah', id: 'penghapus', emoji: '🧽' },
    ],
  },
  {
    id: 'kata-mandi',
    level: 'kata',
    title: 'Barang di Kamar Mandi',
    emoji: '🛁',
    desc: 'Perlengkapan mandi sehari-hari',
    items: [
      { ar: 'صَابُون', latin: 'saabuun', id: 'sabun', emoji: '🧼' },
      { ar: 'مِنْشَفَة', latin: 'minsyafah', id: 'handuk', emoji: '🧖' },
      { ar: 'فُرْشَاة', latin: 'fursyaah', id: 'sikat gigi', emoji: '🪥' },
      { ar: 'مَاء', latin: "maa'", id: 'air', emoji: '💧' },
      { ar: 'مِشْط', latin: 'misyth', id: 'sisir', emoji: '🪮' },
      { ar: 'مَعْجُون', latin: "ma'juun", id: 'pasta gigi', emoji: '🧴' },
    ],
  },
  {
    id: 'kata-makanan',
    level: 'kata',
    title: 'Makanan & Minuman',
    emoji: '🍞',
    desc: 'Yang ada di meja makan',
    items: [
      { ar: 'خُبْز', latin: 'khubz', id: 'roti', emoji: '🍞' },
      { ar: 'أَرُزّ', latin: 'aruzz', id: 'nasi', emoji: '🍚' },
      { ar: 'لَحْم', latin: 'lahm', id: 'daging', emoji: '🍖' },
      { ar: 'فَاكِهَة', latin: 'faakihah', id: 'buah', emoji: '🍎' },
      { ar: 'مَاء', latin: "maa'", id: 'air', emoji: '💧' },
      { ar: 'شَاي', latin: 'syaay', id: 'teh', emoji: '🍵' },
    ],
  },
];

// Helper: ambil materi by id
export function getNgomongMateri(id) {
  return NGOMONG_MATERI.find((m) => m.id === id) || null;
}

// Helper: materi level Kata aja (buat list saat ini)
export function getNgomongKataMateri() {
  return NGOMONG_MATERI.filter((m) => m.level === 'kata');
}
