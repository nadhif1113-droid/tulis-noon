// components/HafalanMotivasiModal.jsx
// Pop-up motivasi tiap masuk Hafalan — kasih semangat dgn hadis tentang
// keutamaan menghafal Quran: mahkota cahaya untuk orang tua di hari kiamat.
// Sumber: HR. Hakim 2087 (versi lengkap dialog orang tua di akhirat).

'use client';

import { X, Sparkles } from 'lucide-react';

export default function HafalanMotivasiModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(10,30,25,0.85)' }}
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
              ✨ Niat Mulai
            </p>
            <h2 className="text-2xl leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: '#0a4d3c' }}>
              Hadiah untuk Orang Tua
            </h2>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(10,77,60,0.08)' }} aria-label="Tutup">
            <X size={16} style={{ color: '#0a4d3c' }} />
          </button>
        </div>

        <div className="px-6 pb-6">
          {/* Hero ilustrasi */}
          <div className="rounded-3xl p-6 mb-4 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #c9a961, #d4b876)' }}>
            <div className="absolute inset-0 opacity-15" style={{ background: 'radial-gradient(circle at 50% 30%, white 0%, transparent 60%)' }} />
            <div className="relative">
              <div className="text-6xl mb-2">👑</div>
              <p className="text-base text-white opacity-95 font-semibold leading-tight" style={{ fontFamily: 'Fraunces, serif' }}>
                Mahkota Cahaya dari Surga
              </p>
            </div>
          </div>

          {/* Hadis Arabic */}
          <div className="rounded-2xl p-4 mb-4" style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.1)' }}>
            <p
              className="leading-loose mb-3 text-center"
              style={{ fontFamily: 'Amiri, serif', fontSize: '18px', color: '#0a4d3c', direction: 'rtl' }}
            >
              مَنْ قَرَأَ الْقُرْآنَ وَتَعَلَّمَ وَعَمِلَ بِهِ، أُلْبِسَ وَالِدَاهُ يَوْمَ الْقِيَامَةِ تَاجًا مِنْ نُورٍ ضَوْءُهُ مِثْلُ ضَوْءِ الشَّمْسِ، وَيُكْسَى وَالِدَاهُ حُلَّتَيْنِ لَا تَقُومُ لَهُمَا الدُّنْيَا، فَيَقُولَانِ: بِمَ كُسِينَا هَذَا؟ فَيُقَالُ: بِأَخْذِ وَلَدِكُمَا الْقُرْآنَ
            </p>

            <div style={{ borderTop: '1px dashed rgba(10,77,60,0.15)', paddingTop: '12px' }}>
              <p className="text-sm leading-relaxed" style={{ color: '#3d2817' }}>
                <em>
                  "Barangsiapa membaca Al-Quran, mempelajari, dan mengamalkannya, maka pada Hari Kiamat kedua orang tuanya akan dipakaikan <strong>mahkota dari cahaya</strong> yang sinarnya seperti cahaya matahari.
                </em>
              </p>
              <p className="text-sm leading-relaxed mt-2" style={{ color: '#3d2817' }}>
                <em>
                  Kedua orang tuanya juga dipakaikan dua perhiasan yang tidak ternilai dengan dunia ini. Lalu keduanya bertanya: <strong>'Karena apa kami diberi ini?'</strong> Dijawab: <strong>'Karena anakmu mempelajari Al-Quran.'"</strong>
                </em>
              </p>
              <p className="text-[10px] mt-3 font-bold text-right" style={{ color: '#c9a961' }}>
                — HR. Al-Hakim no. 2087 · Abu Dawud no. 1453
              </p>
            </div>
          </div>

          {/* Niatan box */}
          <div className="rounded-2xl p-4 mb-4" style={{ background: 'linear-gradient(135deg, rgba(10,77,60,0.08), rgba(201,169,97,0.08))', border: '1.5px solid rgba(10,77,60,0.15)' }}>
            <p className="text-[10px] uppercase tracking-widest font-bold mb-1.5" style={{ color: '#0a4d3c' }}>Niatkan dalam hati</p>
            <p className="text-sm leading-relaxed italic" style={{ color: '#3d2817' }}>
              "Ya Allah, mudahkan aku menghafal Al-Quran. Jadikan hafalan ini hadiah untuk kedua orang tuaku di akhirat — pakaikan mereka mahkota cahaya dari kebaikan ini."
            </p>
          </div>

          {/* Reminder */}
          <div className="rounded-2xl p-3 mb-4" style={{ background: 'rgba(201,169,97,0.1)', border: '1px dashed #c9a961' }}>
            <p className="text-xs leading-relaxed" style={{ color: '#8b6b3d' }}>
              <strong>Mulai dari Al-Fatihah</strong> dan surat-surat Juz Amma. Pelan-pelan, konsisten setiap hari. Yang penting bukan cepat — tapi <em>jaga niat & istiqamah</em>.
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)', boxShadow: '0 10px 24px -8px rgba(10,77,60,0.5)' }}
          >
            <Sparkles size={18} /> Bismillah, Mulai Menghafal
          </button>
        </div>
      </div>
    </div>
  );
}
