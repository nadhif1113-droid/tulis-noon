// components/HafalanScreen.jsx
// Hafalan Quran v2 — 5-stage method dgn audio syekh Alafasy + voice recognition.
// Surat dibagi chunk max 5 ayat. Tiap chunk lewat 5 stage:
//   1. Listen tiap ayat 3x
//   2. Listen full chunk
//   3. Recite per ayat (voice rec)
//   4. Recite full WITH text visible
//   5. Recite full WITHOUT text (memory)

'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Home, Volume2, Check, Mic, MicOff, BookOpen, Sparkles, ChevronRight, RotateCcw, Star, X, Play, Pause, Lock } from 'lucide-react';
import HafalanMotivasiModal from '@/components/HafalanMotivasiModal';
import { HAFALAN_SURAT } from '@/data/hafalan-surat';
import { QURAN_SURAT } from '@/data/quran-metadata';
import {
  getAyatAudioUrl,
  splitIntoChunks,
  compareArabicSpeech,
  isSpeechRecognitionSupported,
  STAGES,
  REQUIRED_LISTEN_COUNT,
  CHUNK_COMPLETION_REWARD,
} from '@/lib/hafalan-method';
import { isSuratFree, isSuratUnlocked, PREMIUM_UNLOCK_COST } from '@/lib/hafalan-tier';
import { isUserPremium } from '@/lib/feature-flags';

export default function HafalanScreen({
  hafalanProgress = {},
  userProfile,
  coins = 0,
  onBack,
  onHome,
  onChunkComplete,
  onUnlockPremium,
  onShowUnlockModal,
}) {
  const [view, setView] = useState('list'); // list | chunks | memorize
  const [selectedSurat, setSelectedSurat] = useState(null);
  const [selectedChunkIdx, setSelectedChunkIdx] = useState(0);

  if (view === 'memorize' && selectedSurat) {
    const chunks = splitIntoChunks(selectedSurat.ayat);
    const chunk = chunks[selectedChunkIdx];
    return (
      <MemorizeFlow
        surat={selectedSurat}
        chunk={chunk}
        chunkIdx={selectedChunkIdx}
        totalChunks={chunks.length}
        onComplete={() => {
          if (onChunkComplete) {
            // Pass chunk metadata (isFullSurat, isFinalRecap) buat reward dinamis
            onChunkComplete(selectedSurat.id, selectedChunkIdx, {
              isFullSurat: chunk.isFullSurat,
              isFinalRecap: chunk.isFinalRecap,
            });
          }
          setView('chunks');
        }}
        onBack={() => setView('chunks')}
      />
    );
  }

  if (view === 'chunks' && selectedSurat) {
    return (
      <ChunksView
        surat={selectedSurat}
        progress={hafalanProgress[selectedSurat.id] || []}
        onBack={() => setView('list')}
        onHome={onHome}
        onSelectChunk={(idx) => {
          setSelectedChunkIdx(idx);
          setView('memorize');
        }}
      />
    );
  }

  return <ListView
    hafalanProgress={hafalanProgress}
    userProfile={userProfile}
    coins={coins}
    onBack={onBack}
    onHome={onHome}
    onShowUnlockModal={onShowUnlockModal}
    onSelect={(s) => { setSelectedSurat(s); setView('chunks'); }}
  />;
}

