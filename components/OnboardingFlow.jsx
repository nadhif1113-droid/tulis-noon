// components/OnboardingFlow.jsx
// 7-step wizard onboarding untuk user baru.
//
// Goal: First 3 menit yang nge-hook user — value prop + persona + commit +
// first win + push ask + roadmap teaser. Setiap step di-track analytics
// untuk identify drop-off.
//
// State management:
//   - userProfile.onboardingCompleted (boolean) → flag selesai
//   - userProfile.personaGoal (string) → tujuan belajar
//   - userProfile.dailyGoalMinutes (number) → komitmen menit/hari
//   - userProfile.reminderTime (string) → '08:00' | '12:00' | '20:00' | null
//
// Steps:
//   1. Welcome — value prop
//   2. Persona — pilih tujuan (5 opsi)
//   3. Daily Commit — 5/10/15 menit
//   4. Mini Lesson — 5 vocab kunci sesuai persona + 1 mini quiz
//   5. First Win — celebration +20 XP
//   6. Push Permission — pilih jam reminder
//   7. Roadmap — teaser 7 sertifikat + Master

'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronRight, ChevronLeft, Volume2, Sparkles, Target, BellRing, MapPin, Award } from 'lucide-react';
import { PERSONA_GOALS, CERTIFICATE_PATHS, getMasterCertificate } from '@/lib/certificate';
import { speakArabic } from '@/lib/tts';
import { Analytics } from '@/lib/analytics';

// Mini vocab per persona — untuk Step 4 (Mini Lesson preview)
const MINI_LESSON_VOCAB = {
  umrah: [
    { ar: 'بِسْمِ اللَّه', latin: 'bismillah', id: 'Dengan nama Allah' },
    { ar: 'الْحَمْدُ لِلَّه', latin: 'alhamdulillah', id: 'Segala puji Allah' },
    { ar: 'إِنْ شَاءَ اللَّه', latin: 'insya Allah', id: 'Insya Allah' },
    { ar: 'مَا شَاءَ اللَّه', latin: 'masya Allah', id: 'Sesuai kehendak Allah' },
    { ar: 'يَا حَاج', latin: 'yā ḥājj', id: 'Wahai pak haji' },
  ],
  profesi: [
    { ar: 'صَبَاحُ الْخَيْر', latin: 'sabaahul khair', id: 'Selamat pagi' },
    { ar: 'شُكْرًا', latin: 'syukran', id: 'Terima kasih' },
    { ar: 'عَفْوًا', latin: '\'afwan', id: 'Maaf / sama-sama' },
    { ar: 'مَكْتَب', latin: 'maktab', id: 'Kantor' },
    { ar: 'مُدِير', latin: 'mudiir', id: 'Manajer' },
  ],
  pelajar: [
    { ar: 'جَامِعَة', latin: 'jaami\'ah', id: 'Universitas' },
    { ar: 'كِتَاب', latin: 'kitaab', id: 'Buku' },
    { ar: 'مُحَاضَرَة', latin: 'muhaadharah', id: 'Kuliah' },
    { ar: 'مَكْتَبَة', latin: 'maktabah', id: 'Perpustakaan' },
    { ar: 'اِخْتِبَار', latin: 'ikhtibaar', id: 'Ujian' },
  ],
  serius: [
    { ar: 'اِسْم', latin: 'ism', id: 'Kata benda' },
    { ar: 'فِعْل', latin: 'fi\'l', id: 'Kata kerja' },
    { ar: 'حَرْف', latin: 'harf', id: 'Huruf / partikel' },
    { ar: 'جُمْلَة', latin: 'jumlah', id: 'Kalimat' },
    { ar: 'إِعْرَاب', latin: 'i\'raab', id: 'Tata bahasa' },
  ],
  all: [
    { ar: 'مَرْحَبًا', latin: 'marhaban', id: 'Halo' },
    { ar: 'نَعَم', latin: 'na\'am', id: 'Ya' },
    { ar: 'لَا', latin: 'laa', id: 'Tidak' },
    { ar: 'شُكْرًا', latin: 'syukran', id: 'Terima kasih' },
    { ar: 'مِنْ فَضْلِك', latin: 'min fadhlik', id: 'Tolong / silakan' },
  ],
};

