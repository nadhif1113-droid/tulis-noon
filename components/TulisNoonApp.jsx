'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Volume2, Mic, Check, X, Sparkles, Lock, MapPin, Briefcase, GraduationCap, Trophy, Flame, Star, Home, BookOpen, Users, User, Heart, Share2, Send, Play, Image as ImageIcon, MessageCircle, Calendar, Target, Zap, ChevronRight, Bot, Video, Clock, Award, UserCheck, Coffee, Music, Film, Gamepad2, Heart as HeartIcon, Mountain, Facebook, Instagram, Twitter, Link2, Copy } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { CHALLENGE_SCENARIOS, getTodayChallenge, getXpForLevel } from '@/data/challenge-levels';
import { ROLEPLAY_SCENARIOS } from '@/data/roleplay-scenarios';
import RoleplayScreen from '@/components/RoleplayScreen';
import TulisArabScreen from '@/components/TulisArabScreen';
import XpLevelInfoModal from '@/components/XpLevelInfoModal';
import CoinInfoModal from '@/components/CoinInfoModal';
import StreakInfoModal from '@/components/StreakInfoModal';

export default function TulisNoonApp() {
  const router = useRouter();
  const { user, userProfile: authProfile, loading: authLoading, updateUserProfile, saveChallengeProgress } = useAuth();
  // null = belum ditentukan (masih loading auth/profile).
  // 'welcome' = user baru yang belum selesai onboarding.
  // 'main' = user yang udah selesai onboarding.
  const [screen, setScreen] = useState(null);
  const [tab, setTab] = useState('home');
  const [selectedPath, setSelectedPath] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedRoleplay, setSelectedRoleplay] = useState(null); // AI Roleplay scenario
  const [selectedGuru, setSelectedGuru] = useState(null);
  // Challenge scenario yang lagi dimainin. Default ke "Tantangan Hari Ini" (rotasi by tanggal).
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  // Level dalam scenario yang dipilih (1-100)
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [progress, setProgress] = useState({ umrah: 1, profesi: 0, beasiswa: 0 });
  // Default 0 (bukan 45 magic number) — biar ga ada flash angka acak sebelum sync dari Firestore.
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [userName, setUserName] = useState('');
  const [userProfile, setUserProfile] = useState({
    interests: [],
    learningStyle: '',
    accent: '',
    dailyTime: '',
    // Premium motivation data
    goal: '',
    profession: '',
    motivation: '',
    targetTime: '',
  });
  const [achievements, setAchievements] = useState([
    { id: 1, type: 'streak', text: 'Streak 3 hari!', emoji: '🔥', time: '2 jam lalu', user: 'Ahmad' },
    { id: 2, type: 'lesson', text: 'Selesai: Salam & Sapaan', emoji: '🤝', time: '5 jam lalu', user: 'Siti' },
    { id: 3, type: 'badge', text: 'Lulus Quiz Pasar Madinah', emoji: '🏆', time: '1 hari lalu', user: 'Yusuf' },
  ]);
  // Offline detection — tampilkan banner sopan kalau user kehilangan koneksi.
  // Penting krn app pakai Firestore (perlu internet buat sync XP/progress).
  const [isOffline, setIsOffline] = useState(false);
  // Onboarding tour state — 4 slide overlay setelah user pertama masuk main app.
  const [showTour, setShowTour] = useState(false);
  // Arabic level survey modal — untuk user lama yang belum di-survey (pre-feature users).
  const [showArabicSurvey, setShowArabicSurvey] = useState(false);
  // XP/Level info modal — trigger dari XP pill di home (atau dari profile).
  const [showXpModal, setShowXpModal] = useState(false);
  // Coin info modal — trigger dari coin pill di home (atau dari profile).
  const [showCoinModal, setShowCoinModal] = useState(false);
  // Streak info modal — trigger dari flame pill di home.
  const [showStreakModal, setShowStreakModal] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Initial state (kalau user buka app dalam keadaan offline)
    setIsOffline(!navigator.onLine);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Trigger Arabic level survey modal + tour overlay untuk user yang baru masuk main.
  // Survey didahulukan kalau belum ada arabicLevel, supaya rekomendasi langsung sesuai.
  // Tour baru muncul setelah survey selesai (atau di-skip).
  useEffect(() => {
    if (screen !== 'main') return;
    if (!authProfile) return;
    const needSurvey = !authProfile.arabicLevel || authProfile.arabicLevel === 'unknown';
    const needTour = !authProfile.tourCompleted;
    if (needSurvey) {
      setShowArabicSurvey(true);
    } else if (needTour) {
      setShowTour(true);
    }
  }, [screen, authProfile?.arabicLevel, authProfile?.tourCompleted, authProfile]);

  // Sync data dari Firebase auth (Firestore users collection) ke state lokal
  useEffect(() => {
    // Debug log — bisa dilihat di Console buat trace kapan sync jalan
    console.log('🔄 Sync from Firestore:', {
      hasProfile: !!authProfile,
      firestoreXp: authProfile?.xp,
      firestoreStreak: authProfile?.streak,
      onboardingCompleted: authProfile?.onboardingCompleted,
    });

    const nameFromAuth = authProfile?.displayName || user?.displayName;
    if (nameFromAuth) {
      setUserName(nameFromAuth);
    }
    if (authProfile) {
      setUserProfile((prev) => ({
        ...prev,
        interests: authProfile.interests || prev.interests,
        learningStyle: authProfile.learningStyle || prev.learningStyle,
        accent: authProfile.accent || prev.accent,
        dailyTime: authProfile.dailyTime || prev.dailyTime,
      }));
    }
    if (typeof authProfile?.xp === 'number') {
      setXp(authProfile.xp);
    }
    if (typeof authProfile?.streak === 'number') {
      setStreak(authProfile.streak);
    }
  }, [authProfile, user]);

  // Routing logic: HANYA jalan saat screen masih null (initial load).
  // BUG SEBELUMNYA: useEffect ini dependency-nya [authLoading, authProfile],
  // jadi setiap kali authProfile berubah (mis. setelah awardXp/saveChallengeProgress),
  // useEffect ini ngebanting screen ke 'main' — user kelempar ke home pas selesai challenge.
  // FIX: tambah guard `screen !== null` supaya routing decision cuma sekali.
  useEffect(() => {
    if (authLoading) return;
    if (!authProfile) return;
    if (screen !== null) return; // Sudah pernah di-route, jangan override lagi

    if (authProfile.onboardingCompleted) {
      setScreen('main');
    } else {
      setScreen('welcome');
    }
  }, [authLoading, authProfile, screen]);

  // Helper: tambah XP ke state lokal + persist ke Firestore.
  // Dipakai oleh callback completion dari Lesson, Game, dan Challenge.
  const awardXp = (earned) => {
    if (!earned || earned <= 0) return;
    const newXp = (xp || 0) + earned;
    console.log('💎 awardXp:', { earned, oldXp: xp, newXp });
    setXp(newXp);
    // Persist ke Firestore (async, await supaya kita tau hasilnya di log).
    updateUserProfile({ xp: newXp })
      .then(() => console.log('✅ XP persisted to Firestore:', newXp))
      .catch((err) => console.error('❌ Failed to persist XP:', err));
  };

  const tabScreens = ['home', 'belajar', 'sosial', 'profil'];

  return (
    <div className="min-h-screen w-full" style={{ background: 'linear-gradient(180deg, #faf6ee 0%, #f3ebd9 100%)', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700;9..144,900&family=DM+Sans:wght@400;500;600;700&family=Amiri:wght@400;700&family=Reem+Kufi:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Background pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cpath d='M40 0L80 40L40 80L0 40Z' fill='none' stroke='%230a4d3c' stroke-width='1'/%3E%3C/svg%3E")`,
      }}/>

      <div className="relative max-w-md mx-auto min-h-screen flex flex-col">
        {/* Offline banner — sticky di atas, muncul di semua screen kalau koneksi terputus.
            Wording: sopan, Islamic, tidak menyalahkan user. */}
        {isOffline && (
          <div
            className="sticky top-0 z-50 px-4 py-3 flex items-start gap-3 shadow-md"
            style={{
              background: 'linear-gradient(90deg, #8b4a2a, #a05536)',
              color: '#faf6ee',
              borderBottom: '2px solid #c9a961',
            }}
            role="alert"
            aria-live="polite"
          >
            <div
              className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-lg"
              style={{ background: 'rgba(255,255,255,0.15)' }}
            >
              🌙
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-semibold leading-snug"
                style={{ fontFamily: 'Fraunces, serif' }}
              >
                Maaf, koneksi internet terputus
              </p>
              <p className="text-xs leading-relaxed mt-0.5" style={{ opacity: 0.92 }}>
                Mohon periksa jaringanmu — bi idznillah akan tersambung kembali. Progres belajarmu insyaAllah aman tersimpan.
              </p>
            </div>
          </div>
        )}

        {screen === null && (
          <div className="flex-1 flex items-center justify-center px-6">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center animate-pulse" style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)', transform: 'rotate(-6deg)' }}>
                <span className="text-3xl" style={{ fontFamily: 'Amiri, serif', color: '#f3ebd9', transform: 'rotate(6deg)', display: 'inline-block' }}>ن</span>
              </div>
              <p className="text-sm" style={{ color: '#8b6b3d' }}>Memuat profilmu...</p>
            </div>
          </div>
        )}
        {screen === 'welcome' && <WelcomeScreen
          initialName={user?.displayName || authProfile?.displayName || ''}
          onComplete={async (profile) => {
            // 1. Update state lokal supaya UI langsung reflect.
            setUserName(profile.name);
            setUserProfile(p => ({...p, ...profile}));
            // 2. Persist ke Firestore + tandai onboarding selesai.
            //    Kalau gagal save (offline misal), UI tetap lanjut ke main,
            //    nanti useEffect routing logic akan re-evaluate dari Firestore.
            await updateUserProfile({
              displayName: profile.name,
              interests: profile.interests,
              arabicLevel: profile.arabicLevel, // NEW: untuk rekomendasi start level
              learningStyle: profile.learningStyle,
              accent: profile.accent,
              dailyTime: profile.dailyTime,
              onboardingCompleted: true,
            });
            setScreen('main');
          }}
        />}

        {screen === 'main' && (
          <>
            <div className="flex-1 pb-20">
              {tab === 'home' && <HomeTab userName={userName} userProfile={userProfile} xp={xp} streak={streak} coins={authProfile?.coins || 0} onShowXpInfo={() => setShowXpModal(true)} onShowCoinInfo={() => setShowCoinModal(true)} onShowStreakInfo={() => setShowStreakModal(true)} onOpenLesson={() => { setSelectedPath({id:'umrah', title:'Wisatawan & Jamaah Umrah'}); setScreen('lessons'); }} onOpenGame={(g) => {
                // Special routing untuk game yang punya screen sendiri.
                // Game lain (image-quiz, video-quiz, story) tetap ke GameScreen placeholder.
                if (g.id === 'chat-roleplay') {
                  setScreen('roleplay-list');
                  return;
                }
                if (g.id === 'tulis-arab') {
                  setScreen('tulis-arab');
                  return;
                }
                setSelectedGame(g);
                setScreen('game');
              }} onOpenChallenge={(scenario) => { setSelectedChallenge(scenario || getTodayChallenge()); setScreen('challenge-levels'); }} onOpenGuru={() => setScreen('guru')} achievements={achievements} />}
              {tab === 'belajar' && <BelajarTab onSelectPath={(p) => { setSelectedPath(p); setScreen('lessons'); }} onOpenGuru={() => setScreen('guru')} progress={progress} />}
              {tab === 'sosial' && <SosialTab achievements={achievements} userName={userName} />}
              {tab === 'profil' && <ProfilTab userName={userName} userProfile={userProfile} xp={xp} streak={streak} progress={progress} onOpenPremium={() => setScreen('premium')} />}
            </div>
            <BottomNav active={tab} onChange={setTab} router={router} />
          </>
        )}

        {screen === 'lessons' && <LessonsScreen path={selectedPath} onBack={() => setScreen('main')} onSelectLesson={(l) => { setSelectedLesson(l); setScreen('lesson'); }} progress={progress[selectedPath?.id] || 0} />}
        {screen === 'lesson' && <LessonScreen lesson={selectedLesson} onBack={() => setScreen('lessons')} onComplete={(earned) => {
          setProgress(p => ({...p, [selectedPath.id]: (p[selectedPath.id] || 0) + 1}));
          awardXp(earned);
          setAchievements(a => [{ id: Date.now(), type:'lesson', text:`Selesai: ${selectedLesson?.title}`, emoji:'✅', time:'baru saja', user: userName || 'Anda' }, ...a]);
          setScreen('lessons');
        }} />}
        {screen === 'game' && <GameScreen game={selectedGame} onBack={() => setScreen('main')} onComplete={(earned) => {
          awardXp(earned);
          setScreen('main');
        }} />}
        {screen === 'challenge-levels' && <ChallengeLevelsScreen
          scenario={selectedChallenge || getTodayChallenge()}
          challengeProgress={authProfile?.challengeProgress?.[(selectedChallenge || getTodayChallenge())?.id] || {}}
          onBack={() => setScreen('main')}
          onHome={() => { setTab('home'); setScreen('main'); }}
          onSelectLevel={(lvl) => {
            setSelectedLevel(lvl);
            setScreen('challenge');
          }}
        />}
        {screen === 'challenge' && <ChallengeScreen
          scenario={selectedChallenge || getTodayChallenge()}
          levelNumber={selectedLevel}
          existingProgress={authProfile?.challengeProgress?.[(selectedChallenge || getTodayChallenge())?.id]?.[selectedLevel]}
          onBack={() => setScreen('challenge-levels')}
          onComplete={({ earned, score, totalQuestions }) => {
            awardXp(earned);
            const scn = selectedChallenge || getTodayChallenge();
            saveChallengeProgress({
              scenarioId: scn.id,
              level: selectedLevel,
              score,
              totalQuestions,
              xpEarned: earned,
            }).catch((err) => console.error('Save progress error:', err));
          }}
          onShare={(text) => {
            // Catat achievement aja, JANGAN navigate — user yang kontrol exit via tombol "Udahan".
            setAchievements(a => [{ id: Date.now(), type:'challenge', text:text, emoji:'⚡', time:'baru saja', user: userName || 'Anda' }, ...a]);
          }}
          onNextLevel={(nextLvl) => {
            // Stay di screen 'challenge' tapi ganti levelNumber → ChallengeScreen reset state via useEffect.
            setSelectedLevel(nextLvl);
          }}
        />}
        {/* AI Roleplay flow: roleplay-list (pilih scenario) → roleplay (chat dengan Claude) */}
        {screen === 'roleplay-list' && <RoleplayListScreen
          onBack={() => setScreen('main')}
          onHome={() => { setTab('home'); setScreen('main'); }}
          onSelectScenario={(s) => { setSelectedRoleplay(s); setScreen('roleplay'); }}
        />}
        {screen === 'roleplay' && selectedRoleplay && <RoleplayScreen
          scenario={selectedRoleplay}
          userId={user?.uid || 'anonymous'}
          onBack={() => setScreen('roleplay-list')}
          onComplete={({ earned, score, grade: gradeLabel }) => {
            // Award XP + catat achievement
            awardXp(earned);
            setAchievements((a) => [{
              id: Date.now(),
              type: 'roleplay',
              text: `${selectedRoleplay.title} — ${gradeLabel} (+${earned} XP)`,
              emoji: selectedRoleplay.emoji,
              time: 'baru saja',
              user: userName || 'Anda',
            }, ...a]);
          }}
          onShare={(payload) => {
            // Share modal pakai pattern yg sama dengan challenge — catat achievement aja
            setAchievements((a) => [{
              id: Date.now(),
              type: 'roleplay-share',
              text: `Roleplay ${payload.scenarioName}: ${payload.grade} ${payload.scenarioEmoji}`,
              emoji: '🎙️',
              time: 'baru saja',
              user: userName || 'Anda',
            }, ...a]);
            // Open native share OR WhatsApp as quick action
            const shareText = `Saya baru aja praktik roleplay "${payload.scenarioName}" ${payload.scenarioEmoji} dapat ${payload.grade} (skor ${payload.score}) di Tulis Noon! ${payload.xpEarned} XP\n\nYuk ikutan: https://tulis-noon.vercel.app`;
            if (typeof navigator !== 'undefined' && navigator.share) {
              navigator.share({ title: 'Tulis Noon AI Roleplay', text: shareText, url: 'https://tulis-noon.vercel.app' }).catch(() => {});
            } else {
              window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
            }
          }}
        />}

        {/* Tulis Arab — game baca-tulis Arab dari nol */}
        {screen === 'tulis-arab' && <TulisArabScreen
          onBack={() => setScreen('main')}
          onHome={() => { setTab('home'); setScreen('main'); }}
          onComplete={({ earned, score, totalQuestions }) => {
            awardXp(earned);
            setAchievements((a) => [{
              id: Date.now(),
              type: 'tulis-arab',
              text: `Tulis Arab — selesai level (${score}/${totalQuestions}, +${earned} XP)`,
              emoji: '✍️',
              time: 'baru saja',
              user: userName || 'Anda',
            }, ...a]);
          }}
          onUpgrade={() => setScreen('premium')}
        />}

        {screen === 'guru' && <GuruScreen onBack={() => setScreen('main')} onSelectGuru={(g) => { setSelectedGuru(g); setScreen('guru-detail'); }} />}
        {screen === 'guru-detail' && <GuruDetailScreen guru={selectedGuru} onBack={() => setScreen('guru')} />}
        {screen === 'premium' && <PremiumScreen onBack={() => setScreen('main')} userProfile={userProfile} onSubmit={(motivData) => {
          setUserProfile(p => ({...p, ...motivData}));
          setScreen('main');
        }} />}

        {/* Modal: Survey level Arab untuk user lama yang belum di-survey.
            Setelah pilih level / skip, lanjut ke tour kalau belum pernah. */}
        {showArabicSurvey && (
          <ArabicLevelSurveyModal
            onSelect={async (level) => {
              await updateUserProfile({ arabicLevel: level });
              setShowArabicSurvey(false);
              if (!authProfile?.tourCompleted) {
                // Kasih jeda 200ms biar transisi modal halus
                setTimeout(() => setShowTour(true), 200);
              }
            }}
            onSkip={async () => {
              // Tandai 'pemula' sbg default supaya gak terus-terusan prompt
              await updateUserProfile({ arabicLevel: 'pemula' });
              setShowArabicSurvey(false);
              if (!authProfile?.tourCompleted) {
                setTimeout(() => setShowTour(true), 200);
              }
            }}
          />
        )}

        {/* XP/Level info modal — trigger dari XP pill di home */}
        {showXpModal && (
          <XpLevelInfoModal xp={xp || 0} onClose={() => setShowXpModal(false)} />
        )}

        {/* Coin info modal — trigger dari coin pill di home */}
        {showCoinModal && (
          <CoinInfoModal
            coins={authProfile?.coins || 0}
            onClose={() => setShowCoinModal(false)}
            onTopUp={() => {
              // Placeholder: top-up flow akan diaktifkan di update berikutnya
              // (butuh payment gateway integration: Midtrans, Xendit, atau Stripe).
              alert('Sistem top-up koin akan diaktifkan di update berikutnya. Saat ini bisa dapet koin gratis dari aktivitas belajar.');
            }}
          />
        )}

        {/* Streak info modal — trigger dari flame pill di home */}
        {showStreakModal && (
          <StreakInfoModal streak={streak || 0} onClose={() => setShowStreakModal(false)} />
        )}

        {/* Tour 4-slide overlay — kenalan dengan tab Beranda/Belajar/Sosial/Profil */}
        {showTour && (
          <TourOverlay
            onComplete={async () => {
              // Selesai tour: kasih 50 XP welcome + badge "Pengembara Baru"
              const bonusXp = 50;
              const newXp = (xp || 0) + bonusXp;
              setXp(newXp);
              await updateUserProfile({ tourCompleted: true, xp: newXp });
              setAchievements((a) => [
                { id: Date.now(), type: 'badge', text: 'Pengembara Baru! +50 XP', emoji: '🧭', time: 'baru saja', user: userName || 'Anda' },
                ...a,
              ]);
              setShowTour(false);
            }}
            onSkip={async () => {
              // Skip tetap tandai selesai biar gak kembali prompt; tapi gak dapet bonus.
              await updateUserProfile({ tourCompleted: true });
              setShowTour(false);
            }}
          />
        )}
      </div>
    </div>
  );
}

