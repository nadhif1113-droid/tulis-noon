'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../lib/auth-context';
import { getXpProgress, TIERS, XP_SOURCES } from '../../lib/xp-system';
import { Star, Flame, BookOpen, Sparkles, ArrowLeft, MapPin, LogOut, ChevronRight, Trophy, Target, Award, MessageCircle, HelpCircle, X, Lock, Check } from 'lucide-react';
import XpLevelInfoModal from '../../components/XpLevelInfoModal';

export default function ProfilePage() {
  const router = useRouter();
  const { user, userProfile, loading, signOut } = useAuth();
  const [showLevelInfo, setShowLevelInfo] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  async function handleSignOut() {
    const result = await signOut();
    if (result.success) {
      router.push('/');
    }
  }

  // Loading state — match home theme
  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ background: 'linear-gradient(180deg, #faf6ee 0%, #f3ebd9 100%)', fontFamily: "'DM Sans', system-ui, sans-serif" }}
      >
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700;9..144,900&family=DM+Sans:wght@400;500;600;700&family=Amiri:wght@400;700&display=swap" rel="stylesheet" />
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center animate-pulse" style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)', transform: 'rotate(-6deg)' }}>
            <span className="text-2xl" style={{ fontFamily: 'Amiri, serif', color: '#f3ebd9', transform: 'rotate(6deg)', display: 'inline-block' }}>ن</span>
          </div>
          <p className="text-sm" style={{ color: '#8b6b3d' }}>Memuat profilmu...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const xp = userProfile?.xp || 0;
  const streak = userProfile?.streak || 0;
  const progress = getXpProgress(xp);
  const { currentLevel, tier, nextTier, xpInLevel, xpNeeded, xpRemaining, percent } = progress;
  const displayName = userProfile?.displayName || user.email?.split('@')[0] || 'User';
  const photoURL = userProfile?.photoURL;

  // Count gold (perfect-scored levels) di Challenge
  const goldCount = (() => {
    if (!userProfile?.challengeProgress) return 0;
    let count = 0;
    for (const scenario of Object.values(userProfile.challengeProgress)) {
      for (const lvl of Object.values(scenario)) {
        if (lvl?.perfectAchieved) count++;
      }
    }
    return count;
  })();

  // Member since formatting
  const memberSinceText = (() => {
    if (!userProfile?.createdAt) return 'Baru saja gabung';
    try {
      // Firestore timestamp atau ISO string
      const date = userProfile.createdAt.toDate ? userProfile.createdAt.toDate() : new Date(userProfile.createdAt);
      return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
    } catch {
      return 'Baru saja gabung';
    }
  })();

  return (
    <div className="min-h-screen w-full" style={{ background: 'linear-gradient(180deg, #faf6ee 0%, #f3ebd9 100%)', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700;9..144,900&family=DM+Sans:wght@400;500;600;700&family=Amiri:wght@400;700&display=swap" rel="stylesheet" />

      {/* Background pattern halus — match home */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cpath d='M40 0L80 40L40 80L0 40Z' fill='none' stroke='%230a4d3c' stroke-width='1'/%3E%3C/svg%3E")`,
      }} />

      <div className="relative max-w-md mx-auto min-h-screen pb-24">
        {/* Top bar */}
        <div className="px-5 pt-6 pb-3 flex items-center gap-3">
          <Link href="/" className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
            <ArrowLeft size={18} style={{ color: '#0a4d3c' }} />
          </Link>
          <div className="flex-1">
            <p className="text-xs tracking-widest uppercase" style={{ color: '#8b6b3d' }}>Akun</p>
            <h1 className="text-xl font-semibold" style={{ color: '#0a4d3c', fontFamily: 'Fraunces, serif' }}>
              Profil & Progress
            </h1>
          </div>
        </div>

        {/* Hero — avatar + name + tier badge */}
        <div className="px-5 mb-4">
          <div className="rounded-3xl p-5 relative overflow-hidden" style={{ background: tier.bgGradient }}>
            <div className="absolute -right-4 -top-4 text-7xl opacity-15">{tier.emoji}</div>
            <div className="flex items-center gap-4 mb-4">
              {photoURL ? (
                <img src={photoURL} alt={displayName} className="w-16 h-16 rounded-2xl border-2 border-white/40 shadow-lg" />
              ) : (
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold border-2 border-white/40 shadow-lg" style={{ background: 'rgba(255,255,255,0.18)', color: '#faf6ee', fontFamily: 'Fraunces, serif' }}>
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-white leading-tight" style={{ fontFamily: 'Fraunces, serif' }}>
                  {displayName}
                </h2>
                <p className="text-xs text-white/85 truncate">{user.email}</p>
              </div>
            </div>

            {/* Tier badge + Level */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }}>
                <span className="text-base">{tier.emoji}</span>
                <span className="text-xs font-bold text-white">{tier.label}</span>
                <span className="text-[10px] text-white/85 uppercase tracking-widest">{tier.subtitle}</span>
              </div>
              <div className="px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: 'rgba(201,169,97,0.3)', color: '#fff' }}>
                Level {currentLevel}
              </div>
            </div>
          </div>
        </div>

        {/* XP Progress card */}
        <div className="px-5 mb-4">
          <div className="rounded-2xl p-4" style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.08)' }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-[10px] tracking-widest uppercase font-bold mb-1" style={{ color: '#c9a961' }}>Total XP</p>
                <p className="text-3xl font-bold leading-none" style={{ fontFamily: 'Fraunces, serif', color: '#0a4d3c' }}>{xp.toLocaleString('id-ID')}</p>
              </div>
              <button
                onClick={() => setShowLevelInfo(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-semibold"
                style={{ background: 'rgba(10,77,60,0.06)', color: '#0a4d3c' }}
              >
                <HelpCircle size={12} />
                Apa itu Level?
              </button>
            </div>

            {/* Progress bar */}
            <div className="mb-2">
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-xs font-semibold" style={{ color: tier.color }}>
                  {xpInLevel.toLocaleString('id-ID')} / {xpNeeded.toLocaleString('id-ID')} XP
                </span>
                <span className="text-xs" style={{ color: '#8b6b3d' }}>
                  Lv {currentLevel} → Lv {currentLevel + 1}
                </span>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(10,77,60,0.1)' }}>
                <div
                  className="h-full transition-all duration-700 rounded-full"
                  style={{ width: `${percent}%`, background: tier.bgGradient }}
                />
              </div>
              <p className="text-[11px] mt-2" style={{ color: '#8b6b3d' }}>
                {xpRemaining.toLocaleString('id-ID')} XP lagi untuk naik ke <strong style={{ color: nextTier.color }}>{nextTier.label} Level {currentLevel + 1}</strong> {nextTier.id !== tier.id && `(${nextTier.emoji})`}
              </p>
            </div>
          </div>
        </div>

        {/* Stats grid 2x2 */}
        <div className="px-5 mb-4">
          <div className="grid grid-cols-2 gap-3">
            <StatCard icon={Star} label="Total XP" value={xp.toLocaleString('id-ID')} color="#c9a961" filled />
            <StatCard icon={Flame} label="Streak Hari" value={streak} color="#a05536" />
            <StatCard icon={Trophy} label="Gold ⭐" value={goldCount} color="#c9a961" />
            <StatCard icon={Sparkles} label="Level" value={currentLevel} color={tier.color} />
          </div>
        </div>

        {/* Interest tags */}
        {userProfile?.interests?.length > 0 && (
          <div className="px-5 mb-4">
            <div className="rounded-2xl p-4" style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.08)' }}>
              <p className="text-[10px] tracking-widest uppercase font-bold mb-2.5" style={{ color: '#c9a961' }}>Minatmu</p>
              <div className="flex flex-wrap gap-1.5">
                {userProfile.interests.map((id) => (
                  <span key={id} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(10,77,60,0.06)', color: '#0a4d3c' }}>
                    {INTEREST_LABELS[id] || id}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Arabic level + dailyTime + accent — kalau ada */}
        {(userProfile?.arabicLevel || userProfile?.accent || userProfile?.dailyTime) && (
          <div className="px-5 mb-4">
            <div className="rounded-2xl p-4 space-y-2" style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.08)' }}>
              <p className="text-[10px] tracking-widest uppercase font-bold mb-1" style={{ color: '#c9a961' }}>Preferensi Belajar</p>
              {userProfile.arabicLevel && userProfile.arabicLevel !== 'unknown' && (
                <ProfileRow label="Level Arab awal" value={ARABIC_LEVEL_LABELS[userProfile.arabicLevel] || userProfile.arabicLevel} />
              )}
              {userProfile.accent && (
                <ProfileRow label="Aksen favorit" value={ACCENT_LABELS[userProfile.accent] || userProfile.accent} />
              )}
              {userProfile.dailyTime && (
                <ProfileRow label="Komitmen harian" value={DAILY_TIME_LABELS[userProfile.dailyTime] || userProfile.dailyTime} />
              )}
            </div>
          </div>
        )}

        {/* Account info */}
        <div className="px-5 mb-4">
          <div className="rounded-2xl p-4 space-y-2" style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.08)' }}>
            <p className="text-[10px] tracking-widest uppercase font-bold mb-1" style={{ color: '#c9a961' }}>Info Akun</p>
            <ProfileRow label="Email" value={user.email} />
            <ProfileRow label="Verifikasi" value={user.emailVerified ? '✓ Terverifikasi' : '⚠ Belum diverifikasi'} valueColor={user.emailVerified ? '#0a4d3c' : '#a05536'} />
            <ProfileRow label="Gabung sejak" value={memberSinceText} />
            <ProfileRow label="Lokasi" value={userProfile?.location?.city || 'Madinah'} icon={MapPin} />
          </div>
        </div>

        {/* Sign out */}
        <div className="px-5 pb-6">
          <button
            onClick={handleSignOut}
            className="w-full py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2"
            style={{ background: 'white', border: '1.5px solid rgba(160,85,54,0.25)', color: '#a05536' }}
          >
            <LogOut size={16} /> Keluar dari Akun
          </button>
          <p className="text-center text-[11px] mt-4" style={{ color: '#8b6b3d' }}>
            Tulis Noon · v1.0 — bismillah
          </p>
        </div>
      </div>

      {/* Modal: XP & Level info — reuse shared component */}
      {showLevelInfo && (
        <XpLevelInfoModal xp={xp} onClose={() => setShowLevelInfo(false)} />
      )}
    </div>
  );
}

// ============================================================================
// Sub-components
// ============================================================================

function StatCard({ icon: Icon, label, value, color, filled = false }) {
  return (
    <div className="rounded-2xl p-3.5 flex items-center gap-3" style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.08)' }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
        <Icon size={18} style={{ color }} fill={filled ? color : 'none'} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-lg font-bold leading-tight" style={{ color: '#0a4d3c', fontFamily: 'Fraunces, serif' }}>{value}</p>
        <p className="text-[10px] uppercase tracking-widest" style={{ color: '#8b6b3d' }}>{label}</p>
      </div>
    </div>
  );
}

function ProfileRow({ label, value, valueColor = '#3d2817', icon: Icon }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs flex items-center gap-1.5" style={{ color: '#8b6b3d' }}>
        {Icon && <Icon size={12} />}
        {label}
      </span>
      <span className="text-xs font-semibold text-right truncate ml-2" style={{ color: valueColor, maxWidth: '60%' }}>{value}</span>
    </div>
  );
}

// ============================================================================
// Display labels
// ============================================================================
const INTEREST_LABELS = {
  religion: '🕌 Agama', travel: '✈️ Travel', food: '🍽️ Kuliner', movies: '🎬 Film',
  music: '🎵 Musik', sports: '⚽ Olahraga', business: '💼 Bisnis', history: '📜 Sejarah',
  tech: '💻 Teknologi', family: '👨‍👩‍👧 Keluarga',
};

const ARABIC_LEVEL_LABELS = {
  pemula: '🌱 Pemula (mulai nol)',
  bisaBaca: '📖 Bisa baca, belum paham arti',
  menengah: '💬 Paham percakapan dasar',
  lancar: '🎯 Lancar ngobrol sehari-hari',
};

const ACCENT_LABELS = {
  saudi: '🇸🇦 Saudi / Khaliji',
  fusha: '📖 Fusha (Standard)',
  masri: '🇪🇬 Mesir',
  shami: '🇸🇾 Syam',
};

const DAILY_TIME_LABELS = {
  '5min': '☕ 5 menit/hari',
  '15min': '🚶 15 menit/hari',
  '30min': '🏃 30 menit/hari',
  '60min': '🚀 1 jam/hari',
};
