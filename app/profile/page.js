'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../lib/auth-context';
import { getXpProgress, TIERS, XP_SOURCES } from '../../lib/xp-system';
import { Star, Flame, BookOpen, Sparkles, ArrowLeft, MapPin, LogOut, ChevronRight, Trophy, Target, Award, MessageCircle, HelpCircle, X, Lock, Check, Mic, Globe } from 'lucide-react';
import XpLevelInfoModal from '../../components/XpLevelInfoModal';
import AdminHelpFAB from '../../components/AdminHelpFAB';
import BrandLoader from '../../components/BrandLoader';
import { isInMiddleEast, isInIndonesia, getUserTimezone } from '../../lib/geo-detect';
import { sendTestNotification, getPendingPrayerNotifsCount } from '../../lib/local-prayer-notifications';

// Debug-only: tombol test notif. Set true kalau mau debug notif sholat di dev.
const SHOW_NOTIF_DEBUG = false;

// Pilihan avatar emoji (hemat storage — cuma simpan string emoji, ga upload gambar).
const AVATAR_EMOJIS = [
  '🧕', '🧔🏽', '👳🏽‍♂️', '👨🏽', '👩🏽', '🧑🏽', '👦🏽', '👧🏽', '👴🏽', '👵🏽',
  '😀', '😎', '🤓', '🥰', '😇', '🤗', '🌙', '⭐', '🌟', '✨',
  '🕌', '🕋', '📿', '📖', '🤲', '☪️', '🐪', '🦅', '🦁', '🌹',
  '☕', '🍵', '💎', '🔥', '🎯', '🏆', '🚀', '🌴', '⛰️', '🌊',
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, userProfile, loading, signOut, updateUserProfile } = useAuth();
  const [showLevelInfo, setShowLevelInfo] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [showNameEdit, setShowNameEdit] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [detectedTz, setDetectedTz] = useState(null);
  useEffect(() => { setDetectedTz(getUserTimezone()); }, []);
  const isME = isInMiddleEast();
  const isID = isInIndonesia();
  const userOverride = userProfile?.locationOverride;
  // Tampilin entry kalau user override = ME, atau auto-detect ME, atau user override = indonesia (kasih kesempatan tetap buka)
  const showTanyaEntry = userOverride === 'middle-east' || (isME && userOverride !== 'indonesia');
  const showTanyaIDLocked = (isID || userOverride === 'indonesia') && userOverride !== 'middle-east';

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  async function handleSignOut() {
    const result = await signOut();
    if (result.success) {
      router.replace('/');
    }
  }

  // Loading state — match home theme
  if (loading) {
    return <BrandLoader fullScreen text="Memuat profilmu..." />;
  }

  if (!user) return null;

  const xp = userProfile?.xp || 0;
  const streak = userProfile?.streak || 0;
  const progress = getXpProgress(xp);
  const { currentLevel, tier, nextTier, xpInLevel, xpNeeded, xpRemaining, percent } = progress;
  const displayName = userProfile?.displayName || user.email?.split('@')[0] || 'User';
  const photoURL = userProfile?.photoURL;
  const avatarEmoji = userProfile?.avatarEmoji || null;

  async function chooseAvatar(emoji) {
    setSavingAvatar(true);
    await updateUserProfile({ avatarEmoji: emoji });
    setSavingAvatar(false);
    setShowAvatarPicker(false);
  }

  function openNameEdit() {
    setNameInput(userProfile?.displayName || '');
    setShowNameEdit(true);
  }

  async function saveName() {
    const name = nameInput.trim();
    if (!name || name.length < 2) return;
    setSavingName(true);
    await updateUserProfile({ displayName: name.slice(0, 30) });
    setSavingName(false);
    setShowNameEdit(false);
  }

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
        {/* Top bar — pakai router.replace biar /profile gak nimpa history.
            Tadinya <Link href="/"> (push) → user buka game di home lalu HW back → kembali ke /profile,
            harusnya kembali ke wherever sebelum profile. */}
        <div className="px-5 pt-6 pb-3 flex items-center gap-3">
          <button onClick={() => router.replace('/')} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
            <ArrowLeft size={18} style={{ color: '#0a4d3c' }} />
          </button>
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
              <button onClick={() => setShowAvatarPicker(true)} className="relative flex-shrink-0">
                {avatarEmoji ? (
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl border-2 border-white/40 shadow-lg" style={{ background: 'rgba(255,255,255,0.18)' }}>
                    {avatarEmoji}
                  </div>
                ) : photoURL ? (
                  <img src={photoURL} alt={displayName} className="w-16 h-16 rounded-2xl border-2 border-white/40 shadow-lg" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold border-2 border-white/40 shadow-lg" style={{ background: 'rgba(255,255,255,0.18)', color: '#faf6ee', fontFamily: 'Fraunces, serif' }}>
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                {/* badge edit */}
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-[11px] shadow" style={{ background: '#c9a961', color: '#0a4d3c' }}>✏️</span>
              </button>
              <div className="flex-1 min-w-0">
                <button onClick={openNameEdit} className="flex items-center gap-1.5 text-left">
                  <h2 className="text-xl font-bold text-white leading-tight truncate" style={{ fontFamily: 'Fraunces, serif' }}>
                    {displayName}
                  </h2>
                  <span className="text-xs flex-shrink-0" style={{ opacity: 0.85 }}>✏️</span>
                </button>
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
            <ProfileRow label="Zona Waktu" value={detectedTz || '-'} icon={Globe} />
          </div>
        </div>

        {/* Notification Test (debug section) — disembunyikan di production */}
        {SHOW_NOTIF_DEBUG && (
        <div className="px-5 mb-4">
          <div className="rounded-2xl p-4" style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.08)' }}>
            <p className="text-[10px] tracking-widest uppercase font-bold mb-2" style={{ color: '#c9a961' }}>🔔 Notifikasi Sholat</p>
            <p className="text-[11px] mb-3" style={{ color: '#8b6b3d' }}>
              Tes apakah sistem notifikasi sholat berjalan dengan baik. Tap tombol di bawah untuk dapat notif percobaan dalam 5 detik.
            </p>
            <button
              onClick={async () => {
                const ok = await sendTestNotification();
                if (ok) {
                  alert('Test notif ke-schedule! Tunggu 5 detik & background app dengan swipe up.');
                } else {
                  alert('Test notif gagal — kemungkinan permission belum granted atau bukan native app. Cek console log Xcode.');
                }
              }}
              className="w-full py-3 rounded-2xl font-semibold flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)', color: 'white' }}
            >
              🔔 Kirim Test Notif (5 detik)
            </button>
            <button
              onClick={async () => {
                const count = await getPendingPrayerNotifsCount();
                alert(`Ada ${count} notifikasi sholat ke-schedule.`);
              }}
              className="w-full py-2 mt-2 rounded-xl text-xs font-medium"
              style={{ background: 'rgba(10,77,60,0.08)', color: '#0a4d3c' }}
            >
              Cek Jumlah Notif Tersimpan
            </button>
          </div>
        </div>
        )}

        {/* Lokasi override — manual toggle untuk Tanya Cepat */}
        <div className="px-5 mb-4">
          <div className="rounded-2xl p-4" style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.08)' }}>
            <p className="text-[10px] tracking-widest uppercase font-bold mb-2" style={{ color: '#c9a961' }}>Saya Sedang Berada Di</p>
            <p className="text-[11px] mb-3" style={{ color: '#8b6b3d' }}>
              Fitur <strong>Tanya Cepat</strong> (asisten Arab Hijazi) cuma muncul kalau kamu lagi di Timur Tengah. Override di sini kalau auto-detect salah:
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'auto', label: 'Auto', emoji: '🌐', desc: 'Deteksi otomatis' },
                { id: 'middle-east', label: 'Timur Tengah', emoji: '🕋', desc: 'Saudi/UAE/Mesir/dll' },
                { id: 'indonesia', label: 'Indonesia', emoji: '🇮🇩', desc: 'Belum berangkat' },
              ].map((opt) => {
                const isActive = (opt.id === 'auto' && !userOverride) || userOverride === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={async () => {
                      try {
                        await updateUserProfile({ locationOverride: opt.id === 'auto' ? null : opt.id });
                      } catch (e) { console.error(e); }
                    }}
                    className="p-2 rounded-xl text-center transition-all"
                    style={{
                      background: isActive ? 'linear-gradient(135deg, #0a4d3c, #1a6b56)' : 'rgba(10,77,60,0.05)',
                      border: isActive ? 'none' : '1.5px solid rgba(10,77,60,0.1)',
                    }}
                  >
                    <div className="text-lg mb-0.5">{opt.emoji}</div>
                    <p className="text-[10px] font-bold leading-tight" style={{ color: isActive ? 'white' : '#0a4d3c' }}>{opt.label}</p>
                    <p className="text-[9px] leading-tight mt-0.5" style={{ color: isActive ? 'rgba(255,255,255,0.8)' : '#8b6b3d' }}>{opt.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Entry ke Tanya Cepat (selalu ada di Profile, fallback kalau FAB ke-hide) */}
        <div className="px-5 mb-4">
          {showTanyaEntry ? (
            <button
              onClick={() => router.replace('/?screen=tanya-cepat')}
              className="block w-full p-4 rounded-2xl active:scale-[0.98] transition-transform relative overflow-hidden text-left"
              style={{ background: 'linear-gradient(135deg, #c9a961, #d4b876)', boxShadow: '0 8px 20px -6px rgba(201,169,97,0.4)' }}
            >
              <div className="absolute -right-2 -top-2 text-5xl opacity-15">⚡</div>
              <div className="flex items-center gap-3 relative">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.95)' }}>
                  <Mic size={18} style={{ color: '#8b6b3d' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] tracking-widest uppercase font-bold text-white opacity-90">⚡ ASISTEN HIJAZI</p>
                  <p className="text-base font-bold text-white leading-tight">Tanya Cepat</p>
                  <p className="text-[11px] text-white opacity-90 leading-snug">Ngomong Indonesia → AI jawab Arab Hijazi</p>
                </div>
                <ChevronRight size={18} className="text-white flex-shrink-0" />
              </div>
            </button>
          ) : (
            <div className="rounded-2xl p-4" style={{ background: 'rgba(10,77,60,0.04)', border: '1.5px dashed rgba(10,77,60,0.2)' }}>
              <div className="flex items-center gap-2 mb-1.5">
                <Lock size={14} style={{ color: '#8b6b3d' }} />
                <p className="text-xs font-bold" style={{ color: '#0a4d3c' }}>Tanya Cepat — Khusus di Timur Tengah</p>
              </div>
              <p className="text-[11px] leading-snug" style={{ color: '#8b6b3d' }}>
                Fitur ini didesain buat jamaah yang <strong>sedang berada</strong> di Saudi/UAE/Mesir/dll — buat tanya cepat ke native Arab.
                Kalau kamu lagi di Indonesia, fokus dulu di pelajaran rutin. Aktifin manual di toggle di atas kalau auto-detect salah.
              </p>
            </div>
          )}
        </div>

        {/* Sertifikat Saya */}
        <div className="px-5 mb-4">
          <button
            onClick={() => router.replace('/?screen=certificates')}
            className="block w-full p-4 rounded-2xl active:scale-[0.98] transition-transform relative overflow-hidden text-left"
            style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)', boxShadow: '0 8px 20px -6px rgba(10,77,60,0.4)' }}
          >
            <div className="absolute -right-2 -top-2 text-5xl opacity-15">🏅</div>
            <div className="flex items-center gap-3 relative">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.95)' }}>
                <Award size={18} style={{ color: '#0a4d3c' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] tracking-widest uppercase font-bold text-white opacity-90">🏅 PENCAPAIAN</p>
                <p className="text-base font-bold text-white leading-tight">Sertifikat Saya</p>
                <p className="text-[11px] text-white opacity-90 leading-snug">Lihat sertifikat dari jalur belajar yang sudah selesai</p>
              </div>
              <ChevronRight size={18} className="text-white flex-shrink-0" />
            </div>
          </button>
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

      {/* Modal: Pilih Avatar Emoji */}
      {showAvatarPicker && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: 'rgba(0,0,0,0.45)' }} onClick={() => setShowAvatarPicker(false)}>
          <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 pb-safe" style={{ background: '#faf6ee', maxHeight: '70vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-bold" style={{ color: '#0a4d3c', fontFamily: 'Fraunces, serif' }}>Pilih Avatar</h3>
              <button onClick={() => setShowAvatarPicker(false)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)', color: '#0a4d3c' }}>✕</button>
            </div>
            <p className="text-xs mb-4" style={{ color: '#8b6b3d' }}>Pakai emoji sebagai foto profil — ringan & tampil di teman, leaderboard, & komunitas.</p>
            <div className="grid grid-cols-6 gap-2">
              {AVATAR_EMOJIS.map((e) => (
                <button
                  key={e}
                  onClick={() => chooseAvatar(e)}
                  disabled={savingAvatar}
                  className="aspect-square rounded-xl flex items-center justify-center text-2xl transition-transform active:scale-90 disabled:opacity-50"
                  style={{ background: avatarEmoji === e ? 'rgba(201,169,97,0.35)' : 'white', border: avatarEmoji === e ? '2px solid #c9a961' : '1px solid rgba(10,77,60,0.08)' }}
                >
                  {e}
                </button>
              ))}
            </div>
            {avatarEmoji && (
              <button onClick={() => chooseAvatar(null)} disabled={savingAvatar} className="w-full mt-4 py-2.5 rounded-xl text-sm font-medium" style={{ background: 'rgba(192,57,43,0.08)', color: '#c0392b' }}>
                Hapus avatar emoji
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal: Edit Nama */}
      {showNameEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ background: 'rgba(0,0,0,0.45)' }} onClick={() => setShowNameEdit(false)}>
          <div className="w-full max-w-sm rounded-3xl p-5" style={{ background: '#faf6ee' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold" style={{ color: '#0a4d3c', fontFamily: 'Fraunces, serif' }}>Edit Nama</h3>
              <button onClick={() => setShowNameEdit(false)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)', color: '#0a4d3c' }}>✕</button>
            </div>
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Nama tampilan"
              maxLength={30}
              autoFocus
              className="w-full px-4 py-3 rounded-xl text-sm outline-none mb-1"
              style={{ background: 'white', border: '1px solid rgba(10,77,60,0.15)', color: '#0a4d3c' }}
            />
            <p className="text-[11px] mb-4" style={{ color: '#8b6b3d' }}>Nama ini muncul di teman, leaderboard, & feed komunitas. Min 2 karakter.</p>
            <button
              onClick={saveName}
              disabled={savingName || nameInput.trim().length < 2}
              className="w-full py-3 rounded-xl font-semibold text-white disabled:opacity-50"
              style={{ background: '#0a4d3c' }}
            >
              {savingName ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </div>
      )}

      {/* Floating Admin Help — HANYA di Profile, gak di tempat lain */}
      <AdminHelpFAB user={user} userProfile={userProfile} />
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
