'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Volume2, Mic, Check, X, Sparkles, Lock, MapPin, Briefcase, GraduationCap, Trophy, Flame, Star, Home, BookOpen, Users, User, Heart, Share2, Send, Play, Image as ImageIcon, MessageCircle, Calendar, Target, Zap, ChevronRight, Bot, Video, Clock, Award, UserCheck, Coffee, Music, Film, Gamepad2, Heart as HeartIcon, Mountain } from 'lucide-react';

export default function TulisNoonApp() {
  const [screen, setScreen] = useState('welcome');
  const [tab, setTab] = useState('home');
  const [selectedPath, setSelectedPath] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedGuru, setSelectedGuru] = useState(null);
  const [progress, setProgress] = useState({ umrah: 1, profesi: 0, beasiswa: 0 });
  const [xp, setXp] = useState(45);
  const [streak, setStreak] = useState(3);
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

  const tabScreens = ['home', 'belajar', 'sosial', 'profil'];

  return (
    <div className="min-h-screen w-full" style={{ background: 'linear-gradient(180deg, #faf6ee 0%, #f3ebd9 100%)', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700;9..144,900&family=DM+Sans:wght@400;500;600;700&family=Amiri:wght@400;700&family=Reem+Kufi:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Background pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cpath d='M40 0L80 40L40 80L0 40Z' fill='none' stroke='%230a4d3c' stroke-width='1'/%3E%3C/svg%3E")`,
      }}/>

      <div className="relative max-w-md mx-auto min-h-screen flex flex-col">
        {screen === 'welcome' && <WelcomeScreen onComplete={(profile) => { setUserName(profile.name); setUserProfile(p => ({...p, ...profile})); setScreen('main'); }} />}

        {screen === 'main' && (
          <>
            <div className="flex-1 pb-20">
              {tab === 'home' && <HomeTab userName={userName} userProfile={userProfile} xp={xp} streak={streak} onOpenLesson={() => { setSelectedPath({id:'umrah', title:'Wisatawan & Jamaah Umrah'}); setScreen('lessons'); }} onOpenGame={(g) => { setSelectedGame(g); setScreen('game'); }} onOpenChallenge={() => setScreen('challenge')} onOpenGuru={() => setScreen('guru')} achievements={achievements} />}
              {tab === 'belajar' && <BelajarTab onSelectPath={(p) => { setSelectedPath(p); setScreen('lessons'); }} onOpenGuru={() => setScreen('guru')} progress={progress} />}
              {tab === 'sosial' && <SosialTab achievements={achievements} userName={userName} />}
              {tab === 'profil' && <ProfilTab userName={userName} userProfile={userProfile} xp={xp} streak={streak} progress={progress} onOpenPremium={() => setScreen('premium')} />}
            </div>
            <BottomNav active={tab} onChange={setTab} />
          </>
        )}

        {screen === 'lessons' && <LessonsScreen path={selectedPath} onBack={() => setScreen('main')} onSelectLesson={(l) => { setSelectedLesson(l); setScreen('lesson'); }} progress={progress[selectedPath?.id] || 0} />}
        {screen === 'lesson' && <LessonScreen lesson={selectedLesson} onBack={() => setScreen('lessons')} onComplete={(earned) => {
          setProgress(p => ({...p, [selectedPath.id]: (p[selectedPath.id] || 0) + 1}));
          setXp(x => x + earned);
          setAchievements(a => [{ id: Date.now(), type:'lesson', text:`Selesai: ${selectedLesson?.title}`, emoji:'✅', time:'baru saja', user: userName || 'Anda' }, ...a]);
          setScreen('lessons');
        }} />}
        {screen === 'game' && <GameScreen game={selectedGame} onBack={() => setScreen('main')} onComplete={(earned) => {
          setXp(x => x + earned);
          setScreen('main');
        }} />}
        {screen === 'challenge' && <ChallengeScreen onBack={() => setScreen('main')} onShare={(text) => {
          setAchievements(a => [{ id: Date.now(), type:'challenge', text:text, emoji:'⚡', time:'baru saja', user: userName || 'Anda' }, ...a]);
          setScreen('main');
        }} />}
        {screen === 'guru' && <GuruScreen onBack={() => setScreen('main')} onSelectGuru={(g) => { setSelectedGuru(g); setScreen('guru-detail'); }} />}
        {screen === 'guru-detail' && <GuruDetailScreen guru={selectedGuru} onBack={() => setScreen('guru')} />}
        {screen === 'premium' && <PremiumScreen onBack={() => setScreen('main')} userProfile={userProfile} onSubmit={(motivData) => {
          setUserProfile(p => ({...p, ...motivData}));
          setScreen('main');
        }} />}
      </div>
    </div>
  );
}