// ============ WELCOME / ONBOARDING ============
function WelcomeScreen({ onComplete, initialName = '' }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    // Pre-fill name dari Google account / Firestore (kalau ada),
    // user masih bisa edit di step 1.
    name: initialName,
    interests: [],
    arabicLevel: '', // 'pemula' | 'bisaBaca' | 'menengah' | 'lancar' — survey baru
    learningStyle: '',
    accent: '',
    dailyTime: '',
  });

  const updateData = (key, value) => setData(d => ({ ...d, [key]: value }));
  const toggleInterest = (id) => {
    setData(d => ({
      ...d,
      interests: d.interests.includes(id) ? d.interests.filter(i => i !== id) : [...d.interests, id]
    }));
  };

  // Step 0: Brand intro
  if (step === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-between px-6 py-12">
        <div className="w-full" />
        <div className="flex flex-col items-center text-center max-w-sm">
          <div className="relative mb-8">
            <div className="absolute inset-0 blur-3xl opacity-40" style={{ background: '#c9a961', borderRadius: '50%' }} />
            <div className="relative w-28 h-28 rounded-3xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)', transform:'rotate(-6deg)' }}>
              <span className="text-6xl" style={{ fontFamily: 'Amiri, serif', color: '#f3ebd9', transform:'rotate(6deg)', display:'inline-block' }}>ن</span>
            </div>
          </div>

          <h1 className="text-5xl mb-2 leading-none" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: '#0a4d3c', letterSpacing: '-0.03em' }}>
            Tulis Noon
          </h1>
          <p className="text-sm tracking-[0.25em] uppercase mb-6" style={{ color: '#8b6b3d' }}>تُلِسْ نُونْ</p>
          <div className="h-px w-12 mb-6" style={{ background: '#c9a961' }} />
          <p className="text-lg leading-relaxed mb-2" style={{ color: '#3d2817', fontFamily: 'Fraunces, serif' }}>
            Bahasa Arab, dengan cara <em>memahami</em>.
          </p>
          <p className="text-sm" style={{ color: '#8b6b3d' }}>
            Bukan menghafal — tapi membiasakan.
          </p>
        </div>

        <div className="w-full">
          <button onClick={() => setStep(1)} className="w-full py-4 rounded-2xl text-white font-medium text-base flex items-center justify-center gap-2" style={{ background: '#0a4d3c', boxShadow: '0 10px 30px -10px rgba(10,77,60,0.5)' }}>
            Mulai Kenalan
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // Common header for onboarding steps
  const OnboardHeader = ({ stepNum, totalSteps, onBack }) => (
    <div className="flex items-center gap-3 mb-8">
      <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
        <ArrowLeft size={18} style={{ color: '#0a4d3c' }} />
      </button>
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(10,77,60,0.1)' }}>
        <div className="h-full transition-all duration-500" style={{ width: `${(stepNum/totalSteps)*100}%`, background: '#0a4d3c' }} />
      </div>
      <span className="text-xs font-semibold" style={{ color: '#0a4d3c' }}>{stepNum}/{totalSteps}</span>
    </div>
  );

  // Step 1: Name
  if (step === 1) {
    return (
      <div className="flex-1 flex flex-col px-6 py-8">
        <OnboardHeader stepNum={1} totalSteps={6} onBack={() => setStep(0)} />
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#8b6b3d' }}>Bismillah</p>
          <h2 className="text-3xl mb-3 leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: '#0a4d3c' }}>
            Siapa namamu?
          </h2>
          <p className="text-sm mb-8" style={{ color: '#666' }}>Supaya kami bisa menyapamu dengan baik.</p>

          <input
            type="text"
            value={data.name}
            onChange={(e) => updateData('name', e.target.value)}
            placeholder="Nama panggilanmu..."
            className="w-full px-5 py-4 rounded-2xl text-base outline-none"
            style={{ background: 'white', border: '2px solid rgba(10,77,60,0.15)', color: '#1a1a1a' }}
          />
        </div>

        <button onClick={() => data.name && setStep(2)} disabled={!data.name} className="w-full py-4 rounded-2xl text-white font-medium flex items-center justify-center gap-2 disabled:opacity-40" style={{ background: '#0a4d3c' }}>
          Lanjut <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  // Step 2: Interests/Hobbies
  if (step === 2) {
    const interests = [
      { id: 'religion', label: 'Agama & Spiritual', emoji: '🕌' },
      { id: 'travel', label: 'Travel & Jalan-jalan', emoji: '✈️' },
      { id: 'food', label: 'Kuliner', emoji: '🍽️' },
      { id: 'movies', label: 'Film & Drama', emoji: '🎬' },
      { id: 'music', label: 'Musik', emoji: '🎵' },
      { id: 'sports', label: 'Olahraga', emoji: '⚽' },
      { id: 'business', label: 'Bisnis & Karir', emoji: '💼' },
      { id: 'history', label: 'Sejarah Islam', emoji: '📜' },
      { id: 'tech', label: 'Teknologi', emoji: '💻' },
      { id: 'family', label: 'Keluarga', emoji: '👨‍👩‍👧' },
    ];

    return (
      <div className="flex-1 flex flex-col px-6 py-8">
        <OnboardHeader stepNum={2} totalSteps={6} onBack={() => setStep(1)} />
        <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#8b6b3d' }}>Tentang dirimu</p>
        <h2 className="text-3xl mb-2 leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: '#0a4d3c' }}>
          Apa yang kamu sukai?
        </h2>
        <p className="text-sm mb-6" style={{ color: '#666' }}>Pilih minimal 2 — kami akan sesuaikan materimu.</p>

        <div className="flex flex-wrap gap-2 mb-6 flex-1 content-start">
          {interests.map((it) => {
            const isSelected = data.interests.includes(it.id);
            return (
              <button
                key={it.id}
                onClick={() => toggleInterest(it.id)}
                className="px-4 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition-all"
                style={{
                  background: isSelected ? '#0a4d3c' : 'white',
                  color: isSelected ? 'white' : '#1a1a1a',
                  border: `1.5px solid ${isSelected ? '#0a4d3c' : 'rgba(10,77,60,0.15)'}`
                }}
              >
                <span>{it.emoji}</span>
                {it.label}
                {isSelected && <Check size={14} />}
              </button>
            );
          })}
        </div>

        <button onClick={() => data.interests.length >= 2 && setStep(3)} disabled={data.interests.length < 2} className="w-full py-4 rounded-2xl text-white font-medium flex items-center justify-center gap-2 disabled:opacity-40" style={{ background: '#0a4d3c' }}>
          Lanjut ({data.interests.length} dipilih) <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  // Step 3: Learning style
  if (step === 3) {
    const styles = [
      { id: 'visual', label: 'Visual', desc: 'Lewat gambar dan video', emoji: '👁️' },
      { id: 'audio', label: 'Auditori', desc: 'Lewat suara dan pengucapan', emoji: '👂' },
      { id: 'story', label: 'Cerita', desc: 'Lewat skenario dan kisah', emoji: '📖' },
      { id: 'game', label: 'Game & Kompetisi', desc: 'Lewat tantangan seru', emoji: '🎮' },
    ];

    return (
      <div className="flex-1 flex flex-col px-6 py-8">
        <OnboardHeader stepNum={3} totalSteps={6} onBack={() => setStep(2)} />
        <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#8b6b3d' }}>Gaya belajar</p>
        <h2 className="text-3xl mb-2 leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: '#0a4d3c' }}>
          Bagaimana kamu suka belajar?
        </h2>
        <p className="text-sm mb-6" style={{ color: '#666' }}>Kami akan menonjolkan metode favoritmu.</p>

        <div className="space-y-3 flex-1">
          {styles.map((s) => {
            const isSelected = data.learningStyle === s.id;
            return (
              <button
                key={s.id}
                onClick={() => updateData('learningStyle', s.id)}
                className="w-full p-4 rounded-2xl text-left flex items-center gap-4"
                style={{
                  background: isSelected ? 'rgba(10,77,60,0.08)' : 'white',
                  border: `2px solid ${isSelected ? '#0a4d3c' : 'rgba(10,77,60,0.15)'}`,
                }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: isSelected ? '#0a4d3c' : 'rgba(10,77,60,0.08)' }}>
                  {s.emoji}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-base" style={{ color: '#1a1a1a' }}>{s.label}</p>
                  <p className="text-xs" style={{ color: '#666' }}>{s.desc}</p>
                </div>
                {isSelected && <Check size={20} style={{ color: '#0a4d3c' }} />}
              </button>
            );
          })}
        </div>

        <button onClick={() => data.learningStyle && setStep(4)} disabled={!data.learningStyle} className="w-full py-4 rounded-2xl text-white font-medium flex items-center justify-center gap-2 disabled:opacity-40 mt-4" style={{ background: '#0a4d3c' }}>
          Lanjut <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  // Step 4: Accent preference
  if (step === 4) {
    const accents = [
      { id: 'saudi', label: 'Saudi / Khaliji', desc: 'Aksen Arab Saudi & Teluk', flag: '🇸🇦' },
      { id: 'fusha', label: 'Fusha (Standard)', desc: 'Bahasa Arab resmi & Al-Quran', flag: '📖' },
      { id: 'masri', label: 'Mesir', desc: 'Aksen Mesir (film & drama)', flag: '🇪🇬' },
      { id: 'shami', label: 'Syam', desc: 'Aksen Suriah, Yordan, Palestin', flag: '🇸🇾' },
    ];

    return (
      <div className="flex-1 flex flex-col px-6 py-8">
        <OnboardHeader stepNum={4} totalSteps={6} onBack={() => setStep(3)} />
        <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#8b6b3d' }}>Aksen favorit</p>
        <h2 className="text-3xl mb-2 leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: '#0a4d3c' }}>
          Aksen Arab mana yang menarik?
        </h2>
        <p className="text-sm mb-6" style={{ color: '#666' }}>Kamu masih bisa belajar yang lain juga.</p>

        <div className="space-y-3 flex-1">
          {accents.map((a) => {
            const isSelected = data.accent === a.id;
            return (
              <button
                key={a.id}
                onClick={() => updateData('accent', a.id)}
                className="w-full p-4 rounded-2xl text-left flex items-center gap-4"
                style={{
                  background: isSelected ? 'rgba(10,77,60,0.08)' : 'white',
                  border: `2px solid ${isSelected ? '#0a4d3c' : 'rgba(10,77,60,0.15)'}`,
                }}
              >
                <div className="text-3xl flex-shrink-0">{a.flag}</div>
                <div className="flex-1">
                  <p className="font-semibold text-base" style={{ color: '#1a1a1a' }}>{a.label}</p>
                  <p className="text-xs" style={{ color: '#666' }}>{a.desc}</p>
                </div>
                {isSelected && <Check size={20} style={{ color: '#0a4d3c' }} />}
              </button>
            );
          })}
        </div>

        <button onClick={() => data.accent && setStep(5)} disabled={!data.accent} className="w-full py-4 rounded-2xl text-white font-medium flex items-center justify-center gap-2 disabled:opacity-40 mt-4" style={{ background: '#0a4d3c' }}>
          Lanjut <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  // Step 5: Daily time commitment
  if (step === 5) {
    const times = [
      { id: '5min', label: '5 menit/hari', desc: 'Sekedar konsisten', emoji: '☕' },
      { id: '15min', label: '15 menit/hari', desc: 'Tempo santai', emoji: '🚶' },
      { id: '30min', label: '30 menit/hari', desc: 'Serius belajar', emoji: '🏃' },
      { id: '60min', label: '1 jam/hari', desc: 'Saya mau cepat fasih', emoji: '🚀' },
    ];

    return (
      <div className="flex-1 flex flex-col px-6 py-8">
        <OnboardHeader stepNum={5} totalSteps={6} onBack={() => setStep(4)} />
        <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#8b6b3d' }}>Komitmen waktu</p>
        <h2 className="text-3xl mb-2 leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: '#0a4d3c' }}>
          Berapa waktu per hari?
        </h2>
        <p className="text-sm mb-6" style={{ color: '#666' }}>Jujur saja — kami akan sesuaikan dengan jadwalmu.</p>

        <div className="space-y-3 flex-1">
          {times.map((t) => {
            const isSelected = data.dailyTime === t.id;
            return (
              <button
                key={t.id}
                onClick={() => updateData('dailyTime', t.id)}
                className="w-full p-4 rounded-2xl text-left flex items-center gap-4"
                style={{
                  background: isSelected ? 'rgba(10,77,60,0.08)' : 'white',
                  border: `2px solid ${isSelected ? '#0a4d3c' : 'rgba(10,77,60,0.15)'}`,
                }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: isSelected ? '#0a4d3c' : 'rgba(10,77,60,0.08)' }}>
                  {t.emoji}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-base" style={{ color: '#1a1a1a' }}>{t.label}</p>
                  <p className="text-xs" style={{ color: '#666' }}>{t.desc}</p>
                </div>
                {isSelected && <Check size={20} style={{ color: '#0a4d3c' }} />}
              </button>
            );
          })}
        </div>

        <button onClick={() => data.dailyTime && setStep(6)} disabled={!data.dailyTime} className="w-full py-4 rounded-2xl text-white font-medium flex items-center justify-center gap-2 disabled:opacity-40 mt-4" style={{ background: '#0a4d3c' }}>
          Lanjut <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  // Step 6: Arabic level survey — penting buat rekomendasi level start point
  if (step === 6) {
    const levels = [
      { id: 'pemula', label: 'Belum pernah belajar', desc: 'Aku mulai dari nol', emoji: '🌱', recommendedLevel: 'Mubtadi (Level 1-5)' },
      { id: 'bisaBaca', label: 'Bisa baca, belum paham arti', desc: 'Lulus iqro/baca Quran tapi belum ngerti makna', emoji: '📖', recommendedLevel: 'Daris (Level 6-20)' },
      { id: 'menengah', label: 'Paham percakapan dasar', desc: 'Bisa salam, sapa, nawar di pasar', emoji: '💬', recommendedLevel: 'Mutawassith (Level 21-50)' },
      { id: 'lancar', label: 'Lancar ngobrol sehari-hari', desc: 'Mau perdalam Hijazi & istilah ibadah', emoji: '🎯', recommendedLevel: 'Faaheem/Mahir (Level 51+)' },
    ];

    return (
      <div className="flex-1 flex flex-col px-6 py-8">
        <OnboardHeader stepNum={6} totalSteps={6} onBack={() => setStep(5)} />
        <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#8b6b3d' }}>Level bahasa Arabmu</p>
        <h2 className="text-3xl mb-2 leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: '#0a4d3c' }}>
          Sudah sejauh mana bahasa Arabmu?
        </h2>
        <p className="text-sm mb-6" style={{ color: '#666' }}>Jujur saja — kami akan kasih rekomendasi level yang pas, tidak terlalu mudah atau susah.</p>

        <div className="space-y-3 flex-1">
          {levels.map((lv) => {
            const isSelected = data.arabicLevel === lv.id;
            return (
              <button
                key={lv.id}
                onClick={() => updateData('arabicLevel', lv.id)}
                className="w-full p-4 rounded-2xl text-left flex items-start gap-3"
                style={{
                  background: isSelected ? 'rgba(10,77,60,0.08)' : 'white',
                  border: `2px solid ${isSelected ? '#0a4d3c' : 'rgba(10,77,60,0.15)'}`,
                }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: isSelected ? '#0a4d3c' : 'rgba(10,77,60,0.08)' }}>
                  {lv.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-base leading-tight" style={{ color: '#1a1a1a' }}>{lv.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#666' }}>{lv.desc}</p>
                  {isSelected && (
                    <p className="text-xs mt-2 font-semibold" style={{ color: '#0a4d3c' }}>
                      ✨ Rekomendasi: {lv.recommendedLevel}
                    </p>
                  )}
                </div>
                {isSelected && <Check size={20} style={{ color: '#0a4d3c' }} className="flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        <button onClick={() => data.arabicLevel && setStep(7)} disabled={!data.arabicLevel} className="w-full py-4 rounded-2xl text-white font-medium flex items-center justify-center gap-2 disabled:opacity-40 mt-4" style={{ background: '#0a4d3c' }}>
          Lanjut <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  // Step 7: Summary / Welcome
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-8">
      <div className="relative mb-6">
        <div className="absolute inset-0 blur-3xl opacity-40" style={{ background: '#c9a961', borderRadius: '50%' }} />
        <div className="relative w-24 h-24 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #c9a961, #d4b876)' }}>
          <Sparkles size={36} color="white" />
        </div>
      </div>
      <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: '#c9a961' }}>Siap memulai</p>
      <h2 className="text-3xl mb-3" style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: '#0a4d3c' }}>
        Marhaban, {data.name}!
      </h2>
      <p className="text-base mb-6 max-w-xs" style={{ color: '#3d2817' }}>
        Kami sudah menyiapkan materi yang sesuai dengan minat dan gaya belajarmu.
      </p>

      <div className="w-full max-w-xs space-y-2 mb-8">
        <div className="flex items-center gap-3 p-3 rounded-xl text-sm" style={{ background: 'white' }}>
          <HeartIcon size={16} style={{ color: '#c9a961' }} />
          <span style={{ color: '#3d2817' }}>{data.interests.length} minat dipersonalisasi</span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl text-sm" style={{ background: 'white' }}>
          <Target size={16} style={{ color: '#0a4d3c' }} />
          <span style={{ color: '#3d2817' }}>
            Level start: {data.arabicLevel === 'pemula' ? 'Mubtadi' : data.arabicLevel === 'bisaBaca' ? 'Daris' : data.arabicLevel === 'menengah' ? 'Mutawassith' : 'Faaheem/Mahir'}
          </span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl text-sm" style={{ background: 'white' }}>
          <BookOpen size={16} style={{ color: '#0a4d3c' }} />
          <span style={{ color: '#3d2817' }}>Gaya belajar disesuaikan</span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl text-sm" style={{ background: 'white' }}>
          <Clock size={16} style={{ color: '#8b6b3d' }} />
          <span style={{ color: '#3d2817' }}>Jadwal sesuai komitmenmu</span>
        </div>
      </div>

      <button onClick={() => onComplete(data)} className="w-full max-w-xs py-4 rounded-2xl text-white font-medium flex items-center justify-center gap-2" style={{ background: '#0a4d3c' }}>
        Masuk ke Tulis Noon <ArrowRight size={18} />
      </button>
    </div>
  );
}

// ============ HOME TAB ============
function HomeTab({ userName, userProfile, xp, streak, coins, onShowXpInfo, onShowCoinInfo, onShowStreakInfo, onOpenLesson, onOpenGame, onOpenChallenge, onOpenGuru, achievements }) {
  // Personalized greeting based on interests
  const personalizedNote = userProfile?.interests?.includes('religion')
    ? 'Mari belajar bahasa Al-Quran hari ini'
    : userProfile?.interests?.includes('travel')
    ? 'Siapkan dirimu untuk perjalanan ke Arab'
    : 'Senang melihatmu lagi';

  // Format tanggal Masehi (Indonesia) + Hijriah (Umm al-Qura — kalender resmi Saudi)
  const today = new Date();
  const gregorianDate = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(today);

  // Hitung Hijriah pakai formatToParts biar bisa pakai nama bulan Bahasa Indonesia
  const hijriMonths = [
    'Muharram', 'Safar', 'Rabiul Awal', 'Rabiul Akhir',
    'Jumadil Awal', 'Jumadil Akhir', 'Rajab', 'Syaban',
    'Ramadan', 'Syawal', 'Zulkaidah', 'Zulhijah',
  ];
  let hijriDate = '';
  try {
    const parts = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }).formatToParts(today);
    const d = parts.find((p) => p.type === 'day')?.value;
    const m = parts.find((p) => p.type === 'month')?.value;
    const y = parts.find((p) => p.type === 'year')?.value;
    if (d && m && y) {
      hijriDate = `${d} ${hijriMonths[parseInt(m, 10) - 1]} ${y} H`;
    }
  } catch (e) {
    // Browser ga support kalender islamic-umalqura — biarin kosong, fallback hanya Masehi.
  }

  return (
    <div className="px-5 py-6">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm" style={{ color: '#8b6b3d' }}>Marhaban,</p>
        <div className="flex items-center gap-1.5">
          {/* Streak pill — clickable, jelasin apa itu flame & cara dapet milestone */}
          <button
            onClick={onShowStreakInfo}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full transition-transform active:scale-95"
            style={{ background: 'rgba(160,85,54,0.15)', cursor: 'pointer' }}
            aria-label="Pelajari tentang streak"
          >
            <Flame size={12} style={{ color: '#a05536' }} />
            <span className="text-xs font-bold" style={{ color: '#a05536' }}>{streak}</span>
          </button>
          {/* Coin pill — clickable, buka modal info Koin & paket top-up */}
          <button
            onClick={onShowCoinInfo}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full transition-transform active:scale-95"
            style={{ background: 'rgba(201,169,97,0.2)', cursor: 'pointer' }}
            aria-label="Pelajari tentang Koin"
          >
            <span style={{ fontSize: '12px' }}>🪙</span>
            <span className="text-xs font-bold" style={{ color: '#8b6b3d' }}>{coins || 0}</span>
          </button>
          {/* XP pill — clickable, buka XpLevelInfoModal yg nerangin XP & cara naik level */}
          <button
            onClick={onShowXpInfo}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full transition-transform active:scale-95"
            style={{ background: 'rgba(10,77,60,0.1)', cursor: 'pointer' }}
            aria-label="Pelajari tentang XP"
          >
            <Star size={12} style={{ color: '#0a4d3c' }} fill="#0a4d3c" />
            <span className="text-xs font-bold" style={{ color: '#0a4d3c' }}>{xp}</span>
          </button>
        </div>
      </div>
      <h1 className="text-2xl mb-1" style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: '#0a4d3c' }}>
        {userName || 'Sahabat'} 👋
      </h1>
      <p className="text-sm mb-4" style={{ color: '#8b6b3d' }}>{personalizedNote}</p>

      {/* Tanggal Masehi + Hijriah - sederet di atas card Pasar Madinah */}
      <div
        className="flex items-center justify-between mb-3 px-4 py-3 rounded-xl"
        style={{
          background: 'linear-gradient(90deg, rgba(201,169,97,0.22), rgba(10,77,60,0.10))',
          border: '1.5px solid rgba(201,169,97,0.45)',
        }}
      >
        <div className="flex items-center gap-2">
          <Calendar size={14} style={{ color: '#0a4d3c' }} />
          <span className="text-xs font-semibold" style={{ color: '#0a4d3c' }}>
            {gregorianDate}
          </span>
        </div>
        {hijriDate && (
          <span className="text-xs font-semibold" style={{ color: '#8b6b3d' }}>
            {hijriDate}
          </span>
        )}
      </div>

      {/* Daily Challenge Card — rotasi berdasarkan tanggal */}
      {(() => {
        const todayChallenge = getTodayChallenge();
        const otherChallenges = CHALLENGE_SCENARIOS.filter((s) => s.id !== todayChallenge.id);
        return (
          <>
            <button onClick={() => onOpenChallenge(todayChallenge)} className="w-full text-left rounded-2xl p-5 mb-5 relative overflow-hidden active:scale-[0.98] transition-transform" style={{ background: todayChallenge.bgGradient }}>
              <div className="absolute -right-6 -top-6 text-8xl opacity-15" style={{ fontFamily: 'Amiri, serif', color: '#c9a961' }}>{todayChallenge.emoji}</div>
              <div className="flex items-center gap-2 mb-2">
                <Zap size={16} color="#c9a961" />
                <p className="text-xs tracking-widest uppercase text-white opacity-90">Tantangan Hari Ini</p>
              </div>
              <h3 className="text-xl text-white mb-1" style={{ fontFamily: 'Fraunces, serif', fontWeight: 600 }}>{todayChallenge.name}</h3>
              <p className="text-sm text-white opacity-80 mb-1" style={{ fontFamily: 'Amiri, serif' }}>{todayChallenge.arName}</p>
              <p className="text-sm text-white opacity-80 mb-3">{todayChallenge.desc} · 5 soal · max +40 XP</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="flex -space-x-1">
                    {['#c9a961','#d4b876','#e8c885'].map((c,i)=>(<div key={i} className="w-5 h-5 rounded-full border-2" style={{background:c,borderColor:todayChallenge.color}}/>))}
                  </div>
                  <span className="text-xs text-white opacity-80">142 user sudah ikut</span>
                </div>
                <span className="text-sm font-semibold text-white flex items-center gap-1">Mulai <ChevronRight size={14}/></span>
              </div>
            </button>

            {/* Tantangan Lain — 3 lokasi yang ga muncul sebagai "Hari Ini" */}
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#8b6b3d' }}>Tantangan Lain</p>
            <div className="grid grid-cols-3 gap-2 mb-5">
              {otherChallenges.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onOpenChallenge(c)}
                  className="p-3 rounded-2xl text-left active:scale-[0.98] transition-transform"
                  style={{ background: 'white', border: '1px solid rgba(10,77,60,0.08)' }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-2" style={{ background: `${c.color}15` }}>
                    {c.emoji}
                  </div>
                  <p className="font-semibold text-xs mb-0.5 leading-tight" style={{ color: '#1a1a1a' }}>{c.name}</p>
                  <p className="text-[10px] leading-tight" style={{ color: '#8b6b3d' }}>{c.desc}</p>
                </button>
              ))}
            </div>
          </>
        );
      })()}

      {/* Continue Learning */}
      <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#8b6b3d' }}>Lanjut Belajar</p>
      <button onClick={onOpenLesson} className="w-full p-4 rounded-2xl flex items-center gap-3 mb-6 active:scale-[0.98] transition-transform" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.08)' }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ background: 'rgba(10,77,60,0.1)' }}>🤝</div>
        <div className="flex-1 text-left">
          <p className="font-semibold text-sm" style={{ color: '#1a1a1a' }}>Perkenalan Diri</p>
          <p className="text-xs" style={{ color: '#666' }}>Wisatawan & Umrah · 2/8</p>
          <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(10,77,60,0.1)' }}>
            <div className="h-full" style={{ width: '25%', background: '#0a4d3c' }} />
          </div>
        </div>
        <ChevronRight size={18} style={{ color: '#8b6b3d' }} />
      </button>

      {/* Quick Games — di-rekomendasi berdasarkan minat user dari onboarding */}
      {(() => {
        // Mapping affinity: setiap game cocok untuk minat-minat tertentu.
        // Logika rule-based (bukan ML beneran) — cukup untuk v1.
        // Phase 2 nanti bisa di-upgrade pakai ML beneran yang track behavior user
        // (mana game yang sering dimainin, completion rate, dll).
        const allGames = [
          {
            id: 'image-quiz', t: 'Tebak Gambar', d: 'Visual',
            icon: ImageIcon, color: '#0a4d3c', bg: 'rgba(10,77,60,0.1)',
            interests: ['food', 'travel', 'family', 'sports'],
            personalizedDesc: {
              food: 'Tebak makanan Arab',
              travel: 'Tebak tempat-tempat',
              family: 'Tebak benda keluarga',
              sports: 'Tebak olahraga',
            },
          },
          {
            id: 'video-quiz', t: 'Quiz Video', d: 'Skenario',
            icon: Play, color: '#7a3d2a', bg: 'rgba(122,61,42,0.1)',
            interests: ['travel', 'business', 'religion', 'family'],
            personalizedDesc: {
              travel: 'Skenario umrah',
              business: 'Skenario kerja',
              religion: 'Skenario masjid',
              family: 'Skenario keluarga',
            },
          },
          {
            id: 'chat-roleplay', t: 'Latihan Ngobrol', d: 'Ngobrol',
            icon: Bot, color: '#8b6b3d', bg: 'rgba(139,107,61,0.15)',
            interests: ['religion', 'business', 'family', 'travel'],
            personalizedDesc: {
              religion: 'Ngobrol dgn ustadz',
              business: 'Ngobrol kerja',
              family: 'Ngobrol keluarga',
              travel: 'Ngobrol jamaah',
            },
          },
          {
            id: 'tulis-arab', t: 'Tulis Arab', d: 'Baca-Tulis',
            icon: BookOpen, color: '#0a4d3c', bg: 'rgba(10,77,60,0.1)',
            interests: ['religion', 'family', 'history', 'tech'],
            personalizedDesc: {
              religion: 'Baca Quran lancar',
              family: 'Bisa nulis nama',
              history: 'Huruf hijaiyah',
              tech: 'Belajar dari nol',
            },
          },
          {
            id: 'story', t: 'Cerita', d: 'Interaktif',
            icon: BookOpen, color: '#0a4d3c', bg: 'rgba(10,77,60,0.1)',
            interests: ['history', 'movies', 'religion', 'family'],
            personalizedDesc: {
              history: 'Sejarah Islam',
              movies: 'Cerita seru',
              religion: 'Kisah sahabat',
              family: 'Cerita keluarga',
            },
          },
        ];

        const userInterests = userProfile?.interests || [];

        // Hitung match score untuk tiap game: jumlah minat user yang overlap dengan
        // tag interests game itu. Game tanpa match (score 0) tetap ditampilkan tapi
        // di-posisi terakhir.
        const scored = allGames.map((g) => {
          const matchedInterests = g.interests.filter((i) => userInterests.includes(i));
          // Kustomisasi deskripsi card berdasarkan minat pertama yang match
          const personalDesc = matchedInterests.length > 0
            ? g.personalizedDesc[matchedInterests[0]]
            : g.d;
          return {
            ...g,
            score: matchedInterests.length,
            displayDesc: personalDesc,
          };
        });

        // Sort: skor tertinggi dulu, stable sort by index sebagai tiebreaker
        scored.sort((a, b) => b.score - a.score);

        const topMatchScore = scored[0]?.score || 0;
        const hasPersonalization = topMatchScore > 0;

        return (
          <>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs tracking-widest uppercase" style={{ color: '#8b6b3d' }}>
                {hasPersonalization ? 'Direkomendasikan Untukmu' : 'Game Cepat'}
              </p>
              {hasPersonalization && (
                <span className="text-xs" style={{ color: '#c9a961' }}>
                  ✨ Berdasarkan minatmu
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {scored.map((g) => {
                const Icon = g.icon;
                const isTopMatch = hasPersonalization && g.score === topMatchScore;
                return (
                  <button
                    key={g.id}
                    onClick={() => onOpenGame(g)}
                    className="p-4 rounded-2xl text-left active:scale-[0.98] transition-transform relative"
                    style={{
                      background: 'white',
                      border: isTopMatch
                        ? '1.5px solid rgba(201,169,97,0.6)'
                        : '1px solid rgba(10,77,60,0.08)',
                      boxShadow: isTopMatch ? '0 4px 16px -8px rgba(201,169,97,0.5)' : 'none',
                    }}
                  >
                    {isTopMatch && (
                      <span
                        className="absolute -top-2 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ background: '#c9a961', color: 'white' }}
                      >
                        ✨ Untukmu
                      </span>
                    )}
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: g.bg }}>
                      <Icon size={18} style={{ color: g.color }} />
                    </div>
                    <p className="font-semibold text-sm" style={{ color: '#1a1a1a' }}>{g.t}</p>
                    <p className="text-xs" style={{ color: '#666' }}>{g.displayDesc}</p>
                  </button>
                );
              })}
            </div>
          </>
        );
      })()}

      {/* Guru / Teacher Card */}
      <button onClick={onOpenGuru} className="w-full text-left rounded-2xl p-5 mb-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #7a3d2a, #a05536)' }}>
        <div className="absolute -right-4 -bottom-4 text-7xl opacity-15" style={{ fontFamily: 'Amiri, serif', color: '#f3ebd9' }}>ع</div>
        <div className="flex items-center gap-2 mb-2">
          <UserCheck size={16} color="#f3ebd9" />
          <p className="text-xs tracking-widest uppercase text-white opacity-90">Baru!</p>
        </div>
        <h3 className="text-xl text-white mb-1" style={{ fontFamily: 'Fraunces, serif', fontWeight: 600 }}>Belajar dengan Ustadz</h3>
        <p className="text-sm text-white opacity-80 mb-3">Kelas grup atau privat 1-on-1 dengan guru asli</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-1">
              {['👨🏽','👨🏽‍🦱','👳🏽‍♂️'].map((e,i)=>(<div key={i} className="w-6 h-6 rounded-full flex items-center justify-center text-xs border-2" style={{background:'white',borderColor:'#7a3d2a'}}>{e}</div>))}
            </div>
            <span className="text-xs text-white opacity-80">12 guru tersedia</span>
          </div>
          <span className="text-sm font-semibold text-white flex items-center gap-1">Lihat <ChevronRight size={14}/></span>
        </div>
      </button>

      {/* Activity Preview */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs tracking-widest uppercase" style={{ color: '#8b6b3d' }}>Aktivitas Komunitas</p>
        <span className="text-xs" style={{ color: '#c9a961', fontWeight: 500 }}>Lihat semua</span>
      </div>
      <div className="space-y-2">
        {achievements.slice(0,2).map((a) => (
          <div key={a.id} className="p-3 rounded-xl flex items-center gap-3" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.06)' }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-base" style={{ background: 'rgba(201,169,97,0.15)' }}>
              {a.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate" style={{ color: '#1a1a1a' }}>
                <span style={{ color: '#0a4d3c' }}>{a.user}</span> {a.text.toLowerCase()}
              </p>
              <p className="text-xs" style={{ color: '#8b6b3d' }}>{a.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ BELAJAR TAB ============
function BelajarTab({ onSelectPath, onOpenGuru, progress }) {
  const paths = [
    { id: 'umrah', title: 'Wisatawan & Jamaah Umrah', arabic: 'للزائرين', desc: 'Salam, perkenalan, tanya arah', icon: MapPin, color: '#0a4d3c', lessons: 8, available: true },
    { id: 'profesi', title: 'Profesional & Bisnis', arabic: 'للمهنيين', desc: 'Komunikasi kerja & rapat', icon: Briefcase, color: '#8b6b3d', lessons: 6, available: true },
    { id: 'beasiswa', title: 'Pelajar Beasiswa', arabic: 'للطلاب', desc: 'Bahasa akademik & kampus', icon: GraduationCap, color: '#7a3d2a', lessons: 10, available: true },
  ];

  return (
    <div className="px-5 py-6">
      <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: '#8b6b3d' }}>Pilih jalurmu</p>
      <h1 className="text-3xl mb-6 leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: '#0a4d3c' }}>
        Belajar untuk<br/>tujuan apa?
      </h1>

      <div className="space-y-3">
        {paths.map((p) => {
          const Icon = p.icon;
          const pProgress = progress[p.id] || 0;
          return (
            <button key={p.id} onClick={() => p.available && onSelectPath(p)} disabled={!p.available} className="w-full text-left p-5 rounded-2xl relative active:scale-[0.98] transition-transform disabled:opacity-60" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.08)', boxShadow: '0 4px 16px -8px rgba(10,77,60,0.1)' }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${p.color}15` }}>
                  <Icon size={22} style={{ color: p.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-base" style={{ color: '#1a1a1a' }}>{p.title}</h3>
                    {!p.available && <Lock size={12} style={{ color: '#8b6b3d' }} />}
                  </div>
                  <p className="text-sm mb-3" style={{ color: '#666' }}>{p.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: '#8b6b3d' }}>{pProgress}/{p.lessons} pelajaran</span>
                    <span className="text-lg" style={{ fontFamily: 'Amiri, serif', color: p.color, opacity: 0.6 }}>{p.arabic}</span>
                  </div>
                  {p.available && (
                    <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: `${p.color}15` }}>
                      <div className="h-full" style={{ width: `${(pProgress/p.lessons)*100}%`, background: p.color }} />
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 p-4 rounded-2xl text-center" style={{ background: 'rgba(201,169,97,0.1)', border: '1px dashed #c9a961' }}>
        <Sparkles size={20} className="mx-auto mb-2" style={{ color: '#c9a961' }} />
        <p className="text-sm" style={{ color: '#7a3d2a' }}>Semua jalur belajar terbuka — pilih sesuai kebutuhanmu</p>
      </div>

      {/* Guru access in Belajar tab */}
      <div className="mt-4">
        <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#8b6b3d' }}>Atau Belajar Langsung</p>
        <button onClick={onOpenGuru} className="w-full p-5 rounded-2xl flex items-center gap-4 active:scale-[0.98] transition-transform" style={{ background: 'white', border: '1px solid rgba(122,61,42,0.15)' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(122,61,42,0.1)' }}>
            <UserCheck size={22} style={{ color: '#7a3d2a' }} />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-semibold text-base" style={{ color: '#1a1a1a' }}>Belajar dengan Ustadz</h3>
            <p className="text-sm" style={{ color: '#666' }}>Kelas grup atau privat 1-on-1</p>
          </div>
          <ChevronRight size={18} style={{ color: '#8b6b3d' }} />
        </button>
      </div>
    </div>
  );
}

// ============ SOSIAL TAB ============
function SosialTab({ achievements, userName }) {
  return (
    <div className="px-5 py-6">
      <div className="flex items-center justify-between mb-1">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase mb-1" style={{ color: '#8b6b3d' }}>Komunitas</p>
          <h1 className="text-3xl" style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: '#0a4d3c' }}>Sosial</h1>
        </div>
      </div>

      <div className="my-4 p-3 rounded-xl text-xs flex items-start gap-2" style={{ background: 'rgba(201,169,97,0.1)', border: '1px dashed #c9a961' }}>
        <Sparkles size={14} style={{ color: '#c9a961' }} className="mt-0.5 flex-shrink-0" />
        <p style={{ color: '#7a3d2a' }}>
          <strong>Preview fitur sosial.</strong> Like, komentar, dan pertemanan akan aktif di versi penuh.
        </p>
      </div>

      {/* Leaderboard preview */}
      <div className="rounded-2xl p-4 mb-5" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.08)' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy size={16} style={{ color: '#c9a961' }} />
            <p className="text-sm font-semibold" style={{ color: '#0a4d3c' }}>Papan Peringkat Mingguan</p>
          </div>
          <Lock size={12} style={{ color: '#8b6b3d' }} />
        </div>
        <div className="space-y-2 opacity-60">
          {[{n:'Ahmad', xp:340}, {n:'Siti', xp:285}, {n:userName || 'Anda', xp:45}].map((u,i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs font-bold w-4" style={{ color: i === 0 ? '#c9a961' : '#8b6b3d' }}>{i+1}</span>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold" style={{ background: 'rgba(10,77,60,0.1)', color: '#0a4d3c' }}>
                {u.n.charAt(0)}
              </div>
              <span className="text-sm flex-1" style={{ color: '#1a1a1a' }}>{u.n}</span>
              <span className="text-xs font-semibold" style={{ color: '#c9a961' }}>{u.xp} XP</span>
            </div>
          ))}
        </div>
      </div>

      {/* Feed */}
      <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#8b6b3d' }}>Feed Pencapaian</p>
      <div className="space-y-3">
        {achievements.map((a) => (
          <div key={a.id} className="p-4 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.08)' }}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-base flex-shrink-0" style={{ background: 'rgba(201,169,97,0.15)' }}>
                {a.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-semibold" style={{ color: '#0a4d3c' }}>{a.user}</span>
                  <span style={{ color: '#666' }}> · {a.time}</span>
                </p>
                <p className="text-sm mt-1" style={{ color: '#1a1a1a' }}>{a.text}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3 pt-3" style={{ borderTop: '1px solid rgba(10,77,60,0.06)' }}>
              <button className="flex items-center gap-1.5 text-xs opacity-40 cursor-not-allowed" disabled>
                <Heart size={14} style={{ color: '#8b6b3d' }} />
                <span style={{ color: '#8b6b3d' }}>Suka</span>
              </button>
              <button className="flex items-center gap-1.5 text-xs opacity-40 cursor-not-allowed" disabled>
                <MessageCircle size={14} style={{ color: '#8b6b3d' }} />
                <span style={{ color: '#8b6b3d' }}>Komentar</span>
              </button>
              <span className="ml-auto text-[10px]" style={{ color: '#c9a961' }}>Segera hadir</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ PROFIL TAB ============
function ProfilTab({ userName, userProfile, xp, streak, progress, onOpenPremium }) {
  const totalLessons = Object.values(progress).reduce((a,b)=>a+b,0);
  const interestLabels = {
    religion: '🕌 Agama', travel: '✈️ Travel', food: '🍽️ Kuliner', movies: '🎬 Film',
    music: '🎵 Musik', sports: '⚽ Olahraga', business: '💼 Bisnis', history: '📜 Sejarah',
    tech: '💻 Teknologi', family: '👨‍👩‍👧 Keluarga'
  };
  return (
    <div className="px-5 py-6">
      <div className="flex flex-col items-center mb-6 mt-2">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mb-3" style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)', color: '#f3ebd9' }}>
          {(userName || 'A').charAt(0).toUpperCase()}
        </div>
        <h2 className="text-xl font-semibold" style={{ color: '#0a4d3c', fontFamily: 'Fraunces, serif' }}>{userName || 'Pengguna'}</h2>
        <p className="text-xs" style={{ color: '#8b6b3d' }}>Pelajar Bahasa Arab</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="rounded-2xl p-3 text-center" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.08)' }}>
          <Star size={18} className="mx-auto mb-1" style={{ color: '#c9a961' }} fill="#c9a961" />
          <p className="text-lg font-bold" style={{ color: '#0a4d3c' }}>{xp}</p>
          <p className="text-[10px]" style={{ color: '#8b6b3d' }}>XP</p>
        </div>
        <div className="rounded-2xl p-3 text-center" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.08)' }}>
          <Flame size={18} className="mx-auto mb-1" style={{ color: '#c9a961' }} />
          <p className="text-lg font-bold" style={{ color: '#0a4d3c' }}>{streak}</p>
          <p className="text-[10px]" style={{ color: '#8b6b3d' }}>HARI</p>
        </div>
        <div className="rounded-2xl p-3 text-center" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.08)' }}>
          <BookOpen size={18} className="mx-auto mb-1" style={{ color: '#0a4d3c' }} />
          <p className="text-lg font-bold" style={{ color: '#0a4d3c' }}>{totalLessons}</p>
          <p className="text-[10px]" style={{ color: '#8b6b3d' }}>SELESAI</p>
        </div>
      </div>

      {/* Display user's interests if available */}
      {userProfile?.interests?.length > 0 && (
        <div className="rounded-2xl p-4 mb-4" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.08)' }}>
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#8b6b3d' }}>Minatmu</p>
          <div className="flex flex-wrap gap-2">
            {userProfile.interests.map((id) => (
              <span key={id} className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: 'rgba(10,77,60,0.08)', color: '#0a4d3c' }}>
                {interestLabels[id] || id}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Premium Card */}
      <button onClick={onOpenPremium} className="w-full text-left rounded-2xl p-5 mb-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #c9a961, #d4b876)' }}>
        <div className="absolute -right-4 -top-4 text-7xl opacity-20" style={{ fontFamily: 'Amiri, serif', color: 'white' }}>★</div>
        <Sparkles size={20} color="white" className="mb-2" />
        <h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily: 'Fraunces, serif' }}>Tulis Noon Premium</h3>
        <p className="text-xs text-white opacity-90 mb-3">AI tutor pribadi, semua modul terbuka, dan banyak lagi.</p>
        <span className="inline-block px-4 py-2 rounded-lg text-xs font-semibold" style={{ background: 'white', color: '#7a3d2a' }}>Pelajari Lebih Lanjut</span>
      </button>

      {/* Settings */}
      <p className="text-xs tracking-widest uppercase mb-2 mt-6" style={{ color: '#8b6b3d' }}>Pengaturan</p>
      {['Pengingat Harian', 'Bantuan & FAQ', 'Beri Masukan', 'Tentang Aplikasi'].map((s,i) => (
        <button key={i} className="w-full flex items-center justify-between p-3.5 rounded-xl mb-2" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.06)' }}>
          <span className="text-sm" style={{ color: '#1a1a1a' }}>{s}</span>
          <ChevronRight size={16} style={{ color: '#8b6b3d' }} />
        </button>
      ))}
    </div>
  );
}

// ============ BOTTOM NAV ============
function BottomNav({ active, onChange, router }) {
  const tabs = [
    { id: 'home', l: 'Beranda', icon: Home },
    { id: 'belajar', l: 'Belajar', icon: BookOpen },
    { id: 'sosial', l: 'Sosial', icon: Users },
    { id: 'profil', l: 'Profil', icon: User },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto pb-safe" style={{ background: 'rgba(250,246,238,0.95)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(10,77,60,0.08)' }}>
      <div className="grid grid-cols-4 px-2 py-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.id;
          return (
            <button key={t.id} onClick={() => { if(t.id === 'profil') { router?.push('/profile'); } else { onChange(t.id); } }} className="flex flex-col items-center justify-center py-2 px-1">
              <Icon size={22} style={{ color: isActive ? '#0a4d3c' : '#8b6b3d' }} fill={isActive ? '#0a4d3c' : 'transparent'} strokeWidth={isActive ? 2 : 1.5} />
              <span className="text-[10px] mt-1 font-medium" style={{ color: isActive ? '#0a4d3c' : '#8b6b3d' }}>{t.l}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============ LESSONS LIST ============
function LessonsScreen({ path, onBack, onSelectLesson, progress }) {
  const lessons = [
    { id: 1, title: 'Salam & Sapaan', arabic: 'التحية', desc: 'Cara menyapa dan membalas salam', emoji: '🤝' },
    { id: 2, title: 'Perkenalan Diri', arabic: 'التعارف', desc: 'Memperkenalkan nama dan asal', emoji: '👋' },
    { id: 3, title: 'Tanya Arah', arabic: 'السؤال عن الطريق', desc: 'Mencari jalan dan tempat', emoji: '🗺️' },
    { id: 4, title: 'Di Restoran', arabic: 'في المطعم', desc: 'Memesan makanan dan minuman', emoji: '🍽️' },
    { id: 5, title: 'Tanya Harga', arabic: 'السؤال عن السعر', desc: 'Belanja dan menawar harga', emoji: '💰' },
    { id: 6, title: 'Darurat', arabic: 'الطوارئ', desc: 'Situasi darurat dan bantuan', emoji: '🆘' },
    { id: 7, title: 'Hotel & Penginapan', arabic: 'الفندق', desc: 'Check-in dan layanan hotel', emoji: '🏨' },
    { id: 8, title: 'Doa & Ibadah Umrah', arabic: 'العمرة', desc: 'Frasa penting saat ibadah', emoji: '🕋' },
  ];

  return (
    <div className="flex-1 flex flex-col px-5 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <ArrowLeft size={18} style={{ color: '#0a4d3c' }} />
        </button>
        <div>
          <p className="text-xs tracking-widest uppercase" style={{ color: '#8b6b3d' }}>Modul</p>
          <h2 className="text-xl font-semibold" style={{ color: '#0a4d3c', fontFamily: 'Fraunces, serif' }}>{path?.title}</h2>
        </div>
      </div>

      <div className="rounded-2xl p-5 mb-5 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)' }}>
        <div className="absolute -right-4 -top-4 text-7xl opacity-15" style={{ fontFamily: 'Amiri, serif', color: '#c9a961' }}>﷽</div>
        <p className="text-xs tracking-widest uppercase opacity-80 text-white mb-1">Kemajuanmu</p>
        <p className="text-2xl font-semibold text-white mb-3" style={{ fontFamily: 'Fraunces, serif' }}>{progress} / {lessons.length}</p>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.2)' }}>
          <div className="h-full" style={{ width: `${(progress/lessons.length)*100}%`, background: '#c9a961' }} />
        </div>
      </div>

      <div className="space-y-2">
        {lessons.map((l, idx) => {
          const isCompleted = idx < progress;
          // Semua lesson dibuka — user bebas pilih mana yang mau dipelajari dulu.
          // (Sebelumnya: progressive lock idx > progress + 1)
          const isLocked = false;
          return (
            <button key={l.id} onClick={() => !isLocked && onSelectLesson(l)} className="w-full text-left p-4 rounded-xl flex items-center gap-3 active:scale-[0.98] transition-transform disabled:opacity-50" disabled={isLocked} style={{ background: 'white', border: '1px solid rgba(10,77,60,0.08)' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: isCompleted ? '#0a4d3c' : '#f3ebd9' }}>
                {isCompleted ? <Check size={20} color="white" /> : (isLocked ? <Lock size={16} style={{color:'#8b6b3d'}}/> : l.emoji)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm" style={{ color: '#1a1a1a' }}>{l.title}</h3>
                <p className="text-xs truncate" style={{ color: '#666' }}>{l.desc}</p>
              </div>
              <span className="text-base" style={{ fontFamily: 'Amiri, serif', color: '#0a4d3c', opacity: 0.5 }}>{l.arabic}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============ LESSON SCREEN ============
function LessonScreen({ lesson, onBack, onComplete }) {
  const [step, setStep] = useState(0);
  const [earnedXp, setEarnedXp] = useState(0);

  const steps = [
    { type: 'intro', title: lesson?.title || 'Pelajaran', arabic: lesson?.arabic || 'الدرس', desc: 'Dalam pelajaran ini kamu akan belajar 3 frasa penting. Bukan untuk dihafal, tapi untuk dipahami dan dibiasakan.' },
    { type: 'phrase', arabic: 'السَّلَامُ عَلَيْكُمْ', latin: 'As-salāmu ʿalaykum', indo: 'Semoga keselamatan tercurah padamu', context: 'Salam universal umat Muslim, bisa diucapkan kapan saja.' },
    { type: 'phrase', arabic: 'وَعَلَيْكُمُ السَّلَامُ', latin: 'Wa-ʿalaykumu s-salām', indo: 'Dan semoga keselamatan juga padamu', context: 'Balasan salam — wajib dijawab saat seseorang memberi salam.' },
    { type: 'speak', arabic: 'السَّلَامُ عَلَيْكُمْ', target: 'السلام عليكم', indo: 'Coba ucapkan salam ini' },
    { type: 'quiz', question: 'Apa balasan yang tepat untuk "As-salāmu ʿalaykum"?', options: [{ text: 'Wa-ʿalaykumu s-salām', correct: true }, { text: 'Shukran jazīlan', correct: false }, { text: 'Maʿa s-salāmah', correct: false }] },
    { type: 'complete' },
  ];

  const current = steps[step];

  const handleNext = (xp = 10) => {
    setEarnedXp(e => e + xp);
    if (step === steps.length - 1) onComplete(earnedXp + xp);
    else setStep(step + 1);
  };

  return (
    <div className="flex-1 flex flex-col px-5 py-5">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <X size={18} style={{ color: '#0a4d3c' }} />
        </button>
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(10,77,60,0.1)' }}>
          <div className="h-full transition-all duration-500" style={{ width: `${((step+1)/steps.length)*100}%`, background: '#0a4d3c' }} />
        </div>
        <span className="text-xs font-semibold" style={{ color: '#0a4d3c' }}>{step+1}/{steps.length}</span>
      </div>

      <div className="flex-1 flex flex-col">
        {current.type === 'intro' && <IntroStep step={current} onNext={() => handleNext(0)} />}
        {current.type === 'phrase' && <PhraseStep step={current} onNext={() => handleNext(5)} />}
        {current.type === 'speak' && <SpeakStep step={current} onNext={() => handleNext(20)} />}
        {current.type === 'quiz' && <QuizStep step={current} onNext={() => handleNext(15)} />}
        {current.type === 'complete' && <CompleteStep xp={earnedXp} onNext={() => handleNext(0)} />}
      </div>
    </div>
  );
}

function IntroStep({ step, onNext }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center">
      <p className="text-7xl mb-6" style={{ fontFamily: 'Amiri, serif', color: '#0a4d3c' }}>{step.arabic}</p>
      <div className="h-px w-12 mb-6" style={{ background: '#c9a961' }} />
      <h2 className="text-3xl mb-4" style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: '#0a4d3c' }}>{step.title}</h2>
      <p className="text-base leading-relaxed max-w-xs" style={{ color: '#3d2817' }}>{step.desc}</p>
      <button onClick={onNext} className="mt-12 w-full max-w-xs py-4 rounded-2xl text-white font-medium flex items-center justify-center gap-2" style={{ background: '#0a4d3c' }}>Mulai <ArrowRight size={18} /></button>
    </div>
  );
}

function PhraseStep({ step, onNext }) {
  const speak = () => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(step.arabic);
      u.lang = 'ar-SA';
      u.rate = 0.8;
      window.speechSynthesis.speak(u);
    }
  };
  useEffect(() => { const t = setTimeout(speak, 400); return () => clearTimeout(t); }, []);

  return (
    <div className="flex-1 flex flex-col">
      <p className="text-xs tracking-widest uppercase mb-6" style={{ color: '#8b6b3d' }}>Dengarkan & pahami</p>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="rounded-3xl p-8 w-full text-center mb-6" style={{ background: 'white', boxShadow: '0 10px 40px -10px rgba(10,77,60,0.2)' }}>
          <p className="text-5xl leading-relaxed mb-4" style={{ fontFamily: 'Amiri, serif', color: '#0a4d3c' }}>{step.arabic}</p>
          <p className="text-base italic mb-2" style={{ color: '#8b6b3d' }}>{step.latin}</p>
          <div className="h-px w-12 mx-auto my-3" style={{ background: '#c9a961' }} />
          <p className="text-base" style={{ color: '#3d2817' }}>{step.indo}</p>
        </div>
        <button onClick={speak} className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: '#0a4d3c', boxShadow: '0 10px 30px -10px rgba(10,77,60,0.5)' }}>
          <Volume2 size={24} color="white" />
        </button>
        <p className="text-sm text-center max-w-xs" style={{ color: '#666' }}>{step.context}</p>
      </div>
      <button onClick={onNext} className="w-full py-4 rounded-2xl text-white font-medium flex items-center justify-center gap-2" style={{ background: '#0a4d3c' }}>Lanjut <ArrowRight size={18} /></button>
    </div>
  );
}

function SpeakStep({ step, onNext }) {
  const [listening, setListening] = useState(false);
  const [result, setResult] = useState(null);
  const [transcript, setTranscript] = useState('');

  const speak = () => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(step.arabic);
      u.lang = 'ar-SA'; u.rate = 0.7;
      window.speechSynthesis.speak(u);
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setResult('Browser ini belum mendukung pengenalan suara. Coba pakai Chrome di Android atau Safari di iOS.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'ar-SA'; recognition.continuous = false; recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => { setListening(false); setResult('Tidak dapat mendengar. Coba lagi.'); };
    recognition.onresult = (e) => {
      const said = e.results[0][0].transcript.trim();
      setTranscript(said);
      const normalize = s => s.replace(/[\u064B-\u0652]/g, '').replace(/\s+/g, ' ').trim();
      const target = normalize(step.target);
      const spoken = normalize(said);
      if (spoken.includes(target.slice(0,4)) || target.includes(spoken.slice(0,4))) setResult('correct');
      else setResult('wrong');
    };
    recognition.start();
  };

  return (
    <div className="flex-1 flex flex-col">
      <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#8b6b3d' }}>Latihan ngomong</p>
      <p className="text-base mb-6" style={{ color: '#3d2817' }}>{step.indo}</p>
      <div className="rounded-3xl p-8 mb-6 text-center" style={{ background: 'white', boxShadow: '0 10px 40px -10px rgba(10,77,60,0.2)' }}>
        <p className="text-5xl mb-4" style={{ fontFamily: 'Amiri, serif', color: '#0a4d3c' }}>{step.arabic}</p>
        <button onClick={speak} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm" style={{ background: 'rgba(10,77,60,0.08)', color: '#0a4d3c' }}><Volume2 size={14} /> Dengar contoh</button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        <button onClick={startListening} disabled={listening} className="relative w-24 h-24 rounded-full flex items-center justify-center" style={{ background: listening ? '#c9a961' : '#0a4d3c', boxShadow: '0 15px 40px -10px rgba(10,77,60,0.5)' }}>
          {listening && <div className="absolute inset-0 rounded-full animate-ping" style={{ background: '#c9a961', opacity: 0.4 }} />}
          <Mic size={30} color="white" />
        </button>
        <p className="text-sm mt-4" style={{ color: '#666' }}>{listening ? 'Mendengarkan...' : 'Tekan & ucapkan'}</p>
        {transcript && (<div className="mt-4 px-4 py-2 rounded-xl text-sm" style={{ background: 'rgba(10,77,60,0.05)', fontFamily: 'Amiri, serif', color: '#0a4d3c' }}>"{transcript}"</div>)}
        {result === 'correct' && (<div className="mt-4 px-5 py-3 rounded-2xl flex items-center gap-2" style={{ background: '#0a4d3c', color: 'white' }}><Check size={18} /> Mantap! Pengucapan tepat.</div>)}
        {result === 'wrong' && (<div className="mt-4 px-5 py-3 rounded-2xl text-center text-sm" style={{ background: 'rgba(201,169,97,0.2)', color: '#7a3d2a' }}>Hampir benar! Coba lagi pelan-pelan.</div>)}
        {typeof result === 'string' && result !== 'correct' && result !== 'wrong' && (<div className="mt-4 px-5 py-3 rounded-2xl text-center text-sm" style={{ background: 'rgba(201,169,97,0.2)', color: '#7a3d2a' }}>{result}</div>)}
      </div>
      <button onClick={onNext} className="w-full py-4 rounded-2xl text-white font-medium flex items-center justify-center gap-2 mt-4" style={{ background: result === 'correct' ? '#0a4d3c' : '#8b6b3d' }}>{result === 'correct' ? 'Lanjut' : 'Lewati'} <ArrowRight size={18} /></button>
    </div>
  );
}

function QuizStep({ step, onNext }) {
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  return (
    <div className="flex-1 flex flex-col">
      <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#8b6b3d' }}>Pahami konteks</p>
      <h3 className="text-xl mb-8 leading-snug" style={{ fontFamily: 'Fraunces, serif', color: '#0a4d3c', fontWeight: 600 }}>{step.question}</h3>
      <div className="space-y-3 flex-1">
        {step.options.map((opt, idx) => {
          let bg = 'white', border = 'rgba(10,77,60,0.15)', color = '#1a1a1a';
          if (answered) {
            if (opt.correct) { bg = 'rgba(10,77,60,0.08)'; border = '#0a4d3c'; }
            else if (idx === selected) { bg = 'rgba(201,169,97,0.15)'; border = '#c9a961'; }
          } else if (selected === idx) { bg = 'rgba(10,77,60,0.05)'; border = '#0a4d3c'; }
          return (
            <button key={idx} onClick={() => { if (!answered) { setSelected(idx); setAnswered(true); }}} className="w-full p-4 rounded-2xl text-left flex items-center justify-between" style={{ background: bg, border: `2px solid ${border}`, color }}>
              <span style={{ fontFamily: 'Amiri, serif', fontSize: '18px' }}>{opt.text}</span>
              {answered && opt.correct && <Check size={20} style={{ color: '#0a4d3c' }} />}
              {answered && idx === selected && !opt.correct && <X size={20} style={{ color: '#c9a961' }} />}
            </button>
          );
        })}
      </div>
      {answered && (<button onClick={onNext} className="w-full py-4 rounded-2xl text-white font-medium flex items-center justify-center gap-2 mt-4" style={{ background: '#0a4d3c' }}>Lanjut <ArrowRight size={18} /></button>)}
    </div>
  );
}

function CompleteStep({ xp, onNext }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 blur-3xl opacity-40" style={{ background: '#c9a961', borderRadius: '50%' }} />
        <div className="relative w-28 h-28 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #c9a961, #d4b876)' }}><Trophy size={48} color="white" /></div>
      </div>
      <h2 className="text-4xl mb-3" style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: '#0a4d3c' }}>Mabrūk!</h2>
      <p className="text-base mb-2" style={{ color: '#3d2817' }}>Pelajaran selesai</p>
      <div className="flex items-center gap-2 mt-4 px-6 py-3 rounded-full" style={{ background: 'rgba(201,169,97,0.2)' }}>
        <Star size={18} style={{ color: '#c9a961' }} fill="#c9a961" />
        <span className="font-semibold" style={{ color: '#8b6b3d' }}>+{xp} XP didapat</span>
      </div>
      <button onClick={onNext} className="mt-12 w-full max-w-xs py-4 rounded-2xl text-white font-medium" style={{ background: '#0a4d3c' }}>Kembali</button>
    </div>
  );
}

// ============ GAME SCREEN (Image Quiz, Video Quiz, AI Roleplay, Story) ============
function GameScreen({ game, onBack, onComplete }) {
  if (game.id === 'image-quiz') return <ImageQuizGame onBack={onBack} onComplete={onComplete} />;
  if (game.id === 'video-quiz') return <VideoQuizGame onBack={onBack} onComplete={onComplete} />;
  if (game.id === 'chat-roleplay') return <RoleplayGame onBack={onBack} onComplete={onComplete} />;
  if (game.id === 'story') return <StoryGame onBack={onBack} onComplete={onComplete} />;
  return null;
}

// Image Quiz: tebak kata Arab dari gambar (emoji)
function ImageQuizGame({ onBack, onComplete }) {
  const questions = [
    { emoji: '☕', arabic: 'قَهْوَة', latin: 'qahwa', options: ['قَهْوَة', 'شَاي', 'مَاء', 'حَلِيب'], optionsLatin: ['kopi', 'teh', 'air', 'susu'] },
    { emoji: '🕌', arabic: 'مَسْجِد', latin: 'masjid', options: ['فُنْدُق', 'مَسْجِد', 'مَطْعَم', 'سُوق'], optionsLatin: ['hotel', 'masjid', 'restoran', 'pasar'] },
    { emoji: '💵', arabic: 'فُلُوس', latin: 'fulūs', options: ['كِتَاب', 'قَلَم', 'فُلُوس', 'مِفْتَاح'], optionsLatin: ['buku', 'pena', 'uang', 'kunci'] },
    { emoji: '🚕', arabic: 'تَاكْسِي', latin: 'taksi', options: ['تَاكْسِي', 'حَافِلَة', 'سَيَّارَة', 'دَرَّاجَة'], optionsLatin: ['taksi', 'bus', 'mobil', 'sepeda'] },
    { emoji: '⏰', arabic: 'سَاعَة', latin: "sā'a", options: ['دَقِيقَة', 'سَاعَة', 'يَوْم', 'شَهْر'], optionsLatin: ['menit', 'jam', 'hari', 'bulan'] },
  ];
  const [q, setQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const current = questions[q];
  const correctIdx = current.options.findIndex(o => o === current.arabic);

  const handleSelect = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === correctIdx) setScore(s => s+1);
    setTimeout(() => {
      if (q === questions.length - 1) setDone(true);
      else { setQ(q+1); setSelected(null); }
    }, 1200);
  };

  if (done) {
    const xp = score * 10;
    return (
      <div className="flex-1 flex flex-col px-5 py-6 items-center justify-center text-center">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, #c9a961, #d4b876)' }}>
          <Trophy size={40} color="white" />
        </div>
        <h2 className="text-3xl mb-2" style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: '#0a4d3c' }}>Selesai!</h2>
        <p className="text-base mb-4" style={{ color: '#3d2817' }}>Skor: {score}/{questions.length}</p>
        <div className="flex items-center gap-2 px-6 py-3 rounded-full mb-8" style={{ background: 'rgba(201,169,97,0.2)' }}>
          <Star size={18} style={{ color: '#c9a961' }} fill="#c9a961" />
          <span className="font-semibold" style={{ color: '#8b6b3d' }}>+{xp} XP</span>
        </div>
        <button onClick={() => onComplete(xp)} className="w-full max-w-xs py-4 rounded-2xl text-white font-medium" style={{ background: '#0a4d3c' }}>Kembali</button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col px-5 py-5">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}><X size={18} style={{ color: '#0a4d3c' }} /></button>
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(10,77,60,0.1)' }}>
          <div className="h-full transition-all duration-500" style={{ width: `${((q+1)/questions.length)*100}%`, background: '#0a4d3c' }} />
        </div>
        <span className="text-xs font-semibold" style={{ color: '#0a4d3c' }}>{q+1}/{questions.length}</span>
      </div>

      <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#8b6b3d' }}>Tebak Kata Arab</p>
      <h3 className="text-lg mb-6" style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: '#0a4d3c' }}>Apa nama benda ini dalam bahasa Arab?</h3>

      <div className="rounded-3xl p-12 mb-6 flex items-center justify-center" style={{ background: 'white', boxShadow: '0 10px 40px -10px rgba(10,77,60,0.2)' }}>
        <span className="text-9xl">{current.emoji}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {current.options.map((opt, idx) => {
          let bg = 'white', border = 'rgba(10,77,60,0.15)';
          if (selected !== null) {
            if (idx === correctIdx) { bg = 'rgba(10,77,60,0.08)'; border = '#0a4d3c'; }
            else if (idx === selected) { bg = 'rgba(201,169,97,0.15)'; border = '#c9a961'; }
          }
          return (
            <button key={idx} onClick={() => handleSelect(idx)} className="p-4 rounded-2xl text-center" style={{ background: bg, border: `2px solid ${border}` }}>
              <p className="text-2xl mb-1" style={{ fontFamily: 'Amiri, serif', color: '#0a4d3c' }}>{opt}</p>
              <p className="text-xs" style={{ color: '#8b6b3d' }}>{current.optionsLatin[idx]}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Video Quiz: skenario video + pertanyaan (kita pakai illustrasi karena video aktual butuh hosting)
function VideoQuizGame({ onBack, onComplete }) {
  const [scene, setScene] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const scenes = [
    {
      illustration: '🛬',
      title: 'Tiba di Bandara Jeddah',
      narration: 'Kamu baru tiba di Bandara King Abdulaziz. Petugas imigrasi menyapamu dengan ramah.',
      audio: 'مَرْحَبًا بِكَ فِي الْمَمْلَكَة',
      audioLatin: 'Marhaban bika fil-mamlakah',
      audioMeaning: '(Selamat datang di Kerajaan)',
      question: 'Apa balasan yang paling tepat?',
      options: [
        { text: 'شُكْرًا (Shukran)', meaning: 'Terima kasih', correct: true },
        { text: 'مَا اسْمُكَ (Mā ismuka)', meaning: 'Siapa namamu', correct: false },
        { text: 'كَمِ السَّاعَة (Kamis-saa)', meaning: 'Jam berapa', correct: false },
      ]
    },
    {
      illustration: '🚕',
      title: 'Naik Taksi ke Hotel',
      narration: 'Kamu naik taksi dari bandara. Sopir bertanya tujuanmu.',
      audio: 'إِلَى أَيْنَ؟',
      audioLatin: 'Ilā ayna?',
      audioMeaning: '(Ke mana?)',
      question: 'Bagaimana cara mengatakan "Ke hotel"?',
      options: [
        { text: 'إِلَى الْمَطَار', meaning: 'Ke bandara', correct: false },
        { text: 'إِلَى الْفُنْدُق', meaning: 'Ke hotel', correct: true },
        { text: 'إِلَى الْمَطْعَم', meaning: 'Ke restoran', correct: false },
      ]
    },
    {
      illustration: '🏨',
      title: 'Check-in Hotel',
      narration: 'Kamu tiba di lobi hotel. Resepsionis menyambut.',
      audio: 'هَلْ عِنْدَكَ حَجْز؟',
      audioLatin: 'Hal ʿindaka hajz?',
      audioMeaning: '(Apakah kamu punya reservasi?)',
      question: 'Cara menjawab "Ya, atas nama saya"?',
      options: [
        { text: 'نَعَم، بِاسْمِي', meaning: 'Ya, atas namaku', correct: true },
        { text: 'لَا، شُكْرًا', meaning: 'Tidak, terima kasih', correct: false },
        { text: 'أَيْنَ الْحَمَّام؟', meaning: 'Di mana toilet?', correct: false },
      ]
    },
  ];

  const current = scenes[scene];
  const playAudio = () => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(current.audio);
      u.lang = 'ar-SA'; u.rate = 0.8;
      window.speechSynthesis.speak(u);
    }
  };

  useEffect(() => { const t = setTimeout(playAudio, 600); return () => clearTimeout(t); }, [scene]);

  const handleSelect = (idx) => {
    if (showAnswer) return;
    setSelected(idx);
    setShowAnswer(true);
    if (current.options[idx].correct) setScore(s=>s+1);
  };

  const nextScene = () => {
    if (scene === scenes.length-1) onComplete(score * 15);
    else { setScene(scene+1); setSelected(null); setShowAnswer(false); }
  };

  return (
    <div className="flex-1 flex flex-col px-5 py-5">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}><X size={18} style={{ color: '#0a4d3c' }} /></button>
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(10,77,60,0.1)' }}>
          <div className="h-full transition-all duration-500" style={{ width: `${((scene+1)/scenes.length)*100}%`, background: '#0a4d3c' }} />
        </div>
        <span className="text-xs font-semibold" style={{ color: '#0a4d3c' }}>{scene+1}/{scenes.length}</span>
      </div>

      <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#8b6b3d' }}>Skenario {scene+1}</p>
      <h3 className="text-xl mb-4" style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: '#0a4d3c' }}>{current.title}</h3>

      {/* Scene "video" mockup */}
      <div className="rounded-3xl p-6 mb-4 relative" style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)' }}>
        <div className="text-center mb-3">
          <span className="text-7xl">{current.illustration}</span>
        </div>
        <p className="text-sm text-white opacity-90 leading-relaxed">{current.narration}</p>
      </div>

      {/* Audio dialog */}
      <div className="rounded-2xl p-4 mb-5" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.08)' }}>
        <div className="flex items-start gap-3">
          <button onClick={playAudio} className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#0a4d3c' }}>
            <Volume2 size={16} color="white" />
          </button>
          <div className="flex-1">
            <p className="text-2xl mb-1" style={{ fontFamily: 'Amiri, serif', color: '#0a4d3c' }}>{current.audio}</p>
            <p className="text-xs italic" style={{ color: '#8b6b3d' }}>{current.audioLatin}</p>
            <p className="text-xs mt-1" style={{ color: '#666' }}>{current.audioMeaning}</p>
          </div>
        </div>
      </div>

      <p className="text-sm font-semibold mb-3" style={{ color: '#0a4d3c' }}>{current.question}</p>
      <div className="space-y-2">
        {current.options.map((opt, idx) => {
          let bg = 'white', border = 'rgba(10,77,60,0.15)';
          if (showAnswer) {
            if (opt.correct) { bg = 'rgba(10,77,60,0.08)'; border = '#0a4d3c'; }
            else if (idx === selected) { bg = 'rgba(201,169,97,0.15)'; border = '#c9a961'; }
          }
          return (
            <button key={idx} onClick={() => handleSelect(idx)} className="w-full p-3 rounded-xl text-left" style={{ background: bg, border: `2px solid ${border}` }}>
              <p style={{ fontFamily: 'Amiri, serif', color: '#0a4d3c' }}>{opt.text}</p>
              {showAnswer && <p className="text-xs mt-1" style={{ color: '#666' }}>{opt.meaning}</p>}
            </button>
          );
        })}
      </div>

      {showAnswer && (
        <button onClick={nextScene} className="w-full py-4 rounded-2xl text-white font-medium flex items-center justify-center gap-2 mt-4" style={{ background: '#0a4d3c' }}>
          {scene === scenes.length-1 ? 'Selesai' : 'Skenario Berikutnya'} <ArrowRight size={18} />
        </button>
      )}
    </div>
  );
}

// AI Roleplay (mock — di versi nyata pakai Claude API)
function RoleplayGame({ onBack, onComplete }) {
  const [messages, setMessages] = useState([
    { from: 'ai', text: 'أَهْلًا وَسَهْلًا! مَرْحَبًا بِكَ فِي مَتْجَرِي', latin: 'Ahlan wa sahlan! Marhaban bika fī matjarī', indo: 'Selamat datang di toko saya!' },
  ]);
  const [input, setInput] = useState('');
  const [round, setRound] = useState(0);

  const aiResponses = [
    { trigger: 'كم', text: 'هَذَا التَّمْر بِعَشْرَة رِيَال', latin: 'Hādha t-tamr biʿasharati riyāl', indo: 'Kurma ini sepuluh riyal.' },
    { trigger: 'غالي', text: 'حَسَنًا، خَمْسَة رِيَال فَقَط لَكَ', latin: 'Hasanan, khamsata riyāl faqat laka', indo: 'Baiklah, untukmu hanya lima riyal.' },
    { trigger: 'شكرا', text: 'الْعَفْو! مَعَ السَّلَامَة', latin: 'Al-ʿafw! Maʿa s-salāmah', indo: 'Sama-sama! Selamat jalan.' },
  ];

  const suggestions = ['كَم السِّعْر؟ (Berapa harganya?)', 'غَالِي (Mahal)', 'شُكْرًا (Terima kasih)'];

  const send = (msg) => {
    setMessages(m => [...m, { from: 'user', text: msg }]);
    setInput('');
    setTimeout(() => {
      const next = aiResponses[round] || aiResponses[0];
      setMessages(m => [...m, { from: 'ai', text: next.text, latin: next.latin, indo: next.indo }]);
      setRound(r => r+1);
    }, 600);
  };

  return (
    <div className="flex-1 flex flex-col px-5 py-5">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}><X size={18} style={{ color: '#0a4d3c' }} /></button>
        <div className="flex-1">
          <p className="text-xs tracking-widest uppercase" style={{ color: '#8b6b3d' }}>AI Roleplay</p>
          <h3 className="text-base font-semibold" style={{ color: '#0a4d3c', fontFamily: 'Fraunces, serif' }}>Pedagang Kurma di Madinah</h3>
        </div>
      </div>

      <div className="mb-3 p-3 rounded-xl text-xs flex items-start gap-2" style={{ background: 'rgba(201,169,97,0.1)' }}>
        <Bot size={14} style={{ color: '#c9a961' }} className="mt-0.5 flex-shrink-0" />
        <p style={{ color: '#7a3d2a' }}>Latih percakapan tawar-menawar. Pakai saran di bawah atau ketik sendiri.</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl ${m.from === 'user' ? '' : ''}`} style={{ background: m.from === 'user' ? '#0a4d3c' : 'white', color: m.from === 'user' ? 'white' : '#1a1a1a', border: m.from === 'ai' ? '1px solid rgba(10,77,60,0.08)' : 'none' }}>
              <p className="text-lg" style={{ fontFamily: 'Amiri, serif' }}>{m.text}</p>
              {m.latin && <p className="text-xs italic mt-1 opacity-70">{m.latin}</p>}
              {m.indo && <p className="text-xs mt-1 opacity-70">{m.indo}</p>}
            </div>
          </div>
        ))}
      </div>

      {round < 3 && (
        <div className="space-y-2 mb-3">
          <p className="text-xs" style={{ color: '#8b6b3d' }}>Coba ucapkan:</p>
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => send(s)} className="w-full p-2.5 rounded-xl text-left text-sm" style={{ background: 'rgba(10,77,60,0.05)', color: '#0a4d3c', border: '1px solid rgba(10,77,60,0.1)' }}>{s}</button>
          ))}
        </div>
      )}

      {round >= 3 && (
        <button onClick={() => onComplete(40)} className="w-full py-4 rounded-2xl text-white font-medium" style={{ background: '#0a4d3c' }}>Selesai +40 XP</button>
      )}
    </div>
  );
}

// Story interactive
function StoryGame({ onBack, onComplete }) {
  const [scene, setScene] = useState(0);

  const story = [
    {
      emoji: '🛬',
      narration: 'Pesawatmu mendarat di Jeddah. Kamu turun, hati berdebar — pertama kali ke Tanah Suci.',
      choices: [
        { text: 'Ke counter imigrasi', next: 1 },
        { text: 'Cari toilet dulu', next: 1 },
      ]
    },
    {
      emoji: '👮',
      narration: 'Petugas imigrasi menyapa: "Marhaban!" Kamu...',
      choices: [
        { text: '"Marhaban bik!" (Halo balik)', next: 2, good: true },
        { text: 'Diam saja', next: 2, good: false },
      ]
    },
    {
      emoji: '🧳',
      narration: 'Kamu mengambil koper. Seseorang bertanya: "Hal taḥtāj musāʿada?" (Butuh bantuan?)',
      choices: [
        { text: '"Lā, shukran" (Tidak, terima kasih)', next: 3, good: true },
        { text: 'Bingung, tidak menjawab', next: 3, good: false },
      ]
    },
    {
      emoji: '🚕',
      narration: 'Kamu naik taksi. Sopir tanya: "Ilā ayna?" (Ke mana?). Kamu jawab...',
      choices: [
        { text: '"Ilā al-funduq" (Ke hotel)', next: 4, good: true },
        { text: 'Tunjukkan alamat di HP saja', next: 4, good: false },
      ]
    },
    { emoji: '🌙', narration: 'Tiba di hotel, kamu istirahat dengan tenang. Hari pertama selesai dengan baik!', end: true }
  ];

  const current = story[scene];

  if (current.end) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-5 text-center">
        <span className="text-7xl mb-4">{current.emoji}</span>
        <h2 className="text-2xl mb-3" style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: '#0a4d3c' }}>Akhir Cerita</h2>
        <p className="text-base mb-8 max-w-xs" style={{ color: '#3d2817' }}>{current.narration}</p>
        <button onClick={() => onComplete(35)} className="w-full max-w-xs py-4 rounded-2xl text-white font-medium" style={{ background: '#0a4d3c' }}>Selesai +35 XP</button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col px-5 py-5">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}><X size={18} style={{ color: '#0a4d3c' }} /></button>
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(10,77,60,0.1)' }}>
          <div className="h-full transition-all duration-500" style={{ width: `${((scene+1)/story.length)*100}%`, background: '#0a4d3c' }} />
        </div>
      </div>

      <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#8b6b3d' }}>Skenario Cerita</p>
      <h3 className="text-lg mb-4" style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: '#0a4d3c' }}>Hari Pertama di Tanah Suci</h3>

      <div className="rounded-3xl p-8 mb-6 text-center" style={{ background: 'white', boxShadow: '0 10px 40px -10px rgba(10,77,60,0.2)' }}>
        <span className="text-7xl block mb-4">{current.emoji}</span>
        <p className="text-base leading-relaxed" style={{ color: '#3d2817' }}>{current.narration}</p>
      </div>

      <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#8b6b3d' }}>Pilihanmu:</p>
      <div className="space-y-2">
        {current.choices.map((c, i) => (
          <button key={i} onClick={() => setScene(c.next)} className="w-full p-4 rounded-2xl text-left active:scale-[0.98] transition-transform" style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.15)', color: '#1a1a1a' }}>
            {c.text}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============ DAILY CHALLENGE ============
// ============================================================================
// CHALLENGE LEVELS SCREEN — 5 halaman × 20 level dengan color coding hasil
// - GOLD (gradient gold) → user udah perfect score di level ini
// - RED  (warm red) → user udah main tapi belum perfect
// - DEFAULT (white) → belum dimainkan
// - LOCKED (grey + 🔒) → Coming Soon, konten belum di-seed
// ============================================================================
function ChallengeLevelsScreen({ scenario, challengeProgress = {}, onBack, onHome, onSelectLevel }) {
  const levels = scenario.levels || [];
  const seededCount = levels.filter((l) => !l.comingSoon && l.questions?.length > 0).length;
  const goldCount = Object.values(challengeProgress).filter((p) => p.perfectAchieved).length;

  // Pagination: 20 level per halaman = 5 halaman buat 100 level
  const PAGE_SIZE = 20;
  const totalPages = Math.ceil(levels.length / PAGE_SIZE);
  const [page, setPage] = useState(0);

  const pageStart = page * PAGE_SIZE;
  const pageLevels = levels.slice(pageStart, pageStart + PAGE_SIZE);

  return (
    <div className="flex-1 flex flex-col px-5 py-6">
      <div className="flex items-center gap-2 mb-4">
        {/* Back button (kembali ke screen sebelumnya, biasanya main) */}
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }} aria-label="Kembali">
          <ArrowLeft size={18} style={{ color: '#0a4d3c' }} />
        </button>
        {/* Home button eksplisit — buat user yang mau langsung ke beranda */}
        <button onClick={onHome || onBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }} aria-label="Beranda">
          <Home size={17} style={{ color: '#0a4d3c' }} />
        </button>
        <div className="flex-1">
          <p className="text-xs tracking-widest uppercase" style={{ color: '#8b6b3d' }}>Pilih Level</p>
          <h2 className="text-xl font-semibold" style={{ color: scenario.color, fontFamily: 'Fraunces, serif' }}>
            {scenario.emoji} {scenario.name}
          </h2>
        </div>
      </div>

      {/* Header card dengan progress + GOLD count */}
      <div className="rounded-2xl p-4 mb-4 relative overflow-hidden" style={{ background: scenario.bgGradient }}>
        <div className="absolute -right-4 -top-4 text-6xl opacity-15">{scenario.emoji}</div>
        <p className="text-xs tracking-widest uppercase opacity-80 text-white mb-1">{scenario.arName}</p>
        <p className="text-sm text-white opacity-90 mb-3">{scenario.location}</p>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: 'rgba(201,169,97,0.3)' }}>
              <Trophy size={11} color="#c9a961" />
              <span className="text-xs font-bold text-white">{goldCount} Gold</span>
            </div>
            <span className="text-xs text-white opacity-80">{seededCount}/100 tersedia</span>
          </div>
        </div>
      </div>

      {/* Pagination tabs */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
        {Array.from({ length: totalPages }).map((_, i) => {
          const isActive = i === page;
          const rangeStart = i * PAGE_SIZE + 1;
          const rangeEnd = Math.min((i + 1) * PAGE_SIZE, levels.length);
          return (
            <button
              key={i}
              onClick={() => setPage(i)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all"
              style={{
                background: isActive ? scenario.color : 'rgba(10,77,60,0.06)',
                color: isActive ? 'white' : '#8b6b3d',
              }}
            >
              {rangeStart}-{rangeEnd}
            </button>
          );
        })}
      </div>

      {/* Grid 4×5 = 20 level per halaman */}
      <div className="grid grid-cols-4 gap-2.5 mb-4">
        {pageLevels.map((lvl) => {
          const isSeeded = !lvl.comingSoon && lvl.questions?.length > 0;
          const progress = challengeProgress[lvl.level];
          const totalQ = lvl.questions?.length || 5;
          const isGold = progress?.perfectAchieved;
          const isRed = progress && !progress.perfectAchieved && progress.attempts > 0;

          // Visual style per tier
          let cardStyle, numberColor, badgeIcon;
          if (!isSeeded) {
            cardStyle = { background: 'rgba(139,107,61,0.06)', border: '1px dashed rgba(139,107,61,0.25)', opacity: 0.6 };
            numberColor = '#8b6b3d';
            badgeIcon = <Lock size={12} style={{ color: '#8b6b3d' }} />;
          } else if (isGold) {
            cardStyle = { background: 'linear-gradient(135deg, #fef6e1, #fff)', border: '2px solid #c9a961', boxShadow: '0 6px 16px -8px rgba(201,169,97,0.5)' };
            numberColor = '#c9a961';
            badgeIcon = <Star size={11} style={{ color: '#c9a961' }} fill="#c9a961" />;
          } else if (isRed) {
            cardStyle = { background: 'linear-gradient(135deg, #fdeae1, #fff)', border: '2px solid #a05536' };
            numberColor = '#a05536';
            badgeIcon = <X size={11} style={{ color: '#a05536' }} />;
          } else {
            cardStyle = { background: 'white', border: `1.5px solid ${scenario.color}40` };
            numberColor = scenario.color;
            badgeIcon = <Zap size={11} style={{ color: scenario.color }} />;
          }

          return (
            <button
              key={lvl.level}
              onClick={() => isSeeded && onSelectLevel(lvl.level)}
              disabled={!isSeeded}
              className="aspect-square rounded-xl flex flex-col items-center justify-center relative active:scale-[0.95] transition-transform p-1"
              style={cardStyle}
            >
              <span className="text-sm font-bold leading-none mb-1" style={{ color: numberColor, fontFamily: 'Fraunces, serif' }}>{lvl.level}</span>
              {badgeIcon}
              {isSeeded && progress && (
                <span className="text-[8px] font-semibold mt-0.5" style={{ color: numberColor }}>
                  {progress.bestScore}/{totalQ}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend — penjelasan warna */}
      <div className="rounded-xl p-3 text-xs space-y-1.5" style={{ background: 'rgba(10,77,60,0.04)' }}>
        <p className="font-semibold mb-1.5" style={{ color: '#0a4d3c' }}>Keterangan warna:</p>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ background: 'linear-gradient(135deg, #fef6e1, #fff)', border: '2px solid #c9a961' }} />
          <span style={{ color: '#3d2817' }}><strong style={{ color: '#c9a961' }}>GOLD</strong> — Skor sempurna ⭐</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ background: 'linear-gradient(135deg, #fdeae1, #fff)', border: '2px solid #a05536' }} />
          <span style={{ color: '#3d2817' }}><strong style={{ color: '#a05536' }}>RED</strong> — Belum sempurna, ulangi untuk GOLD</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ background: 'white', border: `1.5px solid ${scenario.color}` }} />
          <span style={{ color: '#3d2817' }}>Belum dimainkan</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ background: 'rgba(139,107,61,0.1)', border: '1px dashed rgba(139,107,61,0.3)' }} />
          <span style={{ color: '#3d2817' }}>Coming Soon 🔒</span>
        </div>
      </div>
    </div>
  );
}

function ChallengeScreen({ onBack, onShare, onComplete, onNextLevel, scenario, levelNumber, existingProgress }) {
  // Fallback ke Pasar Madinah Level 1 kalau scenario/level ga di-pass (defensive)
  const activeScenario = scenario || CHALLENGE_SCENARIOS[0];
  const activeLevel = activeScenario.levels?.find((l) => l.level === levelNumber)
    || activeScenario.levels?.[0]
    || { level: 1, title: activeScenario.name, questions: [] };
  const questions = activeLevel.questions || [];

  // Cek apakah ada level berikutnya yang playable (bukan comingSoon)
  const nextLevel = activeScenario.levels?.find((l) => l.level === activeLevel.level + 1);
  const hasNextLevel = !!nextLevel && !nextLevel.comingSoon;

  const [stage, setStage] = useState('intro'); // intro, playing, complete
  const [q, setQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [xpAwarded, setXpAwarded] = useState(false);
  // Modal share multi-platform (WA, FB, IG, Twitter, Telegram, copy link)
  const [showShareModal, setShowShareModal] = useState(false);

  // Reset internal state kalau levelNumber berubah (user pencet "Lanjut ke Level X+1")
  // Kalau ga ini, screen akan stuck di state lama meskipun props udah ganti.
  useEffect(() => {
    setStage('intro');
    setQ(0);
    setScore(0);
    setSelected(null);
    setTimeLeft(10);
    setXpAwarded(false);
    setShowShareModal(false);
  }, [levelNumber]);

  // Award XP + save progress otomatis sekali aja saat masuk stage 'complete'.
  // XP scaling: max = getXpForLevel(level), earned proporsional ke score.
  useEffect(() => {
    if (stage === 'complete' && !xpAwarded && questions.length > 0) {
      const maxXp = getXpForLevel(activeLevel.level);
      const earnedXp = Math.round((score / questions.length) * maxXp);
      if (onComplete) {
        onComplete({ earned: earnedXp, score, totalQuestions: questions.length });
      }
      setXpAwarded(true);
    }
  }, [stage, score, xpAwarded, onComplete, questions.length, activeLevel.level]);

  // Timer hanya jalan untuk soal MC (Match soal punya timer beda atau tanpa timer)
  useEffect(() => {
    if (stage !== 'playing') return;
    const currentQ = questions[q];
    if (currentQ?.type === 'match') return; // Match soal ga pakai countdown
    if (timeLeft === 0) { handleMcAnswer(-1); return; }
    const t = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, stage, q, questions]);

  const handleMcAnswer = (idx) => {
    setSelected(idx);
    if (idx === questions[q].correct) setScore(s => s + 1);
    setTimeout(() => {
      if (q === questions.length - 1) setStage('complete');
      else { setQ(q + 1); setSelected(null); setTimeLeft(10); }
    }, 1000);
  };

  // Match soal: user dapet 1 poin HANYA kalau semua pasangan benar
  // pada percobaan pertama (firstTryPerfect = true).
  // Kalau pernah salah pasangkan sekali pun, soal dianggap belum dikuasai → 0 poin.
  const handleMatchComplete = (firstTryPerfect) => {
    if (firstTryPerfect) setScore(s => s + 1);
    setTimeout(() => {
      if (q === questions.length - 1) setStage('complete');
      else { setQ(q + 1); setSelected(null); setTimeLeft(10); }
    }, 800);
  };

  if (stage === 'intro') {
    const maxXp = getXpForLevel(activeLevel.level);
    const hasMc = questions.some((qq) => qq.type === 'mc');
    const hasMatch = questions.some((qq) => qq.type === 'match');
    return (
      <div className="flex-1 flex flex-col px-5 py-6">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center mb-6" style={{ background: 'rgba(10,77,60,0.08)' }}><ArrowLeft size={18} style={{ color: '#0a4d3c' }} /></button>

        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 blur-3xl opacity-40" style={{ background: activeScenario.color, borderRadius: '50%' }} />
            <div className="relative w-24 h-24 rounded-full flex items-center justify-center text-5xl" style={{ background: activeScenario.bgGradient }}>
              {activeScenario.emoji}
            </div>
          </div>
          <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: '#c9a961' }}>Level {activeLevel.level} · {activeScenario.name}</p>
          <h2 className="text-3xl mb-1" style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: activeScenario.color }}>{activeLevel.title}</h2>
          <p className="text-base mb-1" style={{ fontFamily: 'Amiri, serif', color: '#8b6b3d' }}>{activeScenario.arName}</p>
          <p className="text-sm mb-6 max-w-xs" style={{ color: '#3d2817' }}>{activeLevel.description || activeScenario.location}</p>

          <div className="space-y-2 w-full max-w-xs mb-8">
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'white' }}>
              <Target size={16} style={{ color: activeScenario.color }} />
              <span className="text-sm" style={{ color: '#1a1a1a' }}>{questions.length} soal {hasMc && hasMatch ? '(MC + Match)' : hasMatch ? '(Match)' : '(MC)'}</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'white' }}>
              <Star size={16} style={{ color: activeScenario.color }} />
              <span className="text-sm" style={{ color: '#1a1a1a' }}>Max +{maxXp} XP (perfect)</span>
            </div>
          </div>
        </div>

        <button onClick={() => setStage('playing')} className="w-full py-4 rounded-2xl text-white font-medium flex items-center justify-center gap-2" style={{ background: activeScenario.color }}>
          Mulai Tantangan <Zap size={18} />
        </button>
      </div>
    );
  }

  if (stage === 'complete') {
    const maxXp = getXpForLevel(activeLevel.level);
    const xp = questions.length > 0 ? Math.round((score / questions.length) * maxXp) : 0;
    const isPerfect = score === questions.length && questions.length > 0;
    const isPartial = score > 0 && !isPerfect;
    const isZero = score === 0;

    // Color theming berdasarkan performance
    const tier = isPerfect
      ? { label: 'SEMPURNA!', emoji: '🏆', accent: '#c9a961', gradient: 'linear-gradient(135deg, #d4b876, #c9a961)', message: `Level GOLD diraih untuk Level ${activeLevel.level}!`, sub: 'Kamu menguasai semua kosakata di level ini' }
      : isPartial
      ? { label: 'COBA LAGI', emoji: '🔥', accent: '#a05536', gradient: 'linear-gradient(135deg, #a05536, #7a3d2a)', message: `Capai ${questions.length}/${questions.length} untuk dapat GOLD ⭐`, sub: 'Ulangi level untuk kuasai semua kosakata' }
      : { label: 'BELUM BERHASIL', emoji: '🌱', accent: '#8b6b3d', gradient: 'linear-gradient(135deg, #8b6b3d, #6b4f2a)', message: 'Jangan menyerah — semua orang mulai dari sini', sub: 'Coba lagi, pasti bisa!' };

    return (
      <div className="flex-1 flex flex-col px-5 py-6 items-center justify-center text-center">
        {/* Trophy/Badge dengan warna sesuai tier */}
        <div className="relative mb-4">
          <div className="absolute inset-0 blur-3xl opacity-50" style={{ background: tier.accent, borderRadius: '50%' }} />
          <div className="relative w-32 h-32 rounded-full flex items-center justify-center text-6xl" style={{ background: tier.gradient, boxShadow: `0 20px 40px -10px ${tier.accent}80` }}>
            {tier.emoji}
          </div>
        </div>

        {/* Tier label besar */}
        <p className="text-xs tracking-[0.3em] uppercase mb-2 font-bold" style={{ color: tier.accent }}>{tier.label}</p>

        {/* Title */}
        <h2 className="text-3xl mb-2" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: '#0a4d3c' }}>
          Level {activeLevel.level}
        </h2>
        <p className="text-sm mb-4" style={{ color: '#8b6b3d' }}>{activeScenario.emoji} {activeScenario.name} · {activeLevel.title}</p>

        {/* Score display besar */}
        <div className="flex items-center gap-3 mb-3">
          <div className="text-center">
            <p className="text-5xl font-bold" style={{ fontFamily: 'Fraunces, serif', color: tier.accent }}>{score}</p>
            <p className="text-xs uppercase tracking-widest" style={{ color: '#8b6b3d' }}>Benar</p>
          </div>
          <span className="text-3xl" style={{ color: '#8b6b3d' }}>/</span>
          <div className="text-center">
            <p className="text-5xl font-bold" style={{ fontFamily: 'Fraunces, serif', color: '#3d2817' }}>{questions.length}</p>
            <p className="text-xs uppercase tracking-widest" style={{ color: '#8b6b3d' }}>Total</p>
          </div>
        </div>

        {/* XP pill */}
        <div className="flex items-center gap-2 mb-2 px-5 py-2 rounded-full" style={{ background: `${tier.accent}25`, border: `1.5px solid ${tier.accent}` }}>
          <Star size={16} style={{ color: tier.accent }} fill={tier.accent} />
          <span className="text-sm font-bold" style={{ color: tier.accent }}>+{xp} XP</span>
          <span className="text-xs" style={{ color: '#8b6b3d' }}>dari max {maxXp}</span>
        </div>

        {/* Message contextual */}
        <p className="text-sm max-w-xs mb-1 mt-3" style={{ color: tier.accent, fontWeight: 600 }}>{tier.message}</p>
        <p className="text-xs max-w-xs mb-6" style={{ color: '#8b6b3d' }}>{tier.sub}</p>

        {/* Buttons — urutan prioritas: Lanjut (kalau perfect+ada next) → Ulangi/Share → Udahan */}
        <div className="w-full max-w-xs space-y-2">
          {/* PRIMARY: Lanjut ke Level berikutnya — muncul kalau perfect & ada next level playable */}
          {isPerfect && hasNextLevel && (
            <button
              onClick={() => onNextLevel && onNextLevel(activeLevel.level + 1)}
              className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)', color: 'white', boxShadow: '0 10px 24px -8px rgba(10,77,60,0.5)' }}
            >
              <ArrowRight size={18} /> Lanjut ke Level {activeLevel.level + 1}
            </button>
          )}

          {/* PRIMARY (alt): Retry kalau belum perfect */}
          {!isPerfect && (
            <button
              onClick={() => {
                // Reset state untuk replay level yang sama
                setStage('intro');
                setQ(0);
                setScore(0);
                setSelected(null);
                setTimeLeft(10);
                setXpAwarded(false);
              }}
              className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
              style={{ background: tier.gradient, color: 'white', boxShadow: `0 10px 24px -8px ${tier.accent}80` }}
            >
              <Zap size={18} /> Ulangi untuk GOLD ⭐
            </button>
          )}

          {/* SECONDARY: Share multi-platform (WA, FB, IG, Twitter, Telegram, copy).
              Trigger modal ShareModal — user pilih platform sendiri. */}
          {isPerfect && (
            <button
              onClick={() => {
                // Catat achievement ke feed sosial dulu (sebelum buka modal)
                onShare(`Tantangan ${activeScenario.name} Level ${activeLevel.level} GOLD ⭐ — skor ${score}/${questions.length}`);
                setShowShareModal(true);
              }}
              className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 text-white font-medium"
              style={{ background: 'linear-gradient(135deg, #c9a961, #d4b876)', boxShadow: '0 8px 20px -6px rgba(201,169,97,0.5)' }}
            >
              <Share2 size={16} /> Pamerin Pencapaianmu
            </button>
          )}

          {/* SECONDARY (alt): Ulangi level meskipun udah perfect — buat user yang mau coba lagi */}
          {isPerfect && (
            <button
              onClick={() => {
                setStage('intro');
                setQ(0);
                setScore(0);
                setSelected(null);
                setTimeLeft(10);
                setXpAwarded(false);
              }}
              className="w-full py-2.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2"
              style={{ background: 'rgba(201,169,97,0.18)', color: '#8b6b3d' }}
            >
              <Zap size={14} /> Main lagi level ini
            </button>
          )}

          {/* TERTIARY: Udahan / kembali ke level select */}
          <button onClick={onBack} className="w-full py-3 rounded-2xl text-sm font-semibold" style={{ background: 'rgba(10,77,60,0.08)', color: '#0a4d3c' }}>
            Udahan · Kembali ke Pilih Level
          </button>

          {/* Pesan kalau perfect tapi ga ada next level playable */}
          {isPerfect && !hasNextLevel && (
            <p className="text-xs mt-1 italic" style={{ color: '#8b6b3d' }}>
              {nextLevel?.comingSoon
                ? `🔒 Level ${activeLevel.level + 1} masih dipersiapkan — sabar ya!`
                : '🏁 Selamat! Kamu sudah di level tertinggi yang tersedia.'}
            </p>
          )}
        </div>

        {/* Existing best score badge — kalau ada attempt sebelumnya */}
        {existingProgress && existingProgress.attempts > 0 && (
          <p className="text-xs mt-4" style={{ color: '#8b6b3d' }}>
            Rekor terbaik: {existingProgress.bestScore}/{questions.length}
            {existingProgress.perfectAchieved && ' ⭐'}
            {' · '}
            {existingProgress.attempts} kali main
          </p>
        )}

        {/* Share modal multi-platform — render kalau user pencet Pamerin */}
        {showShareModal && (
          <ShareModal
            achievement={{
              scenarioName: activeScenario.name,
              scenarioEmoji: activeScenario.emoji,
              level: activeLevel.level,
              score,
              total: questions.length,
              xpEarned: xp,
            }}
            onClose={() => setShowShareModal(false)}
          />
        )}
      </div>
    );
  }

  // playing — render berbeda berdasarkan question type
  const current = questions[q];
  const progressBar = (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(10,77,60,0.1)' }}>
        <div className="h-full transition-all" style={{ width: `${((q+1)/questions.length)*100}%`, background: activeScenario.color }} />
      </div>
      <span className="text-xs font-semibold" style={{ color: activeScenario.color }}>{q+1}/{questions.length}</span>
    </div>
  );

  if (current?.type === 'match') {
    return (
      <div className="flex-1 flex flex-col px-5 py-5">
        {progressBar}
        <MatchQuestion
          question={current}
          scenarioColor={activeScenario.color}
          onComplete={handleMatchComplete}
        />
      </div>
    );
  }

  // Default: MC (multiple choice)
  return (
    <div className="flex-1 flex flex-col px-5 py-5">
      {progressBar}

      <div className="flex items-center justify-center mb-6">
        <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: timeLeft <= 3 ? 'rgba(201,169,97,0.2)' : 'rgba(10,77,60,0.08)' }}>
          <span className="text-3xl font-bold" style={{ color: timeLeft <= 3 ? '#c9a961' : activeScenario.color, fontFamily: 'Fraunces, serif' }}>{timeLeft}</span>
        </div>
      </div>

      <p className="text-xs tracking-widest uppercase mb-3 text-center" style={{ color: '#8b6b3d' }}>Apa artinya?</p>
      <div className="rounded-3xl p-8 mb-6 text-center" style={{ background: 'white', boxShadow: '0 10px 40px -10px rgba(10,77,60,0.2)' }}>
        <p className="text-4xl mb-2" style={{ fontFamily: 'Amiri, serif', color: activeScenario.color }}>{current.ar}</p>
        {current.latin && (
          <p className="text-xs italic" style={{ color: '#8b6b3d' }}>{current.latin}</p>
        )}
      </div>

      <div className="space-y-2">
        {current.options.map((opt, idx) => {
          let bg = 'white', border = 'rgba(10,77,60,0.15)';
          if (selected !== null) {
            if (idx === current.correct) { bg = 'rgba(10,77,60,0.08)'; border = activeScenario.color; }
            else if (idx === selected) { bg = 'rgba(201,169,97,0.15)'; border = '#c9a961'; }
          }
          return (
            <button key={idx} onClick={() => selected === null && handleMcAnswer(idx)} className="w-full p-4 rounded-2xl text-left" style={{ background: bg, border: `2px solid ${border}`, color: '#1a1a1a' }}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// MATCH QUESTION — cocokkan vocab Arab dengan artinya
// User tap kiri (Arab) lalu tap kanan (Indo) untuk pasangkan.
// Pasangan benar → hijau, salah → reset, ulangi sampai semua benar
// ============================================================================
function MatchQuestion({ question, scenarioColor, onComplete }) {
  const [matches, setMatches] = useState({}); // arIndex → idIndex
  const [selectedAr, setSelectedAr] = useState(null);
  const [shake, setShake] = useState(false);
  // Track berapa kali user salah pasangkan. Kalau > 0 saat semua selesai,
  // soal dianggap "tidak sempurna" → tidak dapat poin (biar fair dgn MC).
  const [mistakes, setMistakes] = useState(0);
  const [completed, setCompleted] = useState(false); // guard biar onComplete cuma dipanggil sekali

  // Shuffle the Indonesian column on mount (Arab tetap urut original)
  const [idOrder] = useState(() => {
    const indices = question.pairs.map((_, i) => i);
    // Fisher-Yates shuffle
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  });

  // Auto-complete kalau semua udah ke-match dengan benar.
  // Poin diberikan HANYA kalau mistakes === 0 (semua benar pada percobaan pertama).
  useEffect(() => {
    if (completed) return;
    if (Object.keys(matches).length === question.pairs.length) {
      const allCorrect = question.pairs.every((_, arIdx) => matches[arIdx] === arIdx);
      if (allCorrect && onComplete) {
        setCompleted(true);
        // Pass `firstTryPerfect` flag — true hanya kalau 0 kesalahan
        setTimeout(() => onComplete(mistakes === 0), 600);
      }
    }
  }, [matches, question.pairs, onComplete, mistakes, completed]);

  const handleArClick = (arIdx) => {
    if (matches[arIdx] !== undefined) return; // udah matched
    setSelectedAr(arIdx === selectedAr ? null : arIdx);
  };

  const handleIdClick = (idIdx) => {
    if (selectedAr === null) return;
    if (Object.values(matches).includes(idIdx)) return; // udah matched

    if (idIdx === selectedAr) {
      // Match benar
      setMatches((m) => ({ ...m, [selectedAr]: idIdx }));
      setSelectedAr(null);
    } else {
      // Salah — increment mistakes + shake feedback
      setMistakes((c) => c + 1);
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setSelectedAr(null);
      }, 400);
    }
  };

  return (
    <>
      <p className="text-xs tracking-widest uppercase mb-2 text-center" style={{ color: '#8b6b3d' }}>{question.instruction || 'Cocokkan pasangan'}</p>
      <p className="text-sm mb-4 text-center" style={{ color: '#3d2817' }}>Tap kiri lalu tap kanan untuk pasangkan</p>

      <div className={`grid grid-cols-2 gap-3 mb-4 ${shake ? 'animate-pulse' : ''}`}>
        {/* Kolom Arab (kiri) */}
        <div className="space-y-2">
          {question.pairs.map((p, arIdx) => {
            const isMatched = matches[arIdx] !== undefined;
            const isSelected = selectedAr === arIdx;
            return (
              <button
                key={arIdx}
                onClick={() => handleArClick(arIdx)}
                disabled={isMatched}
                className="w-full p-3 rounded-xl text-center transition-all disabled:opacity-100"
                style={{
                  background: isMatched ? `${scenarioColor}15` : isSelected ? 'rgba(201,169,97,0.25)' : 'white',
                  border: `2px solid ${isMatched ? scenarioColor : isSelected ? '#c9a961' : 'rgba(10,77,60,0.15)'}`,
                  opacity: isMatched ? 0.7 : 1,
                }}
              >
                <p className="text-xl" style={{ fontFamily: 'Amiri, serif', color: scenarioColor }}>{p.ar}</p>
                {p.latin && <p className="text-[10px] italic mt-0.5" style={{ color: '#8b6b3d' }}>{p.latin}</p>}
              </button>
            );
          })}
        </div>

        {/* Kolom Indonesia (kanan) — di-shuffle */}
        <div className="space-y-2">
          {idOrder.map((idIdx) => {
            const isMatched = Object.values(matches).includes(idIdx);
            return (
              <button
                key={idIdx}
                onClick={() => handleIdClick(idIdx)}
                disabled={isMatched}
                className="w-full p-3 rounded-xl text-center transition-all disabled:opacity-100"
                style={{
                  background: isMatched ? `${scenarioColor}15` : 'white',
                  border: `2px solid ${isMatched ? scenarioColor : 'rgba(10,77,60,0.15)'}`,
                  opacity: isMatched ? 0.7 : 1,
                  minHeight: '54px',
                }}
              >
                <p className="text-sm" style={{ color: '#1a1a1a' }}>{question.pairs[idIdx].id}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 mt-2">
        <p className="text-xs" style={{ color: '#8b6b3d' }}>
          {Object.keys(matches).length}/{question.pairs.length} benar
        </p>
        {mistakes > 0 && (
          <p className="text-xs font-semibold" style={{ color: '#a05536' }}>
            · {mistakes} salah
          </p>
        )}
      </div>
      <p className="text-[10px] text-center mt-1 italic" style={{ color: mistakes > 0 ? '#a05536' : '#8b6b3d', opacity: 0.8 }}>
        {mistakes === 0
          ? 'Pasangkan semua tanpa salah untuk dapat poin ⭐'
          : 'Kamu sudah salah — poin tidak terkumpul, tapi tetap lanjut ya'}
      </p>
    </>
  );
}

// ============ GURU/TEACHER SCREEN ============
function GuruScreen({ onBack, onSelectGuru }) {
  const [mode, setMode] = useState('grup'); // grup or privat

  const gurus = [
    { id: 1, name: 'Ust. Ahmad Fauzi', avatar: '👨🏽', specialty: 'Bahasa Arab Fusha', exp: '8 tahun', rating: 4.9, reviews: 124, langs: ['Indonesia', 'Arab'], price: { grup: 50000, privat: 120000 }, online: true, badge: 'Lulusan Al-Azhar Kairo' },
    { id: 2, name: 'Ustz. Fatimah', avatar: '👩🏽‍🦱', specialty: 'Percakapan Sehari-hari', exp: '5 tahun', rating: 4.8, reviews: 89, langs: ['Indonesia', 'Arab', 'Inggris'], price: { grup: 45000, privat: 100000 }, online: true, badge: 'Lulusan Madinah' },
    { id: 3, name: 'Ust. Ridwan', avatar: '👳🏽‍♂️', specialty: 'Bahasa Arab untuk Umrah', exp: '12 tahun', rating: 5.0, reviews: 201, langs: ['Indonesia', 'Arab'], price: { grup: 60000, privat: 150000 }, online: false, badge: 'Mukim 10 tahun di Saudi' },
    { id: 4, name: 'Ust. Hisham', avatar: '🧔🏽', specialty: 'Arab Akademik', exp: '7 tahun', rating: 4.7, reviews: 56, langs: ['Indonesia', 'Arab', 'Inggris'], price: { grup: 55000, privat: 130000 }, online: true, badge: 'Dosen Bahasa Arab UI' },
  ];

  return (
    <div className="flex-1 flex flex-col px-5 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <ArrowLeft size={18} style={{ color: '#0a4d3c' }} />
        </button>
        <div>
          <p className="text-xs tracking-widest uppercase" style={{ color: '#8b6b3d' }}>Marketplace</p>
          <h2 className="text-xl font-semibold" style={{ color: '#0a4d3c', fontFamily: 'Fraunces, serif' }}>Belajar dengan Ustadz</h2>
        </div>
      </div>

      {/* Trial banner */}
      <div className="rounded-2xl p-4 mb-5 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #c9a961, #d4b876)' }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'white' }}>
            <span className="text-2xl">🎁</span>
          </div>
          <div className="flex-1">
            <p className="font-bold text-white text-sm">Trial GRATIS 15 menit</p>
            <p className="text-xs text-white opacity-90">Coba sesi pertamamu tanpa biaya</p>
          </div>
        </div>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-2 mb-5 p-1 rounded-2xl" style={{ background: 'rgba(10,77,60,0.06)' }}>
        <button onClick={() => setMode('grup')} className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all" style={{ background: mode === 'grup' ? 'white' : 'transparent', color: mode === 'grup' ? '#0a4d3c' : '#8b6b3d', boxShadow: mode === 'grup' ? '0 2px 8px rgba(10,77,60,0.1)' : 'none' }}>
          <div className="flex items-center justify-center gap-2">
            <Users size={14} /> Kelas Grup
          </div>
        </button>
        <button onClick={() => setMode('privat')} className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all" style={{ background: mode === 'privat' ? 'white' : 'transparent', color: mode === 'privat' ? '#0a4d3c' : '#8b6b3d', boxShadow: mode === 'privat' ? '0 2px 8px rgba(10,77,60,0.1)' : 'none' }}>
          <div className="flex items-center justify-center gap-2">
            <User size={14} /> Privat 1-on-1
          </div>
        </button>
      </div>

      {/* Mode info */}
      <div className="rounded-xl p-3 mb-4" style={{ background: mode === 'grup' ? 'rgba(10,77,60,0.05)' : 'rgba(122,61,42,0.05)' }}>
        <p className="text-xs leading-relaxed" style={{ color: '#3d2817' }}>
          {mode === 'grup' ? (
            <><strong>Kelas Grup:</strong> 1 guru, 5-15 murid. Biaya lebih murah, banyak teman belajar, jadwal tetap.</>
          ) : (
            <><strong>Privat 1-on-1:</strong> Hanya kamu dan guru. Belajar lebih cepat, materi sesuai kebutuhanmu, jadwal fleksibel.</>
          )}
        </p>
      </div>

      {/* Guru list */}
      <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#8b6b3d' }}>Guru Tersedia</p>
      <div className="space-y-3 flex-1">
        {gurus.map((g) => (
          <button key={g.id} onClick={() => onSelectGuru({ ...g, mode })} className="w-full text-left p-4 rounded-2xl active:scale-[0.98] transition-transform" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.08)', boxShadow: '0 4px 16px -8px rgba(10,77,60,0.1)' }}>
            <div className="flex items-start gap-3">
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl" style={{ background: 'rgba(10,77,60,0.08)' }}>{g.avatar}</div>
                {g.online && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2" style={{ background: '#22c55e', borderColor: 'white' }} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm" style={{ color: '#1a1a1a' }}>{g.name}</h3>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Star size={12} fill="#c9a961" style={{ color: '#c9a961' }} />
                    <span className="text-xs font-semibold" style={{ color: '#8b6b3d' }}>{g.rating}</span>
                  </div>
                </div>
                <p className="text-xs mb-1" style={{ color: '#666' }}>{g.specialty}</p>
                <p className="text-[10px] mb-2" style={{ color: '#c9a961' }}>{g.badge}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px]" style={{ color: '#8b6b3d' }}>
                      <Award size={10} className="inline mr-0.5" />{g.exp}
                    </span>
                    <span className="text-[10px]" style={{ color: '#8b6b3d' }}>{g.reviews} ulasan</span>
                  </div>
                  <p className="text-sm font-bold" style={{ color: '#0a4d3c' }}>
                    Rp{(g.price[mode]/1000).toFixed(0)}rb<span className="text-[10px] font-normal opacity-70">/{mode === 'grup' ? 'sesi' : 'jam'}</span>
                  </p>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 p-3 rounded-xl text-xs flex items-start gap-2" style={{ background: 'rgba(201,169,97,0.1)', border: '1px dashed #c9a961' }}>
        <Sparkles size={14} style={{ color: '#c9a961' }} className="mt-0.5 flex-shrink-0" />
        <p style={{ color: '#7a3d2a' }}>
          <strong>Preview fitur Guru.</strong> Sistem booking & pembayaran akan aktif setelah validasi user trial.
        </p>
      </div>
    </div>
  );
}

// ============ GURU DETAIL ============
function GuruDetailScreen({ guru, onBack }) {
  const [step, setStep] = useState('detail'); // detail, booking, confirmed
  const [selectedSlot, setSelectedSlot] = useState(null);

  const slots = [
    { day: 'Sabtu', date: '25 Mei', time: '09:00', avail: true },
    { day: 'Sabtu', date: '25 Mei', time: '14:00', avail: true },
    { day: 'Sabtu', date: '25 Mei', time: '19:30', avail: false },
    { day: 'Minggu', date: '26 Mei', time: '10:00', avail: true },
    { day: 'Minggu', date: '26 Mei', time: '16:00', avail: true },
    { day: 'Senin', date: '27 Mei', time: '20:00', avail: true },
  ];

  if (step === 'confirmed') {
    return (
      <div className="flex-1 flex flex-col px-5 py-6 items-center justify-center text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 blur-3xl opacity-40" style={{ background: '#0a4d3c', borderRadius: '50%' }} />
          <div className="relative w-24 h-24 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)' }}>
            <Check size={40} color="white" />
          </div>
        </div>
        <h2 className="text-3xl mb-3" style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: '#0a4d3c' }}>Berhasil!</h2>
        <p className="text-base mb-2 max-w-xs" style={{ color: '#3d2817' }}>
          Booking dengan {guru?.name} dikonfirmasi
        </p>
        <p className="text-sm mb-8" style={{ color: '#8b6b3d' }}>{selectedSlot?.day}, {selectedSlot?.date} · {selectedSlot?.time}</p>

        <div className="w-full max-w-xs p-4 rounded-2xl mb-6" style={{ background: 'rgba(201,169,97,0.1)', border: '1px dashed #c9a961' }}>
          <p className="text-xs" style={{ color: '#7a3d2a' }}>
            <strong>Demo mode:</strong> Di versi nyata, kamu akan diarahkan ke pembayaran & link Zoom otomatis dikirim ke email.
          </p>
        </div>

        <button onClick={onBack} className="w-full max-w-xs py-4 rounded-2xl text-white font-medium" style={{ background: '#0a4d3c' }}>Kembali</button>
      </div>
    );
  }

  if (step === 'booking') {
    return (
      <div className="flex-1 flex flex-col px-5 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setStep('detail')} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
            <ArrowLeft size={18} style={{ color: '#0a4d3c' }} />
          </button>
          <h2 className="text-xl font-semibold" style={{ color: '#0a4d3c', fontFamily: 'Fraunces, serif' }}>Pilih Jadwal</h2>
        </div>

        <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#8b6b3d' }}>Slot Tersedia</p>
        <div className="space-y-2 flex-1">
          {slots.map((s, i) => {
            const isSelected = selectedSlot === s;
            return (
              <button key={i} onClick={() => s.avail && setSelectedSlot(s)} disabled={!s.avail} className="w-full p-4 rounded-xl text-left flex items-center justify-between disabled:opacity-40" style={{ background: isSelected ? 'rgba(10,77,60,0.08)' : 'white', border: `2px solid ${isSelected ? '#0a4d3c' : 'rgba(10,77,60,0.1)'}` }}>
                <div className="flex items-center gap-3">
                  <Calendar size={18} style={{ color: '#0a4d3c' }} />
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#1a1a1a' }}>{s.day}, {s.date}</p>
                    <p className="text-xs" style={{ color: '#666' }}>{s.time} WIB</p>
                  </div>
                </div>
                {!s.avail ? <span className="text-xs" style={{ color: '#999' }}>Penuh</span> : isSelected && <Check size={18} style={{ color: '#0a4d3c' }} />}
              </button>
            );
          })}
        </div>

        <div className="mt-4 p-4 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.1)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm" style={{ color: '#666' }}>{guru?.mode === 'grup' ? 'Kelas Grup' : 'Privat 1-on-1'}</span>
            <span className="text-sm font-semibold" style={{ color: '#1a1a1a' }}>Rp{(guru?.price[guru?.mode]/1000).toFixed(0)}rb</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'rgba(10,77,60,0.1)' }}>
            <span className="text-sm font-semibold" style={{ color: '#0a4d3c' }}>Total</span>
            <span className="text-lg font-bold" style={{ color: '#0a4d3c' }}>Rp{(guru?.price[guru?.mode]/1000).toFixed(0)}rb</span>
          </div>
        </div>

        <button onClick={() => selectedSlot && setStep('confirmed')} disabled={!selectedSlot} className="w-full py-4 rounded-2xl text-white font-medium flex items-center justify-center gap-2 mt-4 disabled:opacity-40" style={{ background: '#0a4d3c' }}>
          Konfirmasi Booking <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col px-5 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <ArrowLeft size={18} style={{ color: '#0a4d3c' }} />
        </button>
        <h2 className="text-xl font-semibold" style={{ color: '#0a4d3c', fontFamily: 'Fraunces, serif' }}>Profil Guru</h2>
      </div>

      {/* Hero */}
      <div className="text-center mb-6">
        <div className="relative inline-block mb-3">
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mx-auto" style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)' }}>{guru?.avatar}</div>
          {guru?.online && <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full border-2" style={{ background: '#22c55e', borderColor: 'white' }} />}
        </div>
        <h3 className="text-2xl mb-1" style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: '#0a4d3c' }}>{guru?.name}</h3>
        <p className="text-sm mb-1" style={{ color: '#666' }}>{guru?.specialty}</p>
        <p className="text-xs" style={{ color: '#c9a961' }}>{guru?.badge}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="rounded-xl p-3 text-center" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.08)' }}>
          <Star size={16} className="mx-auto mb-1" fill="#c9a961" style={{ color: '#c9a961' }} />
          <p className="text-base font-bold" style={{ color: '#0a4d3c' }}>{guru?.rating}</p>
          <p className="text-[10px]" style={{ color: '#8b6b3d' }}>RATING</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.08)' }}>
          <Users size={16} className="mx-auto mb-1" style={{ color: '#0a4d3c' }} />
          <p className="text-base font-bold" style={{ color: '#0a4d3c' }}>{guru?.reviews}</p>
          <p className="text-[10px]" style={{ color: '#8b6b3d' }}>ULASAN</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.08)' }}>
          <Award size={16} className="mx-auto mb-1" style={{ color: '#8b6b3d' }} />
          <p className="text-base font-bold" style={{ color: '#0a4d3c' }}>{guru?.exp}</p>
          <p className="text-[10px]" style={{ color: '#8b6b3d' }}>PENGALAMAN</p>
        </div>
      </div>

      {/* About */}
      <div className="rounded-2xl p-4 mb-4" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.08)' }}>
        <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#8b6b3d' }}>Tentang</p>
        <p className="text-sm leading-relaxed" style={{ color: '#3d2817' }}>
          Mengajar bahasa Arab dengan pendekatan praktis dan menyenangkan. Fokus pada percakapan natural dan pemahaman konteks budaya Arab.
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {guru?.langs?.map((l, i) => (
            <span key={i} className="px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(10,77,60,0.08)', color: '#0a4d3c' }}>{l}</span>
          ))}
        </div>
      </div>

      {/* Trial CTA */}
      <button className="w-full p-4 rounded-2xl mb-3 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #c9a961, #d4b876)' }}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'white' }}>
          <span className="text-xl">🎁</span>
        </div>
        <div className="flex-1 text-left">
          <p className="font-bold text-white text-sm">Trial Gratis 15 Menit</p>
          <p className="text-xs text-white opacity-90">Coba dulu sebelum booking penuh</p>
        </div>
        <ChevronRight size={18} color="white" />
      </button>

      {/* Book button */}
      <button onClick={() => setStep('booking')} className="w-full py-4 rounded-2xl text-white font-medium flex items-center justify-center gap-2" style={{ background: '#0a4d3c' }}>
        Book {guru?.mode === 'grup' ? 'Kelas Grup' : 'Privat'} · Rp{(guru?.price[guru?.mode]/1000).toFixed(0)}rb <ArrowRight size={18} />
      </button>
    </div>
  );
}

// ============ PREMIUM with MOTIVATION FLOW ============
function PremiumScreen({ onBack, userProfile, onSubmit }) {
  const [step, setStep] = useState('intro'); // intro, q1, q2, q3, q4, plans, success
  const [data, setData] = useState({
    goal: userProfile?.goal || '',
    profession: userProfile?.profession || '',
    motivation: userProfile?.motivation || '',
    targetTime: userProfile?.targetTime || '',
  });

  const updateData = (key, val) => setData(d => ({ ...d, [key]: val }));

  const Header = ({ stepNum, totalSteps, onPrev }) => (
    <div className="flex items-center gap-3 mb-6">
      <button onClick={onPrev} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
        <ArrowLeft size={18} style={{ color: '#0a4d3c' }} />
      </button>
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(10,77,60,0.1)' }}>
        <div className="h-full transition-all duration-500" style={{ width: `${(stepNum/totalSteps)*100}%`, background: '#c9a961' }} />
      </div>
      <span className="text-xs font-semibold" style={{ color: '#8b6b3d' }}>{stepNum}/{totalSteps}</span>
    </div>
  );

  // Intro
  if (step === 'intro') {
    return (
      <div className="flex-1 flex flex-col px-5 py-6">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center mb-6 self-start" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <ArrowLeft size={18} style={{ color: '#0a4d3c' }} />
        </button>

        <div className="rounded-3xl p-6 mb-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #c9a961, #d4b876)' }}>
          <div className="absolute -right-6 -top-6 text-9xl opacity-20" style={{ fontFamily: 'Amiri, serif', color: 'white' }}>★</div>
          <Sparkles size={28} color="white" className="mb-3" />
          <h2 className="text-3xl text-white mb-2" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700 }}>Tulis Noon<br/>Premium</h2>
          <p className="text-white opacity-90 text-sm">Akses penuh untuk mendalami bahasa Arab</p>
        </div>

        <p className="text-base mb-5" style={{ color: '#3d2817' }}>
          Sebelum kami tunjukkan paket Premium, kami ingin <em style={{ fontFamily: 'Fraunces, serif' }}>memahami</em> kebutuhanmu lebih dulu.
        </p>

        <div className="space-y-3 flex-1">
          {[
            { icon: '🎯', t: 'Rencana belajar pribadi', d: 'Sesuai tujuan & jadwalmu' },
            { icon: '🤖', t: 'AI tutor khusus', d: 'Selalu siap jawab pertanyaanmu' },
            { icon: '👳🏽‍♂️', t: 'Diskon kelas dengan ustadz', d: 'Akses guru profesional' },
            { icon: '📊', t: 'Laporan kemajuan detail', d: 'Pantau perkembanganmu' },
          ].map((f,i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'white' }}>
              <div className="text-2xl">{f.icon}</div>
              <div>
                <p className="font-semibold text-sm" style={{ color: '#1a1a1a' }}>{f.t}</p>
                <p className="text-xs" style={{ color: '#666' }}>{f.d}</p>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => setStep('q1')} className="w-full py-4 rounded-2xl text-white font-medium flex items-center justify-center gap-2 mt-4" style={{ background: '#0a4d3c' }}>
          Mulai Personalisasi <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  // Q1: Goal
  if (step === 'q1') {
    const goals = [
      { id: 'ibadah', label: 'Ibadah & Al-Quran', desc: 'Memahami sholat, doa, dan Al-Quran', emoji: '🕌' },
      { id: 'profesi', label: 'Karir & Profesi', desc: 'Bekerja di lingkungan Arab', emoji: '💼' },
      { id: 'akademik', label: 'Studi/Beasiswa', desc: 'Kuliah di negara Arab', emoji: '🎓' },
      { id: 'keluarga', label: 'Keluarga & Sosial', desc: 'Pasangan/keluarga berbahasa Arab', emoji: '👨‍👩‍👧' },
      { id: 'umrah', label: 'Umrah/Haji', desc: 'Perjalanan ke Tanah Suci', emoji: '🕋' },
    ];

    return (
      <div className="flex-1 flex flex-col px-5 py-6">
        <Header stepNum={1} totalSteps={4} onPrev={() => setStep('intro')} />
        <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#c9a961' }}>Pertanyaan 1</p>
        <h2 className="text-2xl mb-2 leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: '#0a4d3c' }}>
          Apa tujuan utamamu belajar bahasa Arab?
        </h2>
        <p className="text-sm mb-6" style={{ color: '#666' }}>Pilih yang paling utama.</p>

        <div className="space-y-2 flex-1 overflow-auto">
          {goals.map((g) => {
            const isSelected = data.goal === g.id;
            return (
              <button key={g.id} onClick={() => updateData('goal', g.id)} className="w-full p-4 rounded-2xl text-left flex items-center gap-4" style={{ background: isSelected ? 'rgba(201,169,97,0.1)' : 'white', border: `2px solid ${isSelected ? '#c9a961' : 'rgba(10,77,60,0.15)'}` }}>
                <div className="text-3xl flex-shrink-0">{g.emoji}</div>
                <div className="flex-1">
                  <p className="font-semibold text-sm" style={{ color: '#1a1a1a' }}>{g.label}</p>
                  <p className="text-xs" style={{ color: '#666' }}>{g.desc}</p>
                </div>
                {isSelected && <Check size={20} style={{ color: '#c9a961' }} />}
              </button>
            );
          })}
        </div>

        <button onClick={() => data.goal && setStep('q2')} disabled={!data.goal} className="w-full py-4 rounded-2xl text-white font-medium flex items-center justify-center gap-2 mt-4 disabled:opacity-40" style={{ background: '#0a4d3c' }}>
          Lanjut <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  // Q2: Profession
  if (step === 'q2') {
    return (
      <div className="flex-1 flex flex-col px-5 py-6">
        <Header stepNum={2} totalSteps={4} onPrev={() => setStep('q1')} />
        <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#c9a961' }}>Pertanyaan 2</p>
        <h2 className="text-2xl mb-2 leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: '#0a4d3c' }}>
          Apa profesi/aktivitas kamu saat ini?
        </h2>
        <p className="text-sm mb-6" style={{ color: '#666' }}>Bantu kami sesuaikan istilah & konteks pembelajaran.</p>

        <input
          type="text"
          value={data.profession}
          onChange={(e) => updateData('profession', e.target.value)}
          placeholder="Contoh: Guru, Pegawai, Mahasiswa..."
          className="w-full px-5 py-4 rounded-2xl text-base outline-none mb-3"
          style={{ background: 'white', border: '2px solid rgba(10,77,60,0.15)', color: '#1a1a1a' }}
        />

        <div className="flex flex-wrap gap-2 mb-4">
          {['Pelajar/Mahasiswa', 'Pekerja Kantor', 'Wiraswasta', 'Guru/Dosen', 'Ibu Rumah Tangga', 'Profesional Kesehatan', 'TKI/Pekerja LN'].map((p) => (
            <button key={p} onClick={() => updateData('profession', p)} className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: data.profession === p ? '#0a4d3c' : 'white', color: data.profession === p ? 'white' : '#0a4d3c', border: '1px solid rgba(10,77,60,0.15)' }}>
              {p}
            </button>
          ))}
        </div>

        <div className="flex-1" />
        <button onClick={() => data.profession && setStep('q3')} disabled={!data.profession} className="w-full py-4 rounded-2xl text-white font-medium flex items-center justify-center gap-2 disabled:opacity-40" style={{ background: '#0a4d3c' }}>
          Lanjut <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  // Q3: Deep motivation
  if (step === 'q3') {
    return (
      <div className="flex-1 flex flex-col px-5 py-6">
        <Header stepNum={3} totalSteps={4} onPrev={() => setStep('q2')} />
        <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#c9a961' }}>Pertanyaan 3</p>
        <h2 className="text-2xl mb-2 leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: '#0a4d3c' }}>
          Mengapa kamu ingin <em>fasih</em> bahasa Arab?
        </h2>
        <p className="text-sm mb-6" style={{ color: '#666' }}>Ceritakan dengan jujur. Ini akan jadi pengingatmu di hari malas.</p>

        <textarea
          value={data.motivation}
          onChange={(e) => updateData('motivation', e.target.value)}
          placeholder="Misal: Saya ingin memahami bacaan sholat dengan hati, bukan hanya hafalan..."
          rows={5}
          className="w-full px-5 py-4 rounded-2xl text-base outline-none mb-3 resize-none"
          style={{ background: 'white', border: '2px solid rgba(10,77,60,0.15)', color: '#1a1a1a', fontFamily: 'inherit' }}
        />

        <div className="p-3 rounded-xl mb-4" style={{ background: 'rgba(201,169,97,0.1)' }}>
          <p className="text-xs leading-relaxed" style={{ color: '#7a3d2a' }}>
            💡 <strong>Tahukah kamu?</strong> Orang yang menulis "mengapa" mereka belajar 3x lebih konsisten dibanding yang tidak.
          </p>
        </div>

        <div className="flex-1" />
        <button onClick={() => data.motivation && data.motivation.length >= 10 && setStep('q4')} disabled={!data.motivation || data.motivation.length < 10} className="w-full py-4 rounded-2xl text-white font-medium flex items-center justify-center gap-2 disabled:opacity-40" style={{ background: '#0a4d3c' }}>
          Lanjut <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  // Q4: Target time
  if (step === 'q4') {
    const targets = [
      { id: '1month', label: '1 bulan', desc: 'Saya butuh cepat (umrah dekat)', emoji: '⚡' },
      { id: '3months', label: '3 bulan', desc: 'Intensif tapi realistis', emoji: '🎯' },
      { id: '6months', label: '6 bulan', desc: 'Tempo seimbang', emoji: '🌱' },
      { id: '1year', label: '1 tahun+', desc: 'Pelan tapi pasti', emoji: '🌳' },
    ];

    return (
      <div className="flex-1 flex flex-col px-5 py-6">
        <Header stepNum={4} totalSteps={4} onPrev={() => setStep('q3')} />
        <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#c9a961' }}>Pertanyaan 4</p>
        <h2 className="text-2xl mb-2 leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: '#0a4d3c' }}>
          Kapan kamu ingin sudah lancar?
        </h2>
        <p className="text-sm mb-6" style={{ color: '#666' }}>Target waktu yang realistis untukmu.</p>

        <div className="space-y-3 flex-1">
          {targets.map((t) => {
            const isSelected = data.targetTime === t.id;
            return (
              <button key={t.id} onClick={() => updateData('targetTime', t.id)} className="w-full p-4 rounded-2xl text-left flex items-center gap-4" style={{ background: isSelected ? 'rgba(201,169,97,0.1)' : 'white', border: `2px solid ${isSelected ? '#c9a961' : 'rgba(10,77,60,0.15)'}` }}>
                <div className="text-3xl flex-shrink-0">{t.emoji}</div>
                <div className="flex-1">
                  <p className="font-semibold text-base" style={{ color: '#1a1a1a' }}>{t.label}</p>
                  <p className="text-xs" style={{ color: '#666' }}>{t.desc}</p>
                </div>
                {isSelected && <Check size={20} style={{ color: '#c9a961' }} />}
              </button>
            );
          })}
        </div>

        <button onClick={() => data.targetTime && setStep('plans')} disabled={!data.targetTime} className="w-full py-4 rounded-2xl text-white font-medium flex items-center justify-center gap-2 mt-4 disabled:opacity-40" style={{ background: '#0a4d3c' }}>
          Lihat Paket Premium <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  // Plans
  if (step === 'plans') {
    const plans = [
      { id: 'monthly', name: 'Bulanan', price: 49000, period: '/bulan', save: null },
      { id: 'quarterly', name: '3 Bulan', price: 129000, period: '/3 bulan', save: 'Hemat 12%', popular: true },
      { id: 'yearly', name: 'Tahunan', price: 399000, period: '/tahun', save: 'Hemat 32%' },
    ];

    return (
      <div className="flex-1 flex flex-col px-5 py-6">
        <button onClick={() => setStep('q4')} className="w-10 h-10 rounded-full flex items-center justify-center mb-6 self-start" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <ArrowLeft size={18} style={{ color: '#0a4d3c' }} />
        </button>

        <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#c9a961' }}>Paket pilihan untukmu</p>
        <h2 className="text-2xl mb-2 leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: '#0a4d3c' }}>
          Berdasarkan profilmu...
        </h2>
        <p className="text-sm mb-6" style={{ color: '#666' }}>
          Untuk target <strong>{data.targetTime === '1month' ? '1 bulan' : data.targetTime === '3months' ? '3 bulan' : data.targetTime === '6months' ? '6 bulan' : '1 tahun'}</strong>, kami rekomendasikan paket <strong>{data.targetTime === '1month' ? 'Bulanan' : data.targetTime === '3months' ? '3 Bulan' : 'Tahunan'}</strong>.
        </p>

        <div className="space-y-3 flex-1">
          {plans.map((p) => (
            <div key={p.id} className="p-4 rounded-2xl relative" style={{ background: 'white', border: `2px solid ${p.popular ? '#c9a961' : 'rgba(10,77,60,0.1)'}` }}>
              {p.popular && (
                <div className="absolute -top-2 left-4 px-3 py-0.5 rounded-full text-[10px] font-bold" style={{ background: '#c9a961', color: 'white' }}>POPULER</div>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-base" style={{ color: '#1a1a1a' }}>{p.name}</p>
                  {p.save && <p className="text-xs font-semibold" style={{ color: '#c9a961' }}>{p.save}</p>}
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold" style={{ color: '#0a4d3c' }}>Rp{(p.price/1000).toFixed(0)}rb</p>
                  <p className="text-xs" style={{ color: '#666' }}>{p.period}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-xl text-xs flex items-start gap-2" style={{ background: 'rgba(201,169,97,0.1)', border: '1px dashed #c9a961' }}>
          <Sparkles size={14} style={{ color: '#c9a961' }} className="mt-0.5 flex-shrink-0" />
          <p style={{ color: '#7a3d2a' }}>
            <strong>Mode demo:</strong> Sistem pembayaran akan aktif setelah validasi 5 user trial.
          </p>
        </div>

        <button onClick={() => { onSubmit(data); }} className="w-full py-4 rounded-2xl text-white font-medium flex items-center justify-center gap-2 mt-4" style={{ background: '#0a4d3c' }}>
          Simpan Preferensi <Check size={18} />
        </button>
      </div>
    );
  }
}

// ============================================================================
// ARABIC LEVEL SURVEY MODAL — untuk user lama yang belum di-survey.
// Tampil sekali setelah masuk main app. Bisa skip (default 'pemula') atau pilih.
// ============================================================================
function ArabicLevelSurveyModal({ onSelect, onSkip }) {
  const [selected, setSelected] = useState(null);
  const levels = [
    { id: 'pemula', label: 'Belum pernah belajar', desc: 'Aku mulai dari nol', emoji: '🌱', rec: 'Mubtadi (Level 1-5)' },
    { id: 'bisaBaca', label: 'Bisa baca, belum paham arti', desc: 'Lulus iqro/baca Quran tapi belum ngerti makna', emoji: '📖', rec: 'Daris (Level 6-20)' },
    { id: 'menengah', label: 'Paham percakapan dasar', desc: 'Bisa salam, sapa, nawar di pasar', emoji: '💬', rec: 'Mutawassith (Level 21-50)' },
    { id: 'lancar', label: 'Lancar ngobrol sehari-hari', desc: 'Mau perdalam Hijazi & istilah ibadah', emoji: '🎯', rec: 'Faaheem/Mahir (Level 51+)' },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: 'rgba(10,30,25,0.75)' }}>
      <div className="w-full max-w-md max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl" style={{ background: 'linear-gradient(180deg, #faf6ee 0%, #f3ebd9 100%)' }}>
        <div className="px-6 pt-6 pb-3 sticky top-0 z-10" style={{ background: 'linear-gradient(180deg, #faf6ee 0%, rgba(250,246,238,0.95) 100%)' }}>
          <div className="flex items-start gap-3 mb-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: 'linear-gradient(135deg, #c9a961, #d4b876)' }}>
              📚
            </div>
            <div className="flex-1">
              <p className="text-[10px] tracking-[0.25em] uppercase font-bold" style={{ color: '#c9a961' }}>Survey Sebentar</p>
              <h2 className="text-xl leading-tight mt-0.5" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: '#0a4d3c' }}>
                Level bahasa Arabmu?
              </h2>
            </div>
          </div>
          <p className="text-xs" style={{ color: '#666' }}>Biar kami kasih rekomendasi level yang pas — tidak terlalu gampang atau susah.</p>
        </div>

        <div className="px-6 pb-4 space-y-2.5">
          {levels.map((lv) => {
            const isSelected = selected === lv.id;
            return (
              <button
                key={lv.id}
                onClick={() => setSelected(lv.id)}
                className="w-full p-3.5 rounded-2xl text-left flex items-start gap-3"
                style={{
                  background: isSelected ? 'rgba(10,77,60,0.08)' : 'white',
                  border: `2px solid ${isSelected ? '#0a4d3c' : 'rgba(10,77,60,0.12)'}`,
                }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: isSelected ? '#0a4d3c' : 'rgba(10,77,60,0.08)' }}>
                  {lv.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm leading-tight" style={{ color: '#1a1a1a' }}>{lv.label}</p>
                  <p className="text-[11px] mt-0.5 leading-snug" style={{ color: '#666' }}>{lv.desc}</p>
                  {isSelected && (
                    <p className="text-[11px] mt-1.5 font-semibold" style={{ color: '#0a4d3c' }}>
                      ✨ {lv.rec}
                    </p>
                  )}
                </div>
                {isSelected && <Check size={18} style={{ color: '#0a4d3c' }} className="flex-shrink-0 mt-0.5" />}
              </button>
            );
          })}
        </div>

        <div className="px-6 pb-6 pt-2 space-y-2 sticky bottom-0" style={{ background: 'linear-gradient(0deg, #f3ebd9 60%, transparent 100%)' }}>
          <button
            onClick={() => selected && onSelect(selected)}
            disabled={!selected}
            className="w-full py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 disabled:opacity-40"
            style={{ background: '#0a4d3c', color: 'white' }}
          >
            Simpan & Lanjut <ArrowRight size={16} />
          </button>
          <button onClick={onSkip} className="w-full py-2.5 text-xs font-medium" style={{ color: '#8b6b3d' }}>
            Lewati (mulai dari pemula)
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// TOUR OVERLAY — 4-slide kenalan dengan tab utama Beranda/Belajar/Sosial/Profil.
// Muncul sekali setelah onboarding/login pertama. Reward: 50 XP + badge.
// ============================================================================
function TourOverlay({ onComplete, onSkip }) {
  const [slide, setSlide] = useState(0);
  const slides = [
    {
      icon: Home,
      title: 'Beranda',
      subtitle: 'Pusat aktivitas harianmu',
      desc: 'Di sini kamu lihat Tantangan Hari Ini, game personal yang sesuai minatmu, dan rekomendasi pelajaran.',
      color: '#0a4d3c',
      bg: 'linear-gradient(135deg, #0a4d3c, #1a6b56)',
    },
    {
      icon: BookOpen,
      title: 'Belajar',
      subtitle: 'Materi tersusun rapi',
      desc: 'Jalur lengkap dari Mubtadi (pemula) sampai Mahir. Pilih sesuai tujuanmu — Umrah, Profesi, atau Beasiswa.',
      color: '#0a4d3c',
      bg: 'linear-gradient(135deg, #1a6b56, #2e8869)',
    },
    {
      icon: Users,
      title: 'Sosial',
      subtitle: 'Belajar bareng komunitas',
      desc: 'Lihat pencapaian temanmu, ikut tantangan grup, dan rasakan semangat berjamaah dalam belajar.',
      color: '#c9a961',
      bg: 'linear-gradient(135deg, #c9a961, #d4b876)',
    },
    {
      icon: User,
      title: 'Profil',
      subtitle: 'Pantau progresmu',
      desc: 'Lacak XP, streak harian, achievement, dan atur pengaturan akun. Semakin konsisten, semakin terlihat hasilnya.',
      color: '#8b6b3d',
      bg: 'linear-gradient(135deg, #8b6b3d, #a87f47)',
    },
  ];

  const current = slides[slide];
  const Icon = current.icon;
  const isLast = slide === slides.length - 1;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: 'rgba(10,30,25,0.85)' }}>
      <div className="w-full max-w-md rounded-3xl shadow-2xl overflow-hidden" style={{ background: 'linear-gradient(180deg, #faf6ee 0%, #f3ebd9 100%)' }}>
        {/* Header: progress dots + skip */}
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <div
                key={i}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === slide ? '24px' : '8px',
                  background: i === slide ? '#0a4d3c' : 'rgba(10,77,60,0.2)',
                }}
              />
            ))}
          </div>
          <button onClick={onSkip} className="text-xs font-medium px-2 py-1" style={{ color: '#8b6b3d' }}>
            Lewati
          </button>
        </div>

        {/* Slide content */}
        <div className="px-7 py-6 text-center">
          <div className="relative mx-auto mb-5" style={{ width: '88px', height: '88px' }}>
            <div className="absolute inset-0 blur-2xl opacity-50" style={{ background: current.color, borderRadius: '50%' }} />
            <div className="relative w-full h-full rounded-2xl flex items-center justify-center" style={{ background: current.bg }}>
              <Icon size={40} color="white" strokeWidth={2.2} />
            </div>
          </div>
          <p className="text-[10px] tracking-[0.3em] uppercase font-bold mb-1.5" style={{ color: current.color }}>Tab {slide + 1} / {slides.length}</p>
          <h2 className="text-3xl leading-tight mb-1" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: '#0a4d3c' }}>
            {current.title}
          </h2>
          <p className="text-sm font-semibold mb-3" style={{ color: current.color }}>
            {current.subtitle}
          </p>
          <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: '#3d2817' }}>
            {current.desc}
          </p>
        </div>

        {/* Footer: navigation */}
        <div className="px-5 pb-5 pt-2 flex items-center gap-3">
          {slide > 0 && (
            <button
              onClick={() => setSlide((s) => s - 1)}
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(10,77,60,0.08)' }}
            >
              <ArrowLeft size={18} style={{ color: '#0a4d3c' }} />
            </button>
          )}
          <button
            onClick={() => (isLast ? onComplete() : setSlide((s) => s + 1))}
            className="flex-1 py-3.5 rounded-2xl text-white font-semibold flex items-center justify-center gap-2"
            style={{ background: '#0a4d3c' }}
          >
            {isLast ? (
              <>
                Selesai · +50 XP <Sparkles size={16} />
              </>
            ) : (
              <>
                Lanjut <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SHARE MODAL — multi-platform: WhatsApp, Facebook, Twitter/X, Telegram,
// Instagram (copy + redirect), Copy link, + Web Share API native fallback.
// Tujuan: makin banyak yang tahu Tulis Noon via berbagai channel sosmed.
// ============================================================================
function ShareModal({ achievement, onClose }) {
  const [copied, setCopied] = useState(false);
  const [igCopied, setIgCopied] = useState(false);

  const appUrl = 'https://tulis-noon.vercel.app';
  const shareText = `Saya baru dapat GOLD ⭐ di Tantangan ${achievement.scenarioName} ${achievement.scenarioEmoji} Level ${achievement.level} di Tulis Noon! 🏆\nSkor: ${achievement.score}/${achievement.total} · +${achievement.xpEarned} XP\n\nYuk belajar bahasa Arab bareng untuk Umrah & Haji:`;
  const fullShareText = `${shareText} ${appUrl}`;
  const shareTitle = `GOLD ⭐ di Tulis Noon — ${achievement.scenarioName} Level ${achievement.level}`;

  // Native Web Share API — buka share sheet device (iOS/Android punya banyak app)
  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: appUrl,
        });
      } catch (err) {
        // User cancel — gak masalah, biarin aja
        console.log('Native share cancelled:', err?.message);
      }
    }
  };

  // Per-platform share URLs
  const openWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(fullShareText)}`, '_blank');
  };

  const openFacebook = () => {
    // FB sharer butuh u (url) + quote (caption). Caption ga selalu muncul di mobile.
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}&quote=${encodeURIComponent(shareText)}`,
      '_blank',
      'width=600,height=600'
    );
  };

  const openTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(appUrl)}`,
      '_blank',
      'width=600,height=600'
    );
  };

  const openTelegram = () => {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(appUrl)}&text=${encodeURIComponent(shareText)}`,
      '_blank'
    );
  };

  // Instagram ga punya direct share URL (privacy reason). Workaround:
  // copy text ke clipboard + arahin user buka IG manual.
  const openInstagram = async () => {
    try {
      await navigator.clipboard.writeText(fullShareText);
      setIgCopied(true);
      setTimeout(() => setIgCopied(false), 2500);
      // Coba buka IG app via deep link (kalau install) atau web
      setTimeout(() => {
        window.open('https://www.instagram.com/', '_blank');
      }, 500);
    } catch (e) {
      console.error('IG share clipboard error:', e);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullShareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Copy error:', e);
    }
  };

  // Daftar platform — disusun by popularitas di Indonesia (jamaah umrah)
  const platforms = [
    {
      id: 'wa',
      label: 'WhatsApp',
      bg: '#25D366',
      iconType: 'emoji',
      icon: '💬',
      onClick: openWhatsApp,
    },
    {
      id: 'ig',
      label: igCopied ? 'Disalin!' : 'Instagram',
      bg: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
      iconType: 'lucide',
      icon: Instagram,
      onClick: openInstagram,
    },
    {
      id: 'fb',
      label: 'Facebook',
      bg: '#1877F2',
      iconType: 'lucide',
      icon: Facebook,
      onClick: openFacebook,
    },
    {
      id: 'tw',
      label: 'X (Twitter)',
      bg: '#000000',
      iconType: 'lucide',
      icon: Twitter,
      onClick: openTwitter,
    },
    {
      id: 'tg',
      label: 'Telegram',
      bg: '#0088cc',
      iconType: 'emoji',
      icon: '✈️',
      onClick: openTelegram,
    },
    {
      id: 'copy',
      label: copied ? 'Tersalin!' : 'Salin Link',
      bg: copied ? '#0a4d3c' : '#6b6b6b',
      iconType: 'lucide',
      icon: copied ? Check : Copy,
      onClick: handleCopy,
    },
  ];

  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: 'rgba(10,30,25,0.8)' }} onClick={onClose}>
      <div
        className="w-full max-w-md max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl"
        style={{ background: 'linear-gradient(180deg, #faf6ee 0%, #f3ebd9 100%)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-3">
          <div className="flex-1">
            <p className="text-[10px] tracking-[0.25em] uppercase font-bold mb-1" style={{ color: '#c9a961' }}>Pamerin pencapaianmu</p>
            <h2 className="text-2xl leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: '#0a4d3c' }}>
              Bagikan ke teman 🎉
            </h2>
            <p className="text-xs mt-1" style={{ color: '#666' }}>Pilih platform — ajak temanmu belajar bareng.</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(10,77,60,0.08)' }}
            aria-label="Tutup"
          >
            <X size={16} style={{ color: '#0a4d3c' }} />
          </button>
        </div>

        {/* Preview kartu pencapaian */}
        <div className="mx-6 mb-4 p-3 rounded-2xl flex items-center gap-3" style={{ background: 'white', border: '1.5px dashed #c9a961' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: 'linear-gradient(135deg, #c9a961, #d4b876)' }}>
            🏆
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold" style={{ color: '#c9a961' }}>GOLD ⭐</p>
            <p className="text-sm font-semibold leading-tight" style={{ color: '#0a4d3c' }}>
              {achievement.scenarioEmoji} {achievement.scenarioName} · Level {achievement.level}
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#8b6b3d' }}>
              Skor {achievement.score}/{achievement.total} · +{achievement.xpEarned} XP
            </p>
          </div>
        </div>

        {/* Grid platform buttons */}
        <div className="px-6 pb-4">
          <div className="grid grid-cols-3 gap-3">
            {platforms.map((p) => {
              const IconComponent = p.iconType === 'lucide' ? p.icon : null;
              return (
                <button
                  key={p.id}
                  onClick={p.onClick}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-transform active:scale-95"
                  style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.1)' }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md"
                    style={{ background: p.bg }}
                  >
                    {p.iconType === 'lucide' ? (
                      <IconComponent size={22} color="white" strokeWidth={2.2} />
                    ) : (
                      <span style={{ fontSize: '22px' }}>{p.icon}</span>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-center leading-tight" style={{ color: '#3d2817' }}>
                    {p.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Native share API fallback — kalau device support, kasih opsi tambahan */}
          {hasNativeShare && (
            <button
              onClick={handleNativeShare}
              className="w-full mt-4 py-3 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold"
              style={{ background: 'rgba(10,77,60,0.08)', color: '#0a4d3c' }}
            >
              <Share2 size={15} /> Bagikan ke aplikasi lain
            </button>
          )}

          {/* Hint kalau Instagram di-click (clipboard copied) */}
          {igCopied && (
            <div className="mt-3 p-3 rounded-xl text-xs flex items-start gap-2" style={{ background: 'rgba(220,39,67,0.08)', border: '1px solid rgba(220,39,67,0.2)' }}>
              <Sparkles size={14} style={{ color: '#dc2743' }} className="mt-0.5 flex-shrink-0" />
              <p style={{ color: '#7a3d2a' }}>
                Teks pencapaianmu sudah <strong>disalin</strong>. Buka Instagram → buat Story baru → tempel teksnya. 📸
              </p>
            </div>
          )}
        </div>

        {/* Footer dakwah note */}
        <div className="px-6 pb-6 pt-2">
          <p className="text-[11px] text-center leading-relaxed italic" style={{ color: '#8b6b3d' }}>
            "Sebaik-baik manusia adalah yang paling bermanfaat bagi sesama" — HR. Ahmad
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ROLEPLAY LIST SCREEN — pilih 1 dari 3 scenario AI Roleplay.
// Tampilkan badge "Bayar API" sebagai peringatan halus (kalau ada cost concern).
// ============================================================================
function RoleplayListScreen({ onBack, onHome, onSelectScenario }) {
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
          <p className="text-xs tracking-widest uppercase" style={{ color: '#8b6b3d' }}>Latihan Ngobrol</p>
          <h2 className="text-xl font-semibold" style={{ color: '#0a4d3c', fontFamily: 'Fraunces, serif' }}>
            Ngobrol sama orang Saudi
          </h2>
        </div>
      </div>

      {/* Hero card */}
      <div className="rounded-3xl p-5 mb-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)' }}>
        <div className="absolute -right-6 -top-4 text-7xl opacity-15">🎙️</div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-white opacity-80 mb-1">Sebelum berangkat</p>
        <h3 className="text-xl text-white mb-2 leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700 }}>
          Latihan ngomong dulu yuk
        </h3>
        <p className="text-sm text-white opacity-95 leading-relaxed mb-3">
          AI akan jadi pedagang, polisi, atau barista Saudi. Kamu latihan ngobrol sama mereka — biar pas sampai Tanah Suci udah pede ngomong bahasa Arab.
        </p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: 'rgba(201,169,97,0.3)' }}>
            <Sparkles size={11} color="#c9a961" />
            <span className="text-xs font-bold text-white">Powered by Claude</span>
          </div>
        </div>
      </div>

      {/* Scenario list */}
      <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#8b6b3d' }}>Pilih Skenario</p>
      <div className="space-y-3 mb-4">
        {ROLEPLAY_SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelectScenario(s)}
            className="w-full p-4 rounded-2xl text-left flex items-center gap-3 active:scale-[0.98] transition-transform"
            style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.1)' }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: s.bgGradient }}
            >
              {s.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-semibold text-base leading-tight" style={{ color: s.color }}>{s.title}</p>
              </div>
              <p className="text-xs leading-snug mb-1.5" style={{ color: '#666' }}>{s.description}</p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: `${s.color}15`, color: s.color }}>
                  {s.difficulty}
                </span>
                <span className="text-[10px]" style={{ color: '#c9a961' }}>
                  ⭐ Max +{s.xpReward} XP
                </span>
              </div>
            </div>
            <ChevronRight size={18} style={{ color: '#c9a961' }} className="flex-shrink-0" />
          </button>
        ))}
      </div>

      {/* Info card: how it works */}
      <div className="rounded-2xl p-3 mt-2" style={{ background: 'rgba(201,169,97,0.1)', border: '1px dashed #c9a961' }}>
        <p className="text-[10px] tracking-widest uppercase font-bold mb-2" style={{ color: '#c9a961' }}>Cara mainnya gampang</p>
        <ul className="text-xs space-y-1.5" style={{ color: '#8b6b3d' }}>
          <li>• Pilih situasi → tap Mulai → AI langsung ngajak ngobrol</li>
          <li>• Balas pakai bahasa Indonesia atau Arab — sama-sama paham</li>
          <li>• Bingung mau jawab apa? Tap lampu 💡 buat dikasih contoh kalimat</li>
          <li>• Selesai ngobrol → dapet nilai + vocab baru yang kamu kuasai</li>
        </ul>
      </div>
    </div>
  );
}
