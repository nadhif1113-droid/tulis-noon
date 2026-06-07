// components/CertificatesScreen.jsx
// Daftar semua sertifikat user: yang sudah diraih + yang masih progress.
// Sumber data: lib/certificate.js (CERTIFICATE_PATHS + getPathProgress).
//
// Fitur baru:
//   - Recommendation card "Lanjutkan: X" di paling atas (berdasarkan persona)
//   - Master Sertifikat (capstone) section di akhir
//   - Edit Tujuan Belajar button

'use client';

import { useState } from 'react';
import { ArrowLeft, Home, Award, Lock, ChevronRight, CheckCircle2, Trophy, ArrowRight, Target, Edit3 } from 'lucide-react';
import {
  CERTIFICATE_PATHS,
  getPathProgress,
  hasEarnedCertificate,
  countEarnedCertificates,
  getRecommendedNextLesson,
  getMasterCertificate,
  PERSONA_GOALS,
} from '@/lib/certificate';
import CertificateView from '@/components/CertificateView';
import PersonaGoalModal from '@/components/PersonaGoalModal';

export default function CertificatesScreen({ userProfile, userId, onBack, onHome, onOpenRecommendation, onUpdatePersonaGoal }) {
  const [openPathId, setOpenPathId] = useState(null);
  const [showEditPersona, setShowEditPersona] = useState(false);

  const earnedCount = countEarnedCertificates(userProfile);
  const totalCount = CERTIFICATE_PATHS.length;
  const recommendation = getRecommendedNextLesson(userProfile);
  const master = getMasterCertificate();
  const masterProgress = getPathProgress('master', userProfile);
  const masterEarned = hasEarnedCertificate('master', userProfile);
  const personaGoal = userProfile?.personaGoal || 'all';
  const personaMeta = PERSONA_GOALS.find((p) => p.id === personaGoal) || PERSONA_GOALS[PERSONA_GOALS.length - 1];

  // Hitung progress semua jalur dgn 1 pass.
  const all = CERTIFICATE_PATHS.map((p) => ({
    ...p,
    progress: getPathProgress(p.id, userProfile),
    earned: hasEarnedCertificate(p.id, userProfile),
  }));
  // Urutkan: earned dulu (paling atas), lalu by progress descending
  all.sort((a, b) => {
    if (a.earned !== b.earned) return a.earned ? -1 : 1;
    return b.progress.percent - a.progress.percent;
  });

  if (openPathId) {
    return (
      <CertificateView
        pathId={openPathId}
        userProfile={userProfile}
        userId={userId}
        onBack={() => setOpenPathId(null)}
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto" style={{ height: '100%' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 sticky top-0 z-10" style={{ background: '#faf6ee', borderBottom: '1px solid rgba(10,77,60,0.08)' }}>
        <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <ArrowLeft size={17} style={{ color: '#0a4d3c' }} />
        </button>
        <div className="flex-1">
          <p className="text-[10px] tracking-[0.2em] uppercase" style={{ color: '#8b6b3d' }}>Pencapaian</p>
          <h1 className="text-lg font-bold" style={{ fontFamily: 'Fraunces, serif', color: '#0a4d3c' }}>Sertifikat Saya</h1>
        </div>
        <button onClick={onHome} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <Home size={16} style={{ color: '#0a4d3c' }} />
        </button>
      </div>

      <div className="px-5 py-4">
        {/* RECOMMENDATION CARD — "Lanjutkan: X" */}
        {recommendation && (
          <button
            onClick={() => onOpenRecommendation && onOpenRecommendation(recommendation)}
            className="w-full text-left rounded-3xl p-4 mb-4 relative overflow-hidden active:scale-[0.99] transition-transform"
            style={{ background: recommendation.pathGradient, boxShadow: `0 12px 28px -10px ${recommendation.pathColor}80` }}
          >
            <div className="absolute -right-2 -top-2 text-7xl opacity-15">{recommendation.pathEmoji}</div>
            <div className="relative">
              <div className="flex items-center gap-1.5 mb-2">
                <Target size={11} style={{ color: '#c9a961' }} />
                <p className="text-[10px] tracking-[0.3em] uppercase font-bold" style={{ color: '#c9a961' }}>
                  {recommendation.isStart ? 'Mulai jalur baru' : 'Lanjutkan belajar'}
                </p>
              </div>
              <p className="text-[11px] text-white opacity-80 mb-0.5">{recommendation.pathTitle}</p>
              <h3 className="text-base text-white mb-2 leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700 }}>
                {recommendation.lessonIndex && `${recommendation.lessonIndex}. `}{recommendation.lessonTitle}
              </h3>
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <p className="text-[10px] text-white opacity-70">
                      {recommendation.pathCompleted}/{recommendation.pathTotal} · {recommendation.pathPercent}%
                    </p>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.2)' }}>
                    <div className="h-full" style={{ width: `${recommendation.pathPercent}%`, background: '#c9a961', transition: 'width 0.5s' }} />
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#c9a961' }}>
                  <ArrowRight size={16} color="#0a4d3c" strokeWidth={2.5} />
                </div>
              </div>
            </div>
          </button>
        )}

        {/* PERSONA EDITOR */}
        <div className="flex items-center gap-2 px-3 py-2 mb-4 rounded-2xl" style={{ background: 'rgba(201,169,97,0.1)', border: '1px dashed rgba(201,169,97,0.4)' }}>
          <span className="text-base">{personaMeta.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: '#8b6b3d' }}>Tujuan Belajarmu</p>
            <p className="text-xs font-semibold leading-tight" style={{ color: personaMeta.color }}>{personaMeta.label}</p>
          </div>
          <button
            onClick={() => setShowEditPersona(true)}
            className="px-2.5 py-1.5 rounded-lg flex items-center gap-1 text-[11px] font-semibold"
            style={{ background: 'white', color: '#8b6b3d', border: '1px solid rgba(139,107,61,0.3)' }}
          >
            <Edit3 size={11} /> Ubah
          </button>
        </div>

        {/* HERO STATS */}
        <div className="rounded-3xl p-5 mb-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a4d3c 0%, #1a6b56 100%)' }}>
          <div className="absolute -right-4 -top-2 text-7xl opacity-15">🏅</div>
          <div className="relative">
            <p className="text-[10px] tracking-[0.3em] uppercase mb-1 font-bold" style={{ color: '#c9a961' }}>PROGRES KESELURUHAN</p>
            <div className="flex items-end gap-2 mb-2">
              <p className="text-4xl text-white" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, lineHeight: 1 }}>{earnedCount}</p>
              <p className="text-lg pb-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>/ {totalCount} sertifikat</p>
            </div>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.85)' }}>
              {earnedCount === 0 ? 'Mulai belajar di tab Belajar untuk meraih sertifikat pertamamu.'
                : earnedCount === totalCount ? '🎉 Selamat! Kamu sudah menyelesaikan SEMUA jalur belajar Tulis Noon!'
                : `${totalCount - earnedCount} jalur lagi untuk lengkap. Semangat!`}
            </p>
            {/* Progress bar */}
            <div className="h-1.5 rounded-full overflow-hidden mt-3" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <div className="h-full" style={{ width: `${(earnedCount / totalCount) * 100}%`, background: '#c9a961', transition: 'width 0.5s ease' }} />
            </div>
          </div>
        </div>

        {/* DAFTAR */}
        <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#8b6b3d' }}>Daftar Sertifikat</p>
        <div className="space-y-2.5">
          {all.map((p) => {
            const isEarned = p.earned;
            const inProgress = !isEarned && p.progress.completed > 0;
            return (
              <button
                key={p.id}
                onClick={() => isEarned && setOpenPathId(p.id)}
                disabled={!isEarned}
                className="w-full text-left rounded-2xl p-4 flex items-start gap-3 active:scale-[0.98] transition-transform disabled:cursor-default"
                style={{
                  background: 'white',
                  border: isEarned ? `1.5px solid ${p.color}` : '1px solid rgba(10,77,60,0.1)',
                  boxShadow: isEarned ? `0 6px 16px -10px ${p.color}80` : 'none',
                  opacity: isEarned ? 1 : 0.95,
                }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl" style={{ background: isEarned ? p.gradient : `${p.color}10` }}>
                  {p.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {isEarned ? (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5" style={{ background: `${p.color}15`, color: p.color }}>
                        <Award size={9} /> DIRAIH
                      </span>
                    ) : inProgress ? (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(201,169,97,0.15)', color: '#a05536' }}>
                        SEDANG BELAJAR
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5" style={{ background: 'rgba(139,107,61,0.12)', color: '#8b6b3d' }}>
                        <Lock size={9} /> BELUM MULAI
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-sm leading-tight" style={{ color: '#0a4d3c' }}>{p.title}</p>
                  <p className="text-xs mb-2" style={{ color: '#8b6b3d' }}>{p.subtitle}</p>

                  {/* Progress detail */}
                  {isEarned ? (
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={12} style={{ color: p.color }} />
                      <p className="text-xs font-semibold" style={{ color: p.color }}>Sertifikat sudah diraih — tap untuk lihat</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[11px]" style={{ color: '#8b6b3d' }}>{p.progress.completed} / {p.progress.total} {p.unitLabel}</p>
                        <p className="text-[11px] font-bold" style={{ color: '#0a4d3c' }}>{p.progress.percent}%</p>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(10,77,60,0.08)' }}>
                        <div className="h-full" style={{ width: `${p.progress.percent}%`, background: p.color, transition: 'width 0.5s ease' }} />
                      </div>
                    </>
                  )}
                </div>
                {isEarned && <ChevronRight size={16} style={{ color: p.color, flexShrink: 0, marginTop: 6 }} />}
              </button>
            );
          })}
        </div>

        {/* MASTER CAPSTONE — terkunci sampai 7 selesai */}
        <p className="text-xs tracking-widest uppercase mt-6 mb-3" style={{ color: '#c9a961' }}>🏅 Capstone</p>
        <button
          onClick={() => masterEarned && setOpenPathId('master')}
          disabled={!masterEarned}
          className="w-full text-left rounded-3xl p-5 relative overflow-hidden active:scale-[0.98] transition-transform disabled:cursor-default"
          style={{
            background: masterEarned ? master.gradient : 'white',
            border: masterEarned ? `2px solid ${master.color}` : '2px dashed rgba(201,169,97,0.5)',
            boxShadow: masterEarned ? `0 16px 32px -12px ${master.color}99` : 'none',
          }}
        >
          {masterEarned && <div className="absolute -right-2 -top-2 text-7xl opacity-15">🏅</div>}
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ background: masterEarned ? 'rgba(255,255,255,0.15)' : 'rgba(201,169,97,0.1)' }}
              >
                {masterEarned ? '🏅' : '🔒'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] tracking-[0.3em] uppercase font-bold mb-0.5" style={{ color: masterEarned ? '#c9a961' : '#8b6b3d' }}>
                  {masterEarned ? 'DIRAIH ✨' : 'BELUM TERKUNCI'}
                </p>
                <p className="font-bold text-base leading-tight" style={{ fontFamily: 'Fraunces, serif', color: masterEarned ? 'white' : '#0a4d3c' }}>
                  {master.title}
                </p>
                <p className="text-sm" style={{ fontFamily: 'Amiri, serif', color: masterEarned ? '#c9a961' : '#8b6b3d' }} dir="rtl">{master.arabicTitle}</p>
              </div>
            </div>
            <p className="text-xs mb-3 leading-relaxed" style={{ color: masterEarned ? 'rgba(255,255,255,0.9)' : '#3d2817' }}>
              {masterEarned
                ? 'Pencapaian luar biasa! Kamu telah menyelesaikan seluruh kurikulum Tulis Noon.'
                : 'Selesaikan SEMUA 7 sertifikat di atas untuk membuka Master Tulis Noon — capstone pencapaian.'}
            </p>
            {!masterEarned && (
              <>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[11px]" style={{ color: '#8b6b3d' }}>{masterProgress.completed} / 7 sertifikat selesai</p>
                  <p className="text-[11px] font-bold" style={{ color: '#c9a961' }}>{masterProgress.percent}%</p>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(201,169,97,0.15)' }}>
                  <div className="h-full" style={{ width: `${masterProgress.percent}%`, background: 'linear-gradient(90deg, #c9a961, #d4b876)', transition: 'width 0.5s' }} />
                </div>
              </>
            )}
            {masterEarned && (
              <div className="flex items-center justify-center gap-1.5 mt-1">
                <Trophy size={14} color="#c9a961" />
                <p className="text-xs font-bold" style={{ color: '#c9a961' }}>Tap untuk lihat sertifikat capstone →</p>
              </div>
            )}
          </div>
        </button>

        {/* INFO BAWAH */}
        <div className="rounded-2xl p-4 mt-5" style={{ background: '#faf6ee', borderLeft: '4px solid #c9a961' }}>
          <p className="text-sm font-bold mb-1" style={{ color: '#0a4d3c' }}>Tentang Sertifikat Tulis Noon</p>
          <p className="text-xs leading-relaxed" style={{ color: '#3d2817' }}>
            Sertifikat diberikan saat kamu menyelesaikan <b>SELURUH</b> pelajaran/modul dalam satu jalur belajar. Tiap sertifikat punya nomor unik dan tanggal Hijriah + Masehi. Bisa di-screenshot, dicetak, atau dibagikan ke media sosial. <b>Master Tulis Noon</b> adalah capstone — diraih setelah semua 7 sertifikat selesai.
          </p>
        </div>
      </div>

      {/* MODAL EDIT PERSONA */}
      {showEditPersona && (
        <PersonaGoalModal
          allowDismiss={true}
          onClose={() => setShowEditPersona(false)}
          onSelect={async (goalId) => {
            if (onUpdatePersonaGoal) await onUpdatePersonaGoal(goalId);
            setShowEditPersona(false);
          }}
        />
      )}
    </div>
  );
}
