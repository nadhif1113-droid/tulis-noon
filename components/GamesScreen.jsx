// components/GamesScreen.jsx
// Hub semua game & latihan — diakses dari Home via 1 button.
// Tujuan: declutter Beranda. Semua game di-grup di 1 tempat.
//
// Game yang tersedia:
//   - Tebak Gambar (visual vocab)
//   - Quiz Video (coming soon)
//   - Latihan Ngobrol (AI roleplay)
//   - Tulis Arab (huruf hijaiyah)
//   - Belajar Ngomong (TTS+STT)
//   - Cerita Interaktif

'use client';

import { ArrowLeft, Home, Bot, BookOpen, Mic, Image as ImageIcon, Play, Sparkles } from 'lucide-react';

const ALL_GAMES = [
  {
    id: 'image-quiz', t: 'Tebak Gambar', d: 'Visual vocab quiz',
    icon: ImageIcon, color: '#0a4d3c', bg: 'rgba(10,77,60,0.1)',
    longDesc: '200 kosakata Arab dgn gambar AI — 10 kategori (makanan, tempat, profesi, dll).',
    interests: ['food', 'travel', 'family', 'sports'],
    personalizedDesc: {
      food: 'Tebak makanan Arab', travel: 'Tebak tempat-tempat',
      family: 'Tebak benda keluarga', sports: 'Tebak olahraga',
    },
  },
  {
    id: 'video-quiz', t: 'Quiz Video', d: 'Skenario video',
    icon: Play, color: '#7a3d2a', bg: 'rgba(122,61,42,0.1)',
    comingSoon: true,
    longDesc: 'Soon — tonton scene mini, jawab kuis berdasarkan situasi.',
    interests: ['travel', 'business', 'religion', 'family'],
    personalizedDesc: { travel: 'Segera hadir', business: 'Segera hadir', religion: 'Segera hadir', family: 'Segera hadir' },
  },
  {
    id: 'chat-roleplay', t: 'Latihan Ngobrol', d: 'AI roleplay',
    icon: Bot, color: '#8b6b3d', bg: 'rgba(139,107,61,0.15)',
    longDesc: 'Ngobrol bareng AI dalam scenario nyata (jamaah, kantor, keluarga).',
    interests: ['religion', 'business', 'family', 'travel'],
    personalizedDesc: {
      religion: 'Ngobrol dgn ustadz', business: 'Ngobrol kerja',
      family: 'Ngobrol keluarga', travel: 'Ngobrol jamaah',
    },
  },
  {
    id: 'tulis-arab', t: 'Tulis Arab', d: 'Baca-tulis hijaiyah',
    icon: BookOpen, color: '#0a4d3c', bg: 'rgba(10,77,60,0.1)',
    longDesc: 'Latihan baca-tulis huruf Arab dari nol sampai lancar.',
    interests: ['religion', 'family', 'history', 'tech'],
    personalizedDesc: {
      religion: 'Baca Quran lancar', family: 'Bisa nulis nama',
      history: 'Huruf hijaiyah', tech: 'Belajar dari nol',
    },
  },
  {
    id: 'ngomong', t: 'Belajar Ngomong', d: 'Latihan pengucapan',
    icon: Mic, color: '#a05536', bg: 'rgba(160,85,54,0.12)',
    longDesc: 'Ucapkan kalimat Arab, AI nilai pengucapan-mu real-time.',
    interests: ['travel', 'religion', 'business', 'family'],
    personalizedDesc: {
      travel: 'Ucapkan barang umrah', religion: 'Latih lidah bicara Arab',
      business: 'Ngomong nama barang', family: 'Sebut benda sehari-hari',
    },
  },
  {
    id: 'story', t: 'Cerita Interaktif', d: 'Sejarah & kisah',
    icon: BookOpen, color: '#0a4d3c', bg: 'rgba(10,77,60,0.1)',
    longDesc: '21 cerita: sejarah Islam, kisah sahabat, hadis pendek dlm Arab.',
    interests: ['history', 'movies', 'religion', 'family'],
    personalizedDesc: {
      history: 'Sejarah Islam', movies: 'Cerita seru',
      religion: 'Kisah sahabat', family: 'Cerita keluarga',
    },
  },
];

