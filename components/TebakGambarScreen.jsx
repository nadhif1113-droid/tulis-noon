// components/TebakGambarScreen.jsx
// Game Tebak Gambar — visual vocab quiz. 5 kategori × 10 item, multiple choice.

'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Home, Sparkles, Star, RefreshCw, Volume2, Check, X, ChevronRight } from 'lucide-react';
import { TEBAK_GAMBAR_LEVELS, generateQuestions, QUESTIONS_PER_ROUND } from '@/data/tebak-gambar-levels';
import { speakArabic as ttsSpeakArabic } from '@/lib/tts';

export default function TebakGambarScreen({ lives = 10, onNoLives, onBack, onHome, onComplete }) {
  const [view, setView] = useState('list'); // list | play | result
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [result, setResult] = useState(null);

  // Cari index kategori sekarang untuk tentuin "next level"
  const currentLevelIdx = selectedLevel
    ? TEBAK_GAMBAR_LEVELS.findIndex((l) => l.id === selectedLevel.id)
    : -1;
  const nextLevel = currentLevelIdx >= 0 && currentLevelIdx < TEBAK_GAMBAR_LEVELS.length - 1
    ? TEBAK_GAMBAR_LEVELS[currentLevelIdx + 1]
    : null;

  const handleSelectLevel = (level) => {
    if (lives <= 0) {
      if (onNoLives) onNoLives();
      return;
    }
    setSelectedLevel(level);
    setView('play');
  };

  const handlePlayComplete = ({ score, totalQuestions }) => {
    const isPerfect = score === totalQuestions;
    const correctRatio = totalQuestions > 0 ? score / totalQuestions : 0;
    const xpEarned = Math.round(correctRatio * selectedLevel.xpReward);
    setResult({ score, totalQuestions, xpEarned, isPerfect });
    setView('result');
    if (onComplete) {
      onComplete({
        earned: xpEarned, score, totalQuestions, correctRatio,
        contentId: `tebak-gambar-${selectedLevel.id}`,
      });
    }
  };

  // Handler lanjut ke kategori berikutnya
  const handleNextLevel = () => {
    if (!nextLevel) return;
    if (lives <= 0) {
      if (onNoLives) onNoLives();
      return;
    }
    setSelectedLevel(nextLevel);
    setView('play');
  };

  if (view === 'play' && selectedLevel) {
    return (
      <PlayView
        level={selectedLevel}
        onBack={() => setView('list')}
        onComplete={handlePlayComplete}
      />
    );
  }

  if (view === 'result' && result && selectedLevel) {
    return (
      <ResultView
        level={selectedLevel}
        nextLevel={nextLevel}
        result={result}
        lives={lives}
        onRetry={() => {
          if (lives <= 0) {
            if (onNoLives) onNoLives();
            return;
          }
          setView('play');
        }}
        onNextLevel={handleNextLevel}
        onBack={() => setView('list')}
      />
    );
  }

  return <ListView lives={lives} onBack={onBack} onHome={onHome} onSelect={handleSelectLevel} />;
}

