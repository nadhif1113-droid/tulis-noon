// components/TulisArabScreen.jsx
// Game "Tulis Arab" — multi-screen flow: phases → levels → play → result.
// Phase 1 fully playable, Phase 2-5 locked Premium.

'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Home, Lock, Sparkles, Star, Trophy, RefreshCw, Check, X, Volume2 } from 'lucide-react';
import { TULIS_ARAB_PHASES, buildLetterChoices } from '@/data/tulis-arab-levels';

// ============================================================================
// MAIN ENTRY — manages internal flow (phases / levels / play / result)
// ============================================================================
export default function TulisArabScreen({ lives = 10, onNoLives, onBack, onHome, onComplete, onUpgrade }) {
  const [view, setView] = useState('phases'); // phases | levels | play | result
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [finalScore, setFinalScore] = useState(null);

  // Gate: cek nyawa sebelum start gameplay. Return true kalau boleh main.
  const canStartGame = () => {
    if (lives <= 0) {
      if (onNoLives) onNoLives();
      return false;
    }
    return true;
  };

  const goToLevels = (phase) => {
    setSelectedPhase(phase);
    setView('levels');
  };

  const goToPlay = (level) => {
    setSelectedLevel(level);
    setView('play');
  };

  const onLevelComplete = ({ score, total, xpEarned }) => {
    setFinalScore({ score, total, xpEarned });
    if (onComplete) onComplete({ earned: xpEarned, score, totalQuestions: total });
    setView('result');
  };

  // Find next playable level in current phase (same phase only).
  // Kalau ga ada (user di level terakhir phase), nextLevel = null → trigger Premium upsell.
  const nextLevel = selectedPhase?.levels?.find(
    (l) => l.level === selectedLevel?.level + 1 && !l.comingSoon
  );

  const handleNextLevel = () => {
    if (nextLevel) {
      // Gate dgn lives check sebelum next level
      if (!canStartGame()) return;
      setSelectedLevel(nextLevel);
      setView('play');
    }
  };

  const handleUpgrade = () => {
    if (onUpgrade) onUpgrade();
  };

  if (view === 'phases') {
    return <PhasesView onBack={onBack} onHome={onHome} onSelectPhase={goToLevels} />;
  }

  if (view === 'levels' && selectedPhase) {
    return (
      <LevelsView
        phase={selectedPhase}
        onBack={() => setView('phases')}
        onHome={onHome}
        onSelectLevel={goToPlay}
      />
    );
  }

  if (view === 'play' && selectedLevel) {
    return (
      <PlayView
        phase={selectedPhase}
        level={selectedLevel}
        lives={lives}
        onNoLives={onNoLives}
        onBack={() => setView('levels')}
        onComplete={onLevelComplete}
      />
    );
  }

  if (view === 'result' && finalScore) {
    return (
      <ResultView
        phase={selectedPhase}
        level={selectedLevel}
        result={finalScore}
        nextLevel={nextLevel}
        lives={lives}
        onRetry={() => {
          // Gate retry — kalau nyawa habis, blok & buka modal
          if (!canStartGame()) return;
          setView('play');
        }}
        onNextLevel={handleNextLevel}
        onBack={() => setView('levels')}
        onUpgrade={handleUpgrade}
      />
    );
  }

  return null;
}

