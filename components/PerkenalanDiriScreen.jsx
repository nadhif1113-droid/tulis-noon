// components/PerkenalanDiriScreen.jsx
// Materi pelajaran Perkenalan Diri (التعارف) — 12 materi, 4 FREE + 8 PREMIUM.
// Per-materi 5 koin, bundle 150 koin (lifetime + future-proof).
//
// 4 view: list (pilih materi) → reader (vocab + dialog) → quiz → result

'use client';

import { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, Home, Volume2, Sparkles, Check, X, Lock, Coins, ChevronRight, BookOpen, Star } from 'lucide-react';
import { speakArabic as ttsSpeakArabic } from '@/lib/tts';
import {
  PERKENALAN_MATERI,
  PERKENALAN_MATERI_COST,
  PERKENALAN_BUNDLE_COST,
  PERKENALAN_MATERI_FREE_COUNT,
  isMateriUnlocked,
} from '@/data/perkenalan-diri-materi';

// ============================================================================
// MAIN — view router
// ============================================================================
export default function PerkenalanDiriScreen({
  userProfile,
  onBack,
  onHome,
  onComplete,        // (xpEarned) — dipanggil pas selesai quiz
  onSpendCoinsUnlockMateri,  // (materiId) => Promise<boolean>  — legacy koin (di-bypass kalau Mahir)
  onSpendCoinsUnlockBundle,  // () => Promise<boolean>          — legacy bundle koin
  onUpgrade,         // () => void — buka PremiumScreen (pivot dari koin → Mahir tier)
}) {
  const [view, setView] = useState('list');           // list | reader | quiz | result
  const [selectedMateri, setSelectedMateri] = useState(null);
  const [unlockTarget, setUnlockTarget] = useState(null); // materi yg mau di-unlock (modal)
  const [showBundleModal, setShowBundleModal] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  const userCoins = userProfile?.coins || 0;

  const handleSelectMateri = (materi) => {
    if (!isMateriUnlocked(materi, userProfile)) {
      // Pivot ke Mahir: tap materi terkunci → langsung buka PremiumScreen
      // (skip koin modal lama). Modal koin masih ada di file ini sbg legacy
      // tapi nggak lagi di-trigger dari flow utama.
      onUpgrade?.();
      return;
    }
    setSelectedMateri(materi);
    setView('reader');
  };

  const handleQuizComplete = ({ score, totalQuestions }) => {
    const xpEarned = Math.round((score / totalQuestions) * selectedMateri.xpReward);
    setQuizResult({ score, totalQuestions, xpEarned, isPerfect: score === totalQuestions });
    setView('result');
    if (onComplete) onComplete({ earned: xpEarned, score, totalQuestions, materiId: selectedMateri.id });
  };

  if (view === 'reader' && selectedMateri) {
    return <ReaderView materi={selectedMateri} onBack={() => setView('list')} onDone={() => setView('quiz')} />;
  }
  if (view === 'quiz' && selectedMateri) {
    return <QuizView materi={selectedMateri} onBack={() => setView('reader')} onComplete={handleQuizComplete} />;
  }
  if (view === 'result' && quizResult && selectedMateri) {
    return (
      <ResultView
        materi={selectedMateri}
        result={quizResult}
        onRetry={() => setView('quiz')}
        onBack={() => setView('list')}
      />
    );
  }

  return (
    <>
      <ListView
        userProfile={userProfile}
        onBack={onBack}
        onHome={onHome}
        onSelect={handleSelectMateri}
        onOpenBundle={() => setShowBundleModal(true)}
      />
      {/* Modal unlock per-materi */}
      {unlockTarget && (
        <UnlockMateriModal
          materi={unlockTarget}
          coins={userCoins}
          onClose={() => setUnlockTarget(null)}
          onUnlockSingle={async () => {
            if (userCoins < PERKENALAN_MATERI_COST) return;
            const ok = await onSpendCoinsUnlockMateri?.(unlockTarget.id);
            if (ok !== false) setUnlockTarget(null);
          }}
          onOpenBundle={() => { setUnlockTarget(null); setShowBundleModal(true); }}
        />
      )}
      {/* Modal bundle 150 koin */}
      {showBundleModal && (
        <UnlockBundleModal
          coins={userCoins}
          onClose={() => setShowBundleModal(false)}
          onUnlock={async () => {
            if (userCoins < PERKENALAN_BUNDLE_COST) return;
            const ok = await onSpendCoinsUnlockBundle?.();
            if (ok !== false) setShowBundleModal(false);
          }}
        />
      )}
    </>
  );
}

