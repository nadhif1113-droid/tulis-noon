// components/DailyBriefingModal.jsx
// Modal "Briefing Harian" — muncul 1x/hari saat user buka app.
// Tujuan: orient user sebelum mulai — kasih konteks "kemarin ngapain, hari ini mau apa".
//
// Sections:
//   1. Greeting — time-aware (Pagi/Siang/Sore/Malam) + nama
//   2. Streak banner — sambung streak atau peringatan
//   3. Recap singkat — XP total, sertifikat earned, materi selesai
//   4. Today's recommendation — recommendation engine (from cert.js)
//   5. Event banner — Tantangan Launch + placeholder events ke depan
//   6. CTAs — Mulai Sekarang / Nanti aja

'use client';

import { useEffect, useMemo, useState } from 'react';
import { Sun, Sunrise, Sunset, Moon, Flame, Award, Target, Sparkles, ArrowRight, X, Trophy, Gift, Calendar, Users } from 'lucide-react';
import { getRecommendedNextLesson, countEarnedCertificates, CERTIFICATE_PATHS, PERSONA_GOALS } from '@/lib/certificate';
import { isChallengeActive, challengeDaysRemaining, CHALLENGE_TITLE } from '@/lib/challenge-launch';

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h >= 4 && h < 11) return { label: 'Pagi', emoji: '🌅', Icon: Sunrise, greeting: 'Selamat pagi' };
  if (h >= 11 && h < 15) return { label: 'Siang', emoji: '☀️', Icon: Sun, greeting: 'Selamat siang' };
  if (h >= 15 && h < 18) return { label: 'Sore', emoji: '🌇', Icon: Sunset, greeting: 'Selamat sore' };
  return { label: 'Malam', emoji: '🌙', Icon: Moon, greeting: 'Selamat malam' };
}

function isYesterday(dateStr) {
  if (!dateStr) return false;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateStr === yesterday.toDateString();
}