// ============================================================================
// PHASES VIEW — list 5 phase cards with lock badges for Premium
// ============================================================================
function PhasesView({ onBack, onHome, onSelectPhase }) {
  return (
    <div className="flex-1 flex flex-col px-5 py-6">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }} aria-label="Kembali">
          <ArrowLeft size={18} style={{ color: '#0a4d3c' }} />
        </button>
        <button onClick={onHome || onBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }} aria-label="Beranda">
          <Home size={17} style={{ color: '#0a4d3c' }} />
        </button>
        <div className="flex-1">
          <p className="text-xs tracking-widest uppercase" style={{ color: '#8b6b3d' }}>Tulis Arab</p>
          <h2 className="text-xl font-semibold" style={{ color: '#0a4d3c', fontFamily: 'Fraunces, serif' }}>
            Belajar tulis dari nol
          </h2>
        </div>
      </div>

      {/* Hero / intro card — kasih tau apa game ini buat siapa */}
      <div className="rounded-3xl p-5 mb-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a4d3c, #2e8869)' }}>
        <div className="absolute -right-6 -top-4 text-7xl opacity-15">✍️</div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-white opacity-80 mb-1">Latihan menulis</p>
        <h3 className="text-xl text-white mb-2 leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700 }}>
          Dari ngga bisa, jadi bisa
        </h3>
        <p className="text-sm text-white opacity-95 leading-relaxed mb-3">
          15 level bertahap — kenalan huruf, cara baca, susun kata, kalimat, sampai paragraf. Cocok buat yang baru mulai sama sekali.
        </p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: 'rgba(201,169,97,0.3)' }}>
            <Sparkles size={11} color="#c9a961" />
            <span className="text-xs font-bold text-white">5 Phase · 15 Level</span>
          </div>
        </div>
      </div>

      <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#8b6b3d' }}>Pilih Tahap</p>
      <div className="space-y-3">
        {TULIS_ARAB_PHASES.map((phase) => {
          // Cek apakah phase punya level playable (bukan semua comingSoon)
          const hasPlayableLevels = phase.levels.some((l) => !l.comingSoon);
          return (
            <button
              key={phase.id}
              onClick={() => onSelectPhase(phase)}
              className="w-full p-4 rounded-2xl text-left flex items-center gap-3 transition-transform active:scale-[0.98]"
              style={{
                background: 'white',
                border: '1.5px solid rgba(10,77,60,0.1)',
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ background: phase.bgGradient }}
              >
                {phase.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${phase.color}15`, color: phase.color }}>
                    Phase {phase.number}
                  </span>
                  {!hasPlayableLevels && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(201,169,97,0.2)', color: '#8b6b3d' }}>
                      AKAN DATANG
                    </span>
                  )}
                </div>
                <p className="font-semibold text-base leading-tight" style={{ color: phase.color }}>{phase.title}</p>
                <p className="text-xs leading-snug mt-0.5" style={{ color: '#666' }}>{phase.description}</p>
              </div>
              <ArrowRight size={18} style={{ color: '#c9a961' }} className="flex-shrink-0" />
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl p-3 mt-4" style={{ background: 'rgba(10,77,60,0.06)', border: '1px solid rgba(10,77,60,0.12)' }}>
        <p className="text-[10px] tracking-widest uppercase font-bold mb-1.5" style={{ color: '#0a4d3c' }}>Info</p>
        <p className="text-xs leading-relaxed" style={{ color: '#3d2817' }}>
          ✓ Semua tahap <strong>gratis</strong> dimainkan! Phase 1 sudah siap; Phase 2-5 lagi disiapkan kontennya — kamu udah bisa lihat preview level-nya. Belajar pakai nyawa harian (max 10/hari).
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// LEVELS VIEW — list 3 levels of selected phase
// ============================================================================
function LevelsView({ phase, onBack, onHome, onSelectLevel }) {
  return (
    <div className="flex-1 flex flex-col px-5 py-6">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }} aria-label="Kembali">
          <ArrowLeft size={18} style={{ color: '#0a4d3c' }} />
        </button>
        <button onClick={onHome || onBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }} aria-label="Beranda">
          <Home size={17} style={{ color: '#0a4d3c' }} />
        </button>
        <div className="flex-1">
          <p className="text-xs tracking-widest uppercase" style={{ color: '#8b6b3d' }}>Phase {phase.number}</p>
          <h2 className="text-xl font-semibold" style={{ color: phase.color, fontFamily: 'Fraunces, serif' }}>
            {phase.emoji} {phase.title}
          </h2>
        </div>
      </div>

      <p className="text-sm mb-4" style={{ color: '#3d2817' }}>{phase.description}</p>

      <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#8b6b3d' }}>Pilih Level</p>
      <div className="space-y-3">
        {phase.levels.map((lv) => {
          const isLocked = lv.comingSoon;
          return (
            <button
              key={lv.level}
              onClick={() => !isLocked && onSelectLevel(lv)}
              disabled={isLocked}
              className="w-full p-4 rounded-2xl text-left flex items-center gap-3 transition-transform active:scale-[0.98] disabled:active:scale-100"
              style={{
                background: 'white',
                border: isLocked ? '1.5px dashed rgba(139,107,61,0.25)' : `1.5px solid ${phase.color}25`,
                opacity: isLocked ? 0.6 : 1,
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl flex-shrink-0"
                style={{ background: isLocked ? 'rgba(139,107,61,0.12)' : phase.bgGradient, color: isLocked ? '#8b6b3d' : 'white' }}
              >
                {isLocked ? <Lock size={18} /> : lv.level}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-base leading-tight" style={{ color: isLocked ? '#8b6b3d' : phase.color }}>
                  {lv.title}
                </p>
                <p className="text-xs leading-snug mt-0.5" style={{ color: '#666' }}>{lv.description}</p>
                {!isLocked && (
                  <p className="text-[10px] mt-1.5 font-semibold" style={{ color: '#c9a961' }}>
                    ⭐ Max +{lv.xpReward} XP
                  </p>
                )}
                {isLocked && (
                  <p className="text-[10px] mt-1.5 font-bold" style={{ color: '#c9a961' }}>🔒 Akan datang — Premium</p>
                )}
              </div>
              {!isLocked && <ArrowRight size={16} style={{ color: '#c9a961' }} className="flex-shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// PLAY VIEW — gameplay tap-letter mode
// ============================================================================
function PlayView({ phase, level, lives = 10, onNoLives, onBack, onComplete }) {
  const [stage, setStage] = useState('intro'); // intro | playing | done
  const [itemIdx, setItemIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'

  const items = level.items || [];
  const current = items[itemIdx];

  // Build randomized choices once per item (memoized via state)
  const [choices, setChoices] = useState([]);
  useEffect(() => {
    if (current) setChoices(buildLetterChoices(current));
  }, [itemIdx, current?.arabic]);

  // Lanjut ke soal berikut — dipisah biar bisa di-trigger via TTS onend callback.
  const proceedToNext = () => {
    setSelected(null);
    setFeedback(null);
    if (itemIdx === items.length - 1) {
      setStage('done');
    } else {
      setItemIdx((i) => i + 1);
    }
  };

  const handleTap = (letter) => {
    if (selected !== null) return; // udah jawab
    setSelected(letter);
    const correct = letter === current.arabic;
    setFeedback(correct ? 'correct' : 'wrong');

    if (correct) {
      setScore((s) => s + 1);
      // Putar suara huruf yang user pilih sbg reinforcement audio.
      // Setelah audio selesai (atau timeout fallback), lanjut ke soal berikutnya.
      speakArabic(current.arabic, proceedToNext);
    } else {
      // Salah — kasih waktu 1.5s buat user baca feedback "yang benar: ...", lalu lanjut
      setTimeout(proceedToNext, 1500);
    }
  };

  // Pas masuk stage 'done', panggil onComplete dengan xp earned
  useEffect(() => {
    if (stage === 'done') {
      const xpEarned = Math.round((score / items.length) * level.xpReward);
      onComplete({ score, total: items.length, xpEarned });
    }
  }, [stage]);

  // Audio TTS — pakai Web Speech API kalau support (works on iOS Safari for Arabic).
  // Kasih callback `onEnd` supaya bisa chain action setelah audio selesai
  // (mis. lanjut ke soal berikut setelah putar suara huruf benar).
  const speakArabic = (text, onEnd) => {
    if (typeof window === 'undefined') {
      if (onEnd) setTimeout(onEnd, 800);
      return;
    }
    const synth = window.speechSynthesis;
    if (!synth) {
      // Browser ga support TTS — fallback delay supaya flow tetep lanjut
      if (onEnd) setTimeout(onEnd, 800);
      return;
    }
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'ar-SA';
    utter.rate = 0.7;
    // Safety net: kalau onend ga ke-trigger (TTS error/no voice installed),
    // tetep panggil onEnd setelah max 2.5 detik biar flow ga stuck.
    let fired = false;
    const safeOnEnd = () => {
      if (fired) return;
      fired = true;
      if (onEnd) onEnd();
    };
    if (onEnd) {
      utter.onend = safeOnEnd;
      utter.onerror = safeOnEnd;
      setTimeout(safeOnEnd, 2500);
    }
    synth.speak(utter);
  };

  if (stage === 'intro') {
    return (
      <div className="flex-1 flex flex-col px-5 py-6">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <ArrowLeft size={18} style={{ color: '#0a4d3c' }} />
        </button>

        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="relative mb-5">
            <div className="absolute inset-0 blur-3xl opacity-40" style={{ background: phase.color, borderRadius: '50%' }} />
            <div className="relative w-24 h-24 rounded-2xl flex items-center justify-center text-5xl" style={{ background: phase.bgGradient }}>
              ✍️
            </div>
          </div>
          <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: '#c9a961' }}>
            Phase {phase.number} · Level {level.level}
          </p>
          <h2 className="text-2xl mb-2" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: phase.color }}>
            {level.title}
          </h2>
          <p className="text-sm mb-6 max-w-xs leading-relaxed" style={{ color: '#3d2817' }}>{level.description}</p>

          <div className="space-y-2 w-full max-w-xs mb-6">
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'white' }}>
              <Sparkles size={16} style={{ color: phase.color }} />
              <span className="text-sm" style={{ color: '#1a1a1a' }}>{items.length} soal · tap huruf yang benar</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'white' }}>
              <Star size={16} style={{ color: phase.color }} />
              <span className="text-sm" style={{ color: '#1a1a1a' }}>Max +{level.xpReward} XP (kalau perfect)</span>
            </div>
          </div>
        </div>

        {/* Lives indicator + start button */}
        <div className="mb-2 flex items-center justify-center gap-1.5 text-xs" style={{ color: '#8b6b3d' }}>
          <span>❤️</span>
          <span>{lives}/10 nyawa</span>
          {lives <= 3 && lives > 0 && (
            <span className="font-bold" style={{ color: '#a05536' }}>· hampir habis!</span>
          )}
        </div>
        <button
          onClick={() => {
            if (lives <= 0) {
              if (onNoLives) onNoLives();
              return;
            }
            setStage('playing');
          }}
          className="w-full py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2"
          style={{
            background: lives <= 0 ? '#8b6b3d' : phase.color,
            boxShadow: lives <= 0 ? 'none' : `0 10px 24px -8px ${phase.color}80`,
            opacity: lives <= 0 ? 0.7 : 1,
          }}
        >
          {lives <= 0 ? (
            <>
              <span>❤️</span> Nyawa habis — beli atau tunggu
            </>
          ) : (
            <>
              Mulai <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    );
  }

  if (stage === 'playing' && current) {
    const isCorrect = (letter) => letter === current.arabic;
    return (
      <div className="flex-1 flex flex-col px-5 py-5">
        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(10,77,60,0.08)' }}>
            <ArrowLeft size={16} style={{ color: '#0a4d3c' }} />
          </button>
          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(10,77,60,0.1)' }}>
            <div className="h-full transition-all" style={{ width: `${((itemIdx + 1) / items.length) * 100}%`, background: phase.color }} />
          </div>
          <span className="text-xs font-semibold" style={{ color: phase.color }}>{itemIdx + 1}/{items.length}</span>
        </div>

        {/* Latin prompt */}
        <p className="text-xs tracking-widest uppercase mb-2 text-center" style={{ color: '#8b6b3d' }}>Tap huruf untuk</p>
        <div className="rounded-3xl p-6 mb-2 text-center relative" style={{ background: 'white', boxShadow: '0 10px 30px -10px rgba(10,77,60,0.15)' }}>
          <p className="text-2xl font-bold mb-3" style={{ fontFamily: 'Fraunces, serif', color: phase.color }}>
            {current.latin}
          </p>
          <button
            onClick={() => speakArabic(current.arabic)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: `${phase.color}15`, color: phase.color }}
          >
            <Volume2 size={13} /> Dengar suaranya
          </button>
        </div>

        {/* Feedback banner */}
        <div className="h-6 flex items-center justify-center mb-2">
          {feedback === 'correct' && (
            <p className="text-sm font-bold" style={{ color: '#0a4d3c' }}>✓ Benar! Mantap.</p>
          )}
          {feedback === 'wrong' && (
            <p className="text-sm font-bold" style={{ color: '#a05536' }}>
              Yang benar: <span style={{ fontFamily: 'Amiri, serif', fontSize: '18px' }}>{current.arabic}</span>
            </p>
          )}
        </div>

        {/* Letter grid 3x2 (6 choices) */}
        <div className="grid grid-cols-3 gap-3 mt-2">
          {choices.map((letter, i) => {
            let bg = 'white';
            let border = 'rgba(10,77,60,0.12)';
            if (selected !== null) {
              if (isCorrect(letter)) {
                bg = 'rgba(10,77,60,0.1)';
                border = '#0a4d3c';
              } else if (letter === selected) {
                bg = 'rgba(160,85,54,0.15)';
                border = '#a05536';
              }
            }
            return (
              <button
                key={i}
                onClick={() => handleTap(letter)}
                disabled={selected !== null}
                className="aspect-square rounded-2xl flex items-center justify-center transition-all active:scale-95 disabled:active:scale-100"
                style={{
                  background: bg,
                  border: `2px solid ${border}`,
                  fontFamily: 'Amiri, serif',
                  fontSize: '38px',
                  color: phase.color,
                }}
              >
                {letter}
              </button>
            );
          })}
        </div>

        {/* Score indicator */}
        <p className="text-xs text-center mt-4" style={{ color: '#8b6b3d' }}>
          Skor sementara: <span className="font-bold" style={{ color: phase.color }}>{score}/{items.length}</span>
        </p>
      </div>
    );
  }

  return null; // 'done' state akan trigger onComplete & view change ke 'result'
}

// ============================================================================
// RESULT VIEW — score, XP, next-level / retry / upgrade-premium / back
// ============================================================================
function ResultView({ phase, level, result, nextLevel, lives = 10, onRetry, onNextLevel, onBack, onUpgrade }) {
  const isPerfect = result.score === result.total;
  const isPartial = result.score > 0 && !isPerfect;
  const hasNextLevel = !!nextLevel;
  // Conversion trigger: user finished last free level (no next playable) → Premium upsell
  const isEndOfFree = !hasNextLevel && phase.isFree;
  const noLives = lives <= 0;

  const tier = isPerfect
    ? { label: 'MUMTAAZ!', emoji: '🏆', color: '#c9a961', gradient: 'linear-gradient(135deg, #d4b876, #c9a961)', message: 'Kamu udah kuasai level ini!' }
    : isPartial
    ? { label: 'COBA LAGI', emoji: '🔥', color: '#a05536', gradient: 'linear-gradient(135deg, #a05536, #7a3d2a)', message: 'Coba ulangi biar dapet Mumtaaz!' }
    : { label: 'BELUM BERHASIL', emoji: '🌱', color: '#8b6b3d', gradient: 'linear-gradient(135deg, #8b6b3d, #6b4f2a)', message: 'Pelan-pelan dulu, pasti bisa.' };

  return (
    <div className="flex-1 flex flex-col px-5 py-6 items-center text-center overflow-y-auto">
      <div className="relative mb-4 mt-4">
        <div className="absolute inset-0 blur-3xl opacity-50" style={{ background: tier.color, borderRadius: '50%' }} />
        <div className="relative w-24 h-24 rounded-full flex items-center justify-center text-4xl" style={{ background: tier.gradient, boxShadow: `0 20px 40px -10px ${tier.color}80` }}>
          {tier.emoji}
        </div>
      </div>

      <p className="text-[11px] tracking-[0.3em] uppercase mb-2 font-bold" style={{ color: tier.color }}>{tier.label}</p>
      <h2 className="text-xl mb-1" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: '#0a4d3c' }}>
        {level.title}
      </h2>
      <p className="text-xs mb-3" style={{ color: '#8b6b3d' }}>{phase.emoji} {phase.title} · Level {level.level}</p>

      <div className="flex items-baseline gap-2 mb-2">
        <p className="text-5xl font-bold" style={{ fontFamily: 'Fraunces, serif', color: tier.color }}>{result.score}</p>
        <p className="text-base" style={{ color: '#8b6b3d' }}>/{result.total}</p>
      </div>

      <div className="flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full" style={{ background: `${tier.color}20`, border: `1.5px solid ${tier.color}` }}>
        <Star size={14} style={{ color: tier.color }} fill={tier.color} />
        <span className="text-sm font-bold" style={{ color: tier.color }}>+{result.xpEarned} XP</span>
      </div>

      <p className="text-sm max-w-xs mb-3" style={{ color: '#3d2817' }}>{tier.message}</p>

      {/* Lives indicator — kasih tau kalau berkurang/habis */}
      {!isPerfect && (
        <div className="flex items-center gap-1.5 mb-3 px-3 py-1.5 rounded-full text-xs" style={{ background: noLives ? 'rgba(160,85,54,0.15)' : 'rgba(198,69,69,0.12)' }}>
          <span>❤️</span>
          <span className="font-semibold" style={{ color: noLives ? '#a05536' : '#c64545' }}>
            -1 Nyawa · sisa {lives}/10
          </span>
        </div>
      )}

      {/* INFO CARD — muncul kalau user di akhir Phase 1 & perfect (Phase 2 belum playable content-wise) */}
      {isEndOfFree && isPerfect && (
        <div className="w-full max-w-xs mb-4 rounded-2xl p-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)' }}>
          <div className="absolute -right-4 -top-2 text-6xl opacity-15">🎉</div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-white opacity-90 mb-1 font-bold">Selamat!</p>
          <h3 className="text-base text-white mb-2 leading-tight font-bold" style={{ fontFamily: 'Fraunces, serif' }}>
            Kamu selesaikan Phase 1!
          </h3>
          <p className="text-xs text-white opacity-95 leading-relaxed mb-2">
            Phase berikutnya (Cara Baca, Menulis Kata, Kalimat, Paragraf) lagi disiapkan kontennya. <strong>Semua bakal gratis dimainkan</strong>.
          </p>
          <p className="text-xs text-white opacity-95">
            Sementara, ulangi level untuk perfect score atau coba game lain.
          </p>
        </div>
      )}

      {/* BUTTONS — urutan prioritas tergantung state */}
      <div className="w-full max-w-xs space-y-2 pb-4">
        {/* PRIMARY: Lanjut ke Level X+1 (kalau perfect & ada next level playable) */}
        {isPerfect && hasNextLevel && (
          <button
            onClick={onNextLevel}
            className="w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 text-white"
            style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)', boxShadow: '0 10px 24px -8px rgba(10,77,60,0.5)' }}
          >
            <ArrowRight size={16} /> Lanjut ke Level {nextLevel.level}
          </button>
        )}

        {/* PRIMARY (alt): Ulangi Level (kalau belum perfect) */}
        {!isPerfect && (
          <button
            onClick={onRetry}
            className="w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 text-white"
            style={{
              background: noLives ? '#8b6b3d' : tier.gradient,
              opacity: noLives ? 0.7 : 1,
            }}
          >
            {noLives ? (
              <>❤️ Nyawa habis — beli atau tunggu</>
            ) : (
              <>
                <RefreshCw size={16} /> Ulangi untuk Mumtaaz
              </>
            )}
          </button>
        )}

        {/* SECONDARY: Main lagi (kalau udah perfect) */}
        {isPerfect && (
          <button
            onClick={onRetry}
            className="w-full py-2.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2"
            style={{ background: 'rgba(201,169,97,0.18)', color: '#8b6b3d' }}
          >
            <RefreshCw size={14} /> Main lagi level ini
          </button>
        )}

        {/* TERTIARY: Kembali ke Pilih Level */}
        <button onClick={onBack} className="w-full py-3 rounded-2xl text-sm font-semibold" style={{ background: 'rgba(10,77,60,0.08)', color: '#0a4d3c' }}>
          Kembali ke Pilih Level
        </button>
      </div>
    </div>
  );
}