// ============================================================================
// LIST VIEW
// ============================================================================
function ListView({ userProfile, onBack, onHome, onSelect, onOpenBundle }) {
  const bundleUnlocked = !!userProfile?.perkenalanBundleUnlocked;
  const unlockedArr = userProfile?.unlockedPerkenalanMateri || [];
  const userCoins = userProfile?.coins || 0;

  // Hitung total premium yg sudah dibuka (selain bundle)
  const premiumOwned = bundleUnlocked
    ? PERKENALAN_MATERI.filter((m) => !m.isFree).length
    : unlockedArr.length;
  const premiumTotal = PERKENALAN_MATERI.filter((m) => !m.isFree).length;

  return (
    <div className="flex-1 flex flex-col px-5 py-6 pb-24">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <ArrowLeft size={18} style={{ color: '#0a4d3c' }} />
        </button>
        <button onClick={onHome || onBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <Home size={17} style={{ color: '#0a4d3c' }} />
        </button>
        <div className="flex-1">
          <p className="text-xs tracking-widest uppercase" style={{ color: '#8b6b3d' }}>Pelajaran</p>
          <h2 className="text-xl font-semibold" style={{ color: '#0a4d3c', fontFamily: 'Fraunces, serif' }}>
            Perkenalan Diri
          </h2>
        </div>
        <div className="flex items-center gap-1 px-3 py-1.5 rounded-full" style={{ background: 'rgba(201,169,97,0.18)' }}>
          <Coins size={14} style={{ color: '#c9a961' }} />
          <span className="text-xs font-bold" style={{ color: '#8b6b3d' }}>{userCoins}</span>
        </div>
      </div>

      {/* Hero */}
      <div className="rounded-3xl p-5 mb-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)' }}>
        <div className="absolute -right-4 -top-2 text-7xl opacity-15">👋</div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-white opacity-80 mb-1 font-bold">التعارف · Self-Introduction</p>
        <h3 className="text-xl text-white mb-2 leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700 }}>
          Kenalan pakai bahasa Arab
        </h3>
        <p className="text-sm text-white opacity-95 leading-relaxed">
          12 materi step-by-step — dari sebutin nama, asal, sampai cerita pengalaman haji. 4 materi pertama gratis.
        </p>
      </div>

      {/* Premium bundle upsell (kalau belum unlock) */}
      {!bundleUnlocked && (
        <button
          onClick={onOpenBundle}
          className="w-full rounded-2xl p-4 mb-4 text-left relative overflow-hidden active:scale-[0.98] transition-transform"
          style={{ background: 'linear-gradient(135deg, #c9a961, #d4b876)' }}
        >
          <div className="absolute -right-2 -top-2 text-5xl opacity-20">⭐</div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={14} style={{ color: 'white' }} />
            <p className="text-[10px] tracking-[0.3em] uppercase text-white font-bold">PROMO BUNDLE</p>
          </div>
          <p className="text-base font-bold text-white mb-1" style={{ fontFamily: 'Fraunces, serif' }}>
            Buka SEMUA materi premium
          </p>
          <p className="text-xs text-white opacity-90 leading-snug mb-2">
            150 koin sekali bayar — buka 8 materi premium + semua materi baru ke depannya.
          </p>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded-full text-[10px] font-bold" style={{ background: 'rgba(255,255,255,0.95)', color: '#8b6b3d' }}>
              <Coins size={10} className="inline mr-0.5" /> 150 koin
            </span>
            <span className="text-[10px] text-white opacity-80">Lifetime · {premiumOwned}/{premiumTotal} dibuka</span>
          </div>
        </button>
      )}

      {bundleUnlocked && (
        <div className="rounded-2xl p-3 mb-4 flex items-center gap-2" style={{ background: 'linear-gradient(135deg, rgba(10,77,60,0.08), rgba(201,169,97,0.08))', border: '1.5px solid rgba(10,77,60,0.15)' }}>
          <Sparkles size={16} style={{ color: '#c9a961' }} />
          <p className="text-xs leading-snug flex-1" style={{ color: '#0a4d3c' }}>
            <strong>Bundle Premium aktif</strong> — semua materi terbuka, termasuk yang akan datang.
          </p>
        </div>
      )}

      {/* List materi */}
      <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#8b6b3d' }}>
        Daftar Materi · {PERKENALAN_MATERI.length} pelajaran
      </p>
      <div className="space-y-3">
        {PERKENALAN_MATERI.map((m) => {
          const unlocked = isMateriUnlocked(m, userProfile);
          return (
            <button
              key={m.id}
              onClick={() => onSelect(m)}
              className="w-full p-4 rounded-2xl text-left flex items-start gap-3 transition-transform active:scale-[0.98] relative overflow-hidden"
              style={{
                background: 'white',
                border: unlocked ? '1.5px solid rgba(10,77,60,0.1)' : '1.5px dashed rgba(201,169,97,0.4)',
                opacity: unlocked ? 1 : 0.95,
              }}
            >
              {/* Order badge */}
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                  style={{ background: m.bgGradient }}
                >
                  {m.emoji}
                </div>
                <span className="text-[10px] font-bold" style={{ color: '#8b6b3d' }}>#{m.order}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <p className="font-semibold text-base leading-tight" style={{ color: m.color }}>{m.title}</p>
                  {m.isFree ? (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(10,77,60,0.12)', color: '#0a4d3c' }}>
                      FREE
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5" style={{ background: unlocked ? 'rgba(10,77,60,0.12)' : 'rgba(201,169,97,0.18)', color: unlocked ? '#0a4d3c' : '#8b6b3d' }}>
                      {unlocked ? <><Check size={9} /> DIBUKA</> : <><Lock size={9} /> MAHIR</>}
                    </span>
                  )}
                </div>
                <p className="text-xs leading-snug mb-1" style={{ fontFamily: 'Amiri, serif', color: '#8b6b3d', direction: 'rtl' }}>
                  {m.subtitle}
                </p>
                <p className="text-[11px] leading-snug mb-1.5" style={{ color: '#666' }}>{m.description}</p>
                <div className="flex items-center gap-3 text-[10px]">
                  <span style={{ color: '#c9a961' }}>⭐ +{m.xpReward} XP</span>
                  <span style={{ color: '#8b6b3d' }}>⏱ {m.estimatedMinutes} menit</span>
                  <span style={{ color: '#8b6b3d' }}>{m.vocab.length} vocab</span>
                </div>
              </div>
              {unlocked ? (
                <ChevronRight size={18} style={{ color: '#c9a961' }} className="flex-shrink-0 self-center" />
              ) : (
                <Lock size={16} style={{ color: '#c9a961' }} className="flex-shrink-0 self-center" />
              )}
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl p-3 mt-4" style={{ background: 'rgba(201,169,97,0.1)', border: '1px dashed #c9a961' }}>
        <p className="text-[10px] tracking-widest uppercase font-bold mb-1" style={{ color: '#c9a961' }}>Tips Belajar</p>
        <p className="text-xs leading-relaxed" style={{ color: '#8b6b3d' }}>
          Mulai dari materi <strong>#1 Nama</strong> dulu — biar pondasinya kuat. Setiap materi cuma 3-5 menit, bisa dicicil tiap hari sebelum Subuh atau setelah Maghrib.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// READER VIEW — vocab + dialog page-by-page
// ============================================================================
function ReaderView({ materi, onBack, onDone }) {
  // Build pages: 1 intro + N vocab + 1 dialog page
  const pages = [
    { type: 'intro' },
    ...materi.vocab.map((v) => ({ type: 'vocab', vocab: v })),
    { type: 'dialog' },
  ];
  const [pageIdx, setPageIdx] = useState(0);
  const page = pages[pageIdx];
  const isLast = pageIdx === pages.length - 1;

  // TTS Arab — server-side (Google Cloud TTS) + fallback Web Speech.
  const speakArabic = (text) => {
    ttsSpeakArabic(text, { rate: 0.8 });
  };

  const next = () => { if (isLast) onDone(); else setPageIdx(pageIdx + 1); };
  const prev = () => { if (pageIdx > 0) setPageIdx(pageIdx - 1); };

  return (
    <div className="flex-1 flex flex-col px-5 py-6">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <ArrowLeft size={18} style={{ color: '#0a4d3c' }} />
        </button>
        <div className="flex-1">
          <p className="text-[10px] tracking-widest uppercase" style={{ color: '#8b6b3d' }}>Materi #{materi.order}</p>
          <h2 className="text-base font-semibold" style={{ color: '#0a4d3c' }}>{materi.title}</h2>
        </div>
        <span className="text-xs font-bold" style={{ color: '#8b6b3d' }}>
          {pageIdx + 1} / {pages.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 rounded-full overflow-hidden mb-5" style={{ background: 'rgba(10,77,60,0.1)' }}>
        <div className="h-full transition-all" style={{ width: `${((pageIdx + 1) / pages.length) * 100}%`, background: '#0a4d3c' }} />
      </div>

      <div className="flex-1">
        {page.type === 'intro' && (
          <div className="text-center py-6">
            <div className="text-7xl mb-4">{materi.emoji}</div>
            <p className="text-3xl mb-2" style={{ fontFamily: 'Amiri, serif', color: '#0a4d3c', direction: 'rtl' }}>{materi.subtitle}</p>
            <h3 className="text-2xl mb-3" style={{ fontFamily: 'Fraunces, serif', color: '#0a4d3c', fontWeight: 700 }}>{materi.title}</h3>
            <p className="text-sm leading-relaxed px-2" style={{ color: '#666' }}>{materi.description}</p>
            <div className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full" style={{ background: 'rgba(201,169,97,0.18)' }}>
              <Star size={12} style={{ color: '#c9a961' }} />
              <span className="text-xs font-bold" style={{ color: '#8b6b3d' }}>+{materi.xpReward} XP setelah selesai</span>
            </div>
          </div>
        )}

        {page.type === 'vocab' && (
          <div className="text-center py-3">
            <p className="text-[10px] tracking-[0.3em] uppercase mb-3" style={{ color: '#8b6b3d' }}>Kosakata</p>
            <div className="rounded-3xl p-6 mb-4" style={{ background: 'linear-gradient(135deg, rgba(10,77,60,0.06), rgba(201,169,97,0.06))', border: '1.5px solid rgba(10,77,60,0.1)' }}>
              <p className="text-4xl mb-2 leading-snug" style={{ fontFamily: 'Amiri, serif', color: '#0a4d3c', direction: 'rtl' }}>
                {page.vocab.ar}
              </p>
              <p className="text-sm italic mb-2" style={{ color: '#8b6b3d' }}>{page.vocab.latin}</p>
              <p className="text-base font-medium" style={{ color: '#3d2817' }}>{page.vocab.id}</p>
            </div>
            <button
              onClick={() => speakArabic(page.vocab.ar)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-white font-semibold text-sm active:scale-95 transition-transform"
              style={{ background: '#0a4d3c' }}
            >
              <Volume2 size={16} /> Dengarkan
            </button>
          </div>
        )}

        {page.type === 'dialog' && (
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase mb-3 text-center" style={{ color: '#8b6b3d' }}>Contoh Dialog</p>
            <div className="space-y-3">
              {materi.dialog.map((d, i) => {
                const isA = d.speaker === 'A';
                return (
                  <div
                    key={i}
                    className="rounded-2xl p-4"
                    style={{
                      background: isA ? 'rgba(10,77,60,0.06)' : 'rgba(201,169,97,0.1)',
                      border: `1.5px solid ${isA ? 'rgba(10,77,60,0.15)' : 'rgba(201,169,97,0.25)'}`,
                      marginLeft: isA ? '0' : '24px',
                      marginRight: isA ? '24px' : '0',
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold tracking-widest" style={{ color: isA ? '#0a4d3c' : '#c9a961' }}>
                        {isA ? '👤 ORANG A' : '🧔 ORANG B'}
                      </span>
                      <button onClick={() => speakArabic(d.ar)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'white' }}>
                        <Volume2 size={12} style={{ color: '#0a4d3c' }} />
                      </button>
                    </div>
                    <p className="text-xl leading-relaxed mb-1" style={{ fontFamily: 'Amiri, serif', color: '#0a4d3c', direction: 'rtl' }}>
                      {d.ar}
                    </p>
                    <p className="text-xs italic mb-1" style={{ color: '#8b6b3d' }}>{d.latin}</p>
                    <p className="text-xs" style={{ color: '#3d2817' }}>{d.id}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Nav buttons */}
      <div className="flex gap-2 mt-6 pb-2">
        {pageIdx > 0 && (
          <button onClick={prev} className="px-4 py-3 rounded-2xl flex items-center gap-1.5 font-semibold text-sm" style={{ background: 'rgba(10,77,60,0.08)', color: '#0a4d3c' }}>
            <ArrowLeft size={14} /> Kembali
          </button>
        )}
        <button
          onClick={next}
          className="flex-1 py-3.5 rounded-2xl text-white font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)', boxShadow: '0 8px 20px -6px rgba(10,77,60,0.4)' }}
        >
          {isLast ? <>Lanjut ke Quiz <Sparkles size={16} /></> : <>Lanjut <ArrowRight size={16} /></>}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// QUIZ VIEW — multiple choice 3-4 pertanyaan
// ============================================================================
function QuizView({ materi, onBack, onComplete }) {
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const q = materi.quiz[qIdx];

  const handlePick = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === q.correctIdx;
    setFeedback(correct ? 'correct' : 'wrong');
    const newScore = correct ? score + 1 : score;
    if (correct) setScore(newScore);
    setTimeout(() => {
      setSelected(null);
      setFeedback(null);
      if (qIdx === materi.quiz.length - 1) {
        onComplete({ score: newScore, totalQuestions: materi.quiz.length });
      } else {
        setQIdx(qIdx + 1);
      }
    }, 1400);
  };

  return (
    <div className="flex-1 flex flex-col px-5 py-6">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <ArrowLeft size={18} style={{ color: '#0a4d3c' }} />
        </button>
        <div className="flex-1">
          <p className="text-[10px] tracking-widest uppercase" style={{ color: '#8b6b3d' }}>Quiz · {materi.title}</p>
          <h2 className="text-base font-semibold" style={{ color: '#0a4d3c' }}>Pertanyaan {qIdx + 1} dari {materi.quiz.length}</h2>
        </div>
      </div>
      <div className="h-1 rounded-full overflow-hidden mb-5" style={{ background: 'rgba(10,77,60,0.1)' }}>
        <div className="h-full transition-all" style={{ width: `${((qIdx + 1) / materi.quiz.length) * 100}%`, background: '#c9a961' }} />
      </div>

      <div className="rounded-3xl p-5 mb-5" style={{ background: 'linear-gradient(135deg, rgba(10,77,60,0.06), rgba(201,169,97,0.06))', border: '1.5px solid rgba(10,77,60,0.1)' }}>
        <p className="text-[10px] tracking-widest uppercase mb-2" style={{ color: '#8b6b3d' }}>Pertanyaan</p>
        <p className="text-base leading-relaxed font-medium" style={{ color: '#0a4d3c' }}>{q.q}</p>
      </div>

      <div className="space-y-2 flex-1">
        {q.options.map((opt, i) => {
          const isPicked = selected === i;
          const isCorrect = i === q.correctIdx;
          let bg = 'white', border = '1.5px solid rgba(10,77,60,0.1)', color = '#1a1a1a';
          if (selected !== null) {
            if (isCorrect) { bg = 'rgba(10,77,60,0.1)'; border = '1.5px solid #0a4d3c'; color = '#0a4d3c'; }
            else if (isPicked) { bg = 'rgba(160,85,54,0.1)'; border = '1.5px solid #a05536'; color = '#a05536'; }
          }
          return (
            <button
              key={i}
              onClick={() => handlePick(i)}
              disabled={selected !== null}
              className="w-full p-4 rounded-2xl text-left flex items-center gap-3 active:scale-[0.98] transition-transform"
              style={{ background: bg, border, color }}
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs" style={{ background: 'rgba(10,77,60,0.08)', color: '#0a4d3c' }}>
                {['A', 'B', 'C', 'D'][i]}
              </div>
              <span className="flex-1 text-sm">{opt}</span>
              {selected !== null && isCorrect && <Check size={18} style={{ color: '#0a4d3c' }} />}
              {selected !== null && isPicked && !isCorrect && <X size={18} style={{ color: '#a05536' }} />}
            </button>
          );
        })}
      </div>

      {feedback && (
        <div className="mt-4 rounded-2xl p-3 text-center" style={{ background: feedback === 'correct' ? 'rgba(10,77,60,0.1)' : 'rgba(160,85,54,0.1)', border: `1.5px solid ${feedback === 'correct' ? '#0a4d3c' : '#a05536'}` }}>
          <p className="text-sm font-bold" style={{ color: feedback === 'correct' ? '#0a4d3c' : '#a05536' }}>
            {feedback === 'correct' ? '✓ Benar!' : '✗ Jawaban benar: ' + q.options[q.correctIdx]}
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// RESULT VIEW
// ============================================================================
function ResultView({ materi, result, onRetry, onBack }) {
  const percent = Math.round((result.score / result.totalQuestions) * 100);
  return (
    <div className="flex-1 flex flex-col px-5 py-6">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <ArrowLeft size={18} style={{ color: '#0a4d3c' }} />
        </button>
        <div className="flex-1">
          <p className="text-[10px] tracking-widest uppercase" style={{ color: '#8b6b3d' }}>Selesai</p>
          <h2 className="text-base font-semibold" style={{ color: '#0a4d3c' }}>{materi.title}</h2>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="text-7xl mb-4">{result.isPerfect ? '🏆' : (percent >= 75 ? '⭐' : '✨')}</div>
        <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Fraunces, serif', color: '#0a4d3c' }}>
          {result.isPerfect ? 'Sempurna!' : (percent >= 75 ? 'Bagus!' : 'Coba lagi yuk')}
        </h3>
        <p className="text-base mb-5" style={{ color: '#666' }}>
          Skor: <strong>{result.score} / {result.totalQuestions}</strong> ({percent}%)
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'rgba(201,169,97,0.18)' }}>
          <Star size={14} style={{ color: '#c9a961' }} />
          <span className="font-bold text-sm" style={{ color: '#8b6b3d' }}>+{result.xpEarned} XP didapat</span>
        </div>
      </div>

      <div className="flex gap-2 pb-2">
        <button onClick={onRetry} className="flex-1 py-3.5 rounded-2xl font-semibold text-sm active:scale-[0.98]" style={{ background: 'rgba(10,77,60,0.08)', color: '#0a4d3c' }}>
          Ulangi Quiz
        </button>
        <button onClick={onBack} className="flex-1 py-3.5 rounded-2xl text-white font-bold active:scale-[0.98]" style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)' }}>
          Lanjut Materi →
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// UNLOCK MATERI MODAL — 5 koin per-materi
// ============================================================================
function UnlockMateriModal({ materi, coins, onClose, onUnlockSingle, onOpenBundle }) {
  const canAfford = coins >= PERKENALAN_MATERI_COST;
  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: 'rgba(10,30,25,0.85)' }} onClick={onClose}>
      <div
        className="w-full max-w-md max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl"
        style={{ background: 'linear-gradient(180deg, #faf6ee 0%, #f3ebd9 100%)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between px-6 pt-6 pb-2">
          <div className="flex-1">
            <p className="text-[10px] tracking-[0.3em] uppercase font-bold mb-1" style={{ color: '#c9a961' }}>🔒 Materi Premium</p>
            <h2 className="text-2xl leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: '#0a4d3c' }}>{materi.title}</h2>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(10,77,60,0.08)' }}>
            <X size={16} style={{ color: '#0a4d3c' }} />
          </button>
        </div>
        <div className="px-6 pb-6">
          <div className="rounded-3xl p-5 mb-4 text-center" style={{ background: materi.bgGradient }}>
            <div className="text-6xl mb-2">{materi.emoji}</div>
            <p className="text-base text-white font-semibold leading-tight" style={{ fontFamily: 'Fraunces, serif' }}>{materi.subtitle}</p>
          </div>

          <p className="text-sm leading-relaxed mb-4" style={{ color: '#3d2817' }}>{materi.description}</p>

          <div className="rounded-2xl p-3 mb-4" style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.1)' }}>
            <p className="text-[10px] tracking-widest uppercase font-bold mb-2" style={{ color: '#8b6b3d' }}>Kamu akan dapat</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-bold" style={{ color: '#0a4d3c' }}>{materi.vocab.length}</p>
                <p className="text-[10px]" style={{ color: '#8b6b3d' }}>Vocab</p>
              </div>
              <div>
                <p className="text-lg font-bold" style={{ color: '#0a4d3c' }}>{materi.dialog.length}</p>
                <p className="text-[10px]" style={{ color: '#8b6b3d' }}>Dialog</p>
              </div>
              <div>
                <p className="text-lg font-bold" style={{ color: '#c9a961' }}>+{materi.xpReward}</p>
                <p className="text-[10px]" style={{ color: '#8b6b3d' }}>XP</p>
              </div>
            </div>
          </div>

          {/* Saldo koin */}
          <div className="rounded-2xl p-3 mb-3 flex items-center justify-between" style={{ background: 'rgba(201,169,97,0.12)' }}>
            <div className="flex items-center gap-2">
              <Coins size={16} style={{ color: '#c9a961' }} />
              <span className="text-xs font-bold" style={{ color: '#8b6b3d' }}>Saldo koin kamu</span>
            </div>
            <span className="text-base font-bold" style={{ color: '#0a4d3c' }}>{coins}</span>
          </div>

          {/* CTA buka materi ini */}
          <button
            onClick={onUnlockSingle}
            disabled={!canAfford}
            className="w-full py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 mb-2 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)', boxShadow: '0 10px 24px -8px rgba(10,77,60,0.5)' }}
          >
            <Coins size={16} /> Buka Materi Ini · {PERKENALAN_MATERI_COST} koin
          </button>

          {!canAfford && (
            <p className="text-[11px] text-center mb-3" style={{ color: '#a05536' }}>
              Koin kamu kurang. Selesaikan game untuk dapet koin gratis.
            </p>
          )}

          {/* Upgrade ke bundle */}
          <button
            onClick={onOpenBundle}
            className="w-full py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2"
            style={{ background: 'rgba(201,169,97,0.18)', color: '#8b6b3d', border: '1.5px dashed #c9a961' }}
          >
            <Sparkles size={14} /> Atau buka SEMUA materi · {PERKENALAN_BUNDLE_COST} koin
          </button>
          <p className="text-[10px] text-center mt-2" style={{ color: '#8b6b3d' }}>
            Bundle = lifetime + semua materi baru ke depan
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// UNLOCK BUNDLE MODAL — 150 koin lifetime
// ============================================================================
function UnlockBundleModal({ coins, onClose, onUnlock }) {
  const canAfford = coins >= PERKENALAN_BUNDLE_COST;
  const premiumCount = PERKENALAN_MATERI.filter((m) => !m.isFree).length;
  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: 'rgba(10,30,25,0.85)' }} onClick={onClose}>
      <div
        className="w-full max-w-md max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl"
        style={{ background: 'linear-gradient(180deg, #faf6ee 0%, #f3ebd9 100%)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between px-6 pt-6 pb-2">
          <div className="flex-1">
            <p className="text-[10px] tracking-[0.3em] uppercase font-bold mb-1" style={{ color: '#c9a961' }}>⭐ BUNDLE PREMIUM</p>
            <h2 className="text-2xl leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: '#0a4d3c' }}>
              Buka Semua Materi Selamanya
            </h2>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(10,77,60,0.08)' }}>
            <X size={16} style={{ color: '#0a4d3c' }} />
          </button>
        </div>
        <div className="px-6 pb-6">
          <div className="rounded-3xl p-6 mb-4 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #c9a961, #d4b876)' }}>
            <div className="absolute inset-0 opacity-15" style={{ background: 'radial-gradient(circle at 50% 30%, white 0%, transparent 60%)' }} />
            <div className="relative">
              <div className="text-6xl mb-2">🌟</div>
              <p className="text-base text-white opacity-95 font-semibold leading-tight" style={{ fontFamily: 'Fraunces, serif' }}>
                Akses Penuh Perkenalan Diri
              </p>
            </div>
          </div>

          <p className="text-sm leading-relaxed mb-4" style={{ color: '#3d2817' }}>
            Bayar <strong>1 kali</strong>, buka <strong>semua {premiumCount} materi premium</strong> sekarang + <em>otomatis terbuka</em> setiap materi baru yang kami tambahkan ke depan.
          </p>

          <div className="space-y-2 mb-4">
            {[
              { icon: '🔓', t: `${premiumCount} materi premium langsung terbuka` },
              { icon: '🚀', t: 'Otomatis dapat materi baru (no extra cost)' },
              { icon: '⭐', t: 'XP bonus +400 total dari semua materi' },
              { icon: '🎯', t: 'Skill set lengkap buat ngobrol di Saudi' },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-2 rounded-xl p-2.5" style={{ background: 'rgba(10,77,60,0.06)' }}>
                <span className="text-base">{b.icon}</span>
                <p className="text-xs leading-snug flex-1" style={{ color: '#3d2817' }}>{b.t}</p>
              </div>
            ))}
          </div>

          {/* Saldo */}
          <div className="rounded-2xl p-3 mb-3 flex items-center justify-between" style={{ background: 'rgba(201,169,97,0.12)' }}>
            <div className="flex items-center gap-2">
              <Coins size={16} style={{ color: '#c9a961' }} />
              <span className="text-xs font-bold" style={{ color: '#8b6b3d' }}>Saldo koin kamu</span>
            </div>
            <span className="text-base font-bold" style={{ color: '#0a4d3c' }}>{coins}</span>
          </div>

          <button
            onClick={onUnlock}
            disabled={!canAfford}
            className="w-full py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #c9a961, #d4b876)', boxShadow: '0 10px 24px -8px rgba(201,169,97,0.5)' }}
          >
            <Sparkles size={18} /> Buka Bundle · {PERKENALAN_BUNDLE_COST} koin
          </button>

          {!canAfford && (
            <p className="text-[11px] text-center mt-2" style={{ color: '#a05536' }}>
              Koin kamu kurang {PERKENALAN_BUNDLE_COST - coins} lagi. Selesaikan game untuk earning lebih.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
