// components/CertificatesScreen.jsx
// Daftar semua sertifikat user: yang sudah diraih + yang masih progress.
// Sumber data: lib/certificate.js (CERTIFICATE_PATHS + getPathProgress).

'use client';

import { useState } from 'react';
import { ArrowLeft, Home, Award, Lock, ChevronRight, CheckCircle2, Trophy } from 'lucide-react';
import { CERTIFICATE_PATHS, getPathProgress, hasEarnedCertificate, countEarnedCertificates } from '@/lib/certificate';
import CertificateView from '@/components/CertificateView';

export default function CertificatesScreen({ userProfile, userId, onBack, onHome }) {
  const [openPathId, setOpenPathId] = useState(null);

  const earnedCount = countEarnedCertificates(userProfile);
  const totalCount = CERTIFICATE_PATHS.length;

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

        {/* INFO BAWAH */}
        <div className="rounded-2xl p-4 mt-5" style={{ background: '#faf6ee', borderLeft: '4px solid #c9a961' }}>
          <p className="text-sm font-bold mb-1" style={{ color: '#0a4d3c' }}>Tentang Sertifikat Tulis Noon</p>
          <p className="text-xs leading-relaxed" style={{ color: '#3d2817' }}>
            Sertifikat diberikan saat kamu menyelesaikan <b>SELURUH</b> pelajaran/modul dalam satu jalur belajar. Tiap sertifikat punya nomor unik dan tanggal Hijriah + Masehi. Bisa di-screenshot, dicetak, atau dibagikan ke media sosial.
          </p>
        </div>
      </div>
    </div>
  );
}