// ============================================================================
// LIST VIEW — daftar surat + progress chunk per surat
// ============================================================================
function ListView({ hafalanProgress, userProfile, coins, onBack, onHome, onShowUnlockModal, onSelect }) {
  // Motivasi modal — muncul sekali tiap user masuk Hafalan screen
  const [showMotivasi, setShowMotivasi] = useState(true);
  // Pagination state
  const [page, setPage] = useState(0);
  // Search query — filter surat by name/number
  const [searchQuery, setSearchQuery] = useState('');
  const ITEMS_PER_PAGE = 12;

  // Map seeded content (id-based) ke surat number untuk quick lookup
  const seededByNumber = new Map(HAFALAN_SURAT.map((s) => [s.number, s]));

  // Pisahkan surat: Al-Fatihah, Juz 30, Premium (Juz 1-29)
  const alFatihahMeta = QURAN_SURAT.find((s) => s.number === 1);
  const juz30Surat = QURAN_SURAT.filter((s) => s.number !== 1 && s.juz.includes(30));
  const premiumSurat = QURAN_SURAT.filter((s) => s.number !== 1 && !s.juz.includes(30));
  // Premium aktif (launch / trial / paid / lifetime) → semua surat kebuka.
  const isPremiumUnlocked = isUserPremium(userProfile) || !!userProfile?.hafalanFullUnlocked;

  // Filter by search query (kalau ada)
  const matchSearch = (meta) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      meta.name.toLowerCase().includes(q) ||
      meta.arName.includes(q) || // Arabic name (no lowercasing)
      meta.number.toString() === q ||
      meta.number.toString().includes(q) ||
      meta.meaning.toLowerCase().includes(q)
    );
  };

  // Filtered list — kombinasi Juz 30 dulu lalu Premium
  const filteredJuz30 = juz30Surat.filter(matchSearch);
  const filteredPremium = premiumSurat.filter(matchSearch);
  const alFatihahMatches = matchSearch(alFatihahMeta);
  const paginatedSurat = [...filteredJuz30, ...filteredPremium];

  // Pagination — reset ke page 0 kalau search baru
  const totalPages = Math.max(1, Math.ceil(paginatedSurat.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages - 1);
  const pageStart = safePage * ITEMS_PER_PAGE;
  const currentPageSurat = paginatedSurat.slice(pageStart, pageStart + ITEMS_PER_PAGE);

  // Handler search dgn auto-reset pagination ke page 0
  const handleSearchChange = (q) => {
    setSearchQuery(q);
    setPage(0);
  };

  // Progress: hitung total chunks completed across all hafalan
  const totalChunksCompleted = Object.values(hafalanProgress).reduce(
    (acc, arr) => acc + (Array.isArray(arr) ? arr.length : 0),
    0
  );

  // Handler: tap surat — gating logic
  const handleSelectSurat = (meta) => {
    const seeded = seededByNumber.get(meta.number);
    if (!seeded) {
      alert(`Konten ${meta.name} sedang disiapkan. Akan tersedia di update berikutnya.\n\nUntuk sekarang, coba: Al-Fatihah, Al-Fil, Quraisy, Al-Maun, Al-Kautsar, Al-Kafirun, An-Nasr, Al-Lahab, Al-Ikhlas, Al-Falaq, An-Naas.`);
      return;
    }
    if (!isSuratUnlocked(meta, userProfile)) {
      if (onShowUnlockModal) onShowUnlockModal();
      return;
    }
    onSelect(seeded);
  };

  return (
    <div className="flex-1 flex flex-col px-5 py-6">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <ArrowLeft size={18} style={{ color: '#0a4d3c' }} />
        </button>
        <button onClick={onHome || onBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <Home size={17} style={{ color: '#0a4d3c' }} />
        </button>
        <div className="flex-1">
          <p className="text-xs tracking-widest uppercase" style={{ color: '#8b6b3d' }}>Hafalan Quran</p>
          <h2 className="text-xl font-semibold" style={{ color: '#0a4d3c', fontFamily: 'Fraunces, serif' }}>
            Mari mulai menghafal!
          </h2>
        </div>
      </div>

      <div className="rounded-3xl p-5 mb-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)' }}>
        <div className="absolute -right-6 -top-2 text-7xl opacity-15" style={{ fontFamily: 'Amiri, serif', color: '#c9a961' }}>﷽</div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-white opacity-80 mb-1 font-bold">Hafalan Al-Quran</p>
        <h3 className="text-xl text-white mb-2 leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700 }}>
          Mulai dari Al-Fatihah
        </h3>
        <p className="text-sm text-white opacity-95 leading-relaxed mb-3">
          Audio syekh Alafasy + cek bacaan via mic. <strong>Free: Al-Fatihah + 37 surat Juz Amma</strong>.
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: 'rgba(201,169,97,0.3)' }}>
            <Sparkles size={11} color="#c9a961" />
            <span className="text-xs font-bold text-white">{totalChunksCompleted} sesi dihafal</span>
          </div>
          {isPremiumUnlocked && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.25)' }}>
              <span className="text-xs font-bold text-white">⭐ 30 JUZ UNLOCKED</span>
            </div>
          )}
        </div>
      </div>

      {/* PREMIUM UPSELL CARD — tonjolkan "bayar sekali" pitch */}
      {!isPremiumUnlocked && (
        <button
          onClick={onShowUnlockModal}
          className="w-full text-left rounded-3xl p-5 mb-4 relative overflow-hidden transition-transform active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #c9a961, #d4b876)', boxShadow: '0 10px 30px -10px rgba(201,169,97,0.5)' }}
        >
          <div className="absolute -right-6 -top-4 text-7xl opacity-15">🕌</div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-white opacity-90 mb-1 font-bold">Premium · Bayar Sekali</p>
          <h3 className="text-xl text-white mb-1 leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700 }}>
            Hafal 30 Juz Sampai Bisa
          </h3>
          <p className="text-sm text-white opacity-95 leading-relaxed mb-3">
            Buka 76 surat lainnya (Juz 1-29) — termasuk Al-Baqarah, Yasin, Ar-Rahman, Al-Mulk. <strong>Akses seumur hidup</strong>, tanpa langganan bulanan.
          </p>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white" style={{ color: '#8b6b3d' }}>
            🪙 {PREMIUM_UNLOCK_COST} koin · Sekali Bayar <ChevronRight size={12} />
          </span>
        </button>
      )}

      {/* DROPDOWN SEARCH — pilih surat tanpa mengetik (native picker di mobile) */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {/* Dropdown by Name */}
        <div className="rounded-2xl flex items-center gap-2 px-3 py-2.5 relative" style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.12)' }}>
          <span className="text-base flex-shrink-0">📖</span>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] uppercase tracking-widest font-bold" style={{ color: '#8b6b3d' }}>Cari Nama</p>
            <select
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full outline-none text-sm font-semibold appearance-none cursor-pointer"
              style={{ background: 'transparent', color: '#0a4d3c', WebkitAppearance: 'none' }}
            >
              <option value="">Semua surat</option>
              {QURAN_SURAT.map((s) => (
                <option key={s.number} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <span className="text-xs flex-shrink-0" style={{ color: '#c9a961' }}>▼</span>
        </div>

        {/* Dropdown by Number */}
        <div className="rounded-2xl flex items-center gap-2 px-3 py-2.5 relative" style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.12)' }}>
          <span className="text-base flex-shrink-0">🔢</span>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] uppercase tracking-widest font-bold" style={{ color: '#8b6b3d' }}>Cari Nomor</p>
            <select
              value={/^\d+$/.test(searchQuery) ? searchQuery : ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full outline-none text-sm font-semibold appearance-none cursor-pointer"
              style={{ background: 'transparent', color: '#0a4d3c', WebkitAppearance: 'none' }}
            >
              <option value="">No.</option>
              {QURAN_SURAT.map((s) => (
                <option key={s.number} value={s.number.toString()}>
                  {s.number}. {s.name}
                </option>
              ))}
            </select>
          </div>
          <span className="text-xs flex-shrink-0" style={{ color: '#c9a961' }}>▼</span>
        </div>
      </div>

      {/* Active filter indicator + clear */}
      {searchQuery && (
        <div className="flex items-center justify-between mb-3 px-3 py-2 rounded-xl" style={{ background: 'rgba(201,169,97,0.12)', border: '1px dashed #c9a961' }}>
          <p className="text-xs" style={{ color: '#8b6b3d' }}>
            🎯 Filter aktif: <strong>"{searchQuery}"</strong>
          </p>
          <button onClick={() => handleSearchChange('')} className="text-xs font-bold" style={{ color: '#a05536' }}>
            ✕ Reset
          </button>
        </div>
      )}

      {/* AL-FATIHAH — always shown at top (kecuali pas search & ga match) */}
      {(!searchQuery || alFatihahMatches) && (
        <>
          <p className="text-xs tracking-widest uppercase mb-3 flex items-center gap-2" style={{ color: '#0a4d3c' }}>
            🌟 Permulaan — Surat Al-Fatihah
          </p>
          <div className="mb-5">
            <SuratCard
              meta={alFatihahMeta}
              seeded={seededByNumber.get(1)}
              progress={hafalanProgress[seededByNumber.get(1)?.id] || []}
              isUnlocked={true}
              onSelect={() => handleSelectSurat(alFatihahMeta)}
              accentColor="#c9a961"
              isStarter
            />
          </div>
        </>
      )}

      {/* PAGINATED SURAT LIST */}
      {paginatedSurat.length > 0 ? (
        <>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs tracking-widest uppercase" style={{ color: '#8b6b3d' }}>
              {searchQuery
                ? `Hasil pencarian (${paginatedSurat.length})`
                : `Daftar Surat — Halaman ${safePage + 1}/${totalPages}`}
            </p>
            {!searchQuery && (
              <span className="text-[10px] font-semibold" style={{ color: '#8b6b3d' }}>
                {pageStart + 1}–{Math.min(pageStart + ITEMS_PER_PAGE, paginatedSurat.length)} dari {paginatedSurat.length}
              </span>
            )}
          </div>

          {/* Page tabs — horizontal scrollable */}
          {totalPages > 1 && (
            <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {Array.from({ length: totalPages }).map((_, i) => {
                const isActive = i === safePage;
                return (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className="px-3 py-1.5 rounded-full text-xs font-bold flex-shrink-0 transition-all"
                    style={{
                      background: isActive ? '#0a4d3c' : 'rgba(10,77,60,0.08)',
                      color: isActive ? 'white' : '#0a4d3c',
                    }}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          )}

          <div className="space-y-2 mb-4">
            {currentPageSurat.map((meta) => {
              const seeded = seededByNumber.get(meta.number);
              const isFree = meta.juz.includes(30);
              const isUnlocked = isFree || isPremiumUnlocked;
              return (
                <SuratCard
                  key={meta.number}
                  meta={meta}
                  seeded={seeded}
                  progress={seeded ? (hafalanProgress[seeded.id] || []) : []}
                  isUnlocked={isUnlocked}
                  onSelect={() => handleSelectSurat(meta)}
                />
              );
            })}
          </div>

          {/* Prev/Next buttons */}
          {totalPages > 1 && (
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={safePage === 0}
                className="flex-1 py-3 rounded-2xl text-sm font-semibold disabled:opacity-40"
                style={{ background: 'rgba(10,77,60,0.08)', color: '#0a4d3c' }}
              >
                ← Sebelumnya
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={safePage >= totalPages - 1}
                className="flex-1 py-3 rounded-2xl text-sm font-semibold disabled:opacity-40 text-white"
                style={{ background: '#0a4d3c' }}
              >
                Berikutnya →
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-2xl p-6 mb-4 text-center" style={{ background: 'rgba(10,77,60,0.05)' }}>
          <p className="text-4xl mb-2">🔍</p>
          <p className="text-sm font-semibold mb-1" style={{ color: '#0a4d3c' }}>Tidak ada surat ditemukan</p>
          <p className="text-xs" style={{ color: '#8b6b3d' }}>
            Coba kata kunci lain — nama surat, nomor, atau arti.
          </p>
        </div>
      )}

      <p className="text-[11px] text-center mt-4 italic" style={{ color: '#8b6b3d' }}>
        "Sebaik-baik kalian adalah yang belajar Al-Quran dan mengajarkannya" — HR. Bukhari
      </p>

      {/* Motivasi modal — muncul pas pertama buka */}
      {showMotivasi && <HafalanMotivasiModal onClose={() => setShowMotivasi(false)} />}
    </div>
  );
}

// ============================================================================
// SURAT CARD — display 1 surat dgn lock state, progress, content readiness
// ============================================================================
function SuratCard({ meta, seeded, progress, isUnlocked, onSelect, accentColor, isStarter }) {
  const chunks = seeded ? splitIntoChunks(seeded.ayat) : [];
  const completedChunks = progress.length;
  const totalChunks = chunks.length;
  const isComplete = totalChunks > 0 && completedChunks >= totalChunks;
  const percent = totalChunks > 0 ? Math.round((completedChunks / totalChunks) * 100) : 0;
  const hasContent = !!seeded;

  // Visual styling
  const cardBorder = !isUnlocked
    ? '1.5px dashed rgba(139,107,61,0.3)'
    : isComplete
    ? '1.5px solid #c9a961'
    : isStarter
    ? '2px solid #c9a961'
    : '1.5px solid rgba(10,77,60,0.1)';

  const iconBg = !isUnlocked
    ? 'rgba(139,107,61,0.15)'
    : isComplete
    ? 'linear-gradient(135deg, #c9a961, #d4b876)'
    : isStarter
    ? 'linear-gradient(135deg, #c9a961, #d4b876)'
    : 'linear-gradient(135deg, #0a4d3c, #1a6b56)';

  const iconContent = !isUnlocked ? '🔒' : isComplete ? '⭐' : isStarter ? '🌟' : meta.number;

  return (
    <button
      onClick={onSelect}
      className="w-full p-4 rounded-2xl text-left flex items-center gap-3 transition-transform active:scale-[0.98]"
      style={{
        background: 'white',
        border: cardBorder,
        opacity: !isUnlocked ? 0.7 : 1,
      }}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-base font-bold flex-shrink-0"
        style={{ background: iconBg, color: !isUnlocked ? '#8b6b3d' : 'white', fontFamily: 'Fraunces, serif' }}
      >
        {iconContent}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <p className="font-semibold text-base leading-tight" style={{ color: !isUnlocked ? '#8b6b3d' : '#0a4d3c' }}>
            {meta.number}. {meta.name}
          </p>
          <span className="text-base" style={{ fontFamily: 'Amiri, serif', color: !isUnlocked ? '#a87f47' : '#c9a961' }}>
            {meta.arName}
          </span>
        </div>
        <p className="text-[11px] leading-snug" style={{ color: '#666' }}>
          {meta.totalAyat} ayat · {meta.meaning}
          {!hasContent && isUnlocked && <span style={{ color: '#a05536' }}> · Konten segera datang</span>}
        </p>
        {hasContent && isUnlocked && totalChunks > 0 && (
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(10,77,60,0.1)' }}>
              <div className="h-full transition-all rounded-full" style={{ width: `${percent}%`, background: isComplete ? '#c9a961' : '#0a4d3c' }} />
            </div>
            <span className="text-[10px] font-bold" style={{ color: '#8b6b3d' }}>
              {completedChunks}/{totalChunks}
            </span>
          </div>
        )}
      </div>
      {!isUnlocked ? (
        <Lock size={14} style={{ color: '#8b6b3d', opacity: 0.6 }} className="flex-shrink-0" />
      ) : (
        <ChevronRight size={16} style={{ color: '#c9a961' }} className="flex-shrink-0" />
      )}
    </button>
  );
}

// ============================================================================
// CHUNKS VIEW — daftar chunks dalam 1 surat
// ============================================================================
function ChunksView({ surat, progress = [], onBack, onHome, onSelectChunk }) {
  const chunks = splitIntoChunks(surat.ayat);
  return (
    <div className="flex-1 flex flex-col px-5 py-6">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <ArrowLeft size={18} style={{ color: '#0a4d3c' }} />
        </button>
        <button onClick={onHome || onBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <Home size={17} style={{ color: '#0a4d3c' }} />
        </button>
        <div className="flex-1">
          <p className="text-xs tracking-widest uppercase" style={{ color: '#8b6b3d' }}>Surat {surat.number}</p>
          <h2 className="text-xl font-semibold" style={{ color: '#0a4d3c', fontFamily: 'Fraunces, serif' }}>
            {surat.name}
          </h2>
        </div>
      </div>

      <div className="rounded-3xl p-5 mb-4 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)' }}>
        <div className="absolute -right-2 -top-2 text-7xl opacity-15" style={{ fontFamily: 'Amiri, serif', color: '#c9a961' }}>﷽</div>
        <p className="text-4xl mb-1 text-white" style={{ fontFamily: 'Amiri, serif' }}>{surat.arName}</p>
        <p className="text-xs text-white opacity-90 mb-2">{surat.meaning} · {surat.totalAyat} ayat</p>
        <p className="text-xs text-white opacity-80 italic">{surat.description}</p>
      </div>

      <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#8b6b3d' }}>
        Pilih Bagian ({chunks.length} sesi)
      </p>
      <div className="space-y-3">
        {chunks.map((chunk, idx) => {
          const isCompleted = progress.includes(idx);
          const isLocked = idx > 0 && !progress.includes(idx - 1);
          // Visual styling khusus untuk Recap Final (lebih emas, "ujian akhir")
          const isRecap = chunk.isFinalRecap;
          const isFullSurat = chunk.isFullSurat;
          const chunkLabel = isRecap
            ? '🏆 Recap Final — Hafalan Penuh'
            : isFullSurat
            ? `Surat Lengkap · ${chunk.ayat.length} ayat`
            : `Sesi ${idx + 1} · Ayat ${chunk.startAyat}–${chunk.endAyat}`;
          const chunkDetail = isRecap
            ? `Bacakan SELURUH ${chunk.ayat.length} ayat dari hafalan — ujian penutup`
            : isFullSurat
            ? `${chunk.ayat.length} ayat full · 5 tahap metode hafalan`
            : `${chunk.ayat.length} ayat · 5 tahap metode hafalan`;
          const chunkEmoji = isCompleted ? '⭐' : isLocked ? '🔒' : isRecap ? '🏆' : isFullSurat ? '📚' : '📖';
          const chunkGradient = isCompleted
            ? 'linear-gradient(135deg, #c9a961, #d4b876)'
            : isLocked
            ? 'rgba(139,107,61,0.15)'
            : isRecap
            ? 'linear-gradient(135deg, #c9a961, #a87f47)'
            : 'linear-gradient(135deg, #0a4d3c, #1a6b56)';

          return (
            <button
              key={idx}
              onClick={() => !isLocked && onSelectChunk(idx)}
              disabled={isLocked}
              className="w-full p-4 rounded-2xl text-left flex items-center gap-3 transition-transform active:scale-[0.98] disabled:active:scale-100"
              style={{
                background: 'white',
                border: isCompleted
                  ? '1.5px solid #c9a961'
                  : isLocked
                  ? '1.5px dashed rgba(139,107,61,0.3)'
                  : isRecap
                  ? '2px solid #c9a961'
                  : '1.5px solid rgba(10,77,60,0.12)',
                opacity: isLocked ? 0.6 : 1,
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: chunkGradient }}
              >
                {chunkEmoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                  <p className="font-semibold text-base leading-tight" style={{ color: isRecap ? '#c9a961' : '#0a4d3c' }}>
                    {chunkLabel}
                  </p>
                  {isFullSurat && !isRecap && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(10,77,60,0.1)', color: '#0a4d3c' }}>
                      PENUH
                    </span>
                  )}
                  {isRecap && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(201,169,97,0.25)', color: '#8b6b3d' }}>
                      UJIAN
                    </span>
                  )}
                </div>
                <p className="text-xs leading-snug" style={{ color: '#666' }}>
                  {chunkDetail}
                </p>
                {isCompleted && (
                  <p className="text-[11px] mt-1 font-bold" style={{ color: '#c9a961' }}>
                    ✓ Sudah dihafal
                  </p>
                )}
                {isLocked && (
                  <p className="text-[11px] mt-1 font-bold" style={{ color: '#8b6b3d' }}>
                    Selesaikan sesi sebelumnya dulu
                  </p>
                )}
              </div>
              {!isLocked && <ChevronRight size={16} style={{ color: '#c9a961' }} className="flex-shrink-0" />}
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl p-3 mt-4" style={{ background: 'rgba(201,169,97,0.1)', border: '1px dashed #c9a961' }}>
        <p className="text-[10px] tracking-widest uppercase font-bold mb-1.5" style={{ color: '#c9a961' }}>5 Tahap per Chunk</p>
        <ul className="text-xs space-y-1" style={{ color: '#8b6b3d' }}>
          <li>1. 🎧 Dengar tiap ayat min 3x</li>
          <li>2. 📻 Dengar utuh sekaligus</li>
          <li>3. 🎤 Baca per ayat — cek bacaanmu</li>
          <li>4. 📖 Baca utuh dengan teks</li>
          <li>5. 🌟 Hafalan penuh tanpa teks</li>
        </ul>
      </div>
    </div>
  );
}

// ============================================================================
// MEMORIZE FLOW — orchestrator untuk 5 stage
// ============================================================================
function MemorizeFlow({ surat, chunk, chunkIdx, totalChunks, onComplete, onBack }) {
  const [stageId, setStageId] = useState(1);
  const totalStages = STAGES.length;

  const advanceStage = () => {
    if (stageId < totalStages) {
      setStageId(stageId + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Sticky header */}
      <div className="px-5 pt-5 pb-3" style={{ background: 'linear-gradient(180deg, #faf6ee 0%, rgba(250,246,238,0.95) 100%)' }}>
        <div className="flex items-center justify-between mb-2">
          <button onClick={onBack} className="text-xs font-semibold flex items-center gap-1" style={{ color: '#8b6b3d' }}>
            <ArrowLeft size={14} /> Keluar
          </button>
          <p className="text-xs tracking-widest uppercase font-bold text-center flex-1 mx-2" style={{ color: chunk.isFinalRecap ? '#c9a961' : '#0a4d3c' }}>
            {chunk.isFinalRecap
              ? `🏆 Recap · ${surat.name}`
              : chunk.isFullSurat
              ? `📚 ${surat.name} (Penuh)`
              : `Sesi ${chunkIdx + 1}/${totalChunks} · ${surat.name}`}
          </p>
          <span className="text-[10px] font-semibold" style={{ color: '#8b6b3d' }}>
            Tahap {stageId}/{totalStages}
          </span>
        </div>

        {/* Stage progress dots */}
        <div className="flex gap-1 mb-2">
          {STAGES.map((s) => (
            <div
              key={s.id}
              className="flex-1 h-1.5 rounded-full transition-all"
              style={{
                background: s.id < stageId ? '#c9a961' : s.id === stageId ? '#0a4d3c' : 'rgba(10,77,60,0.15)',
              }}
            />
          ))}
        </div>

        {/* Stage label */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-lg">{STAGES.find((s) => s.id === stageId).emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold" style={{ color: '#0a4d3c' }}>
              {STAGES.find((s) => s.id === stageId).label}
            </p>
            <p className="text-[11px] leading-tight" style={{ color: '#8b6b3d' }}>
              {STAGES.find((s) => s.id === stageId).desc}
            </p>
          </div>
        </div>
      </div>

      {/* Stage content */}
      <div className="flex-1 overflow-y-auto">
        {stageId === 1 && <Stage1ListenEach surat={surat} chunk={chunk} onComplete={advanceStage} />}
        {stageId === 2 && <Stage2ListenFull surat={surat} chunk={chunk} onComplete={advanceStage} />}
        {stageId === 3 && <Stage3ReciteEach surat={surat} chunk={chunk} onComplete={advanceStage} />}
        {stageId === 4 && <Stage4ReciteFullVisible surat={surat} chunk={chunk} onComplete={advanceStage} />}
        {stageId === 5 && <Stage5ReciteMemory surat={surat} chunk={chunk} onComplete={advanceStage} />}
      </div>
    </div>
  );
}

// ============================================================================
// STAGE 1 — Listen each ayat min 3x, auto-advance
// ============================================================================
function Stage1ListenEach({ surat, chunk, onComplete }) {
  const [ayatIdx, setAyatIdx] = useState(0);
  const [listenCount, setListenCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const currentAyat = chunk.ayat[ayatIdx];
  const audioUrl = getAyatAudioUrl(surat.number, currentAyat.num);
  const isFinishedAyat = listenCount >= REQUIRED_LISTEN_COUNT;
  const isFinishedAll = ayatIdx >= chunk.ayat.length - 1 && isFinishedAyat;

  // Reset audio state pas ganti ayat — supaya audio element re-load src baru
  useEffect(() => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.load(); // re-load src dari attribute
    }
  }, [ayatIdx]);

  // Play audio dgn proper Promise handling (untuk iOS Safari & Chrome quirks).
  // Setelah audio pernah selesai, play() bisa reject — kita handle dengan load() retry.
  const playAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    const playPromise = audio.play();
    if (playPromise instanceof Promise) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Audio play failed, retry dgn load():', err?.message);
          // Fallback: force re-load src lalu play lagi
          audio.load();
          audio
            .play()
            .then(() => setIsPlaying(true))
            .catch((err2) => {
              console.error('Audio play retry failed:', err2);
              setIsPlaying(false);
            });
        });
    } else {
      setIsPlaying(true);
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    setListenCount((c) => c + 1);
  };

  const advanceAyat = () => {
    if (ayatIdx < chunk.ayat.length - 1) {
      setAyatIdx(ayatIdx + 1);
      setListenCount(0);
    } else {
      onComplete();
    }
  };

  return (
    <div className="px-5 py-4">
      <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: '#8b6b3d' }}>Ayat {currentAyat.num}</p>

      {/* Ayat card */}
      <div className="rounded-2xl p-5 mb-4" style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.1)' }}>
        <p className="leading-relaxed mb-3" style={{ fontFamily: 'Amiri, serif', fontSize: '28px', color: '#0a4d3c', direction: 'rtl', textAlign: 'right' }}>
          {currentAyat.ar}
        </p>
        <p className="text-sm italic mb-2" style={{ color: '#a87f47' }}>
          {currentAyat.latin}
        </p>
        <p className="text-xs leading-relaxed" style={{ color: '#3d2817' }}>
          {currentAyat.id}
        </p>
      </div>

      {/* Audio control */}
      <audio ref={audioRef} src={audioUrl} onEnded={handleAudioEnd} preload="auto" />
      <button
        onClick={playAudio}
        disabled={isPlaying}
        className="w-full py-5 rounded-2xl flex items-center justify-center gap-3 mb-3 transition-transform active:scale-[0.98] disabled:opacity-70"
        style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)', color: 'white' }}
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} fill="white" />}
        <span className="font-bold text-base">
          {isPlaying ? 'Sedang diputar...' : listenCount === 0 ? 'Putar Audio Ayat' : 'Putar Lagi'}
        </span>
      </button>

      {/* Listen counter */}
      <div className="rounded-2xl p-4 mb-4 text-center" style={{ background: 'rgba(201,169,97,0.1)', border: '1.5px dashed #c9a961' }}>
        <p className="text-[10px] uppercase tracking-widest font-bold mb-1" style={{ color: '#c9a961' }}>Hitungan Dengar</p>
        <div className="flex items-center justify-center gap-2 mb-2">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
              style={{
                background: n <= listenCount ? '#c9a961' : 'rgba(201,169,97,0.2)',
                color: n <= listenCount ? 'white' : '#8b6b3d',
              }}
            >
              {n <= listenCount ? '✓' : n}
            </div>
          ))}
        </div>
        <p className="text-xs" style={{ color: '#8b6b3d' }}>
          {isFinishedAyat ? '✨ Sudah cukup! Lanjutkan ke ayat berikutnya.' : `Dengar ${REQUIRED_LISTEN_COUNT - listenCount}x lagi minimal`}
        </p>
      </div>

      {/* Advance button */}
      {isFinishedAyat && (
        <button
          onClick={advanceAyat}
          className="w-full py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2"
          style={{ background: '#c9a961' }}
        >
          {isFinishedAll ? 'Lanjut Tahap 2 — Dengar Penuh' : `Lanjut Ayat ${chunk.ayat[ayatIdx + 1]?.num}`}
          <ChevronRight size={18} />
        </button>
      )}

      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-1 mt-4">
        {chunk.ayat.map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{
              background: i < ayatIdx ? '#c9a961' : i === ayatIdx ? '#0a4d3c' : 'rgba(10,77,60,0.15)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// STAGE 2 — Listen full chunk (semua ayat berurutan)
// ============================================================================
function Stage2ListenFull({ surat, chunk, onComplete }) {
  const [playingIdx, setPlayingIdx] = useState(-1);
  const [hasListenedFull, setHasListenedFull] = useState(false);
  const audioRef = useRef(null);

  const playAll = () => {
    setPlayingIdx(0);
    playAyatAt(0);
  };

  const playAyatAt = (idx) => {
    if (idx >= chunk.ayat.length) {
      setPlayingIdx(-1);
      setHasListenedFull(true);
      return;
    }
    setPlayingIdx(idx);
    const audio = audioRef.current;
    if (!audio) return;
    // Set src baru + load + play dgn Promise handling
    audio.pause();
    audio.src = getAyatAudioUrl(surat.number, chunk.ayat[idx].num);
    audio.load();
    const playPromise = audio.play();
    if (playPromise instanceof Promise) {
      playPromise.catch((err) => {
        console.warn('Sequential play failed:', err?.message);
        // Skip ke ayat berikutnya kalau gagal
        setTimeout(() => playAyatAt(idx + 1), 200);
      });
    }
  };

  const handleEnded = () => {
    playAyatAt(playingIdx + 1);
  };

  return (
    <div className="px-5 py-4">
      <audio ref={audioRef} onEnded={handleEnded} preload="auto" />

      {/* Full chunk text */}
      <div className="rounded-2xl p-5 mb-4 space-y-3" style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.1)' }}>
        {chunk.ayat.map((a, i) => {
          const isCurrent = playingIdx === i;
          const isPast = playingIdx > i || (playingIdx === -1 && hasListenedFull);
          return (
            <div
              key={a.num}
              className="pb-3 transition-all"
              style={{
                borderBottom: i < chunk.ayat.length - 1 ? '1px solid rgba(10,77,60,0.08)' : 'none',
                opacity: isCurrent ? 1 : isPast ? 0.5 : 0.8,
                background: isCurrent ? 'rgba(201,169,97,0.08)' : 'transparent',
                margin: isCurrent ? '0 -8px' : '0',
                padding: isCurrent ? '8px' : '0 0 12px 0',
                borderRadius: isCurrent ? '12px' : '0',
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: isCurrent ? '#0a4d3c' : 'rgba(10,77,60,0.1)', color: isCurrent ? 'white' : '#0a4d3c' }}>
                  {a.num}
                </div>
                {isCurrent && <span className="text-xs font-bold animate-pulse" style={{ color: '#0a4d3c' }}>🔊 Sedang diputar</span>}
              </div>
              <p className="leading-relaxed" style={{ fontFamily: 'Amiri, serif', fontSize: '20px', color: '#0a4d3c', direction: 'rtl', textAlign: 'right' }}>
                {a.ar}
              </p>
            </div>
          );
        })}
      </div>

      {/* Play full button */}
      <button
        onClick={playAll}
        disabled={playingIdx >= 0}
        className="w-full py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 mb-3 disabled:opacity-70"
        style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)' }}
      >
        {playingIdx >= 0 ? <><Pause size={18} /> Memutar ayat {chunk.ayat[playingIdx]?.num}...</> : <><Play size={18} fill="white" /> Putar Semua Ayat</>}
      </button>

      {/* Status */}
      {hasListenedFull && (
        <div className="rounded-2xl p-3 mb-3 text-center" style={{ background: 'rgba(10,77,60,0.06)', border: '1px solid rgba(10,77,60,0.15)' }}>
          <p className="text-sm font-bold" style={{ color: '#0a4d3c' }}>✓ Sudah dengar penuh!</p>
          <p className="text-xs mt-0.5" style={{ color: '#8b6b3d' }}>Putar lagi kalau perlu, atau lanjut ke tahap baca.</p>
        </div>
      )}

      <button
        onClick={onComplete}
        disabled={!hasListenedFull}
        className="w-full py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
        style={{ background: '#c9a961' }}
      >
        Lanjut Tahap 3 — Baca per Ayat <ChevronRight size={18} />
      </button>
    </div>
  );
}

// ============================================================================
// STAGE 3 — Recite per ayat (voice recognition)
// ============================================================================
function Stage3ReciteEach({ surat, chunk, onComplete }) {
  const [ayatIdx, setAyatIdx] = useState(0);
  const [recognized, setRecognized] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState(''); // live transcript display
  const recognitionRef = useRef(null);
  const transcriptRef = useRef(''); // accumulate full transcript

  const supported = isSpeechRecognitionSupported();
  const currentAyat = chunk.ayat[ayatIdx];
  const isFinishedAll = ayatIdx >= chunk.ayat.length;

  useEffect(() => {
    if (!supported || typeof window === 'undefined') return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    // continuous=true — user kontrol kapan stop, gak auto-cut pas ada pause
    rec.continuous = true;
    rec.interimResults = true; // live preview
    rec.lang = 'ar-SA';
    rec.maxAlternatives = 1;

    rec.onresult = (event) => {
      let finalChunk = '';
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) {
          finalChunk += res[0].transcript + ' ';
        } else {
          interim += res[0].transcript;
        }
      }
      if (finalChunk) {
        transcriptRef.current += finalChunk;
      }
      // Live preview text
      setInterimText((transcriptRef.current + interim).trim());
    };

    rec.onerror = (e) => {
      console.warn('Speech recognition error:', e?.error);
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
      // Compare hasil accumulated transcript
      const fullTranscript = transcriptRef.current.trim();
      if (fullTranscript) {
        const result = compareArabicSpeech(fullTranscript, currentAyat.ar);
        setRecognized({ transcript: fullTranscript, ...result });
      }
    };

    recognitionRef.current = rec;
    return () => {
      try { rec.stop(); } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ayatIdx, supported]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      // STOP — trigger onend which evaluates result
      try { recognitionRef.current.stop(); } catch {}
    } else {
      // START — reset state, start fresh
      setRecognized(null);
      setInterimText('');
      transcriptRef.current = '';
      setIsListening(true);
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Start recognition failed:', e?.message);
        setIsListening(false);
      }
    }
  };

  const advanceAyat = () => {
    setAyatIdx(ayatIdx + 1);
    setRecognized(null);
    setInterimText('');
    transcriptRef.current = '';
  };

  const skipAyat = () => {
    advanceAyat();
  };

  if (isFinishedAll) {
    return (
      <div className="px-5 py-6 text-center">
        <div className="text-6xl mb-3">✨</div>
        <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Fraunces, serif', color: '#0a4d3c' }}>
          Semua ayat sudah dibaca!
        </h3>
        <p className="text-sm mb-6" style={{ color: '#8b6b3d' }}>
          Lanjut ke tahap baca penuh dengan teks.
        </p>
        <button
          onClick={onComplete}
          className="w-full max-w-xs py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 mx-auto"
          style={{ background: '#c9a961' }}
        >
          Lanjut Tahap 4 <ChevronRight size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="px-5 py-4">
      <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: '#8b6b3d' }}>
        Bacakan Ayat {currentAyat.num} ({ayatIdx + 1}/{chunk.ayat.length})
      </p>

      {/* Ayat card */}
      <div className="rounded-2xl p-5 mb-4" style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.1)' }}>
        <p className="leading-relaxed mb-2" style={{ fontFamily: 'Amiri, serif', fontSize: '26px', color: '#0a4d3c', direction: 'rtl', textAlign: 'right' }}>
          {currentAyat.ar}
        </p>
        <p className="text-xs italic" style={{ color: '#a87f47' }}>{currentAyat.latin}</p>
      </div>

      {!supported && (
        <div className="rounded-2xl p-3 mb-3" style={{ background: 'rgba(160,85,54,0.12)', border: '1px solid rgba(160,85,54,0.25)' }}>
          <p className="text-xs leading-relaxed" style={{ color: '#a05536' }}>
            Browser kamu belum support voice recognition. Skip tahap ini dengan tombol di bawah.
          </p>
        </div>
      )}

      {/* Mic button — toggle on/off, user kontrol kapan selesai */}
      {supported && (
        <button
          onClick={toggleListening}
          className="w-full py-6 rounded-2xl flex flex-col items-center justify-center gap-2 mb-2 transition-transform active:scale-[0.98]"
          style={{ background: isListening ? 'linear-gradient(135deg, #c64545, #e76b6b)' : 'linear-gradient(135deg, #0a4d3c, #1a6b56)', color: 'white' }}
        >
          {isListening ? <MicOff size={32} className="animate-pulse" /> : <Mic size={32} />}
          <span className="font-bold text-base">
            {isListening ? 'Tap untuk Berhenti & Cek' : 'Tap untuk Mulai Bacakan'}
          </span>
          {isListening && (
            <>
              <span className="text-xs opacity-90 italic">
                🔴 Sedang merekam... bacakan dengan tenang
              </span>
              <MicLevelBars isActive={isListening} />
            </>
          )}
        </button>
      )}

      {/* Live transcript display saat masih listening */}
      {isListening && interimText && (
        <div className="rounded-2xl p-3 mb-3" style={{ background: 'rgba(10,77,60,0.05)', border: '1px dashed rgba(10,77,60,0.2)' }}>
          <p className="text-[10px] uppercase tracking-widest font-bold mb-1" style={{ color: '#8b6b3d' }}>Live (sambil baca):</p>
          <p className="text-sm" style={{ fontFamily: 'Amiri, serif', color: '#0a4d3c', direction: 'rtl', textAlign: 'right' }}>
            {interimText}
          </p>
        </div>
      )}

      {/* Result feedback */}
      {recognized && (
        <div
          className="rounded-2xl p-4 mb-3"
          style={{
            background: recognized.isMatch ? 'rgba(10,77,60,0.08)' : 'rgba(160,85,54,0.12)',
            border: `1.5px solid ${recognized.isMatch ? '#0a4d3c' : '#a05536'}`,
          }}
        >
          <p className="text-sm font-bold mb-1" style={{ color: recognized.isMatch ? '#0a4d3c' : '#a05536' }}>
            {recognized.isMatch ? '✓ Bacaanmu cukup tepat!' : '✗ Belum sesuai, coba lagi'}
          </p>
          <p className="text-[11px]" style={{ color: '#666' }}>
            Kemiripan: {Math.round(recognized.similarity * 100)}%
          </p>
          {recognized.transcript && (
            <p className="text-xs mt-1" style={{ color: '#3d2817', fontFamily: 'Amiri, serif', direction: 'rtl' }}>
              Terdengar: "{recognized.transcript}"
            </p>
          )}
        </div>
      )}

      <div className="flex gap-2">
        {recognized?.isMatch && (
          <button
            onClick={advanceAyat}
            className="flex-1 py-3.5 rounded-2xl text-white font-bold flex items-center justify-center gap-1.5"
            style={{ background: '#c9a961' }}
          >
            Lanjut <ChevronRight size={16} />
          </button>
        )}
        <button
          onClick={skipAyat}
          className="flex-1 py-3.5 rounded-2xl text-sm font-semibold"
          style={{ background: 'rgba(10,77,60,0.08)', color: '#0a4d3c' }}
        >
          Lewati ayat
        </button>
      </div>

      <p className="text-[11px] text-center mt-3 italic" style={{ color: '#8b6b3d' }}>
        Tip: bacakan dengan jelas, browser pakai voice recognition AI
      </p>
    </div>
  );
}

