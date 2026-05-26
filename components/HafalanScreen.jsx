// components/HafalanScreen.jsx
// Fitur Hafalan Quran — list surat pendek + detail per ayat dgn audio.
// Track progress hafalan: ayat yang udah ditandai "Sudah hafal" di Firestore.
// BUKAN game — gak konsumsi nyawa, gak ada skor. Cuma tools belajar.

'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Home, Volume2, Check, BookOpen, Sparkles, ChevronRight, RotateCcw } from 'lucide-react';
import { HAFALAN_SURAT } from '@/data/hafalan-surat';

export default function HafalanScreen({ hafalanProgress = {}, onBack, onHome, onToggleAyat }) {
  const [view, setView] = useState('list'); // list | surat
  const [selectedSurat, setSelectedSurat] = useState(null);

  if (view === 'surat' && selectedSurat) {
    return (
      <SuratView
        surat={selectedSurat}
        memorizedAyat={hafalanProgress[selectedSurat.id] || []}
        onBack={() => setView('list')}
        onToggleAyat={(ayatNum) => onToggleAyat && onToggleAyat(selectedSurat.id, ayatNum)}
      />
    );
  }

  return <ListView hafalanProgress={hafalanProgress} onBack={onBack} onHome={onHome} onSelect={(s) => { setSelectedSurat(s); setView('surat'); }} />;
}

// ============================================================================
// LIST VIEW — daftar surat Juz Amma + progress per surat
// ============================================================================
function ListView({ hafalanProgress, onBack, onHome, onSelect }) {
  // Hitung total ayat hafalan dari semua surat
  const totalMemorized = Object.values(hafalanProgress).reduce((acc, arr) => acc + (arr?.length || 0), 0);
  const totalAyat = HAFALAN_SURAT.reduce((acc, s) => acc + s.totalAyat, 0);
  const percent = totalAyat > 0 ? Math.round((totalMemorized / totalAyat) * 100) : 0;

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
          <p className="text-xs tracking-widest uppercase" style={{ color: '#8b6b3d' }}>Hafalan</p>
          <h2 className="text-xl font-semibold" style={{ color: '#0a4d3c', fontFamily: 'Fraunces, serif' }}>
            Quran Juz Amma
          </h2>
        </div>
      </div>

      {/* Hero card */}
      <div className="rounded-3xl p-5 mb-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)' }}>
        <div className="absolute -right-6 -top-2 text-7xl opacity-15" style={{ fontFamily: 'Amiri, serif', color: '#c9a961' }}>﷽</div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-white opacity-80 mb-1 font-bold">Hafalan</p>
        <h3 className="text-xl text-white mb-2 leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700 }}>
          Hafalin pelan-pelan
        </h3>
        <p className="text-sm text-white opacity-95 leading-relaxed mb-3">
          Mulai dari surat pendek. Dengarkan, baca, ulang sampai hafal. Centang ayat yang udah dikuasai.
        </p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: 'rgba(201,169,97,0.3)' }}>
            <Sparkles size={11} color="#c9a961" />
            <span className="text-xs font-bold text-white">{totalMemorized} / {totalAyat} ayat</span>
          </div>
          <span className="text-xs text-white opacity-90">{percent}% terhafal</span>
        </div>
      </div>

      <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#8b6b3d' }}>Surat Pendek (Juz Amma)</p>
      <div className="space-y-2">
        {HAFALAN_SURAT.map((s) => {
          const memorized = (hafalanProgress[s.id] || []).length;
          const isComplete = memorized >= s.totalAyat;
          const percentSurat = Math.round((memorized / s.totalAyat) * 100);
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s)}
              className="w-full p-4 rounded-2xl text-left flex items-center gap-3 transition-transform active:scale-[0.98]"
              style={{ background: 'white', border: isComplete ? '1.5px solid #c9a961' : '1.5px solid rgba(10,77,60,0.1)' }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-base font-bold flex-shrink-0"
                style={{ background: isComplete ? 'linear-gradient(135deg, #c9a961, #d4b876)' : 'linear-gradient(135deg, #0a4d3c, #1a6b56)', color: 'white', fontFamily: 'Fraunces, serif' }}
              >
                {isComplete ? '⭐' : s.number}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-semibold text-base leading-tight" style={{ color: '#0a4d3c' }}>{s.name}</p>
                  <span className="text-base" style={{ fontFamily: 'Amiri, serif', color: '#c9a961' }}>{s.arName}</span>
                </div>
                <p className="text-[11px] leading-snug" style={{ color: '#666' }}>{s.description}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(10,77,60,0.1)' }}>
                    <div className="h-full transition-all rounded-full" style={{ width: `${percentSurat}%`, background: isComplete ? '#c9a961' : '#0a4d3c' }} />
                  </div>
                  <span className="text-[10px] font-bold" style={{ color: '#8b6b3d' }}>
                    {memorized}/{s.totalAyat}
                  </span>
                </div>
              </div>
              <ChevronRight size={16} style={{ color: '#c9a961' }} className="flex-shrink-0" />
            </button>
          );
        })}
      </div>

      <p className="text-[11px] text-center mt-4 italic" style={{ color: '#8b6b3d' }}>
        "Sebaik-baik kalian adalah yang belajar Al-Quran dan mengajarkannya"<br/>
        <span className="text-[10px] opacity-80">— HR. Bukhari</span>
      </p>
    </div>
  );
}