// ============================================================================
// LIST VIEW — pilih kategori
// ============================================================================
function ListView({ lives, onBack, onHome, onSelect }) {
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
          <p className="text-xs tracking-widest uppercase" style={{ color: '#8b6b3d' }}>Tebak Gambar</p>
          <h2 className="text-xl font-semibold" style={{ color: '#0a4d3c', fontFamily: 'Fraunces, serif' }}>
            Visual Vocab Quiz
          </h2>
        </div>
      </div>

      {/* Hero */}
      <div className="rounded-3xl p-5 mb-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #a05536, #c46a3f)' }}>
        <div className="absolute -right-6 -top-4 text-7xl opacity-15">🖼️</div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-white opacity-80 mb-1 font-bold">10 Kategori · 200 Vocab</p>
        <h3 className="text-xl text-white mb-2 leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700 }}>
          Tebak Bahasa Arab-nya!
        </h3>
        <p className="text-sm text-white opacity-95 leading-relaxed">
          Lihat gambar → pilih kosakata Arab yang tepat dari 4 pilihan. Asyik buat hafal vocab harian dengan cepat.
        </p>
      </div>

      <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#8b6b3d' }}>Pilih Kategori</p>
      <div className="space-y-3">
        {TEBAK_GAMBAR_LEVELS.map((level) => (
          <button
            key={level.id}
            onClick={() => onSelect(level)}
            className="w-full p-4 rounded-2xl text-left flex items-center gap-3 transition-transform active:scale-[0.98]"
            style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.1)' }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: level.bgGradient }}
            >
              {level.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-base leading-tight" style={{ color: level.color }}>{level.title}</p>
              <p className="text-xs leading-snug mb-1.5" style={{ color: '#666' }}>{level.description}</p>
              <div className="flex items-center gap-3 text-[11px]">
                <span style={{ color: '#c9a961' }}>⭐ Max +{level.xpReward} XP</span>
                <span style={{ color: '#8b6b3d' }}>{QUESTIONS_PER_ROUND} soal · {level.items.length} pool</span>
              </div>
            </div>
            <ChevronRight size={18} style={{ color: '#c9a961' }} className="flex-shrink-0" />
          </button>
        ))}
      </div>

      <div className="mt-4">
        {lives <= 0 ? (
          <div className="rounded-2xl p-3" style={{ background: 'rgba(160,85,54,0.12)', border: '1px solid rgba(160,85,54,0.25)' }}>
            <p className="text-xs leading-relaxed text-center" style={{ color: '#a05536' }}>
              ❤️ Nyawa habis — beli pakai koin atau tunggu refresh
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-1.5 text-xs" style={{ color: '#8b6b3d' }}>
            <span>❤️</span>
            <span>{lives}/10 nyawa</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// PLAY VIEW — multiple choice quiz
// ============================================================================
function PlayView({ level, onBack, onComplete }) {
  const [questions] = useState(() => generateQuestions(level.id, QUESTIONS_PER_ROUND));
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const current = questions[qIdx];

  // TTS — putar pengucapan Arab pas user pilih (kalau benar).
  // Server-side (Google Cloud TTS) + fallback Web Speech.
  const speakArabic = (text) => {
    ttsSpeakArabic(text, { rate: 0.8 });
  };

  // FIX BUG: score state pakai functional update, tapi setTimeout closure
  // capture score LAMA. Solusi: pass finalScore explicit ke proceedToNext.
  const proceedToNext = (finalScore) => {
    setSelected(null);
    setFeedback(null);
    if (qIdx === questions.length - 1) {
      onComplete({ score: finalScore, totalQuestions: questions.length });
    } else {
      setQIdx(qIdx + 1);
    }
  };

  const handleTap = (choice) => {
    if (selected !== null) return;
    setSelected(choice);
    const isCorrect = choice === current.arabic;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    // Hitung newScore lokal (gak tunggu setScore commit) — pass eksplisit ke proceedToNext
    const newScore = isCorrect ? score + 1 : score;
    if (isCorrect) {
      setScore(newScore);
      speakArabic(current.arabic);
    }
    setTimeout(() => proceedToNext(newScore), 1500);
  };

  if (!current) return null;

  return (
    <div className="flex-1 flex flex-col px-5 py-5">
      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <ArrowLeft size={16} style={{ color: '#0a4d3c' }} />
        </button>
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(10,77,60,0.1)' }}>
          <div className="h-full transition-all" style={{ width: `${((qIdx + 1) / questions.length) * 100}%`, background: level.color }} />
        </div>
        <span className="text-xs font-semibold" style={{ color: level.color }}>{qIdx + 1}/{questions.length}</span>
      </div>

      <p className="text-xs tracking-widest uppercase mb-2 text-center" style={{ color: '#8b6b3d' }}>
        Apa nama benda ini dalam bahasa Arab?
      </p>

      {/* Image card — kalau imageUrl ada, render <img> (pure visual challenge).
          Kalau null, fallback ke emoji + label Indonesia (biar gak ambigu). */}
      <div className="rounded-3xl mb-3 text-center overflow-hidden" style={{ background: 'white', boxShadow: '0 10px 30px -10px rgba(10,77,60,0.15)' }}>
        {current.imageUrl ? (
          <div className="w-full flex items-center justify-center p-4" style={{ aspectRatio: '1/1', maxHeight: '260px' }}>
            <img
              src={current.imageUrl}
              alt={current.id}
              className="w-full h-full object-contain"
              loading="eager"
              onError={(e) => {
                // Fallback: kalau gambar gagal load, tampilin emoji
                e.target.style.display = 'none';
                const fallback = e.target.parentElement.querySelector('.emoji-fallback');
                if (fallback) fallback.style.display = 'block';
              }}
            />
            <p className="text-7xl emoji-fallback" style={{ display: 'none' }}>{current.image}</p>
          </div>
        ) : (
          <div className="p-8">
            <p className="text-7xl mb-2">{current.image}</p>
            <p className="text-xs uppercase tracking-widest font-bold" style={{ color: '#8b6b3d' }}>{current.id}</p>
          </div>
        )}
      </div>

      {/* Feedback banner */}
      <div className="h-7 flex items-center justify-center mb-2">
        {feedback === 'correct' && (
          <p className="text-sm font-bold flex items-center gap-1.5" style={{ color: '#0a4d3c' }}>
            <Check size={16} /> Benar!
            <span style={{ fontFamily: 'Amiri, serif', fontSize: '18px', marginLeft: '4px' }}>{current.arabic}</span>
          </p>
        )}
        {feedback === 'wrong' && (
          <p className="text-sm font-bold flex items-center gap-1.5" style={{ color: '#a05536' }}>
            <X size={16} /> Yang benar:
            <span style={{ fontFamily: 'Amiri, serif', fontSize: '18px', marginLeft: '4px' }}>{current.arabic}</span>
          </p>
        )}
      </div>

      {/* 4 choices */}
      <div className="space-y-2 mt-2">
        {current.choices.map((choice, i) => {
          let bg = 'white';
          let border = 'rgba(10,77,60,0.12)';
          if (selected !== null) {
            if (choice === current.arabic) {
              bg = 'rgba(10,77,60,0.1)';
              border = '#0a4d3c';
            } else if (choice === selected) {
              bg = 'rgba(160,85,54,0.15)';
              border = '#a05536';
            }
          }
          return (
            <button
              key={i}
              onClick={() => handleTap(choice)}
              disabled={selected !== null}
              className="w-full p-4 rounded-2xl text-center transition-all active:scale-95 disabled:active:scale-100"
              style={{ background: bg, border: `2px solid ${border}` }}
            >
              <p style={{ fontFamily: 'Amiri, serif', fontSize: '24px', color: level.color, direction: 'rtl' }}>
                {choice}
              </p>
            </button>
          );
        })}
      </div>

      {/* 💡 Pemahaman: kalau item punya note (penjelasan tambahan), tampilkan setelah user jawab */}
      {selected !== null && current.note && (
        <div className="mt-3 rounded-2xl p-3 text-xs leading-relaxed" style={{
          background: 'rgba(201,169,97,0.12)',
          border: '1px solid rgba(201,169,97,0.35)',
          color: '#3d2817',
        }}>
          <p className="font-bold mb-1" style={{ color: '#8b6b3d', fontSize: '10px', letterSpacing: '0.15em' }}>💡 PEMAHAMAN</p>
          {current.note}
        </div>
      )}

      <p className="text-xs text-center mt-4" style={{ color: '#8b6b3d' }}>
        Skor sementara: <span className="font-bold" style={{ color: level.color }}>{score}/{questions.length}</span>
      </p>
    </div>
  );
}

// ============================================================================
// RESULT VIEW — score + retry
// ============================================================================
function ResultView({ level, nextLevel, result, lives, onRetry, onNextLevel, onBack }) {
  const { score, totalQuestions, xpEarned, isPerfect } = result;
  const isPartial = score > 0 && !isPerfect;
  const noLives = lives <= 0;
  const hasNextLevel = !!nextLevel;
  const tier = isPerfect
    ? { label: 'MUMTAAZ!', emoji: '🏆', color: '#c9a961', gradient: 'linear-gradient(135deg, #d4b876, #c9a961)' }
    : isPartial
    ? { label: 'COBA LAGI', emoji: '🔥', color: '#a05536', gradient: 'linear-gradient(135deg, #a05536, #7a3d2a)' }
    : { label: 'BELUM BERHASIL', emoji: '🌱', color: '#8b6b3d', gradient: 'linear-gradient(135deg, #8b6b3d, #6b4f2a)' };

  return (
    <div className="flex-1 flex flex-col px-5 py-6 items-center text-center overflow-y-auto">
      <div className="relative mb-4 mt-2">
        <div className="absolute inset-0 blur-3xl opacity-50" style={{ background: tier.color, borderRadius: '50%' }} />
        <div className="relative w-28 h-28 rounded-full flex items-center justify-center text-5xl" style={{ background: tier.gradient, boxShadow: `0 20px 40px -10px ${tier.color}80` }}>
          {tier.emoji}
        </div>
      </div>

      <p className="text-[11px] tracking-[0.3em] uppercase mb-2 font-bold" style={{ color: tier.color }}>{tier.label}</p>
      <h2 className="text-xl mb-1" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: '#0a4d3c' }}>
        {level.title}
      </h2>
      <p className="text-xs mb-3" style={{ color: '#8b6b3d' }}>{level.emoji} Tebak Gambar</p>

      <div className="flex items-baseline gap-2 mb-2">
        <p className="text-5xl font-bold" style={{ fontFamily: 'Fraunces, serif', color: tier.color }}>{score}</p>
        <p className="text-base" style={{ color: '#8b6b3d' }}>/{totalQuestions}</p>
      </div>

      <div className="flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full" style={{ background: `${tier.color}20`, border: `1.5px solid ${tier.color}` }}>
        <Star size={14} style={{ color: tier.color }} fill={tier.color} />
        <span className="text-sm font-bold" style={{ color: tier.color }}>+{xpEarned} XP</span>
      </div>

      {!isPerfect && (
        <div className="flex items-center gap-1.5 mb-4 px-3 py-1.5 rounded-full text-xs" style={{ background: noLives ? 'rgba(160,85,54,0.15)' : 'rgba(198,69,69,0.12)' }}>
          <span>❤️</span>
          <span className="font-semibold" style={{ color: noLives ? '#a05536' : '#c64545' }}>-1 Nyawa · sisa {lives}/10</span>
        </div>
      )}

      <div className="w-full max-w-xs space-y-2 mt-2 pb-4">
        {/* PRIMARY: Lanjut ke kategori berikutnya (kalau perfect & ada next level) */}
        {isPerfect && hasNextLevel && (
          <button
            onClick={onNextLevel}
            className="w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 text-white"
            style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)', boxShadow: '0 10px 24px -8px rgba(10,77,60,0.5)' }}
          >
            <ArrowRight size={16} /> Lanjut: {nextLevel.title}
          </button>
        )}

        {/* PRIMARY (alt): Ulangi kalau belum perfect */}
        {!isPerfect && (
          <button
            onClick={onRetry}
            className="w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 text-white"
            style={{ background: noLives ? '#8b6b3d' : tier.gradient, opacity: noLives ? 0.7 : 1 }}
          >
            {noLives ? <>❤️ Nyawa habis — beli atau tunggu</> : <><RefreshCw size={16} /> Ulangi Kategori</>}
          </button>
        )}

        {/* SECONDARY: Main lagi kalau perfect (replay) */}
        {isPerfect && (
          <button
            onClick={onRetry}
            className="w-full py-2.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2"
            style={{ background: 'rgba(201,169,97,0.18)', color: '#8b6b3d' }}
          >
            <RefreshCw size={14} /> Main lagi kategori ini
          </button>
        )}

        {/* Pesan kalau udah selesai semua kategori */}
        {isPerfect && !hasNextLevel && (
          <div className="rounded-2xl p-3" style={{ background: 'rgba(201,169,97,0.12)', border: '1px dashed #c9a961' }}>
            <p className="text-xs text-center font-semibold" style={{ color: '#8b6b3d' }}>
              🎉 Semua kategori selesai! Vocab baru akan ditambah di update berikutnya.
            </p>
          </div>
        )}

        {/* TERTIARY: Kembali ke list */}
        <button onClick={onBack} className="w-full py-3 rounded-2xl text-sm font-semibold" style={{ background: 'rgba(10,77,60,0.08)', color: '#0a4d3c' }}>
          Kembali ke Pilih Kategori
        </button>
      </div>
    </div>
  );
}
