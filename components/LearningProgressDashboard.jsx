// components/LearningProgressDashboard.jsx
// Status belajar user — render di Profile screen.
// Show overall % + per-section progress bar + sertifikat earned summary.

'use client';

import { useMemo } from 'react';
import { BookOpen, GraduationCap, Sparkles, Users, Award, Trophy, ChevronRight, TrendingUp } from 'lucide-react';
import { LEARNING_UMRAH } from '@/data/learning-umrah';
import { LEARNING_PROFESIONAL } from '@/data/learning-profesional';
import { LEARNING_PELAJAR } from '@/data/learning-pelajar';
import { PERKENALAN_MATERI } from '@/data/perkenalan-diri-materi';
import { NAHWU_LESSONS } from '@/data/learning-nahwu';
import { SHORF_LESSONS } from '@/data/learning-shorf';
import { CERITA_STORIES } from '@/data/cerita-stories';
import { HAFALAN_SURAT } from '@/data/hafalan-surat';
import { buildLearningDashboard } from '@/lib/learning-progress';

export default function LearningProgressDashboard({ userProfile, onOpenCertificates, onOpenSection }) {
  const dashboard = useMemo(() => {
    const totals = {
      umrah: LEARNING_UMRAH.length,
      profesi: LEARNING_PROFESIONAL.length,
      pelajar: LEARNING_PELAJAR.length,
      perkenalan: PERKENALAN_MATERI.length,
      nahwu: NAHWU_LESSONS.length,
      shorf: SHORF_LESSONS.length,
      cerita: CERITA_STORIES.length,
      hafalan: HAFALAN_SURAT.length,
    };
    return buildLearningDashboard(userProfile, totals);
  }, [userProfile]);

  const certificatesEarned = (userProfile?.certificates || userProfile?.earnedCertificates || []).length;

  const sections = [
    { key: 'umrah',      label: 'Modul Umrah',     emoji: '🕋', color: '#0a4d3c', stat: dashboard.lesson.umrah, action: () => onOpenSection?.('umrah') },
    { key: 'profesi',    label: 'Modul Profesi',   emoji: '💼', color: '#8b6b3d', stat: dashboard.lesson.profesi, action: () => onOpenSection?.('profesi') },
    { key: 'pelajar',    label: 'Modul Pelajar',   emoji: '🎓', color: '#7a3d2a', stat: dashboard.lesson.beasiswa.total > 0 ? dashboard.lesson.beasiswa : dashboard.lesson.pelajar, action: () => onOpenSection?.('pelajar') },
    { key: 'perkenalan', label: 'Perkenalan Diri', emoji: '👋', color: '#a05536', stat: dashboard.perkenalan, action: () => onOpenSection?.('perkenalan-diri') },
    { key: 'nahwu',      label: 'Nahwu',           emoji: '🧮', color: '#0a4d3c', stat: dashboard.nahwu, action: () => onOpenSection?.('nahwu') },
    { key: 'shorf',      label: 'Shorf',           emoji: '🌿', color: '#1a6b56', stat: dashboard.shorf, action: () => onOpenSection?.('shorf') },
    { key: 'cerita',     label: 'Cerita Interaktif', emoji: '📖', color: '#c9a961', stat: dashboard.cerita, action: () => onOpenSection?.('cerita') },
    { key: 'hafalan',    label: 'Hafalan Juz 30',  emoji: '📿', color: '#0a4d3c', stat: dashboard.hafalan, action: () => onOpenSection?.('hafalan') },
  ].filter((s) => s.stat.total > 0);

  return (
    <div className="space-y-4">
      {/* HEADER OVERALL */}
      <div className="rounded-2xl p-4 relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)',
      }}>
        <div className="absolute -right-4 -top-2 text-7xl opacity-15">📊</div>
        <div className="relative">
          <p className="text-[10px] tracking-[0.3em] uppercase font-bold mb-1" style={{ color: '#c9a961' }}>
            STATUS BELAJAR
          </p>
          <div className="flex items-baseline gap-2 mb-2">
            <p className="text-3xl font-bold text-white" style={{ fontFamily: 'Fraunces, serif' }}>
              {dashboard.overall.percent}%
            </p>
            <p className="text-xs text-white opacity-80">
              {dashboard.overall.completed.toLocaleString('id-ID')} / {dashboard.overall.total.toLocaleString('id-ID')} materi
            </p>
          </div>
          <div className="h-2 rounded-full mb-3" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <div className="h-full rounded-full transition-all" style={{
              width: `${dashboard.overall.percent}%`,
              background: '#c9a961',
            }} />
          </div>
          <div className="flex items-center gap-3 text-xs text-white opacity-90">
            <span>📚 {sections.length} kategori</span>
            <span>•</span>
            <span>🏆 {certificatesEarned} sertifikat</span>
          </div>
        </div>
      </div>

      {/* SERTIFIKAT CTA */}
      <button
        onClick={onOpenCertificates}
        className="w-full rounded-2xl p-3.5 flex items-center gap-3 active:scale-[0.98]"
        style={{
          background: 'linear-gradient(135deg, rgba(201,169,97,0.15), rgba(212,184,118,0.08))',
          border: '1.5px solid rgba(201,169,97,0.4)',
        }}
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(201,169,97,0.25)' }}>
          <Trophy size={18} style={{ color: '#8b6b3d' }} />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-bold" style={{ color: '#0a4d3c' }}>
            Sertifikat ({certificatesEarned})
          </p>
          <p className="text-[11px]" style={{ color: '#8b6b3d' }}>
            {certificatesEarned === 0
              ? 'Selesaikan path apa pun untuk dapat sertifikat pertama'
              : `Lihat semua sertifikat & download bukti kelulusan`}
          </p>
        </div>
        <ChevronRight size={16} style={{ color: '#8b6b3d' }} />
      </button>

      {/* PER-SECTION BREAKDOWN */}
      <div>
        <p className="text-[10px] tracking-[0.25em] uppercase font-bold mb-2 px-1" style={{ color: '#8b6b3d' }}>
          Per Kategori
        </p>
        <div className="space-y-2">
          {sections.map((s) => (
            <button
              key={s.key}
              onClick={s.action}
              className="w-full rounded-2xl p-3 flex items-center gap-3 text-left active:scale-[0.98] transition-transform"
              style={{
                background: 'white',
                border: s.stat.isCompleted ? '1.5px solid rgba(10,77,60,0.4)' : '1px solid rgba(10,77,60,0.08)',
              }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{
                background: s.stat.isCompleted ? '#0a4d3c' : `${s.color}15`,
              }}>
                {s.stat.isCompleted ? '✓' : s.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-sm font-semibold" style={{ color: s.color }}>{s.label}</p>
                  <p className="text-xs font-bold" style={{ color: s.stat.isCompleted ? '#0a4d3c' : '#8b6b3d' }}>
                    {s.stat.completed}/{s.stat.total}
                  </p>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: 'rgba(10,77,60,0.08)' }}>
                  <div className="h-full rounded-full transition-all" style={{
                    width: `${s.stat.percent}%`,
                    background: s.stat.isCompleted ? '#0a4d3c' : s.color,
                  }} />
                </div>
              </div>
              <ChevronRight size={14} style={{ color: '#c9a961' }} className="flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* INSPIRATION */}
      {dashboard.overall.percent < 100 && (
        <div className="rounded-2xl p-3 flex items-start gap-3" style={{
          background: 'rgba(201,169,97,0.08)', border: '1px dashed rgba(201,169,97,0.4)',
        }}>
          <TrendingUp size={16} style={{ color: '#8b6b3d', flexShrink: 0, marginTop: 2 }} />
          <div>
            <p className="text-xs font-bold mb-0.5" style={{ color: '#0a4d3c' }}>
              {dashboard.overall.percent < 25
                ? 'Awal yang baik!'
                : dashboard.overall.percent < 50
                ? 'Sudah seperempat jalan'
                : dashboard.overall.percent < 75
                ? 'Hampir setengah perjalanan!'
                : 'Tinggal sedikit lagi!'}
            </p>
            <p className="text-[11px] leading-snug" style={{ color: '#3d2817' }}>
              {dashboard.overall.total - dashboard.overall.completed} materi lagi untuk selesai semua. Konsisten 10 menit/hari lebih baik dari maraton sekali seminggu.
            </p>
          </div>
        </div>
      )}

      {dashboard.overall.percent >= 100 && (
        <div className="rounded-2xl p-4 text-center" style={{
          background: 'linear-gradient(135deg, #c9a961, #d4b876)',
        }}>
          <p className="text-3xl mb-1">🏆</p>
          <p className="text-sm font-bold mb-1" style={{ color: '#0a4d3c' }}>
            Mabruk! Semua materi selesai!
          </p>
          <p className="text-xs" style={{ color: '#0a4d3c' }}>
            Cek halaman sertifikat untuk koleksi achievement-mu.
          </p>
        </div>
      )}
    </div>
  );
}