const REMINDER_TIMES = [
  { id: '08:00', label: 'Pagi', sub: 'Setelah sarapan / kerja' },
  { id: '12:00', label: 'Siang', sub: 'Pas istirahat siang' },
  { id: '20:00', label: 'Malam', sub: 'Sebelum tidur' },
];

const DAILY_COMMIT_OPTIONS = [
  { minutes: 5, label: 'Santai', sub: '5 menit/hari · cocok pemula' },
  { minutes: 10, label: 'Rutin', sub: '10 menit/hari · sweet spot' },
  { minutes: 15, label: 'Serius', sub: '15+ menit/hari · cepat mahir' },
];

export default function OnboardingFlow({ userName, onComplete }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    personaGoal: null,
    dailyGoalMinutes: 10,
    reminderTime: null,
    pushPermissionAskedAt: null,
  });
  const [saving, setSaving] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = true;
      Analytics.sessionStarted();
      trackStep(1);
    }
  }, []);

  function trackStep(n) {
    try { Analytics.trackEvent?.('onboarding_step', { step: n }); } catch {}
  }

  const goNext = (extra = {}) => {
    setData((prev) => ({ ...prev, ...extra }));
    setStep((s) => {
      const next = s + 1;
      trackStep(next);
      return next;
    });
  };

  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const finish = async (finalExtra = {}) => {
    const final = { ...data, ...finalExtra };
    setSaving(true);
    try {
      Analytics.trackEvent?.('onboarding_completed', {
        persona: final.personaGoal || 'all',
        daily_minutes: final.dailyGoalMinutes,
        reminder_enabled: !!final.reminderTime,
      });
      await onComplete?.(final);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-center"
      style={{ background: 'linear-gradient(180deg, #faf6ee 0%, #f3ebd9 100%)' }}
    >
      <div className="w-full max-w-md mx-auto flex flex-col h-full">
        {/* Top progress */}
        <div className="px-5 pt-5 pb-2">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <div
                key={n}
                className="h-1.5 flex-1 rounded-full transition-all"
                style={{ background: n <= step ? '#0a4d3c' : 'rgba(10,77,60,0.12)' }}
              />
            ))}
          </div>
          <p className="text-[10px] uppercase tracking-widest mt-2 text-center font-semibold" style={{ color: '#8b6b3d' }}>
            Langkah {step} dari 7
          </p>
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto px-5 pb-5">
          {step === 1 && <StepWelcome userName={userName} onNext={() => goNext()} />}
          {step === 2 && <StepPersona onNext={(persona) => goNext({ personaGoal: persona })} onBack={goBack} />}
          {step === 3 && <StepDailyCommit onNext={(minutes) => goNext({ dailyGoalMinutes: minutes })} onBack={goBack} />}
          {step === 4 && <StepMiniLesson persona={data.personaGoal} onNext={() => goNext()} onBack={goBack} />}
          {step === 5 && <StepFirstWin onNext={() => goNext()} />}
          {step === 6 && <StepPushPermission onNext={(time) => goNext({ reminderTime: time })} onBack={goBack} />}
          {step === 7 && <StepRoadmap saving={saving} onFinish={() => finish()} />}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// STEP 1: Welcome — value prop
