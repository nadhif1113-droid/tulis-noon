// components/CertificateView.jsx
// Tampilan sertifikat — full screen, indah, siap di-screenshot.
// User bisa lihat, screenshot, share, atau cetak via print dialog.

'use client';

import { useRef } from 'react';
import { ArrowLeft, Share2, Printer, Download } from 'lucide-react';
import { getCertificateData, getCertificatePath, formatHijriDate, formatGregorianDate } from '@/lib/certificate';

export default function CertificateView({ pathId, userProfile, userId, onBack }) {
  const certRef = useRef(null);
  const data = getCertificateData(pathId, userProfile, userId);
  if (!data) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 text-center">
        <p className="text-sm" style={{ color: '#8b6b3d' }}>Sertifikat tidak ditemukan.</p>
      </div>
    );
  }

  const { meta, recipientName, earnedAt, certNumber } = data;
  const hijri = formatHijriDate(earnedAt);
  const gregorian = formatGregorianDate(earnedAt);

  const handleShare = async () => {
    const shareText = `🎓 Aku telah meraih sertifikat "${meta.title}" dari Tulis Noon!\n\nNomor: ${certNumber}\nTanggal: ${gregorian}\n\nDapatkan juga di https://tulis-noon.vercel.app`;
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ title: `Sertifikat ${meta.title}`, text: shareText });
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        alert('Teks sertifikat sudah disalin ke clipboard!');
      }
    } catch (e) {}
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{ height: '100%', background: '#1a1a1a' }}>
      {/* Header (hilang saat print) */}
      <div className="flex items-center gap-3 px-5 py-3 sticky top-0 z-10 print:hidden" style={{ background: 'rgba(26,26,26,0.95)', backdropFilter: 'blur(10px)' }}>
        <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <ArrowLeft size={17} color="white" />
        </button>
        <div className="flex-1">
          <p className="text-[10px] tracking-[0.2em] uppercase" style={{ color: '#c9a961' }}>Sertifikat</p>
          <h1 className="text-base font-bold text-white truncate" style={{ fontFamily: 'Fraunces, serif' }}>{meta.title}</h1>
        </div>
        <button onClick={handleShare} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }} aria-label="Bagikan">
          <Share2 size={15} color="white" />
        </button>
        <button onClick={handlePrint} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }} aria-label="Cetak">
          <Printer size={15} color="white" />
        </button>
      </div>

      {/* Wrapper buat tengah-in sertifikat saat print/screenshot */}
      <div className="px-3 py-5 flex items-center justify-center print:p-0">
        {/* SERTIFIKAT */}
        <div ref={certRef} className="w-full max-w-xl relative" style={{
          background: 'linear-gradient(180deg, #fef9ee 0%, #faf3df 100%)',
          border: `8px double ${meta.color}`,
          borderRadius: 12,
          padding: '32px 28px',
          boxShadow: '0 20px 60px -20px rgba(0,0,0,0.5)',
          aspectRatio: '1 / 1.414', // A4-ish portrait
          maxWidth: 480,
        }}>
          {/* Watermark ن */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            opacity: 0.06,
            fontSize: 280,
            fontFamily: 'Amiri, serif',
            color: meta.color,
            fontWeight: 700,
            lineHeight: 1,
          }}>ن</div>

          {/* Ornamen pojok */}
          <div style={{ position: 'absolute', top: 14, left: 14, width: 32, height: 32, border: `2px solid ${meta.color}`, borderRight: 'none', borderBottom: 'none', borderRadius: '4px 0 0 0' }} />
          <div style={{ position: 'absolute', top: 14, right: 14, width: 32, height: 32, border: `2px solid ${meta.color}`, borderLeft: 'none', borderBottom: 'none', borderRadius: '0 4px 0 0' }} />
          <div style={{ position: 'absolute', bottom: 14, left: 14, width: 32, height: 32, border: `2px solid ${meta.color}`, borderRight: 'none', borderTop: 'none', borderRadius: '0 0 0 4px' }} />
          <div style={{ position: 'absolute', bottom: 14, right: 14, width: 32, height: 32, border: `2px solid ${meta.color}`, borderLeft: 'none', borderTop: 'none', borderRadius: '0 0 4px 0' }} />

          {/* Isi */}
          <div className="relative h-full flex flex-col" style={{ zIndex: 2 }}>
            {/* HEADER */}
            <div className="text-center">
              <div className="inline-block px-3 py-1 rounded-full mb-2" style={{ background: meta.color }}>
                <p className="text-[9px] tracking-[0.3em] uppercase font-bold text-white">TULIS NOON</p>
              </div>
              <div className="text-3xl mb-1" style={{ fontFamily: 'Amiri, serif', color: meta.color, fontWeight: 700 }} dir="rtl">شَهَادَةُ إِتْمَامٍ</div>
              <h2 className="text-lg mb-0.5" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: meta.color }}>SERTIFIKAT PENYELESAIAN</h2>
              <p className="text-[10px] italic" style={{ color: '#8b6b3d' }}>Certificate of Completion</p>
            </div>

            {/* DIVIDER */}
            <div className="my-3 flex items-center gap-2 justify-center">
              <div style={{ height: 1, flex: 1, background: `${meta.color}40`, maxWidth: 60 }} />
              <div className="text-base" style={{ color: meta.color }}>{meta.emoji}</div>
              <div style={{ height: 1, flex: 1, background: `${meta.color}40`, maxWidth: 60 }} />
            </div>

            {/* RECIPIENT */}
            <div className="text-center mb-3">
              <p className="text-[10px] tracking-widest uppercase mb-1.5" style={{ color: '#8b6b3d' }}>Diberikan kepada</p>
              <p className="text-2xl mb-1 pb-1.5" style={{
                fontFamily: 'Fraunces, serif',
                fontWeight: 700,
                color: '#1a1a1a',
                borderBottom: `1.5px solid ${meta.color}80`,
                display: 'inline-block',
                padding: '0 12px',
              }}>{recipientName}</p>
            </div>

            {/* JUDUL JALUR */}
            <div className="text-center mb-3">
              <p className="text-[10px] tracking-widest uppercase mb-1.5" style={{ color: '#8b6b3d' }}>Atas penyelesaian</p>
              <h3 className="text-lg mb-1 leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: meta.color }}>{meta.title}</h3>
              <p className="text-base" style={{ fontFamily: 'Amiri, serif', color: meta.color, fontWeight: 600 }} dir="rtl">{meta.arabicTitle}</p>
            </div>

            {/* DESKRIPSI */}
            <div className="text-center px-2 mb-4">
              <p className="text-[10px] leading-relaxed italic" style={{ color: '#3d2817' }}>{meta.description}</p>
            </div>

            {/* INFO BAWAH */}
            <div className="mt-auto">
              {/* Tanggal */}
              <div className="text-center mb-3">
                <p className="text-[9px] tracking-widest uppercase mb-0.5" style={{ color: '#8b6b3d' }}>Tanggal</p>
                <p className="text-xs font-semibold" style={{ color: '#1a1a1a' }}>{gregorian}</p>
                {hijri && <p className="text-[10px] italic" style={{ color: '#8b6b3d', fontFamily: 'Amiri, serif' }}>{hijri}</p>}
              </div>

              {/* Tanda tangan / nomor */}
              <div className="flex items-end justify-between gap-3 pt-2" style={{ borderTop: `1px dashed ${meta.color}40` }}>
                <div className="text-center flex-1">
                  <p className="text-base mb-0.5 pb-0.5" style={{ fontFamily: 'Fraunces, serif', color: meta.color, fontWeight: 700, fontStyle: 'italic', borderBottom: '1px solid #3d2817' }}>Tulis Noon</p>
                  <p className="text-[9px]" style={{ color: '#8b6b3d' }}>Pendiri & Tim Akademik</p>
                </div>
                <div className="text-center flex-1">
                  <div className="inline-block w-12 h-12 rounded-full flex items-center justify-center mb-0.5" style={{ background: `${meta.color}15`, border: `2px solid ${meta.color}` }}>
                    <div className="text-base font-bold" style={{ fontFamily: 'Amiri, serif', color: meta.color }}>ن</div>
                  </div>
                  <p className="text-[8px] tracking-wide uppercase font-bold" style={{ color: '#8b6b3d' }}>Tulis Noon</p>
                  <p className="text-[8px]" style={{ color: '#8b6b3d' }}>Seal of Excellence</p>
                </div>
              </div>

              {/* Nomor sertifikat */}
              <p className="text-center text-[9px] mt-3 font-mono" style={{ color: '#8b6b3d' }}>
                Nomor: <span style={{ color: meta.color, fontWeight: 700 }}>{certNumber}</span>
              </p>
              <p className="text-center text-[8px] mt-0.5" style={{ color: '#8b6b3d' }}>
                Verifikasi keaslian di tulis-noon.vercel.app/verify
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips (hilang saat print) */}
      <div className="px-5 pb-6 print:hidden">
        <div className="max-w-xl mx-auto rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(201,169,97,0.3)' }}>
          <p className="text-xs font-bold mb-2" style={{ color: '#c9a961' }}>📸 Simpan sertifikatmu</p>
          <ul className="text-[11px] space-y-1" style={{ color: 'rgba(255,255,255,0.75)' }}>
            <li>• Ambil <b>screenshot</b> halaman ini untuk menyimpan sebagai gambar</li>
            <li>• Tekan tombol <b>Cetak</b> di atas untuk simpan sebagai PDF</li>
            <li>• Tekan tombol <b>Bagikan</b> untuk share ke media sosial / WhatsApp</li>
          </ul>
        </div>
      </div>

      {/* Print CSS — sertifikat full A4 saat dicetak */}
      <style jsx>{`
        @media print {
          @page { size: A4 portrait; margin: 10mm; }
          body, html { background: white !important; }
        }
      `}</style>
    </div>
  );
}
