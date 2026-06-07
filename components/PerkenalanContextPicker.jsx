// components/PerkenalanContextPicker.jsx
// Modal picker — user pilih konteks Perkenalan Diri sebelum masuk materi:
// 1. Generic (12 materi standalone)
// 2. Akademik (Pelajar path modul #1)
// 3. Kerja (Profesional path modul #1)
// 4. Jamaah Umrah (Umrah path modul #15)

'use client';

import { X, ChevronRight, Sparkles } from 'lucide-react';

const CONTEXTS = [
  {
    id: 'generic',
    icon: '👤',
    title: 'Generic / Umum',
    desc: '12 materi step-by-step: nama, asal, umur, keluarga, hobi, tujuan, kontak, status, jamaah haji',
    badge: '4 FREE',
    color: '#0a4d3c',
    bgGradient: 'linear-gradient(135deg, #0a4d3c, #1a6b56)',
    target: 'perkenalan-diri',
  },
  {
    id: 'akademik',
    icon: '🎓',
    title: 'Akademik',
    desc: 'Buat pelajar/mahasiswa — kenalan di kelas pakai bahasa Arab Fusha (nama, asal negara, jurusan, kampus)',
    badge: 'GRATIS',
    color: '#7a3d2a',
    bgGradient: 'linear-gradient(135deg, #7a3d2a, #a05536)',
    target: 'beasiswa-1',
  },
  {
    id: 'kerja',
    icon: '💼',
    title: 'Kerja',
    desc: 'Buat profesional — perkenalan di lingkungan kerja (jabatan, perusahaan, departemen, pengalaman)',
    badge: 'GRATIS',
    color: '#8b6b3d',
    bgGradient: 'linear-gradient(135deg, #8b6b3d, #a5814f)',
    target: 'profesi-1',
  },
  {
    id: 'jamaah',
    icon: '🕋',
    title: 'Jamaah Umrah/Haji',
    desc: 'Buat jamaah — sapa & kenalan sesama jamaah dari berbagai negara di Masjidil Haram',
    badge: 'MAHIR',
    color: '#c9a961',
    bgGradient: 'linear-gradient(135deg, #c9a961, #d4b876)',
    target: 'umrah-15',
  },
];

export default function PerkenalanContextPicker({ onClose, onPick }) {
  return (
    <div
      className="fixed inset-0 z-[85] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(10,30,25,0.88)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl"
        style={{ background: 'linear-gradient(180deg, #faf6ee 0%, #f3ebd9 100%)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-2">
          <div className="flex-1">
            <p className="text-[10px] tracking-[0.3em] uppercase font-bold mb-1" style={{ color: '#c9a961' }}>
              ✨ PILIH KONTEKSMU
            </p>
            <h2 className="text-2xl leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: '#0a4d3c' }}>
              Perkenalan Diri
            </h2>
            <p className="text-sm mt-1.5" style={{ color: '#8b6b3d' }}>
              Materi disesuaikan dengan situasimu — pilih yang paling pas.
            </p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(10,77,60,0.08)' }} aria-label="Tutup">
            <X size={16} style={{ color: '#0a4d3c' }} />
          </button>
        </div>

        {/* Options */}
        <div className="px-6 pb-6 pt-2 space-y-2.5">
          {CONTEXTS.map((c) => (
            <button
              key={c.id}
              onClick={() => onPick(c.target)}
              className="w-full p-4 rounded-2xl flex items-center gap-3 text-left active:scale-[0.98] transition-transform"
              style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.1)' }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: c.bgGradient }}
              >
                {c.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className="font-bold text-base leading-tight" style={{ color: c.color }}>{c.title}</p>
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                    style={{
                      background: c.id === 'jamaah' ? 'rgba(201,169,97,0.18)' : 'rgba(10,77,60,0.1)',
                      color: c.id === 'jamaah' ? '#8b6b3d' : '#0a4d3c',
                    }}
                  >
                    {c.badge}
                  </span>
                </div>
                <p className="text-[11px] leading-snug" style={{ color: '#666' }}>{c.desc}</p>
              </div>
              <ChevronRight size={16} style={{ color: '#c9a961' }} className="flex-shrink-0" />
            </button>
          ))}
        </div>

        {/* Footer hint */}
        <div className="px-6 pb-6">
          <div className="rounded-2xl p-3 flex items-start gap-2" style={{ background: 'rgba(201,169,97,0.1)', border: '1px dashed #c9a961' }}>
            <Sparkles size={12} style={{ color: '#c9a961' }} className="flex-shrink-0 mt-0.5" />
            <p className="text-[11px] leading-snug flex-1" style={{ color: '#8b6b3d' }}>
              <strong>Tips</strong>: Kalau belum yakin, pilih <strong>Generic</strong> dulu — lebih lengkap (12 materi) & 4 pertama gratis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