// ============================================================================
function StepWelcome({ userName, onNext }) {
  const firstName = (userName || 'kamu').split(' ')[0];
  return (
    <div className="h-full flex flex-col justify-center text-center py-6">
      <div className="w-24 h-24 mx-auto mb-5 rounded-3xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)', boxShadow: '0 14px 32px -10px rgba(10,77,60,0.4)' }}>
        <span className="text-5xl" style={{ fontFamily: 'Amiri, serif', color: 'white' }}>ن</span>
      </div>
      <p className="text-[10px] tracking-[0.3em] uppercase mb-2 font-bold" style={{ color: '#c9a961' }}>SELAMAT DATANG</p>
      <h1 className="text-3xl mb-3 leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: '#0a4d3c' }}>
        Hai, {firstName}!
      </h1>
      <p className="text-base leading-relaxed mb-6 px-4" style={{ color: '#3d2817' }}>
        Tulis Noon bantu kamu belajar bahasa Arab praktis cuma <b style={{ color: '#0a4d3c' }}>5 menit/hari</b> — untuk umrah, kerja di Saudi, atau studi.
      </p>
      <div className="space-y-2 mb-8 px-2">
        <FeatureRow emoji="🎯" text="Belajar terstruktur jalur sertifikat" />
        <FeatureRow emoji="🤖" text="AI pemahaman setiap percakapan" />
        <FeatureRow emoji="📿" text="Hafalan Juz 30 + tata bahasa" />
        <FeatureRow emoji="🏅" text="7 sertifikat + Master capstone" />
      </div>
      <button
        onClick={onNext}
        className="w-full py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)', boxShadow: '0 10px 24px -8px rgba(10,77,60,0.5)' }}
      >
        Mulai Perjalanan <ChevronRight size={18} />
      </button>
      <p className="text-xs mt-3" style={{ color: '#8b6b3d' }}>
        ~3 menit · bisa di-skip tapi sayang lho
      </p>
    </div>
  );
}

function FeatureRow({ emoji, text }) {
  return (
    <div className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.08)' }}>
      <span className="text-xl">{emoji}</span>
      <p className="text-sm" style={{ color: '#3d2817' }}>{text}</p>
    </div>
  );
}

// ============================================================================
// STEP 2: Persona Goal
// ============================================================================
function StepPersona({ onNext, onBack }) {
  const [selected, setSelected] = useState(null);
  return (
    <div className="h-full flex flex-col py-4">
      <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center mb-3" style={{ background: 'rgba(10,77,60,0.08)' }}>
        <ChevronLeft size={17} style={{ color: '#0a4d3c' }} />
      </button>
      <div className="text-center mb-5">
        <Target size={28} style={{ color: '#c9a961' }} className="mx-auto mb-2" />
        <p className="text-[10px] tracking-[0.3em] uppercase mb-1 font-bold" style={{ color: '#c9a961' }}>TUJUAN</p>
        <h2 className="text-xl leading-tight mb-2" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: '#0a4d3c' }}>
          Apa tujuan utamamu belajar Arab?
        </h2>
        <p className="text-xs" style={{ color: '#8b6b3d' }}>
          Pilih satu — kami sesuaikan jalur belajar
        </p>
      </div>
      <div className="space-y-2 flex-1">
        {PERSONA_GOALS.map((g) => {
          const isSel = selected === g.id;
          return (
            <button
              key={g.id}
              onClick={() => setSelected(g.id)}
              className="w-full flex items-center gap-3 p-3.5 rounded-2xl text-left transition-all active:scale-[0.98]"
              style={{
                background: isSel ? `${g.color}12` : 'white',
                border: isSel ? `2px solid ${g.color}` : '1.5px solid rgba(10,77,60,0.1)',
              }}
            >
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: isSel ? g.color : `${g.color}15` }}>
                {g.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm" style={{ color: g.color }}>{g.label}</p>
                <p className="text-[11px]" style={{ color: '#666' }}>{g.sublabel}</p>
              </div>
              {isSel && (
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: g.color }}>
                  <Check size={11} color="white" strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>
      <button
        onClick={() => selected && onNext(selected)}
        disabled={!selected}
        className="w-full py-3.5 rounded-2xl font-bold mt-4 text-white disabled:opacity-50 active:scale-[0.98] transition-transform"
        style={{ background: selected ? 'linear-gradient(135deg, #0a4d3c, #1a6b56)' : '#8b6b3d' }}
      >
        {selected ? 'Lanjut' : 'Pilih dulu salah satu'}
      </button>
    </div>
  );
}

// ============================================================================
// STEP 3: Daily Commitment
// ============================================================================
function StepDailyCommit({ onNext, onBack }) {
  const [selected, setSelected] = useState(10);
  return (
    <div className="h-full flex flex-col py-4">
      <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center mb-3" style={{ background: 'rgba(10,77,60,0.08)' }}>
        <ChevronLeft size={17} style={{ color: '#0a4d3c' }} />
      </button>
      <div className="text-center mb-5">
        <div className="text-4xl mb-2">⏱️</div>
        <p className="text-[10px] tracking-[0.3em] uppercase mb-1 font-bold" style={{ color: '#c9a961' }}>KOMITMEN</p>
        <h2 className="text-xl leading-tight mb-2" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: '#0a4d3c' }}>
          Berapa menit/hari janjimu?
        </h2>
        <p className="text-xs leading-relaxed" style={{ color: '#8b6b3d' }}>
          Konsistensi &gt; intensitas. Lebih baik 5 menit tiap hari daripada 1 jam seminggu sekali.
        </p>
      </div>
      <div className="space-y-2 flex-1">
        {DAILY_COMMIT_OPTIONS.map((opt) => {
          const isSel = selected === opt.minutes;
          return (
            <button
              key={opt.minutes}
              onClick={() => setSelected(opt.minutes)}
              className="w-full flex items-center gap-3 p-4 rounded-2xl text-left transition-all active:scale-[0.98]"
              style={{
                background: isSel ? 'rgba(10,77,60,0.08)' : 'white',
                border: isSel ? '2px solid #0a4d3c' : '1.5px solid rgba(10,77,60,0.1)',
              }}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: isSel ? '#0a4d3c' : 'rgba(10,77,60,0.08)' }}>
                <p className="text-xl font-bold" style={{ color: isSel ? 'white' : '#0a4d3c', fontFamily: 'Fraunces, serif' }}>{opt.minutes}'</p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-base" style={{ color: '#0a4d3c' }}>{opt.label}</p>
                <p className="text-xs" style={{ color: '#8b6b3d' }}>{opt.sub}</p>
              </div>
              {isSel && <Check size={20} style={{ color: '#0a4d3c' }} />}
            </button>
          );
        })}
      </div>
      <button
        onClick={() => onNext(selected)}
        className="w-full py-3.5 rounded-2xl font-bold mt-4 text-white active:scale-[0.98] transition-transform"
        style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)', boxShadow: '0 8px 20px -6px rgba(10,77,60,0.5)' }}
      >
        Lanjut
      </button>
    </div>
  );
}