export default function GamesScreen({ userProfile, onBack, onHome, onOpenGame }) {
  const userInterests = userProfile?.interests || [];

  // Hitung match score berdasarkan minat user
  const scored = ALL_GAMES.map((g) => {
    const matched = g.interests.filter((i) => userInterests.includes(i));
    const personalDesc = matched.length > 0 ? g.personalizedDesc[matched[0]] : g.d;
    return { ...g, score: matched.length, displayDesc: personalDesc };
  });

  scored.sort((a, b) => b.score - a.score);
  const topMatchScore = scored[0]?.score || 0;
  const hasPersonalization = topMatchScore > 0;

  return (
    <div className="flex-1 overflow-y-auto" style={{ height: '100%' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 sticky top-0 z-10" style={{ background: '#faf6ee', borderBottom: '1px solid rgba(10,77,60,0.08)' }}>
        <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <ArrowLeft size={17} style={{ color: '#0a4d3c' }} />
        </button>
        <div className="flex-1">
          <p className="text-[10px] tracking-[0.2em] uppercase" style={{ color: '#8b6b3d' }}>Game & Latihan</p>
          <h1 className="text-lg font-bold" style={{ fontFamily: 'Fraunces, serif', color: '#0a4d3c' }}>Semua Permainan</h1>
        </div>
        <button onClick={onHome} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <Home size={16} style={{ color: '#0a4d3c' }} />
        </button>
      </div>

      <div className="px-5 py-4">
        {/* HERO */}
        <div className="rounded-3xl p-5 mb-5 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a4d3c 0%, #1a6b56 100%)' }}>
          <div className="absolute -right-4 -top-2 text-7xl opacity-15">🎮</div>
          <div className="relative">
            <p className="text-[10px] tracking-[0.3em] uppercase mb-1 font-bold" style={{ color: '#c9a961' }}>MAIN SAMBIL BELAJAR</p>
            <h2 className="text-xl text-white mb-2 leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700 }}>
              6 Permainan Edukatif
            </h2>
            <p className="text-xs text-white opacity-90 leading-relaxed">
              Latihan menyenangkan untuk vocabulary, baca-tulis, bicara, dan pemahaman. Konsisten 10 menit/hari lebih efektif dari 1 jam seminggu.
            </p>
          </div>
        </div>

        {/* Section title */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs tracking-widest uppercase" style={{ color: '#8b6b3d' }}>
            {hasPersonalization ? 'Direkomendasikan untukmu' : 'Daftar Game'}
          </p>
          {hasPersonalization && (
            <span className="text-xs flex items-center gap-1" style={{ color: '#c9a961' }}>
              <Sparkles size={11} /> Berdasarkan minatmu
            </span>
          )}
        </div>

        {/* Grid game cards */}
        <div className="grid grid-cols-2 gap-3">
          {scored.map((g) => {
            const Icon = g.icon;
            const isTopMatch = hasPersonalization && g.score === topMatchScore && !g.comingSoon;
            const isComingSoon = !!g.comingSoon;
            return (
              <button
                key={g.id}
                onClick={() => !isComingSoon && onOpenGame(g)}
                disabled={isComingSoon}
                className="p-4 rounded-2xl text-left active:scale-[0.98] transition-transform relative disabled:cursor-default"
                style={{
                  background: isComingSoon ? 'rgba(10,77,60,0.04)' : 'white',
                  border: isComingSoon
                    ? '1px dashed rgba(10,77,60,0.2)'
                    : isTopMatch
                    ? '1.5px solid rgba(201,169,97,0.6)'
                    : '1px solid rgba(10,77,60,0.08)',
                  boxShadow: isTopMatch ? '0 4px 16px -8px rgba(201,169,97,0.5)' : 'none',
                  opacity: isComingSoon ? 0.75 : 1,
                }}
              >
                {isTopMatch && (
                  <span className="absolute -top-2 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: '#c9a961', color: 'white' }}>
                    ✨ Untukmu
                  </span>
                )}
                {isComingSoon && (
                  <span className="absolute -top-2 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide" style={{ background: 'rgba(201,169,97,0.25)', color: '#a05536' }}>
                    🔒 SOON
                  </span>
                )}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: isComingSoon ? 'rgba(10,77,60,0.06)' : g.bg }}>
                  <Icon size={18} style={{ color: isComingSoon ? '#8b6b3d' : g.color }} />
                </div>
                <p className="font-semibold text-sm mb-0.5" style={{ color: isComingSoon ? '#8b6b3d' : '#1a1a1a' }}>{g.t}</p>
                <p className="text-[11px] mb-2" style={{ color: '#8b6b3d' }}>{isComingSoon ? 'Segera hadir' : g.displayDesc}</p>
                <p className="text-[10px] leading-snug" style={{ color: '#666' }}>{g.longDesc}</p>
              </button>
            );
          })}
        </div>

        {/* INFO bawah */}
        <div className="rounded-2xl p-4 mt-5" style={{ background: '#faf6ee', borderLeft: '4px solid #c9a961' }}>
          <p className="text-sm font-bold mb-1" style={{ color: '#0a4d3c' }}>💡 Tip Permainan</p>
          <p className="text-xs leading-relaxed" style={{ color: '#3d2817' }}>
            Setiap game punya XP + streak reward. Main 1-2 game setiap hari konsisten lebih baik dari maraton sekali seminggu.
          </p>
        </div>
      </div>
    </div>
  );
}