// ============================================================================
// STAGE 4 — Recite full WITH text visible
// ============================================================================
function Stage4ReciteFullVisible({ surat, chunk, onComplete }) {
  const [recognized, setRecognized] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [hasTried, setHasTried] = useState(false);
  const [interimText, setInterimText] = useState('');
  const recognitionRef = useRef(null);
  const transcriptRef = useRef('');
  const supported = isSpeechRecognitionSupported();

  const fullText = chunk.ayat.map((a) => a.ar).join(' ');

  useEffect(() => {
    if (!supported || typeof window === 'undefined') return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = 'ar-SA';
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (event) => {
      let finalChunk = '';
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) finalChunk += res[0].transcript + ' ';
        else interim += res[0].transcript;
      }
      if (finalChunk) transcriptRef.current += finalChunk;
      setInterimText((transcriptRef.current + interim).trim());
    };
    rec.onerror = (e) => {
      console.warn('Recognition error:', e?.error);
      setIsListening(false);
    };
    rec.onend = () => {
      setIsListening(false);
      const fullTranscript = transcriptRef.current.trim();
      if (fullTranscript) {
        const result = compareArabicSpeech(fullTranscript, fullText);
        setRecognized({ transcript: fullTranscript, ...result });
        setHasTried(true);
      }
    };
    recognitionRef.current = rec;
    return () => { try { rec.stop(); } catch {} };
  }, [supported, fullText]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      try { recognitionRef.current.stop(); } catch {}
    } else {
      setRecognized(null);
      setInterimText('');
      transcriptRef.current = '';
      setIsListening(true);
      try {
        recognitionRef.current.start();
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  return (
    <div className="px-5 py-4">
      <div className="rounded-2xl p-4 mb-4 space-y-2" style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.1)' }}>
        <p className="text-[10px] uppercase tracking-widest font-bold mb-1" style={{ color: '#c9a961' }}>Baca semuanya:</p>
        {chunk.ayat.map((a) => (
          <div key={a.num} className="flex items-start gap-2 pb-2" style={{ borderBottom: '1px solid rgba(10,77,60,0.06)' }}>
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-1" style={{ background: 'rgba(10,77,60,0.1)', color: '#0a4d3c' }}>
              {a.num}
            </span>
            <p className="flex-1" style={{ fontFamily: 'Amiri, serif', fontSize: '20px', color: '#0a4d3c', direction: 'rtl', textAlign: 'right' }}>
              {a.ar}
            </p>
          </div>
        ))}
      </div>

      {!supported && (
        <div className="rounded-2xl p-3 mb-3" style={{ background: 'rgba(160,85,54,0.12)', border: '1px solid rgba(160,85,54,0.25)' }}>
          <p className="text-xs leading-relaxed" style={{ color: '#a05536' }}>
            Voice recognition ga didukung. Skip tahap ini.
          </p>
        </div>
      )}

      {supported && (
        <button
          onClick={toggleListening}
          className="w-full py-5 rounded-2xl flex flex-col items-center justify-center gap-2 mb-2 transition-transform active:scale-[0.98]"
          style={{ background: isListening ? 'linear-gradient(135deg, #c64545, #e76b6b)' : 'linear-gradient(135deg, #0a4d3c, #1a6b56)', color: 'white' }}
        >
          {isListening ? <MicOff size={22} className="animate-pulse" /> : <Mic size={22} />}
          <span className="font-bold text-base">
            {isListening ? 'Tap untuk Berhenti & Cek' : 'Tap untuk Mulai Bacakan'}
          </span>
          {isListening && (
            <>
              <span className="text-xs opacity-90 italic">🔴 Bacakan dengan tenang — gak ada batas waktu</span>
              <MicLevelBars isActive={isListening} />
            </>
          )}
        </button>
      )}

      {/* Live transcript preview */}
      {isListening && interimText && (
        <div className="rounded-2xl p-3 mb-3" style={{ background: 'rgba(10,77,60,0.05)', border: '1px dashed rgba(10,77,60,0.2)' }}>
          <p className="text-[10px] uppercase tracking-widest font-bold mb-1" style={{ color: '#8b6b3d' }}>Live:</p>
          <p className="text-sm" style={{ fontFamily: 'Amiri, serif', color: '#0a4d3c', direction: 'rtl', textAlign: 'right' }}>
            {interimText}
          </p>
        </div>
      )}

      {recognized && (
        <div
          className="rounded-2xl p-3 mb-3"
          style={{
            background: recognized.isMatch ? 'rgba(10,77,60,0.08)' : 'rgba(201,169,97,0.12)',
            border: `1.5px solid ${recognized.isMatch ? '#0a4d3c' : '#c9a961'}`,
          }}
        >
          <p className="text-sm font-bold mb-1" style={{ color: recognized.isMatch ? '#0a4d3c' : '#8b6b3d' }}>
            {recognized.isMatch ? '✓ Bacaanmu sudah baik!' : `${Math.round(recognized.similarity * 100)}% mirip — bisa lebih baik`}
          </p>
          {recognized.transcript && (
            <p className="text-xs mt-1" style={{ color: '#3d2817', fontFamily: 'Amiri, serif', direction: 'rtl' }}>
              "{recognized.transcript}"
            </p>
          )}
        </div>
      )}

      <button
        onClick={onComplete}
        disabled={!hasTried && supported}
        className="w-full py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
        style={{ background: '#c9a961' }}
      >
        Lanjut Tahap Final <ChevronRight size={18} />
      </button>
    </div>
  );
}