// ============================================================================
// STEP 4: Mini Lesson — 5 vocab + 1 quiz
// ============================================================================
function StepMiniLesson({ persona, onNext, onBack }) {
  const vocab = MINI_LESSON_VOCAB[persona] || MINI_LESSON_VOCAB.all;
  const [cardIdx, setCardIdx] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState(null);

  // Quiz: tampilkan 1 vocab random, minta tebak artinya
  const quizCard = vocab[2]; // pakai card ke-3 untuk quiz (yang udah dilewat)
  const choices = (() => {
    const correct = quizCard.id;
    const distractors = vocab.filter((v) => v.id !== correct).slice(0, 3).map((v) => v.id);
    const all = [correct, ...distractors];
    // Shuffle dengan seed sederhana berdasarkan persona biar konsisten
    return all.sort(() => 0.5 - Math.random());
  })();

  if (showQuiz) {
    const isCorrect = quizAnswer === quizCard.id;
    return (
      <div className="h-full flex flex-col py-4">
        <div className="text-center mb-4">
          <p className="text-[10px] tracking-[0.3em] uppercase mb-1 font-bold" style={{ color: '#c9a961' }}>MINI QUIZ</p>
          <h2 className="text-lg leading-tight mb-2" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: '#0a4d3c' }}>
            Apa arti kata ini?
          </h2>
        </div>
        <div className="rounded-3xl p-6 mb-5 text-center" style={{ background: 'white', boxShadow: '0 10px 30px -10px rgba(10,77,60,0.15)' }}>
          <button onClick={() => speakArabic(quizCard.ar, { rate: 0.85 })} className="w-9 h-9 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
            <Volume2 size={16} style={{ color: '#0a4d3c' }} />
          </button>
          <p className="text-4xl mb-2" style={{ fontFamily: 'Amiri, serif', color: '#0a4d3c', direction: 'rtl' }}>{quizCard.ar}</p>
          <p className="text-xs italic" style={{ color: '#8b6b3d' }}>{quizCard.latin}</p>
        </div>
        <div className="space-y-2 flex-1">
          {choices.map((c, i) => {
            const answered = quizAnswer !== null;
            const isThis = quizAnswer === c;
            const isRight = c === quizCard.id;
            let bg = 'white', border = 'rgba(10,77,60,0.1)';
            if (answered && isRight) { bg = 'rgba(10,77,60,0.1)'; border = '#0a4d3c'; }
            else if (answered && isThis) { bg = 'rgba(160,85,54,0.1)'; border = '#a05536'; }
            return (
              <button
                key={i}
                onClick={() => !answered && setQuizAnswer(c)}
                disabled={answered}
                className="w-full p-3.5 rounded-2xl text-left font-semibold text-sm transition-all active:scale-[0.98]"
                style={{ background: bg, border: `2px solid ${border}`, color: '#0a4d3c' }}
              >
                {String.fromCharCode(65 + i)}. {c}
              </button>
            );
          })}
        </div>
        {quizAnswer && (
          <div className="mt-4 mb-2 text-center">
            {isCorrect ? (
              <p className="text-base font-bold" style={{ color: '#0a4d3c' }}>✅ Benar!</p>
            ) : (
              <p className="text-base font-bold" style={{ color: '#a05536' }}>❌ Yang benar: {quizCard.id}</p>
            )}
          </div>
        )}
        <button
          onClick={onNext}
          disabled={!quizAnswer}
          className="w-full py-3.5 rounded-2xl font-bold mt-3 text-white disabled:opacity-50 active:scale-[0.98] transition-transform"
          style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)' }}
        >
          Lanjut <ChevronRight size={16} className="inline" />
        </button>
      </div>
    );
  }

  // Card swipe mode
  const card = vocab[cardIdx];
  const isLast = cardIdx === vocab.length - 1;
  return (
    <div className="h-full flex flex-col py-4">
      <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center mb-3" style={{ background: 'rgba(10,77,60,0.08)' }}>
        <ChevronLeft size={17} style={{ color: '#0a4d3c' }} />
      </button>
      <div className="text-center mb-4">
        <p className="text-[10px] tracking-[0.3em] uppercase mb-1 font-bold" style={{ color: '#c9a961' }}>VOCAB PERTAMA</p>
        <h2 className="text-lg leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: '#0a4d3c' }}>
          Hafal 5 kata kunci dulu
        </h2>
        <p className="text-xs mt-1" style={{ color: '#8b6b3d' }}>Kartu {cardIdx + 1}/{vocab.length} — tap speaker untuk dengar</p>
      </div>
      <div className="flex-1 flex items-center">
        <div className="w-full rounded-3xl p-8 text-center" style={{ background: 'white', boxShadow: '0 14px 36px -12px rgba(10,77,60,0.2)', border: '1px solid rgba(10,77,60,0.06)' }}>
          <button onClick={() => speakArabic(card.ar, { rate: 0.85 })} className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
            <Volume2 size={20} style={{ color: '#0a4d3c' }} />
          </button>
          <p className="text-5xl mb-3" style={{ fontFamily: 'Amiri, serif', color: '#0a4d3c', direction: 'rtl', lineHeight: 1.4 }}>{card.ar}</p>
          <p className="text-sm italic mb-2" style={{ color: '#8b6b3d' }}>{card.latin}</p>
          <p className="text-base font-semibold" style={{ color: '#3d2817' }}>{card.id}</p>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        {cardIdx > 0 && (
          <button
            onClick={() => setCardIdx(cardIdx - 1)}
            className="px-4 py-3 rounded-2xl font-semibold text-sm flex items-center gap-1"
            style={{ background: 'rgba(10,77,60,0.08)', color: '#0a4d3c' }}
          >
            <ChevronLeft size={15} /> Kembali
          </button>
        )}
        <button
          onClick={() => isLast ? setShowQuiz(true) : setCardIdx(cardIdx + 1)}
          className="flex-1 py-3.5 rounded-2xl font-bold text-white active:scale-[0.98] transition-transform"
          style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)' }}
        >
          {isLast ? 'Test Pemahaman →' : 'Lanjut kartu →'}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// STEP 5: First Win — celebration