export default function DailyBriefingModal({ userName, userProfile, onClose, onStartLearning, onOpenChallenge }) {
  const [animate, setAnimate] = useState(false);
  const tod = getTimeOfDay();
  const firstName = (userName || userProfile?.displayName || 'Sahabat').split(' ')[0];

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Data agregat dari userProfile
  const streak = userProfile?.streak || 0;
  const totalXp = userProfile?.xp || 0;
  const certCount = countEarnedCertificates(userProfile);
  const persona = userProfile?.personaGoal || 'all';
  const personaMeta = PERSONA_GOALS.find((p) => p.id === persona) || PERSONA_GOALS[PERSONA_GOALS.length - 1];
  const lastActiveDate = userProfile?.lastActiveDate;
  const wasYesterday = isYesterday(lastActiveDate);

  // Recommendation engine
  const recommendation = useMemo(() => getRecommendedNextLesson(userProfile), [userProfile]);

  // Active event (Tantangan Launch)
  const challengeActive = isChallengeActive();
  const challengeDaysLeft = challengeActive ? challengeDaysRemaining() : 0;

  // Greeting variations berdasarkan streak status
  let streakMessage = '';
  let streakColor = '#c9a961';
  if (streak === 0) {
    streakMessage = 'Mulai streak hari ini — konsisten 5 menit lebih baik dari 1 jam sekali seminggu';
    streakColor = '#8b6b3d';
  } else if (wasYesterday) {
    streakMessage = `🔥 ${streak} hari berturut! Jangan putus hari ini, ya habibi`;
    streakColor = '#a05536';
  } else if (streak > 0) {
    streakMessage = `Streak ${streak} hari kemarin terputus, habibi. Mulai lagi dari sini!`;
    streakColor = '#8b6b3d';
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(10,77,60,0.55)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md mx-auto rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        style={{
          background: '#fdfaf4',
          maxHeight: '92vh',
          transform: animate ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(20px)',
          opacity: animate ? 1 : 0,
          transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero header — greeting time-aware */}
        <div className="relative px-6 pt-6 pb-5" style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)' }}>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.15)' }}
            aria-label="Tutup"
          >
            <X size={15} color="white" />
          </button>
          <div className="text-5xl mb-2">{tod.emoji}</div>
          <p className="text-[10px] tracking-[0.3em] uppercase font-bold mb-1" style={{ color: '#c9a961' }}>
            <Sparkles size={11} className="inline mr-1" /> BRIEFING HARIAN
          </p>
          <h2 className="text-2xl text-white leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700 }}>
            {tod.greeting}, {firstName}!
          </h2>
          <p className="text-sm text-white opacity-90 mt-1">
            Yuk lihat plan belajarmu hari ini 🌱
          </p>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">

          {/* STREAK BANNER */}
          <div className="rounded-2xl p-3 flex items-center gap-3" style={{ background: `${streakColor}10`, border: `1.5px solid ${streakColor}40` }}>
            <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: streakColor }}>
              <Flame size={20} color="white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm leading-tight" style={{ color: streakColor }}>
                Streak: {streak} hari {streak > 0 ? '🔥' : ''}
              </p>
              <p className="text-[11px] leading-snug mt-0.5" style={{ color: '#3d2817' }}>{streakMessage}</p>
            </div>
          </div>

          {/* RECAP SECTION */}
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase font-bold mb-2" style={{ color: '#8b6b3d' }}>
              📊 Progres Kamu
            </p>
            <div className="grid grid-cols-3 gap-2">
              <StatCard icon="⭐" label="Total XP" value={totalXp} color="#c9a961" />
              <StatCard icon="🏅" label="Sertifikat" value={`${certCount}/${CERTIFICATE_PATHS.length}`} color="#0a4d3c" />
              <StatCard icon={personaMeta.emoji} label="Tujuan" value={personaMeta.label.split(' ')[0]} color={personaMeta.color} small />
            </div>
          </div>

          {/* TODAY'S PLAN */}
          {recommendation ? (
            <button
              onClick={() => onStartLearning && onStartLearning(recommendation)}
              className="w-full text-left rounded-2xl p-4 relative overflow-hidden active:scale-[0.98] transition-transform"
              style={{
                background: recommendation.pathGradient,
                boxShadow: `0 10px 24px -10px ${recommendation.pathColor}66`,
              }}
            >
              <div className="absolute -right-2 -top-2 text-6xl opacity-15">{recommendation.pathEmoji}</div>
              <div className="relative">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Target size={11} style={{ color: '#c9a961' }} />
                  <p className="text-[10px] tracking-[0.3em] uppercase font-bold" style={{ color: '#c9a961' }}>
                    Plan Hari Ini
                  </p>
                </div>
                <p className="text-[11px] text-white opacity-80 mb-0.5">{recommendation.pathTitle}</p>
                <h3 className="text-base text-white leading-tight mb-2" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700 }}>
                  {recommendation.lessonIndex && `${recommendation.lessonIndex}. `}{recommendation.lessonTitle}
                </h3>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[10px] text-white opacity-80">
                    {recommendation.pathCompleted}/{recommendation.pathTotal} · {recommendation.pathPercent}%
                  </p>
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold" style={{ background: '#c9a961', color: '#0a4d3c' }}>
                    Mulai <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </button>
          ) : (
            <div className="rounded-2xl p-4 text-center" style={{ background: 'rgba(201,169,97,0.12)', border: '2px dashed #c9a961' }}>
              <Trophy size={28} className="mx-auto mb-2" style={{ color: '#c9a961' }} />
              <p className="text-sm font-bold" style={{ color: '#8b6b3d' }}>🎉 Semua jalur selesai!</p>
              <p className="text-xs mt-1" style={{ color: '#3d2817' }}>Kamu udah jadi Master Tulis Noon. Pertahankan!</p>
            </div>
          )}

          {/* EVENT SECTION */}
          {challengeActive && (
            <button
              onClick={onOpenChallenge}
              className="w-full text-left rounded-2xl p-3.5 flex items-center gap-3 active:scale-[0.98] transition-transform"
              style={{ background: 'linear-gradient(135deg, #a05536, #7a3d2a)' }}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-xl" style={{ background: 'rgba(255,255,255,0.15)' }}>
                🏆
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] tracking-[0.3em] uppercase font-bold" style={{ color: '#c9a961' }}>EVENT AKTIF</p>
                <p className="font-bold text-sm text-white leading-tight" style={{ fontFamily: 'Fraunces, serif' }}>{CHALLENGE_TITLE}</p>
                <p className="text-[11px] text-white opacity-85 mt-0.5">{challengeDaysLeft} hari lagi · hadiah uang tunai</p>
              </div>
              <ArrowRight size={16} color="white" className="flex-shrink-0" />
            </button>
          )}

          {/* COMING SOON EVENTS */}
          <div className="rounded-2xl p-3.5" style={{ background: 'rgba(10,77,60,0.05)', border: '1px dashed rgba(10,77,60,0.2)' }}>
            <div className="flex items-center gap-1.5 mb-2">
              <Calendar size={12} style={{ color: '#8b6b3d' }} />
              <p className="text-[10px] tracking-[0.3em] uppercase font-bold" style={{ color: '#8b6b3d' }}>SEGERA HADIR</p>
            </div>
            <div className="space-y-1.5">
              <ComingSoonRow emoji="🎙️" title="Ceramah Ustadz Live" desc="Live streaming kajian + tanya jawab" />
              <ComingSoonRow emoji="👨‍🏫" title="Privat 1-on-1 Ustadz" desc="Booking sesi privat dengan guru asli" />
              <ComingSoonRow emoji="👥" title="Kelas Grup (20-30 orang)" desc="Kelas reguler bareng teman se-jalur" />
              <ComingSoonRow emoji="🎁" title="Hadiah uang tunai" desc="Untuk yang konsisten ikut event" />
            </div>
            <p className="text-[10px] mt-2.5 leading-snug" style={{ color: '#8b6b3d' }}>
              ⚡ Tetap aktif sekarang — early adopter selalu dapat priority akses event-event ini.
            </p>
          </div>

        </div>

        {/* CTA bottom */}
        <div className="px-5 py-4 border-t" style={{ borderColor: 'rgba(10,77,60,0.08)' }}>
          {recommendation ? (
            <button
              onClick={() => onStartLearning && onStartLearning(recommendation)}
              className="w-full py-3.5 rounded-2xl text-white font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
              style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)', boxShadow: '0 8px 20px -6px rgba(10,77,60,0.5)' }}
            >
              Mulai Belajar Sekarang <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl text-white font-bold"
              style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)' }}
            >
              Jelajahi App
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full mt-2 py-2 text-xs font-semibold"
            style={{ color: '#8b6b3d' }}
          >
            Nanti aja
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color, small }) {
  return (
    <div className="rounded-xl p-2.5 text-center" style={{ background: 'white', border: `1px solid ${color}20` }}>
      <p className="text-lg leading-none mb-1">{icon}</p>
      <p className={small ? 'text-[11px] font-bold leading-tight' : 'text-base font-bold leading-tight'} style={{ color, fontFamily: 'Fraunces, serif' }}>{value}</p>
      <p className="text-[9px] uppercase tracking-wide mt-0.5" style={{ color: '#8b6b3d' }}>{label}</p>
    </div>
  );
}

function ComingSoonRow({ emoji, title, desc }) {
  return (
    <div className="flex items-center gap-2.5 py-1.5">
      <span className="text-lg flex-shrink-0">{emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold leading-tight" style={{ color: '#3d2817' }}>{title}</p>
        <p className="text-[10px] leading-snug" style={{ color: '#8b6b3d' }}>{desc}</p>
      </div>
    </div>
  );
}
