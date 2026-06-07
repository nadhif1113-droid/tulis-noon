// components/LessonDetailScreen.jsx
// Render satu modul pelajaran — vocab list + dialog percakapan dgn TTS Arab.
// Dipake untuk Umrah/Pelajar/Profesional learning paths.

'use client';

import { useState, useRef, useMemo } from 'react';
import { ArrowLeft, ArrowRight, Home, Volume2, Sparkles, BookOpen, MessageCircle, ChevronRight, Star, Lock, Coins, X, Award, Check, RotateCcw } from 'lucide-react';
import { isConversationFree, isConversationUnlocked, getPricing } from '@/lib/learning-pricing';
import { speakArabic as ttsSpeakArabic } from '@/lib/tts';
import { generateModuleQuiz, quizPassed, calcQuizBonusXp } from '@/lib/lesson-quiz-generator';
import InsightCard from '@/components/InsightCard';
import NextActionModal from '@/components/NextActionModal';

export default function LessonDetailScreen({ module, userProfile, userId, onBack, onHome, onComplete, onUnlockConversation, onNextModule }) {
  const [view, setView] = useState('overview'); // overview | vocab | conversation | quiz
  const [convIdx, setConvIdx] = useState(0);
  const [unlockTargetConv, setUnlockTargetConv] = useState(null);
  const [showNextAction, setShowNextAction] = useState(false);
  const pricing = getPricing(module?.pathId);

  // TTS Arab — server-side (Google Cloud TTS) + fallback Web Speech.
  const speakArabic = (text) => {
    ttsSpeakArabic(text, { rate: 0.85 });
  };

  if (!module) return null;

  if (view === 'vocab') {
    return <VocabView module={module} onBack={() => setView('overview')} onSpeak={speakArabic} />;
  }
  if (view === 'quiz') {
    return (
      <QuizView
        module={module}
        onSpeak={speakArabic}
        onBack={() => setView('overview')}
        onFinish={(bonusXp) => {
          if (bonusXp > 0 && onComplete) onComplete(bonusXp);
          setView('overview');
        }}
      />
    );
  }
  if (view === 'conversation') {
    return (
      <>
        <ConversationView
          module={module}
          convIdx={convIdx}
          userId={userId}
          onSpeak={speakArabic}
          onBack={() => setView('overview')}
          onNext={() => {
            if (convIdx < module.conversations.length - 1) {
              setConvIdx(convIdx + 1);
            } else {
              // Selesai semua percakapan → tampil modal Next Action (bukan langsung close)
              if (onComplete) onComplete(module.xpReward);
              setShowNextAction(true);
            }
          }}
          onPrev={() => { if (convIdx > 0) setConvIdx(convIdx - 1); }}
        />
        {showNextAction && (
          <NextActionModal
            moduleTitle={module.title}
            moduleEmoji={module.emoji || '✅'}
            convsDone={module.conversations.length}
            convsTotal={module.conversations.length}
            xpEarned={module.xpReward}
            hasQuiz={true}
            hasNextModule={!!onNextModule}
            onTakeQuiz={() => {
              setShowNextAction(false);
              setView('quiz');
            }}
            onNextModule={() => {
              setShowNextAction(false);
              setView('overview');
              setConvIdx(0);
              if (onNextModule) onNextModule();
            }}
            onRestart={() => {
              setShowNextAction(false);
              setConvIdx(0);
              // tetap di view conversation
            }}
            onFinish={() => {
              setShowNextAction(false);
              setView('overview');
              setConvIdx(0);
            }}
            onClose={() => {
              // Dismiss modal saja, gak navigate. User bisa pilih nanti.
              setShowNextAction(false);
              setView('overview');
              setConvIdx(0);
            }}
          />
        )}
      </>
    );
  }

  return (
    <>
      <OverviewView
        module={module}
        userProfile={userProfile}
        pricing={pricing}
        onBack={onBack}
        onHome={onHome}
        onOpenVocab={() => setView('vocab')}
        onOpenQuiz={() => setView('quiz')}
        onOpenConv={(idx) => {
          if (!isConversationUnlocked(module, idx, userProfile)) {
            setUnlockTargetConv(idx);
            return;
          }
          setConvIdx(idx);
          setView('conversation');
        }}
      />
      {unlockTargetConv !== null && (
        <UnlockConvModal
          module={module}
          convIdx={unlockTargetConv}
          pricing={pricing}
          coins={userProfile?.coins || 0}
          onClose={() => setUnlockTargetConv(null)}
          onUnlock={async () => {
            const ok = await onUnlockConversation?.(module.id, unlockTargetConv);
            if (ok !== false) {
              setConvIdx(unlockTargetConv);
              setUnlockTargetConv(null);
              setView('conversation');
            }
          }}
        />
      )}
    </>
  );
}