// ============================================================================
function StepFirstWin({ onNext }) {
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="h-full flex flex-col justify-center text-center py-6">
      <div className="relative mb-6">
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl"
              style={{
                top: `${(i * 37) % 80}%`,
                left: `${(i * 53) % 90}%`,
                opacity: animate ? 0.8 : 0,
                transition: `opacity 0.6s ${i * 0.05}s, transform 0.8s ${i * 0.05}s`,
                transform: animate ? `translateY(0) rotate(${i * 25}deg)` : 'translateY(20px) rotate(0)',
              }}
            >
              {['✨', '🎉', '⭐', '🌟', '🏅'][i % 5]}
            </div>
          ))}
        </div>
        <div
          className="w-32 h-32 mx-auto rounded-full flex items-center justify-center text-6xl relative"
          style={{
            background: 'linear-gradient(135deg, #c9a961, #d4b876)',
            boxShadow: '0 20px 50px -15px rgba(201,169,97,0.8)',
            transform: animate ? 'scale(1)' : 'scale(0.5)',
            opacity: animate ? 1 : 0,
            transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          🎉
        </div>
      </div>
      <p className="text-[10px] tracking-[0.3em] uppercase mb-2 font-bold" style={{ color: '#c9a961' }}>MABRUK!</p>
      <h2 className="text-2xl mb-2 leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: '#0a4d3c' }}>
        Vocab pertamamu!
      </h2>
      <p className="text-sm mb-5" style={{ color: '#3d2817' }}>
        Kamu udah belajar <b>5 kata Arab</b> + jawab quiz pertama. Awal yang bagus.
      </p>
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="px-4 py-2 rounded-full flex items-center gap-1.5" style={{ background: 'rgba(201,169,97,0.15)', border: '1.5px solid #c9a961' }}>
          <Sparkles size={14} style={{ color: '#c9a961' }} />
          <span className="text-sm font-bold" style={{ color: '#8b6b3d' }}>+20 XP</span>
        </div>
        <div className="px-4 py-2 rounded-full flex items-center gap-1.5" style={{ background: 'rgba(255,77,77,0.1)', border: '1.5px solid #ff6b6b' }}>
          <span className="text-lg">🔥</span>
          <span className="text-sm font-bold" style={{ color: '#ff6b6b' }}>Streak 1</span>
        </div>
      </div>
      <button
        onClick={onNext}
        className="w-full py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)', boxShadow: '0 10px 24px -8px rgba(10,77,60,0.5)' }}
      >
        Lanjut <ChevronRight size={18} />
      </button>
    </div>
  );
}

