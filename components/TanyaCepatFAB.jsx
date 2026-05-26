// components/TanyaCepatFAB.jsx
// Floating Action Button untuk Tanya Cepat — lingkaran di pojok kanan bawah.
// Mencolok dengan pulse glow + label "TANYA" yang ke-reveal saat hover/tap.
//
// Position: fixed bottom-right, di atas BottomNav (z-index lebih tinggi).

'use client';

import { useState, useEffect } from 'react';
import { Mic, Sparkles, X } from 'lucide-react';

export default function TanyaCepatFAB({ onClick, hasQuotaLow = false }) {
  const [showLabel, setShowLabel] = useState(true);

  // Auto-collapse label setelah beberapa detik (less intrusive)
  useEffect(() => {
    const t = setTimeout(() => setShowLabel(false), 5000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <button
        onClick={onClick}
        className="fixed flex items-center gap-2 rounded-full active:scale-95 transition-all"
        style={{
          right: 16,
          bottom: 88, // di atas BottomNav (yang ±70px)
          zIndex: 60,
          padding: showLabel ? '14px 18px 14px 14px' : '16px',
          background: 'linear-gradient(135deg, #c9a961 0%, #d4b876 50%, #c9a961 100%)',
          boxShadow: '0 12px 28px -4px rgba(201,169,97,0.6), 0 0 0 4px rgba(255,255,255,0.8), 0 0 0 6px rgba(201,169,97,0.3)',
          animation: 'tanya-pulse 2.4s ease-in-out infinite',
        }}
        aria-label="Tanya Cepat"
      >
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.95)' }}>
          <Mic size={14} style={{ color: '#8b6b3d' }} />
        </div>
        {showLabel && (
          <div className="pr-1 max-w-[140px]">
            <p className="text-[9px] tracking-widest uppercase font-bold leading-none text-white" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
              TANYA CEPAT
            </p>
            <p className="text-[11px] font-bold text-white leading-tight mt-0.5" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
              Arab Hijazi
            </p>
          </div>
        )}
        {hasQuotaLow && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full" style={{ background: '#a05536', border: '2px solid white' }} />
        )}
      </button>

      <style jsx>{`
        @keyframes tanya-pulse {
          0%, 100% {
            box-shadow:
              0 12px 28px -4px rgba(201,169,97,0.6),
              0 0 0 4px rgba(255,255,255,0.8),
              0 0 0 6px rgba(201,169,97,0.3);
          }
          50% {
            box-shadow:
              0 16px 36px -4px rgba(201,169,97,0.75),
              0 0 0 4px rgba(255,255,255,0.95),
              0 0 0 10px rgba(201,169,97,0.15);
          }
        }
      `}</style>
    </>
  );
}
