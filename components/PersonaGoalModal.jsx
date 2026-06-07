// components/PersonaGoalModal.jsx
// Modal yang muncul SEKALI untuk user yang belum set personaGoal.
// Hasil disimpan di Firestore → dipakai recommendation engine.

'use client';

import { useState } from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { PERSONA_GOALS } from '@/lib/certificate';

export default function PersonaGoalModal({ onSelect, onClose, allowDismiss = false }) {
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleConfirm = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await onSelect(selected);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(10, 77, 60, 0.5)', backdropFilter: 'blur(4px)' }}
      onClick={allowDismiss ? onClose : undefined}
    >
      <div
        className="w-full max-w-md mx-auto rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        style={{ background: '#fdfaf4', maxHeight: '92vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 text-center" style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)' }}>
          <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-3xl" style={{ background: 'rgba(255,255,255,0.2)' }}>
            🎯
          </div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-white opacity-80 font-bold mb-1">
            Tentukan Tujuanmu
          </p>
          <h2 className="text-xl text-white" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700 }}>
            Apa tujuan utamamu belajar Arab?
          </h2>
          <p className="text-xs text-white opacity-85 mt-2 leading-relaxed px-2">
            Pilih satu — kami akan kasih rekomendasi & jalur sertifikat yang paling pas untukmu.
          </p>
        </div>

        {/* Options */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          {PERSONA_GOALS.map((goal) => {
            const isSelected = selected === goal.id;
            return (
              <button
                key={goal.id}
                onClick={() => setSelected(goal.id)}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl text-left transition-all active:scale-[0.98]"
                style={{
                  background: isSelected ? `${goal.color}15` : 'white',
                  border: isSelected ? `2px solid ${goal.color}` : '1.5px solid rgba(10,77,60,0.1)',
                  boxShadow: isSelected ? `0 6px 20px -8px ${goal.color}40` : 'none',
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: isSelected ? goal.color : `${goal.color}15` }}
                >
                  {goal.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-base leading-tight" style={{ color: goal.color }}>
                    {goal.label}
                  </p>
                  <p className="text-xs leading-snug mt-0.5" style={{ color: '#666' }}>
                    {goal.sublabel}
                  </p>
                </div>
                {isSelected ? (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: goal.color }}>
                    <Check size={14} color="white" strokeWidth={3} />
                  </div>
                ) : (
                  <ChevronRight size={18} style={{ color: '#c9a961' }} className="flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <div className="p-4 border-t" style={{ borderColor: 'rgba(10,77,60,0.08)' }}>
          <button
            onClick={handleConfirm}
            disabled={!selected || saving}
            className="w-full py-3.5 rounded-2xl font-bold text-white transition-all active:scale-[0.98] disabled:opacity-50"
            style={{
              background: selected ? 'linear-gradient(135deg, #0a4d3c, #1a6b56)' : '#8b6b3d',
              boxShadow: selected ? '0 10px 24px -8px rgba(10,77,60,0.5)' : 'none',
            }}
          >
            {saving ? 'Menyimpan...' : selected ? 'Lanjut' : 'Pilih dulu salah satu'}
          </button>
          <p className="text-[11px] text-center mt-2.5" style={{ color: '#8b6b3d' }}>
            Bisa diubah kapan saja di <span className="font-semibold">Profil → Edit Tujuan</span>
          </p>
        </div>
      </div>
    </div>
  );
}