// ============================================================================
// STEP 6: Push Permission
// ============================================================================
function StepPushPermission({ onNext, onBack }) {
  const [selected, setSelected] = useState(null);
  const [skipping, setSkipping] = useState(false);
  return (
    <div className="h-full flex flex-col py-4">
      <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center mb-3" style={{ background: 'rgba(10,77,60,0.08)' }}>
        <ChevronLeft size={17} style={{ color: '#0a4d3c' }} />
      </button>
      <div className="text-center mb-5">
        <BellRing size={36} style={{ color: '#c9a961' }} className="mx-auto mb-3" />
        <p className="text-[10px] tracking-[0.3em] uppercase mb-1 font-bold" style={{ color: '#c9a961' }}>HABIT</p>
        <h2 className="text-xl leading-tight mb-2" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: '#0a4d3c' }}>
          Pilih jam pengingat
        </h2>
        <p className="text-xs leading-relaxed" style={{ color: '#8b6b3d' }}>
          Kamu lebih konsisten kalau ada pengingat. Pilih waktu yang pas — kita kirim notif lembut.
        </p>
      </div>
      <div className="space-y-2 flex-1">
        {REMINDER_TIMES.map((t) => {
          const isSel = selected === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setSelected(t.id)}
              className="w-full flex items-center gap-3 p-4 rounded-2xl text-left transition-all active:scale-[0.98]"
              style={{
                background: isSel ? 'rgba(201,169,97,0.12)' : 'white',
                border: isSel ? '2px solid #c9a961' : '1.5px solid rgba(10,77,60,0.1)',
              }}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: isSel ? '#c9a961' : 'rgba(201,169,97,0.15)' }}>
                <p className="text-base font-bold" style={{ color: isSel ? 'white' : '#8b6b3d', fontFamily: 'Fraunces, serif' }}>{t.id}</p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-base" style={{ color: '#0a4d3c' }}>{t.label}</p>
                <p className="text-xs" style={{ color: '#8b6b3d' }}>{t.sub}</p>
              </div>
              {isSel && <Check size={20} style={{ color: '#c9a961' }} />}
            </button>
          );
        })}
      </div>
      <button
        onClick={() => onNext(selected)}
        disabled={!selected || skipping}
        className="w-full py-3.5 rounded-2xl font-bold mt-4 text-white disabled:opacity-50 active:scale-[0.98] transition-transform"
        style={{ background: selected ? 'linear-gradient(135deg, #0a4d3c, #1a6b56)' : '#8b6b3d' }}
      >
        {selected ? 'Aktifkan Pengingat' : 'Pilih waktu dulu'}
      </button>
      <button
        onClick={() => { setSkipping(true); onNext(null); }}
        className="w-full py-2.5 mt-2 text-xs font-semibold"
        style={{ color: '#8b6b3d' }}
      >
        Nanti aja, lewati →
      </button>
    </div>
  );
}

