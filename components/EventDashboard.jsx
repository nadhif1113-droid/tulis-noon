// components/EventDashboard.jsx
// Dashboard "Tantangan 10 Hari Aktif" — replace ChallengeLaunchScreen yang lama.
//
// Sections:
//   1. Hero — countdown + status (aktif/coming soon/ended)
//   2. Eligibility card — apa syarat menang + status user sekarang
//   3. Today's checklist — 8 fitur (pakai apa hari ini, progress per fitur)
//   4. Personal stats — streak, score, days active, features used
//   5. Leaderboard top 20
//   6. Prizes
//   7. Rules

'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Home, Trophy, Flame, Target, CheckCircle2, Lock, Sparkles, Award, Users, Calendar, Info, Share2 } from 'lucide-react';
import ShareEventModal from '@/components/ShareEventModal';
import {
  isChallengeActive, challengeDaysRemaining, challengeTotalDays, challengeDaysUntilStart,
  challengeCurrentDay, challengePercentElapsed,
  CHALLENGE_TITLE, CHALLENGE_TAGLINE, CHALLENGE_SUBTITLE, CHALLENGE_PRIZES, challengeTotalPrize,
  CHALLENGE_START_MS, CHALLENGE_END_MS, EVENT_ID, isAccountEligibleForChallenge,
} from '@/lib/challenge-launch';
import {
  EVENT_FEATURES, EVENT_FEATURE_KEYS, getTodayProgress, computeEventStreak,
  checkEligibility, checkGrandPrizeEligibility, getEventScore,
  MIN_STREAK_DAYS, MIN_FEATURES_USED, MIN_TOTAL_SCORE,
  GRAND_PRIZE_MIN_SCORE, MAX_POSSIBLE_SCORE,
} from '@/lib/event-scoring';
import { getChallengeLeaderboard } from '@/lib/social';

