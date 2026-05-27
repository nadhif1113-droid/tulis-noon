// components/BrandLoader.jsx
// Loader branded Tulis Noon — badge hijau membulat + huruf ن (noon) putih yang berdenyut.
// Dipakai untuk SEMUA loading state di app biar konsisten & on-brand.
//
// Usage:
//   <BrandLoader />                          → fullscreen, teks "Memuat..."
//   <BrandLoader text="Memuat ranking..." /> → custom teks
//   <BrandLoader size="sm" inline />         → kecil, inline (dalam section/card)
//   <BrandLoader text="" />                  → tanpa teks (badge aja)

'use client';

const SIZES = {
  sm: { box: 40, radius: 12, font: 24, gap: 8, text: 12 },
  md: { box: 72, radius: 20, font: 42, gap: 14, text: 14 },
  lg: { box: 96, radius: 26, font: 56, gap: 16, text: 15 },
};

export default function BrandLoader({
  text = 'Memuat...',
  size = 'md',
  inline = false,
  fullScreen = false,
  className = '',
}) {
  const s = SIZES[size] || SIZES.md;

  const badge = (
    <div className="flex flex-col items-center justify-center" style={{ gap: s.gap }}>
      {/* Badge ن berdenyut */}
      <div
        className="noon-pulse flex items-center justify-center"
        style={{
          width: s.box,
          height: s.box,
          borderRadius: s.radius,
          background: 'linear-gradient(135deg, #0a4d3c 0%, #1a6b56 100%)',
          boxShadow: '0 8px 24px rgba(10,77,60,0.28)',
        }}
        role="status"
        aria-label={text || 'Memuat'}
      >
        <span
          style={{
            fontFamily: "'Amiri', serif",
            fontSize: s.font,
            color: '#ffffff',
            lineHeight: 1,
            // Sedikit naik biar titik ن keliatan seimbang di tengah
            transform: 'translateY(-2px)',
          }}
        >
          ن
        </span>
      </div>

      {/* Teks Memuat dengan titik beranimasi */}
      {text ? (
        <div
          className="flex items-center"
          style={{ gap: 4, color: '#8b6b3d', fontSize: s.text, fontWeight: 500 }}
        >
          <span>{text.replace(/\.+$/, '')}</span>
          <span style={{ display: 'inline-flex', gap: 2 }}>
            <Dot delay="0s" />
            <Dot delay="0.2s" />
            <Dot delay="0.4s" />
          </span>
        </div>
      ) : null}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{
          minHeight: '100vh',
          width: '100%',
          background: 'linear-gradient(180deg, #faf6ee 0%, #f3ebd9 100%)',
        }}
      >
        {badge}
      </div>
    );
  }

  if (inline) {
    return <div className={`flex items-center justify-center ${className}`}>{badge}</div>;
  }

  // Default: center dalam container parent (section/card)
  return (
    <div className={`flex items-center justify-center py-10 ${className}`}>{badge}</div>
  );
}

function Dot({ delay }) {
  return (
    <span
      style={{
        width: 4,
        height: 4,
        borderRadius: '50%',
        background: '#c9a961',
        display: 'inline-block',
        animation: `noon-dots 1.2s ease-in-out ${delay} infinite`,
      }}
    />
  );
}