// ============================================================================
// OVERVIEW — landing modul
// ============================================================================
function OverviewView({ module, userProfile, pricing, onBack, onHome, onOpenVocab, onOpenConv, onOpenQuiz }) {
  return (
    <div className="flex-1 flex flex-col px-5 py-6 pb-24">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <ArrowLeft size={18} style={{ color: '#0a4d3c' }} />
        </button>
        {onHome && (
          <button onClick={onHome} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
            <Home size={17} style={{ color: '#0a4d3c' }} />
          </button>
        )}
        <div className="flex-1">
          <p className="text-[10px] tracking-widest uppercase" style={{ color: '#8b6b3d' }}>Modul #{module.order}</p>
          <h2 className="text-base font-semibold" style={{ color: '#0a4d3c' }}>{module.title}</h2>
        </div>
      </div>

      {/* Hero */}
      <div className="rounded-3xl p-5 mb-4 relative overflow-hidden" style={{ background: module.bgGradient }}>
        <div className="absolute -right-4 -top-4 text-7xl opacity-15">{module.emoji}</div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-white opacity-80 mb-1 font-bold" style={{ fontFamily: 'Amiri, serif', direction: 'rtl' }}>
          {module.arabic}
        </p>
        <h3 className="text-2xl text-white mb-2 leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700 }}>
          {module.title}
        </h3>
        <p className="text-sm text-white opacity-95 leading-relaxed mb-3">{module.description}</p>
        <div className="flex items-center gap-3 text-xs text-white opacity-90">
          <span>⭐ +{module.xpReward} XP</span>
          <span>⏱ {module.estimatedMinutes} menit</span>
          <span>📚 {module.vocab.length} kosakata</span>
          <span>💬 {module.conversations.length} percakapan</span>
        </div>
      </div>

      {module.isStub && (
        <div className="rounded-2xl p-3 mb-4" style={{ background: 'rgba(201,169,97,0.12)', border: '1px dashed #c9a961' }}>
          <p className="text-xs leading-relaxed" style={{ color: '#8b6b3d' }}>
            <strong>🚧 Konten sedang dikembangkan</strong> — kosakata utama sudah ada, percakapan lengkap akan ditambahkan di update berikutnya.
          </p>
        </div>
      )}

      {/* Vocab button */}
      <button
        onClick={onOpenVocab}
        className="w-full p-4 rounded-2xl flex items-center gap-3 mb-3 active:scale-[0.98] transition-transform"
        style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.12)' }}
      >
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <BookOpen size={20} style={{ color: '#0a4d3c' }} />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-bold" style={{ color: '#0a4d3c' }}>Kosakata Penting</p>
          <p className="text-[11px]" style={{ color: '#8b6b3d' }}>Pelajari {module.vocab.length} kata kunci dulu</p>
        </div>
        <ChevronRight size={18} style={{ color: '#c9a961' }} />
      </button>

      {/* Conversations list */}
      <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#8b6b3d' }}>
        Percakapan ({module.conversations.length})
        {!pricing.isFullyFree && <span className="ml-1 normal-case tracking-normal" style={{ color: '#c9a961' }}>· {pricing.perModuleFreeConvs} pertama GRATIS</span>}
      </p>
      <div className="space-y-2">
        {module.conversations.map((conv, idx) => {
          const free = isConversationFree(module, idx);
          const unlocked = isConversationUnlocked(module, idx, userProfile);
          return (
            <button
              key={conv.id}
              onClick={() => onOpenConv(idx)}
              className="w-full p-3.5 rounded-2xl flex items-center gap-3 active:scale-[0.98] transition-transform"
              style={{
                background: 'white',
                border: unlocked ? '1px solid rgba(10,77,60,0.08)' : '1.5px dashed rgba(201,169,97,0.45)',
                opacity: unlocked ? 1 : 0.92,
              }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-xs" style={{ background: `${module.color}15`, color: module.color }}>
                {idx + 1}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold leading-tight" style={{ color: '#1a1a1a' }}>{conv.title}</p>
                  {free && (
                    <span className="text-[8px] font-bold px-1 py-0.5 rounded" style={{ background: 'rgba(10,77,60,0.1)', color: '#0a4d3c' }}>FREE</span>
                  )}
                  {!free && unlocked && (
                    <span className="text-[8px] font-bold px-1 py-0.5 rounded" style={{ background: 'rgba(10,77,60,0.1)', color: '#0a4d3c' }}>✓ DIBUKA</span>
                  )}
                </div>
                <p className="text-[10px] truncate" style={{ color: '#8b6b3d' }}>{conv.situation}</p>
              </div>
              {unlocked ? (
                <ChevronRight size={16} style={{ color: '#c9a961' }} />
              ) : (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: 'rgba(201,169,97,0.18)' }}>
                  <Lock size={10} style={{ color: '#8b6b3d' }} />
                  <span className="text-[10px] font-bold" style={{ color: '#8b6b3d' }}>{pricing.conversationPriceCoins}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Latihan Soal — auto-generated quiz dari vocab + dialog */}
      {module.vocab && module.vocab.length >= 3 && (
        <>
          <p className="text-xs tracking-widest uppercase mt-5 mb-3" style={{ color: '#8b6b3d' }}>Uji Pemahaman</p>
          <button
            onClick={onOpenQuiz}
            className="w-full text-left rounded-2xl p-5 relative overflow-hidden active:scale-[0.98] transition-transform"
            style={{ background: 'linear-gradient(135deg, #a05536, #c46a3f)', boxShadow: '0 8px 20px -8px rgba(160,85,54,0.5)' }}
          >
            <div className="absolute -right-4 -top-3 text-7xl opacity-15">🎯</div>
            <div className="relative flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.95)' }}>
                <Award size={20} style={{ color: '#a05536' }} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] tracking-widest uppercase text-white opacity-90 mb-0.5 font-bold">🎯 LATIHAN SOAL</p>
                <p className="text-base font-bold text-white leading-tight">Uji Pemahamanmu</p>
                <p className="text-[11px] text-white opacity-90 leading-snug">7 soal campuran — vocab, audio, lengkapi dialog · lulus dapat bonus XP</p>
              </div>
              <ChevronRight size={18} className="text-white flex-shrink-0" />
            </div>
          </button>
        </>
      )}
    </div>
  );
}

// ============================================================================
// VOCAB VIEW — list semua kosakata + TTS
// ============================================================================
function VocabView({ module, onBack, onSpeak }) {
  return (
    <div className="flex-1 flex flex-col px-5 py-6 pb-24">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <ArrowLeft size={18} style={{ color: '#0a4d3c' }} />
        </button>
        <div className="flex-1">
          <p className="text-[10px] tracking-widest uppercase" style={{ color: '#8b6b3d' }}>Kosakata · {module.title}</p>
          <h2 className="text-base font-semibold" style={{ color: '#0a4d3c' }}>{module.vocab.length} kata kunci</h2>
        </div>
      </div>

      <div className="space-y-2">
        {module.vocab.map((v, i) => (
          <div key={i} className="rounded-2xl p-3 flex items-center gap-3" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.08)' }}>
            <button onClick={() => onSpeak(v.ar)} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(10,77,60,0.08)' }}>
              <Volume2 size={14} style={{ color: '#0a4d3c' }} />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-lg leading-tight" style={{ fontFamily: 'Amiri, serif', color: '#0a4d3c', direction: 'rtl' }}>{v.ar}</p>
              <p className="text-[11px] italic" style={{ color: '#8b6b3d' }}>{v.latin}</p>
            </div>
            <p className="text-xs font-medium text-right" style={{ color: '#3d2817', maxWidth: '40%' }}>{v.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// CONVERSATION VIEW — dialog per situation dgn TTS
// ============================================================================
function ConversationView({ module, convIdx, userId, onSpeak, onBack, onNext, onPrev }) {
  const conv = module.conversations[convIdx];
  const isLast = convIdx === module.conversations.length - 1;

  // Build payload untuk insight API — kasih konteks minimal
  const insightPayload = useMemo(() => ({
    moduleTitle: module.title,
    convTitle: conv?.title || '',
    situation: conv?.situation || '',
    vocab: (module.vocab || []).slice(0, 8).map((v) => ({ ar: v.ar, latin: v.latin, id: v.id })),
    dialog: (conv?.dialog || []).map((d) => ({ speaker: d.speaker, ar: d.ar, latin: d.latin, id: d.id })),
  }), [module, conv]);

  return (
    <div className="flex-1 flex flex-col px-5 py-6 pb-24">
      <div className="flex items-center gap-2 mb-3">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <ArrowLeft size={18} style={{ color: '#0a4d3c' }} />
        </button>
        <div className="flex-1">
          <p className="text-[10px] tracking-widest uppercase" style={{ color: '#8b6b3d' }}>
            Percakapan {convIdx + 1}/{module.conversations.length}
          </p>
          <h2 className="text-base font-semibold leading-tight" style={{ color: '#0a4d3c' }}>{conv.title}</h2>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 rounded-full overflow-hidden mb-4" style={{ background: 'rgba(10,77,60,0.1)' }}>
        <div className="h-full transition-all" style={{ width: `${((convIdx + 1) / module.conversations.length) * 100}%`, background: module.color }} />
      </div>

      {/* Situation card */}
      <div className="rounded-2xl p-3 mb-4" style={{ background: 'rgba(201,169,97,0.1)', border: '1px dashed #c9a961' }}>
        <p className="text-[10px] tracking-widest uppercase font-bold mb-1" style={{ color: '#c9a961' }}>📍 Situasi</p>
        <p className="text-xs leading-snug" style={{ color: '#8b6b3d' }}>{conv.situation}</p>
      </div>

      {/* Dialog turns */}
      <div className="space-y-3 flex-1">
        {conv.dialog.map((d, i) => {
          // Speaker pertama (Petugas/A) di kiri, kedua (Anda/B) di kanan
          const speakers = [...new Set(conv.dialog.map(t => t.speaker))];
          const isFirstSpeaker = d.speaker === speakers[0];
          return (
            <div
              key={i}
              className="rounded-2xl p-3.5"
              style={{
                background: isFirstSpeaker ? 'rgba(10,77,60,0.06)' : 'rgba(201,169,97,0.1)',
                border: `1.5px solid ${isFirstSpeaker ? 'rgba(10,77,60,0.15)' : 'rgba(201,169,97,0.3)'}`,
                marginLeft: isFirstSpeaker ? '0' : '24px',
                marginRight: isFirstSpeaker ? '24px' : '0',
              }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: isFirstSpeaker ? '#0a4d3c' : '#c9a961' }}>
                  {isFirstSpeaker ? '👤 ' : '🧔 '}{d.speaker}
                </span>
                <button onClick={() => onSpeak(d.ar)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'white' }}>
                  <Volume2 size={12} style={{ color: '#0a4d3c' }} />
                </button>
              </div>
              <p className="text-xl leading-relaxed mb-1" style={{ fontFamily: 'Amiri, serif', color: '#0a4d3c', direction: 'rtl' }}>
                {d.ar}
              </p>
              <p className="text-[11px] italic mb-1" style={{ color: '#8b6b3d' }}>{d.latin}</p>
              <p className="text-[11px]" style={{ color: '#3d2817' }}>{d.id}</p>
            </div>
          );
        })}
      </div>

      {/* Insight Card — pemahaman pasca-percakapan */}
      <InsightCard
        moduleId={module.id}
        convId={conv?.id || `conv-${convIdx}`}
        payload={insightPayload}
        userId={userId}
      />

      {/* Nav buttons */}
      <div className="flex gap-2 mt-4">
        {convIdx > 0 && (
          <button onClick={onPrev} className="px-4 py-3 rounded-2xl flex items-center gap-1.5 font-semibold text-sm" style={{ background: 'rgba(10,77,60,0.08)', color: '#0a4d3c' }}>
            <ArrowLeft size={14} /> Sebelumnya
          </button>
        )}
        <button
          onClick={onNext}
          className="flex-1 py-3.5 rounded-2xl text-white font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          style={{ background: `linear-gradient(135deg, ${module.color}, ${module.color}cc)`, boxShadow: `0 8px 20px -6px ${module.color}66` }}
        >
          {isLast ? <>Selesai <Sparkles size={16} /></> : <>Lanjut <ArrowRight size={16} /></>}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// UNLOCK CONVERSATION MODAL — bayar koin untuk buka percakapan ke-6+
// ============================================================================
function UnlockConvModal({ module, convIdx, pricing, coins, onClose, onUnlock }) {
  const conv = module.conversations[convIdx];
  const canAfford = coins >= pricing.conversationPriceCoins;
  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: 'rgba(10,30,25,0.85)' }} onClick={onClose}>
      <div
        className="w-full max-w-md max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl"
        style={{ background: 'linear-gradient(180deg, #faf6ee 0%, #f3ebd9 100%)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between px-6 pt-6 pb-2">
          <div className="flex-1">
            <p className="text-[10px] tracking-[0.3em] uppercase font-bold mb-1" style={{ color: '#c9a961' }}>🔒 Percakapan #{convIdx + 1}</p>
            <h2 className="text-xl leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: '#0a4d3c' }}>
              {conv.title}
            </h2>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(10,77,60,0.08)' }}>
            <X size={16} style={{ color: '#0a4d3c' }} />
          </button>
        </div>

        <div className="px-6 pb-6">
          <div className="rounded-3xl p-5 mb-4 text-center" style={{ background: module.bgGradient }}>
            <div className="text-5xl mb-2">{module.emoji}</div>
            <p className="text-sm text-white font-semibold leading-tight" style={{ fontFamily: 'Fraunces, serif' }}>
              {conv.situation}
            </p>
          </div>

          <p className="text-sm leading-relaxed mb-3" style={{ color: '#3d2817' }}>
            Buka percakapan ini buat akses <strong>{conv.dialog.length} dialog</strong> dengan dialek Saudi yang siap dipake langsung di lapangan.
          </p>

          <div className="rounded-2xl p-3 mb-3 flex items-center justify-between" style={{ background: 'rgba(201,169,97,0.12)' }}>
            <div className="flex items-center gap-2">
              <Coins size={16} style={{ color: '#c9a961' }} />
              <span className="text-xs font-bold" style={{ color: '#8b6b3d' }}>Saldo koin</span>
            </div>
            <span className="text-base font-bold" style={{ color: '#0a4d3c' }}>{coins}</span>
          </div>

          <button
            onClick={onUnlock}
            disabled={!canAfford}
            className="w-full py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: `linear-gradient(135deg, ${module.color}, ${module.color}cc)`, boxShadow: `0 10px 24px -8px ${module.color}66` }}
          >
            <Coins size={16} /> Buka Percakapan · {pricing.conversationPriceCoins} koin
          </button>

          {!canAfford && (
            <p className="text-[11px] text-center mt-2" style={{ color: '#a05536' }}>
              Koin kamu kurang {pricing.conversationPriceCoins - coins} lagi. Top-up atau selesaikan game untuk earn lebih.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// QUIZ VIEW — auto-generated dari vocab + dialog modul.
// Pattern mirip NahwuShorf quiz: progress bar, soal MC, cek + explanation, hasil.
// ============================================================================
function QuizView({ module, onSpeak, onBack, onFinish }) {
  const questions = useMemo(() => generateModuleQuiz(module, 7), [module]);
  const [idx, setIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState([]); // array of boolean (correct?)
  const [done, setDone] = useState(false);

  if (questions.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center" style={{ height: '100%' }}>
        <p className="text-sm mb-4" style={{ color: '#8b6b3d' }}>Modul ini belum punya cukup data untuk kuis otomatis.</p>
        <button onClick={onBack} className="px-5 py-2.5 rounded-full font-semibold" style={{ background: '#0a4d3c', color: 'white' }}>Kembali</button>
      </div>
    );
  }

  if (done) {
    const correct = answers.filter(Boolean).length;
    const total = questions.length;
    const percent = Math.round((correct / total) * 100);
    const passed = quizPassed(correct, total);
    const bonusXp = calcQuizBonusXp(correct, total);
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-6 text-center" style={{ height: '100%' }}>
        <div className="text-7xl mb-3">{passed ? (correct === total ? '🏆' : '🌟') : '📚'}</div>
        <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Fraunces, serif', color: '#0a4d3c' }}>
          {passed ? (correct === total ? 'Sempurna!' : 'Lulus, mantap!') : 'Hampir!'}
        </h2>
        <p className="text-sm mb-5" style={{ color: '#8b6b3d' }}>{module.title}</p>
        <div className="w-full max-w-xs rounded-2xl p-5 mb-4" style={{ background: 'white', border: `1.5px solid ${passed ? '#0a4d3c40' : '#a0553640'}` }}>
          <p className="text-4xl font-bold mb-1" style={{ color: '#0a4d3c', fontFamily: 'Fraunces, serif' }}>{correct}/{total}</p>
          <p className="text-xs mb-3" style={{ color: '#8b6b3d' }}>Skor ({percent}%) {passed ? '· LULUS ≥70%' : '· butuh ≥70% untuk lulus'}</p>
          <div className="h-2 rounded-full overflow-hidden mb-3" style={{ background: 'rgba(10,77,60,0.08)' }}>
            <div className="h-full" style={{ width: `${percent}%`, background: passed ? '#0a4d3c' : '#a05536' }} />
          </div>
          {bonusXp > 0 ? (
            <p className="text-xl font-bold" style={{ color: '#c9a961', fontFamily: 'Fraunces, serif' }}>+{bonusXp} XP bonus</p>
          ) : (
            <p className="text-xs italic" style={{ color: '#a05536' }}>Coba ulangi untuk bonus XP</p>
          )}
        </div>
        <button onClick={() => onFinish(bonusXp)} className="w-full max-w-xs py-3.5 rounded-2xl text-white font-bold mb-2" style={{ background: '#0a4d3c' }}>Selesai</button>
        {!passed && (
          <button onClick={() => { setIdx(0); setSelectedOption(null); setRevealed(false); setAnswers([]); setDone(false); }} className="w-full max-w-xs py-3 rounded-2xl font-semibold flex items-center justify-center gap-1.5" style={{ background: 'rgba(10,77,60,0.08)', color: '#0a4d3c' }}>
            <RotateCcw size={14} /> Ulangi Kuis
          </button>
        )}
      </div>
    );
  }

  const current = questions[idx];
  const handleCheck = () => {
    if (selectedOption === null) return;
    const ok = selectedOption === current.correct;
    setAnswers((prev) => [...prev, ok]);
    setRevealed(true);
  };
  const handleNext = () => {
    if (idx + 1 >= questions.length) setDone(true);
    else { setIdx(idx + 1); setSelectedOption(null); setRevealed(false); }
  };

  const isArabicOpt = (opt) => /[؀-ۿ]/.test(opt);

  return (
    <div className="flex-1 flex flex-col" style={{ height: '100%' }}>
      <div className="flex items-center gap-3 px-5 py-3" style={{ borderBottom: '1px solid rgba(10,77,60,0.08)' }}>
        <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <ArrowLeft size={17} style={{ color: '#0a4d3c' }} />
        </button>
        <div className="flex-1">
          <p className="text-[10px] tracking-widest uppercase" style={{ color: '#8b6b3d' }}>Latihan Soal</p>
          <p className="text-xs font-semibold" style={{ color: '#0a4d3c' }}>Soal {idx + 1} dari {questions.length}</p>
        </div>
      </div>
      <div className="px-5 pt-3">
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <div className="h-full transition-all" style={{ width: `${((idx + (revealed ? 1 : 0)) / questions.length) * 100}%`, background: '#0a4d3c' }} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        <p className="text-sm font-semibold mb-3" style={{ color: '#1a1a1a' }}>{current.q}</p>

        {/* Prompt area — bisa Arab, audio, atau Indonesia */}
        <div className="rounded-2xl p-4 mb-4 text-center" style={{ background: '#faf6ee', border: '1.5px solid rgba(201,169,97,0.4)' }}>
          {current.type === 'audio-to-id' ? (
            <button onClick={() => onSpeak?.(current.ttsText)} className="inline-flex items-center gap-2 px-5 py-3 rounded-full" style={{ background: '#0a4d3c', color: 'white', fontWeight: 600 }}>
              <Volume2 size={18} /> Putar Audio
            </button>
          ) : (current.type === 'ar-to-id') ? (
            <>
              <p className="text-2xl mb-1" dir="rtl" style={{ fontFamily: 'Amiri, serif', color: '#0a4d3c', fontWeight: 600 }}>{current.prompt}</p>
              {current.promptLatin && <p className="text-xs italic" style={{ color: '#a87f47' }}>{current.promptLatin}</p>}
              <button onClick={() => onSpeak?.(current.ttsText)} className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs" style={{ background: 'rgba(10,77,60,0.1)', color: '#0a4d3c' }}>
                <Volume2 size={12} /> Dengar
              </button>
            </>
          ) : (
            <p className="text-base font-semibold" style={{ color: '#3d2817' }}>"{current.prompt}"</p>
          )}
        </div>

        {/* Opsi */}
        <div className="space-y-2.5">
          {current.options.map((opt, i) => {
            const isSelected = selectedOption === i;
            const isCorrectOpt = i === current.correct;
            let bg = 'white';
            let border = '1.5px solid rgba(10,77,60,0.12)';
            let color = '#1a1a1a';
            if (revealed) {
              if (isCorrectOpt) { bg = 'rgba(22,163,74,0.08)'; border = '1.5px solid #16a34a'; color = '#16a34a'; }
              else if (isSelected) { bg = 'rgba(192,57,43,0.07)'; border = '1.5px solid #c0392b'; color = '#c0392b'; }
            } else if (isSelected) {
              bg = 'rgba(10,77,60,0.08)'; border = '1.5px solid #0a4d3c';
            }
            return (
              <button
                key={i}
                onClick={() => !revealed && setSelectedOption(i)}
                disabled={revealed}
                className="w-full text-left p-3.5 rounded-2xl transition-all flex items-center gap-3"
                style={{ background: bg, border }}
              >
                <span className={isArabicOpt(opt) ? 'text-lg flex-1' : 'text-base flex-1'} dir={isArabicOpt(opt) ? 'rtl' : 'ltr'} style={{ fontFamily: isArabicOpt(opt) ? 'Amiri, serif' : 'inherit', color, fontWeight: 600 }}>{opt}</span>
                {revealed && isCorrectOpt && <Check size={18} style={{ color: '#16a34a' }} />}
                {revealed && isSelected && !isCorrectOpt && <X size={18} style={{ color: '#c0392b' }} />}
              </button>
            );
          })}
        </div>

        {revealed && (
          <div className="rounded-2xl p-3 mt-4" style={{ background: 'rgba(201,169,97,0.1)', borderLeft: '3px solid #c9a961' }}>
            <p className="text-xs leading-relaxed" style={{ color: '#3d2817' }}><b>Penjelasan:</b> {current.explanation}</p>
          </div>
        )}
      </div>

      <div className="px-5 py-4" style={{ borderTop: '1px solid rgba(10,77,60,0.08)' }}>
        {!revealed ? (
          <button onClick={handleCheck} disabled={selectedOption === null} className="w-full py-3.5 rounded-2xl text-white font-bold disabled:opacity-40" style={{ background: '#0a4d3c' }}>Cek Jawaban</button>
        ) : (
          <button onClick={handleNext} className="w-full py-3.5 rounded-2xl text-white font-bold flex items-center justify-center gap-1.5" style={{ background: '#0a4d3c' }}>
            {idx + 1 >= questions.length ? 'Lihat Hasil' : 'Lanjut'} <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