// ============================================================================
// STAGE 5 — Recite from MEMORY (no Arabic text, only translation cue)
// ============================================================================
function Stage5ReciteMemory({ surat, chunk, onComplete }) {
  const [recognized, setRecognized] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [hasTried, setHasTried] = useState(false);
  const [interimText, setInterimText] = useState('');
  const recognitionRef = useRef(null);
  const transcriptRef = useRef('');
  const supported = isSpeechRecognitionSupported();

  const fullText = chunk.ayat.map((a) => a.ar).join(' ');

  useEffect(() => {
    if (!supported || typeof window === 'undefined') return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = 'ar-SA';
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (event) => {
      let finalChunk = '';
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) finalChunk += res[0].transcript + ' ';
        else interim += res[0].transcript;
      }
      if (finalChunk) transcriptRef.current += finalChunk;
      setInterimText((transcriptRef.current + interim).trim());
    };
    rec.onerror = (e) => {
      console.warn('Recognition error:', e?.error);
      setIsListening(false);
    };
    rec.onend = () => {
      setIsListening(false);
      const fullTranscript = transcriptRef.current.trim();
      if (fullTranscript) {
        const result = compareArabicSpeech(fullTranscript, fullText);
        setRecognized({ transcript: fullTranscript, ...result });
        setHasTried(true);
      }
    };
    recognitionRef.current = rec;
    return () => { try { rec.stop(); } catch {} };
  }, [supported, fullText]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      try { recognitionRef.current.stop(); } catch {}
    } else {
      setRecognized(null);
      setInterimText('');
      transcriptRef.current = '';
      setIsListening(true);
      try {
        recognitionRef.current.start();
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  const passed = recognized?.isMatch;

  if (passed) {
    return (
      <div className="px-5 py-6 text-center">
        <div className="text-7xl mb-3">🌟</div>
        <p className="text-[10px] tracking-[0.3em] uppercase mb-2 font-bold" style={{ color: '#c9a961' }}>MUMTAAZ!</p>
        <h3 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Fraunces, serif', color: '#0a4d3c' }}>
          Sudah Hafal!
        </h3>
        <p className="text-xs mb-4" style={{ color: '#8b6b3d' }}>
          {surat.name} ayat {chunk.startAyat}–{chunk.endAyat}
        </p>

        <div className="rounded-2xl p-4 mb-4" style={{ background: 'linear-gradient(135deg, #c9a961, #d4b876)' }}>
          <p className="text-[10px] uppercase tracking-widest font-bold text-white opacity-90 mb-1">Reward</p>
          <p className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Fraunces, serif' }}>
            +{CHUNK_COMPLETION_REWARD.xp} XP · +{CHUNK_COMPLETION_REWARD.coins} 🪙
          </p>
        </div>

        <button
          onClick={onComplete}
          className="w-full max-w-xs py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 mx-auto"
          style={{ background: '#0a4d3c' }}
        >
          <Sparkles size={16} /> Selesai
        </button>
      </div>
    );
  }

  return (
    <div className="px-5 py-4">
      {/* Cue only — terjemahan, tanpa Arab */}
      <div className="rounded-2xl p-4 mb-4 space-y-2" style={{ background: 'rgba(10,77,60,0.04)', border: '1.5px dashed rgba(10,77,60,0.2)' }}>
        <p className="text-[10px] uppercase tracking-widest font-bold mb-2" style={{ color: '#c9a961' }}>
          Coba bacakan dari hafalan — petunjuk arti:
        </p>
        {chunk.ayat.map((a) => (
          <div key={a.num} className="flex items-start gap-2 py-1" style={{ borderBottom: '1px solid rgba(10,77,60,0.06)' }}>
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5" style={{ background: 'rgba(10,77,60,0.1)', color: '#0a4d3c' }}>
              {a.num}
            </span>
            <p className="text-xs leading-relaxed italic flex-1" style={{ color: '#666' }}>
              {a.id}
            </p>
          </div>
        ))}
      </div>

      {!supported && (
        <div className="rounded-2xl p-3 mb-3" style={{ background: 'rgba(160,85,54,0.12)' }}>
          <p className="text-xs" style={{ color: '#a05536' }}>
            Voice recognition tidak tersedia. Tap selesai kalau yakin sudah hafal.
          </p>
        </div>
      )}

      {supported && (
        <button
          onClick={toggleListening}
          className="w-full py-6 rounded-2xl flex flex-col items-center justify-center gap-2 mb-2 transition-transform active:scale-[0.98]"
          style={{ background: isListening ? 'linear-gradient(135deg, #c64545, #e76b6b)' : 'linear-gradient(135deg, #c9a961, #d4b876)', color: 'white' }}
        >
          {isListening ? <MicOff size={32} className="animate-pulse" /> : <Mic size={32} />}
          <span className="font-bold text-base">
            {isListening ? 'Tap untuk Berhenti & Cek' : 'Tap untuk Bacakan dari Hafalan'}
          </span>
          {isListening && <MicLevelBars isActive={isListening} />}
        </button>
      )}

      {/* Live transcript preview */}
      {isListening && interimText && (
        <div className="rounded-2xl p-3 mb-3" style={{ background: 'rgba(10,77,60,0.05)', border: '1px dashed rgba(10,77,60,0.2)' }}>
          <p className="text-[10px] uppercase tracking-widest font-bold mb-1" style={{ color: '#8b6b3d' }}>Live:</p>
          <p className="text-sm" style={{ fontFamily: 'Amiri, serif', color: '#0a4d3c', direction: 'rtl', textAlign: 'right' }}>
            {interimText}
          </p>
        </div>
      )}

      {recognized && !recognized.isMatch && (
        <div className="rounded-2xl p-3 mb-3" style={{ background: 'rgba(160,85,54,0.12)', border: '1.5px solid rgba(160,85,54,0.3)' }}>
          <p className="text-sm font-bold" style={{ color: '#a05536' }}>
            ✗ Belum sesuai ({Math.round(recognized.similarity * 100)}% mirip)
          </p>
          <p className="text-[11px] mt-1" style={{ color: '#8b6b3d' }}>
            Coba lagi — kalau perlu, kembali ke tahap 4 untuk review.
          </p>
        </div>
      )}

      {!supported && (
        <button
          onClick={onComplete}
          className="w-full py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2"
          style={{ background: '#0a4d3c' }}
        >
          Tandai Selesai (Tanpa Voice Check)
        </button>
      )}
    </div>
  );
}

// ============================================================================
// MIC LEVEL BARS — visualisasi real-time audio levels dari mic.
// Pakai Web Audio API AnalyserNode buat ambil frequency data tiap frame.
// User langsung lihat apakah mic-nya nangkep suara atau tidak.
// ============================================================================
function MicLevelBars({ isActive, barCount = 5 }) {
  const [levels, setLevels] = useState(new Array(barCount).fill(0));
  const audioContextRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!isActive) {
      setLevels(new Array(barCount).fill(0));
      return;
    }
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) return;

    let cancelled = false;

    async function setup() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;

        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioCtx();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 64; // small size buat fewer bars + responsive
        analyser.smoothingTimeConstant = 0.6;
        source.connect(analyser);
        audioContextRef.current = audioContext;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        function tick() {
          if (cancelled) return;
          analyser.getByteFrequencyData(dataArray);
          // Distribute frequency bins ke `barCount` bars
          const newLevels = [];
          const binsPerBar = Math.floor(dataArray.length / barCount);
          for (let i = 0; i < barCount; i++) {
            const start = i * binsPerBar;
            const end = start + binsPerBar;
            let sum = 0;
            for (let j = start; j < end; j++) sum += dataArray[j];
            const avg = sum / binsPerBar;
            newLevels.push(avg / 255); // normalize 0-1
          }
          setLevels(newLevels);
          animationRef.current = requestAnimationFrame(tick);
        }
        tick();
      } catch (e) {
        // Mic permission denied atau mic dipakai SpeechRecognition exclusively
        console.warn('MicLevelBars not available:', e?.message);
      }
    }

    setup();

    return () => {
      cancelled = true;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
    };
  }, [isActive, barCount]);

  if (!isActive) return null;

  return (
    <div className="flex items-end justify-center gap-1.5 mt-1" style={{ height: '24px' }}>
      {levels.map((level, i) => {
        // Map level (0-1) ke height (4-24px), kasih minimum biar gak hilang
        const height = Math.max(4, Math.round(4 + level * 22));
        return (
          <div
            key={i}
            style={{
              width: '5px',
              height: `${height}px`,
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '3px',
              transition: 'height 80ms ease-out',
            }}
          />
        );
      })}
    </div>
  );
}