// ============================================================================
// STEP 7: Roadmap Teaser
// ============================================================================
function StepRoadmap({ saving, onFinish }) {
  const master = getMasterCertificate();
  return (
    <div className="h-full flex flex-col py-4">
      <div className="text-center mb-4">
        <MapPin size={32} style={{ color: '#c9a961' }} className="mx-auto mb-2" />
        <p className="text-[10px] tracking-[0.3em] uppercase mb-1 font-bold" style={{ color: '#c9a961' }}>PERJALANANMU</p>
        <h2 className="text-xl leading-tight mb-2" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: '#0a4d3c' }}>
          7 sertifikat menantimu
        </h2>
        <p className="text-xs leading-relaxed" style={{ color: '#8b6b3d' }}>
          Tiap jalur belajar tuntas = 1 sertifikat. Selesai semua → unlock Master Tulis Noon.
        </p>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {CERTIFICATE_PATHS.map((p) => (
          <div key={p.id} className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: 'white', border: `1px solid ${p.color}20` }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: `${p.color}15` }}>
              {p.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm leading-tight" style={{ color: p.color }}>{p.title}</p>
              <p className="text-[11px]" style={{ color: '#8b6b3d' }}>{p.totalUnits} {p.unitLabel}</p>
            </div>
          </div>
        ))}
        {/* Master capstone */}
        <div className="flex items-center gap-3 p-3 rounded-2xl mt-3" style={{ background: 'linear-gradient(135deg, rgba(201,169,97,0.1), rgba(212,184,118,0.05))', border: '2px dashed #c9a961' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: 'linear-gradient(135deg, #c9a961, #d4b876)' }}>
            🏅
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm leading-tight" style={{ color: '#8b6b3d' }}>{master.title}</p>
            <p className="text-[11px]" style={{ color: '#c9a961' }}>Capstone — selesai semua 7</p>
          </div>
        </div>
      </div>
      <button
        onClick={onFinish}
        disabled={saving}
        className="w-full py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] transition-transform"
        style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)', boxShadow: '0 12px 28px -10px rgba(10,77,60,0.5)' }}
      >
        {saving ? 'Menyimpan...' : <>Siap Belajar! <Award size={18} /></>}
      </button>
    </div>
  );
}
