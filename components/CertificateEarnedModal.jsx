// components/CertificateEarnedModal.jsx
// Modal celebration — muncul otomatis pas user baru saja menyelesaikan jalur.
// Tampil sekali (di-persist via earnedCertificates di Firestore).

'use client';

import { useEffect, useState } from 'react';
import { Award, Sparkles, X, ArrowRight } from 'lucide-react';
import { getCertificatePath } from '@/lib/certificate';

export default function CertificateEarnedModal({ pathId, recipientName, onClose, onView }) {
  const meta = getCertificatePath(pathId);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(t);
  }, []);

  if (!meta) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-5" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      {/* Confetti background dots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: `${(i * 73) % 90}%`,
            left: `${(i * 41) % 95}%`,
            fontSize: 18 + (i % 3) * 6,
            opacity: 0.7,
            transform: `rotate(${(i * 23) % 360}deg)`,
            animation: `cfloat 3s ease-in-out ${i * 0.1}s infinite`,
          }}>{['✨','🌟','🎊','🎉','⭐'][i % 5]}</div>
        ))}
      </div>

      <div className="w-full max-w-sm rounded-3xl p-6 relative" style={{
        background: '#faf6ee',
        boxShadow: '0 20px 60px -20px rgba(0,0,0,0.6)',
        transform: animate ? 'scale(1) translateY(0)' : 'scale(0.85) translateY(20px)',
        opacity: animate ? 1 : 0,
        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        {/* Close */}
        <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }} aria-label="Tutup">
          <X size={15} style={{ color: '#0a4d3c' }} />
        </button>

        {/* Hero ikon dgn watermark */}
        <div className="relative w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: meta.gradient, boxShadow: `0 12px 24px -8px ${meta.color}80` }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.2, fontSize: 90, fontFamily: 'Amiri, serif', color: 'white', lineHeight: 1 }}>ن</div>
          <Award size={42} color="white" style={{ position: 'relative', zIndex: 2 }} />
        </div>

        {/* Tagline — special untuk Master capstone */}
        <div className="text-center mb-4">
          <p className="text-[10px] tracking-[0.3em] uppercase mb-1 font-bold" style={{ color: '#c9a961' }}>
            <Sparkles size={11} className="inline mr-1" />
            {pathId === 'master' ? 'CAPSTONE TULIS NOON' : 'SERTIFIKAT DIRAIH'}
          </p>
          <h2 className="text-2xl mb-1 leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: '#0a4d3c' }}>
            {pathId === 'master'
              ? `Mabruk, ${(recipientName || 'Anda').split(' ')[0]}!`
              : `Selamat, ${(recipientName || 'Anda').split(' ')[0]}!`}
          </h2>
          <p className="text-sm" style={{ color: '#3d2817' }}>
            {pathId === 'master' ? 'Kamu menyelesaikan seluruh kurikulum' : 'Kamu telah menyelesaikan'}
          </p>
          <p className="text-base font-bold mt-1" style={{ fontFamily: 'Fraunces, serif', color: meta.color }}>{meta.title}</p>
          <p className="text-sm mt-0.5" style={{ fontFamily: 'Amiri, serif', color: meta.color }} dir="rtl">{meta.arabicTitle}</p>
        </div>

        {/* Detail */}
        <div className="rounded-2xl p-3 mb-4 text-center" style={{ background: 'white', border: `1.5px solid ${meta.color}30` }}>
          <p className="text-xs leading-relaxed" style={{ color: '#3d2817' }}>{meta.description}</p>
        </div>

        {/* CTAs */}
        <button onClick={onView} className="w-full py-3.5 rounded-2xl text-white font-bold flex items-center justify-center gap-2 mb-2" style={{ background: meta.gradient, boxShadow: `0 6px 14px -6px ${meta.color}80` }}>
          <Award size={17} /> Lihat Sertifikat <ArrowRight size={15} />
        </button>
        <button onClick={onClose} className="w-full py-3 rounded-2xl font-semibold text-sm" style={{ background: 'rgba(10,77,60,0.08)', color: '#0a4d3c' }}>
          Nanti aja
        </button>
      </div>

      <style jsx>{`
        @keyframes cfloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(15deg); }
        }
      `}</style>
    </div>
  );
}