// ============ WELCOME / ONBOARDING ============
function WelcomeScreen({ onComplete }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    name: '',
    interests: [],
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
        <OnboardHeader stepNum={1} totalSteps={5} onBack={() => setStep(0)} />
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
        <OnboardHeader stepNum={2} totalSteps={5} onBack={() => setStep(1)} />
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
        <OnboardHeader stepNum={3} totalSteps={5} onBack={() => setStep(2)} />
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
        <OnboardHeader stepNum={4} totalSteps={5} onBack={() => setStep(3)} />
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
        <OnboardHeader stepNum={5} totalSteps={5} onBack={() => setStep(4)} />
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

  // Step 6: Summary / Welcome
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
function HomeTab({ userName, userProfile, xp, streak, onOpenLesson, onOpenGame, onOpenChallenge, onOpenGuru, achievements }) {
  // Personalized greeting based on interests
  const personalizedNote = userProfile?.interests?.includes('religion')
    ? 'Mari belajar bahasa Al-Quran hari ini'
    : userProfile?.interests?.includes('travel')
    ? 'Siapkan dirimu untuk perjalanan ke Arab'
    : 'Senang melihatmu lagi';

  return (
    <div className="px-5 py-6">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm" style={{ color: '#8b6b3d' }}>Marhaban,</p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: 'rgba(201,169,97,0.2)' }}>
            <Flame size={12} style={{ color: '#c9a961' }} />
            <span className="text-xs font-bold" style={{ color: '#8b6b3d' }}>{streak}</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: 'rgba(10,77,60,0.1)' }}>
            <Star size={12} style={{ color: '#0a4d3c' }} fill="#0a4d3c" />
            <span className="text-xs font-bold" style={{ color: '#0a4d3c' }}>{xp}</span>
          </div>
        </div>
      </div>
      <h1 className="text-2xl mb-1" style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: '#0a4d3c' }}>
        {userName || 'Sahabat'} 👋
      </h1>
      <p className="text-sm mb-6" style={{ color: '#8b6b3d' }}>{personalizedNote}</p>

      {/* Daily Challenge Card */}
      <button onClick={onOpenChallenge} className="w-full text-left rounded-2xl p-5 mb-5 relative overflow-hidden active:scale-[0.98] transition-transform" style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)' }}>
        <div className="absolute -right-6 -top-6 text-8xl opacity-15" style={{ fontFamily: 'Amiri, serif', color: '#c9a961' }}>ن</div>
        <div className="flex items-center gap-2 mb-2">
          <Zap size={16} color="#c9a961" />
          <p className="text-xs tracking-widest uppercase text-white opacity-90">Tantangan Hari Ini</p>
        </div>
        <h3 className="text-xl text-white mb-1" style={{ fontFamily: 'Fraunces, serif', fontWeight: 600 }}>Pasar Madinah</h3>
        <p className="text-sm text-white opacity-80 mb-3">5 frasa belanja · 2 menit · +30 XP</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-1">
              {['#c9a961','#d4b876','#e8c885'].map((c,i)=>(<div key={i} className="w-5 h-5 rounded-full border-2" style={{background:c,borderColor:'#0a4d3c'}}/>))}
            </div>
            <span className="text-xs text-white opacity-80">142 user sudah ikut</span>
          </div>
          <span className="text-sm font-semibold text-white flex items-center gap-1">Mulai <ChevronRight size={14}/></span>
        </div>
      </button>

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

      {/* Quick Games */}
      <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#8b6b3d' }}>Game Cepat</p>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { id:'image-quiz', t:'Tebak Gambar', d:'Visual', icon:ImageIcon, color:'#0a4d3c', bg:'rgba(10,77,60,0.1)' },
          { id:'video-quiz', t:'Quiz Video', d:'Skenario', icon:Play, color:'#7a3d2a', bg:'rgba(122,61,42,0.1)' },
          { id:'chat-roleplay', t:'AI Roleplay', d:'Ngobrol', icon:Bot, color:'#8b6b3d', bg:'rgba(139,107,61,0.15)' },
          { id:'story', t:'Cerita', d:'Interaktif', icon:BookOpen, color:'#0a4d3c', bg:'rgba(10,77,60,0.1)' },
        ].map((g,i) => {
          const Icon = g.icon;
          return (
            <button key={i} onClick={() => onOpenGame(g)} className="p-4 rounded-2xl text-left active:scale-[0.98] transition-transform" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.08)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: g.bg }}>
                <Icon size={18} style={{ color: g.color }} />
              </div>
              <p className="font-semibold text-sm" style={{ color: '#1a1a1a' }}>{g.t}</p>
              <p className="text-xs" style={{ color: '#666' }}>{g.d}</p>
            </button>
          );
        })}
      </div>

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
    { id: 'profesi', title: 'Profesional & Bisnis', arabic: 'للمهنيين', desc: 'Komunikasi kerja & rapat', icon: Briefcase, color: '#8b6b3d', lessons: 6, available: false },
    { id: 'beasiswa', title: 'Pelajar Beasiswa', arabic: 'للطلاب', desc: 'Bahasa akademik & kampus', icon: GraduationCap, color: '#7a3d2a', lessons: 10, available: false },
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
        <p className="text-sm" style={{ color: '#7a3d2a' }}>Modul lain akan terbuka di versi penuh</p>
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
function BottomNav({ active, onChange }) {
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
            <button key={t.id} onClick={() => onChange(t.id)} className="flex flex-col items-center justify-center py-2 px-1">
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
          const isLocked = idx > progress + 1;
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
function ChallengeScreen({ onBack, onShare }) {
  const [stage, setStage] = useState('intro'); // intro, playing, complete
  const [q, setQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);

  const questions = [
    { ar: 'كَمِ السِّعْر؟', options: ['Apa namamu', 'Berapa harganya', 'Di mana hotel', 'Selamat datang'], correct: 1 },
    { ar: 'أَيْنَ الْحَمَّام؟', options: ['Di mana toilet', 'Berapa jam', 'Saya lapar', 'Terima kasih'], correct: 0 },
    { ar: 'هَذَا غَالِي', options: ['Ini murah', 'Ini bagus', 'Ini mahal', 'Ini lezat'], correct: 2 },
    { ar: 'مِنْ فَضْلِكَ', options: ['Maaf', 'Tolong/Silakan', 'Selamat tinggal', 'Saya tidak tahu'], correct: 1 },
    { ar: 'لَا أَفْهَم', options: ['Saya mengerti', 'Saya lapar', 'Saya tidak mengerti', 'Saya capek'], correct: 2 },
  ];

  useEffect(() => {
    if (stage !== 'playing') return;
    if (timeLeft === 0) { handleAnswer(-1); return; }
    const t = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, stage]);

  const handleAnswer = (idx) => {
    setSelected(idx);
    if (idx === questions[q].correct) setScore(s => s+1);
    setTimeout(() => {
      if (q === questions.length - 1) setStage('complete');
      else { setQ(q+1); setSelected(null); setTimeLeft(10); }
    }, 1000);
  };

  if (stage === 'intro') {
    return (
      <div className="flex-1 flex flex-col px-5 py-6">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center mb-6" style={{ background: 'rgba(10,77,60,0.08)' }}><ArrowLeft size={18} style={{ color: '#0a4d3c' }} /></button>

        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 blur-3xl opacity-40" style={{ background: '#c9a961', borderRadius: '50%' }} />
            <div className="relative w-24 h-24 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)' }}>
              <Zap size={40} color="#c9a961" />
            </div>
          </div>
          <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: '#c9a961' }}>Tantangan Hari Ini</p>
          <h2 className="text-3xl mb-3" style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: '#0a4d3c' }}>Pasar Madinah</h2>
          <p className="text-base mb-6 max-w-xs" style={{ color: '#3d2817' }}>5 pertanyaan kilat. 10 detik per soal. Tunjukkan kecepatanmu!</p>

          <div className="space-y-2 w-full max-w-xs mb-8">
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'white' }}>
              <Target size={16} style={{ color: '#0a4d3c' }} />
              <span className="text-sm" style={{ color: '#1a1a1a' }}>5 soal pilihan ganda</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'white' }}>
              <Calendar size={16} style={{ color: '#0a4d3c' }} />
              <span className="text-sm" style={{ color: '#1a1a1a' }}>+30 XP, naik streak</span>
            </div>
          </div>
        </div>

        <button onClick={() => setStage('playing')} className="w-full py-4 rounded-2xl text-white font-medium flex items-center justify-center gap-2" style={{ background: '#0a4d3c' }}>
          Mulai Tantangan <Zap size={18} />
        </button>
      </div>
    );
  }

  if (stage === 'complete') {
    const xp = score * 6 + (score === questions.length ? 10 : 0);
    return (
      <div className="flex-1 flex flex-col px-5 py-6 items-center justify-center text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 blur-3xl opacity-40" style={{ background: '#c9a961', borderRadius: '50%' }} />
          <div className="relative w-28 h-28 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #c9a961, #d4b876)' }}>
            <Trophy size={48} color="white" />
          </div>
        </div>
        <h2 className="text-3xl mb-2" style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: '#0a4d3c' }}>Tantangan Selesai!</h2>
        <p className="text-base mb-1" style={{ color: '#3d2817' }}>Skor: {score}/{questions.length}</p>
        <div className="flex items-center gap-2 mt-3 mb-6 px-5 py-2 rounded-full" style={{ background: 'rgba(201,169,97,0.2)' }}>
          <Star size={16} style={{ color: '#c9a961' }} fill="#c9a961" />
          <span className="text-sm font-semibold" style={{ color: '#8b6b3d' }}>+{xp} XP</span>
        </div>

        <div className="w-full max-w-xs space-y-2">
          <button onClick={() => {
            const text = `Tantangan Pasar Madinah selesai dengan skor ${score}/${questions.length}`;
            onShare(text);
            // Try open WA share
            const waText = encodeURIComponent(`Saya baru selesai Tantangan Pasar Madinah di Tulis Noon! 🎉\nSkor: ${score}/${questions.length}\n\nYuk belajar bahasa Arab bareng: [link aplikasi]`);
            window.open(`https://wa.me/?text=${waText}`, '_blank');
          }} className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 text-white font-medium" style={{ background: '#25D366' }}>
            <Share2 size={16} /> Bagikan ke WhatsApp
          </button>
          <button onClick={() => onShare(`Selesai tantangan dengan skor ${score}/${questions.length}`)} className="w-full py-3 rounded-2xl font-medium" style={{ background: '#0a4d3c', color: 'white' }}>
            Posting ke Feed
          </button>
          <button onClick={onBack} className="w-full py-3 rounded-2xl text-sm" style={{ color: '#8b6b3d' }}>
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  // playing
  const current = questions[q];
  return (
    <div className="flex-1 flex flex-col px-5 py-5">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(10,77,60,0.1)' }}>
          <div className="h-full transition-all" style={{ width: `${((q+1)/questions.length)*100}%`, background: '#0a4d3c' }} />
        </div>
        <span className="text-xs font-semibold" style={{ color: '#0a4d3c' }}>{q+1}/{questions.length}</span>
      </div>

      <div className="flex items-center justify-center mb-6">
        <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: timeLeft <= 3 ? 'rgba(201,169,97,0.2)' : 'rgba(10,77,60,0.08)' }}>
          <span className="text-3xl font-bold" style={{ color: timeLeft <= 3 ? '#c9a961' : '#0a4d3c', fontFamily: 'Fraunces, serif' }}>{timeLeft}</span>
        </div>
      </div>

      <p className="text-xs tracking-widest uppercase mb-3 text-center" style={{ color: '#8b6b3d' }}>Apa artinya?</p>
      <div className="rounded-3xl p-8 mb-6 text-center" style={{ background: 'white', boxShadow: '0 10px 40px -10px rgba(10,77,60,0.2)' }}>
        <p className="text-4xl" style={{ fontFamily: 'Amiri, serif', color: '#0a4d3c' }}>{current.ar}</p>
      </div>

      <div className="space-y-2">
        {current.options.map((opt, idx) => {
          let bg = 'white', border = 'rgba(10,77,60,0.15)';
          if (selected !== null) {
            if (idx === current.correct) { bg = 'rgba(10,77,60,0.08)'; border = '#0a4d3c'; }
            else if (idx === selected) { bg = 'rgba(201,169,97,0.15)'; border = '#c9a961'; }
          }
          return (
            <button key={idx} onClick={() => selected === null && handleAnswer(idx)} className="w-full p-4 rounded-2xl text-left" style={{ background: bg, border: `2px solid ${border}`, color: '#1a1a1a' }}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
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