// ============================================================================
// SURAT VIEW — detail ayat dgn audio + tombol hafal
// ============================================================================
function SuratView({ surat, memorizedAyat, onBack, onToggleAyat }) {
  const [playingAyat, setPlayingAyat] = useState(null);

  // TTS Arabic — ar-SA voice
  const playAudio = (ayat) => {
    if (typeof window === 'undefined') return;
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    setPlayingAyat(ayat.num);
    const utter = new SpeechSynthesisUtterance(ayat.ar);
    utter.lang = 'ar-SA';
    utter.rate = 0.7;
    utter.onend = () => setPlayingAyat(null);
    utter.onerror = () => setPlayingAyat(null);
    synth.speak(utter);
  };

  // Play seluruh surat ayat-by-ayat
  const playWholeSurat = () => {
    if (typeof window === 'undefined') return;
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    surat.ayat.forEach((ayat, i) => {
      const utter = new SpeechSynthesisUtterance(ayat.ar);
      utter.lang = 'ar-SA';
      utter.rate = 0.7;
      if (i === 0) {
        utter.onstart = () => setPlayingAyat(ayat.num);
      } else {
        utter.onstart = () => setPlayingAyat(ayat.num);
      }
      if (i === surat.ayat.length - 1) {
        utter.onend = () => setPlayingAyat(null);
      }
      synth.speak(utter);
    });
  };

  const memorizedCount = memorizedAyat.length;
  const isComplete = memorizedCount >= surat.totalAyat;

  return (
    <div className="flex-1 flex flex-col px-5 py-6 pb-20">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <ArrowLeft size={18} style={{ color: '#0a4d3c' }} />
        </button>
        <div className="flex-1">
          <p className="text-xs tracking-widest uppercase" style={{ color: '#8b6b3d' }}>Surat {surat.number}</p>
          <h2 className="text-xl font-semibold" style={{ color: '#0a4d3c', fontFamily: 'Fraunces, serif' }}>
            {surat.name}
          </h2>
        </div>
        <button
          onClick={playWholeSurat}
          className="px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5"
          style={{ background: 'rgba(10,77,60,0.08)', color: '#0a4d3c' }}
        >
          <Volume2 size={12} /> Putar Semua
        </button>
      </div>

      {/* Surat header */}
      <div className="rounded-3xl p-5 mb-4 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)' }}>
        <div className="absolute -right-2 -top-2 text-7xl opacity-15" style={{ fontFamily: 'Amiri, serif', color: '#c9a961' }}>﷽</div>
        <p className="text-4xl mb-1 text-white" style={{ fontFamily: 'Amiri, serif' }}>{surat.arName}</p>
        <p className="text-xs text-white opacity-90 mb-2">{surat.meaning} · {surat.totalAyat} ayat</p>
        <p className="text-base text-white" style={{ fontFamily: 'Amiri, serif' }}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        <p className="text-xs italic text-white opacity-80 mt-1">(Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang)</p>
        <div className="mt-3 flex items-center justify-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: 'rgba(201,169,97,0.3)' }}>
            <Sparkles size={11} color="#c9a961" />
            <span className="text-xs font-bold text-white">{memorizedCount}/{surat.totalAyat} ayat dihafal</span>
          </div>
          {isComplete && <span className="text-xs font-bold text-white">⭐ SELESAI</span>}
        </div>
      </div>

      {/* Ayat list */}
      <div className="space-y-3">
        {surat.ayat.map((ayat) => {
          const isMemorized = memorizedAyat.includes(ayat.num);
          const isPlaying = playingAyat === ayat.num;
          return (
            <div
              key={ayat.num}
              className="rounded-2xl p-4 relative"
              style={{
                background: 'white',
                border: isMemorized ? '1.5px solid #c9a961' : '1px solid rgba(10,77,60,0.1)',
              }}
            >
              {/* Header ayat number + buttons */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: isMemorized ? '#c9a961' : 'rgba(10,77,60,0.08)', color: isMemorized ? 'white' : '#0a4d3c' }}>
                    {ayat.num}
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#8b6b3d' }}>
                    Ayat {ayat.num}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => playAudio(ayat)}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-transform active:scale-90"
                    style={{ background: isPlaying ? 'rgba(10,77,60,0.15)' : 'rgba(10,77,60,0.05)' }}
                    aria-label="Putar audio"
                  >
                    {isPlaying ? (
                      <span className="text-base">🔊</span>
                    ) : (
                      <Volume2 size={15} style={{ color: '#0a4d3c' }} />
                    )}
                  </button>
                  <button
                    onClick={() => onToggleAyat(ayat.num)}
                    className="px-3 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-transform active:scale-95"
                    style={{
                      background: isMemorized ? '#c9a961' : 'rgba(10,77,60,0.08)',
                      color: isMemorized ? 'white' : '#0a4d3c',
                    }}
                  >
                    {isMemorized ? (
                      <><Check size={13} /> Hafal</>
                    ) : (
                      <>Tandai Hafal</>
                    )}
                  </button>
                </div>
              </div>

              {/* Arabic */}
              <p className="leading-relaxed mb-2" style={{ fontFamily: 'Amiri, serif', fontSize: '24px', color: '#0a4d3c', direction: 'rtl', textAlign: 'right' }}>
                {ayat.ar}
              </p>

              {/* Latin */}
              <p className="text-sm italic leading-snug mb-2" style={{ color: '#a87f47' }}>
                {ayat.latin}
              </p>

              {/* Indonesia */}
              <p className="text-xs leading-relaxed" style={{ color: '#3d2817' }}>
                {ayat.id}
              </p>
            </div>
          );
        })}
      </div>

      {/* Footer message */}
      <div className="rounded-2xl p-3 mt-4" style={{ background: 'rgba(201,169,97,0.1)', border: '1px dashed #c9a961' }}>
        <p className="text-[10px] tracking-widest uppercase font-bold mb-1" style={{ color: '#c9a961' }}>Tips Menghafal</p>
        <p className="text-xs leading-relaxed" style={{ color: '#8b6b3d' }}>
          Putar audio dulu, baca pelan-pelan sambil ikut. Ulangi 5-10 kali. Tutup arabnya, coba baca dari ingatan. Kalau lancar, centang "Tandai Hafal".
        </p>
      </div>
    </div>
  );
}