export default function EventDashboard({ userId, userProfile, onBack, onHome, onShareBonus }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [lbLoading, setLbLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);

  const isActive = isChallengeActive();
  const isPast = Date.now() > CHALLENGE_END_MS;
  const isFuture = Date.now() < CHALLENGE_START_MS;
  const daysLeft = challengeDaysRemaining();
  const daysUntilStart = challengeDaysUntilStart();
  const currentDay = challengeCurrentDay();
  const totalDays = challengeTotalDays();
  const percentElapsed = challengePercentElapsed();

  const eligibility = useMemo(
    () => checkEligibility(userProfile, CHALLENGE_START_MS),
    [userProfile]
  );
  const grandPrize = useMemo(
    () => checkGrandPrizeEligibility(userProfile, CHALLENGE_START_MS),
    [userProfile]
  );
  const eventScore = getEventScore(userProfile?.eventStats);
  const eventStreak = computeEventStreak(userProfile?.eventStats, CHALLENGE_START_MS);
  const todayProgress = useMemo(() => getTodayProgress(userProfile?.eventStats), [userProfile]);
  const featuresUsedToday = todayProgress.filter((p) => p.used).length;
  const featuresUsedOverall = userProfile?.eventStats?.featuresUsedOverall?.length || 0;
  const accountEligible = isAccountEligibleForChallenge(userProfile);

  useEffect(() => {
    let cancelled = false;
    setLbLoading(true);
    // Pakai existing leaderboard query (challengeXp field) — masih relevan sebagai
    // proxy ranking; refine kalau perlu nanti pakai eventStats.totalScore
    getChallengeLeaderboard(20).then((list) => {
      if (!cancelled) {
        setLeaderboard(list || []);
        setLbLoading(false);
      }
    }).catch(() => {
      if (!cancelled) setLbLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="flex-1 overflow-y-auto" style={{ height: '100%' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 sticky top-0 z-10" style={{ background: '#faf6ee', borderBottom: '1px solid rgba(10,77,60,0.08)' }}>
        <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <ArrowLeft size={17} style={{ color: '#0a4d3c' }} />
        </button>
        <div className="flex-1">
          <p className="text-[10px] tracking-[0.2em] uppercase" style={{ color: '#8b6b3d' }}>Event</p>
          <h1 className="text-lg font-bold" style={{ fontFamily: 'Fraunces, serif', color: '#0a4d3c' }}>{CHALLENGE_TITLE}</h1>
        </div>
        <button onClick={onHome} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <Home size={16} style={{ color: '#0a4d3c' }} />
        </button>
      </div>

      <div className="px-5 py-4 space-y-3">
        {/* HERO */}
        <div className="rounded-3xl p-5 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #a05536, #7a3d2a)' }}>
          <div className="absolute -right-4 -top-2 text-7xl opacity-15">🏆</div>
          <div className="relative">
            <p className="text-[10px] tracking-[0.3em] uppercase font-bold mb-1" style={{ color: '#c9a961' }}>
              {isActive ? `HARI ${currentDay} DARI ${totalDays}` : isFuture ? 'SEGERA HADIR' : 'BERAKHIR'}
            </p>
            <h2 className="text-xl text-white mb-1" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700 }}>
              {CHALLENGE_TAGLINE}
            </h2>
            <p className="text-xs text-white opacity-85 mb-3">{CHALLENGE_SUBTITLE}</p>

            {isActive && (
              <>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[11px] text-white opacity-80">{daysLeft} hari tersisa</p>
                  <p className="text-[11px] font-bold" style={{ color: '#c9a961' }}>{Math.round(percentElapsed)}% berjalan</p>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.2)' }}>
                  <div className="h-full" style={{ width: `${percentElapsed}%`, background: '#c9a961', transition: 'width 0.5s' }} />
                </div>
              </>
            )}
            {isFuture && (
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <Calendar size={12} color="white" />
                <p className="text-xs font-bold text-white">{daysUntilStart} hari lagi sebelum mulai</p>
              </div>
            )}
            {isPast && (
              <p className="text-xs text-white opacity-80">Event sudah berakhir. Tunggu event berikutnya!</p>
            )}
          </div>
        </div>

        {/* PRIZES */}
        <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, rgba(201,169,97,0.12), rgba(212,184,118,0.08))', border: '1.5px solid rgba(201,169,97,0.4)' }}>
          <p className="text-[10px] tracking-[0.3em] uppercase font-bold mb-2.5 flex items-center gap-1.5" style={{ color: '#8b6b3d' }}>
            <Trophy size={11} /> HADIAH TOTAL: RP {(challengeTotalPrize() / 1000).toFixed(0)}.000
          </p>
          <div className="space-y-2">
            {CHALLENGE_PRIZES.map((prize) => (
              <div key={prize.rank} className="rounded-xl p-2.5" style={{
                background: prize.rank === 1 ? 'linear-gradient(135deg, rgba(201,169,97,0.18), rgba(212,184,118,0.1))' : 'rgba(255,255,255,0.6)',
                border: prize.rank === 1 ? '1px solid rgba(201,169,97,0.5)' : '1px solid rgba(10,77,60,0.08)',
              }}>
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{prize.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: '#0a4d3c' }}>Juara {prize.rank}</p>
                    <p className="text-[10px] leading-tight" style={{ color: '#8b6b3d' }}>{prize.tagline}</p>
                  </div>
                  <p className="text-base font-bold" style={{ color: '#a05536', fontFamily: 'Fraunces, serif' }}>{prize.label}</p>
                </div>
                {prize.rank === 1 && (
                  <p className="text-[10px] mt-1.5 px-1 leading-snug" style={{ color: '#7a3d2a' }}>
                    💡 Threshold ini bikin jackpot beneran "earned". Yang serius = berhak.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 🏆 GRAND PRIZE PROGRESS (4000 XP target) */}
        {!isPast && (
          <div className="rounded-2xl p-4 relative overflow-hidden" style={{
            background: grandPrize.eligible
              ? 'linear-gradient(135deg, #c9a961, #d4b876)'
              : 'linear-gradient(135deg, rgba(122,61,42,0.95), rgba(160,85,54,0.9))',
            color: 'white',
          }}>
            <div className="absolute -right-4 -top-2 text-7xl opacity-15">🏆</div>
            <div className="relative">
              <p className="text-[9px] tracking-[0.3em] uppercase font-bold mb-1.5 opacity-90">
                JACKPOT JUARA 1 — RP 500.000
              </p>
              <div className="flex items-baseline gap-2 mb-2">
                <p className="text-2xl font-bold" style={{ fontFamily: 'Fraunces, serif' }}>
                  {eventScore.toLocaleString('id-ID')}
                </p>
                <p className="text-sm opacity-80">/ {GRAND_PRIZE_MIN_SCORE.toLocaleString('id-ID')} XP</p>
              </div>
              <div className="h-2.5 rounded-full mb-2" style={{ background: 'rgba(255,255,255,0.25)' }}>
                <div className="h-full rounded-full transition-all" style={{
                  width: `${grandPrize.percent}%`,
                  background: grandPrize.eligible ? '#0a4d3c' : '#faf6ee',
                }} />
              </div>
              <p className="text-xs leading-snug">
                {grandPrize.eligible
                  ? '🎯 Sudah lewat threshold! Pertahankan rank #1 di leaderboard sampai event berakhir.'
                  : `Kurang ${grandPrize.gap.toLocaleString('id-ID')} XP lagi. Maksimal harian: ~410 XP (semua fitur + diversity bonus).`}
              </p>
            </div>
          </div>
        )}

        {/* ELIGIBILITY STATUS */}
        <div className="rounded-2xl p-4" style={{
          background: eligibility.eligible ? 'rgba(10,77,60,0.06)' : 'rgba(160,85,54,0.06)',
          border: `1.5px solid ${eligibility.eligible ? 'rgba(10,77,60,0.3)' : 'rgba(160,85,54,0.3)'}`,
        }}>
          <div className="flex items-center gap-2 mb-2">
            {eligibility.eligible ? <CheckCircle2 size={16} style={{ color: '#0a4d3c' }} /> : <Lock size={14} style={{ color: '#a05536' }} />}
            <p className="text-[10px] tracking-[0.3em] uppercase font-bold" style={{ color: eligibility.eligible ? '#0a4d3c' : '#a05536' }}>
              {eligibility.eligible ? 'ELIGIBLE ✨' : 'Belum Eligible'}
            </p>
          </div>
          <p className="text-xs leading-relaxed mb-3" style={{ color: '#3d2817' }}>
            {eligibility.eligible
              ? 'Kamu memenuhi semua syarat. Tetap aktif untuk menang hadiah!'
              : 'Penuhi semua syarat di bawah untuk bisa menang hadiah:'}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <ReqRow label="Streak" current={eligibility.streak} target={MIN_STREAK_DAYS} suffix="hari" met={eligibility.streak >= MIN_STREAK_DAYS} />
            <ReqRow label="Fitur dipakai" current={featuresUsedOverall} target={MIN_FEATURES_USED} suffix="fitur" met={featuresUsedOverall >= MIN_FEATURES_USED} />
            <ReqRow label="Event score" current={eventScore} target={MIN_TOTAL_SCORE} suffix="XP" met={eventScore >= MIN_TOTAL_SCORE} />
            <ReqRow label="Akun lama" current={accountEligible ? '✓' : '✗'} target="" suffix="" met={accountEligible} />
          </div>
        </div>

        {/* TODAY CHECKLIST */}
        {isActive && (
          <div className="rounded-2xl p-4" style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.1)' }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] tracking-[0.3em] uppercase font-bold flex items-center gap-1.5" style={{ color: '#0a4d3c' }}>
                <Target size={11} /> HARI INI · {featuresUsedToday}/8 fitur
              </p>
              {featuresUsedToday >= 7 && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold" style={{ background: '#c9a961', color: 'white' }}>
                  ✨ JACKPOT +50 XP
                </span>
              )}
              {featuresUsedToday >= 5 && featuresUsedToday < 7 && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold" style={{ background: 'rgba(201,169,97,0.2)', color: '#8b6b3d' }}>
                  +20 XP BONUS
                </span>
              )}
            </div>
            <div className="space-y-1.5">
              {todayProgress.map((p) => (
                <FeatureRow key={p.feature} progress={p} />
              ))}
            </div>
          </div>
        )}

        {/* PERSONAL STATS */}
        <div className="grid grid-cols-2 gap-2">
          <StatBox icon="🔥" label="Streak" value={`${eventStreak}/${MIN_STREAK_DAYS}`} color="#a05536" />
          <StatBox icon="⭐" label="Score" value={eventScore} color="#c9a961" />
        </div>

        {/* SHARE PROGRESS — viral growth CTA */}
        {isActive && (
          <button
            onClick={() => setShowShareModal(true)}
            className="w-full rounded-2xl p-4 flex items-center gap-3 active:scale-[0.98] transition-transform relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #c9a961, #d4b876)', boxShadow: '0 10px 24px -8px rgba(201,169,97,0.5)' }}
          >
            <div className="absolute -right-3 -top-3 text-6xl opacity-15">📣</div>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.25)' }}>
              <Share2 size={20} color="#0a4d3c" />
            </div>
            <div className="flex-1 text-left relative">
              <p className="text-[10px] tracking-[0.3em] uppercase font-bold mb-0.5" style={{ color: '#0a4d3c' }}>
                🎁 PAMERKAN PROGRES
              </p>
              <p className="text-sm font-bold leading-tight" style={{ color: '#0a4d3c' }}>Ajak teman + bonus +10 XP</p>
              <p className="text-[11px]" style={{ color: '#7a3d2a' }}>Caption siap pakai untuk WA / IG / Twitter</p>
            </div>
          </button>
        )}

        {/* LEADERBOARD */}
        <div className="rounded-2xl p-4" style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.1)' }}>
          <p className="text-[10px] tracking-[0.3em] uppercase font-bold mb-3 flex items-center gap-1.5" style={{ color: '#0a4d3c' }}>
            <Trophy size={11} /> LEADERBOARD TOP 20
          </p>
          {lbLoading ? (
            <p className="text-xs text-center py-4" style={{ color: '#8b6b3d' }}>Loading...</p>
          ) : leaderboard.length === 0 ? (
            <p className="text-xs text-center py-4" style={{ color: '#8b6b3d' }}>Belum ada peserta. Jadi yang pertama!</p>
          ) : (
            <div className="space-y-1">
              {leaderboard.slice(0, 20).map((user, idx) => {
                const isMe = user.uid === userId;
                const rank = idx + 1;
                const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null;
                return (
                  <div key={user.uid || idx} className="flex items-center gap-2 py-1.5 px-2 rounded-lg" style={{ background: isMe ? 'rgba(201,169,97,0.15)' : 'transparent' }}>
                    <span className="text-xs font-bold w-6 text-center" style={{ color: medal ? '#c9a961' : '#8b6b3d' }}>{medal || `#${rank}`}</span>
                    <p className="flex-1 text-sm truncate" style={{ color: isMe ? '#a05536' : '#0a4d3c', fontWeight: isMe ? 700 : 500 }}>
                      {user.displayName || 'Pengguna'} {isMe && '(Kamu)'}
                    </p>
                    <p className="text-xs font-bold" style={{ color: '#c9a961' }}>{user.challengeXp || 0} XP</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RULES */}
        <details className="rounded-2xl p-4" style={{ background: 'rgba(10,77,60,0.04)', border: '1px solid rgba(10,77,60,0.1)' }}>
          <summary className="cursor-pointer flex items-center gap-1.5 text-[10px] tracking-[0.3em] uppercase font-bold" style={{ color: '#8b6b3d' }}>
            <Info size={11} /> ATURAN LENGKAP EVENT
          </summary>
          <div className="mt-3 space-y-2.5 text-xs leading-relaxed" style={{ color: '#3d2817' }}>
            <p><b>Periode:</b> 13–22 Juni 2026 (10 hari)</p>
            <p><b>Scoring:</b> XP dari 8 fitur di-CAP per hari (anti-farming). User yang aktif di banyak fitur menang dari yang spam 1 fitur.</p>
            <p><b>Diversity Bonus:</b></p>
            <ul className="list-disc pl-5 space-y-0.5">
              <li>Pakai 5+ fitur dalam sehari → +20 XP</li>
              <li>Pakai 7+ fitur dalam sehari → +50 XP (jackpot)</li>
            </ul>
            <p><b>Syarat Menang (semua harus dipenuhi):</b></p>
            <ul className="list-disc pl-5 space-y-0.5">
              <li>Streak {MIN_STREAK_DAYS} hari tanpa putus</li>
              <li>Pakai minimum {MIN_FEATURES_USED} dari 8 fitur</li>
              <li>Min {MIN_TOTAL_SCORE} event XP total</li>
              <li>Akun terdaftar sebelum event mulai (anti alt-account)</li>
            </ul>
            <p><b>Tie-breaker:</b> kalau score sama → streak terpanjang → diversity terbanyak → total raw XP.</p>
            <p className="pt-1 italic" style={{ color: '#8b6b3d' }}>Admin akan kontak top 3 pemenang via email/admin chat untuk transfer hadiah setelah event berakhir.</p>
          </div>
        </details>
      </div>

      {/* SHARE MODAL */}
      {showShareModal && (
        <ShareEventModal
          userId={userId}
          userName={userProfile?.displayName}
          score={eventScore}
          rank={(() => {
            const myIdx = leaderboard.findIndex((u) => u.uid === userId);
            return myIdx >= 0 ? myIdx + 1 : '?';
          })()}
          streak={eventStreak}
          onClose={() => setShowShareModal(false)}
          onShared={(platformId) => {
            if (onShareBonus) onShareBonus(platformId);
          }}
        />
      )}
    </div>
  );
}

// ============================================================================
// Sub-components
// ============================================================================

function ReqRow({ label, current, target, suffix, met }) {
  return (
    <div className="rounded-xl p-2.5" style={{
      background: met ? 'rgba(10,77,60,0.06)' : 'rgba(160,85,54,0.04)',
      border: `1px solid ${met ? 'rgba(10,77,60,0.2)' : 'rgba(160,85,54,0.15)'}`,
    }}>
      <p className="text-[9px] uppercase tracking-widest" style={{ color: '#8b6b3d' }}>{label}</p>
      <div className="flex items-baseline gap-1 mt-0.5">
        <p className="text-sm font-bold" style={{ color: met ? '#0a4d3c' : '#a05536' }}>{current}</p>
        {target && <p className="text-[10px]" style={{ color: '#8b6b3d' }}>/{target}{suffix && ` ${suffix}`}</p>}
        {met && <CheckCircle2 size={12} style={{ color: '#0a4d3c', marginLeft: 'auto' }} />}
      </div>
    </div>
  );
}

function FeatureRow({ progress }) {
  return (
    <div className="flex items-center gap-2.5 py-1.5">
      <span className="text-lg flex-shrink-0">{progress.emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold leading-tight" style={{ color: progress.used ? '#0a4d3c' : '#8b6b3d' }}>
          {progress.name}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(10,77,60,0.06)' }}>
            <div className="h-full" style={{ width: `${progress.percent}%`, background: progress.used ? '#0a4d3c' : 'rgba(139,107,61,0.3)', transition: 'width 0.4s' }} />
          </div>
          <p className="text-[10px] font-bold w-12 text-right" style={{ color: progress.used ? '#0a4d3c' : '#8b6b3d' }}>
            {progress.currentXp}/{progress.capPerDay}
          </p>
        </div>
      </div>
      {progress.used && <CheckCircle2 size={14} style={{ color: '#0a4d3c', flexShrink: 0 }} />}
    </div>
  );
}

function StatBox({ icon, label, value, color }) {
  return (
    <div className="rounded-2xl p-3" style={{ background: 'white', border: `1.5px solid ${color}30` }}>
      <p className="text-2xl mb-1">{icon}</p>
      <p className="text-xl font-bold leading-tight" style={{ color, fontFamily: 'Fraunces, serif' }}>{value}</p>
      <p className="text-[10px] uppercase tracking-widest mt-0.5" style={{ color: '#8b6b3d' }}>{label}</p>
    </div>
  );
}
