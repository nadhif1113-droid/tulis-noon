// components/InsightCard.jsx
// Card "Pemahaman" yang muncul di akhir tiap percakapan dalam lesson.
// Fetch insight dari /api/insight (cached at server).
//
// States:
//  - loading: skeleton placeholder
//  - error: fallback (kasih retry button)
//  - loaded: render 3-4 section

'use client';

import { useEffect, useState, useRef } from 'react';
import { Lightbulb, Globe2, Sparkles, BookOpen, Volume2, RefreshCw } from 'lucide-react';
import { speakArabic } from '@/lib/tts';

export default function InsightCard({ moduleId, convId, payload, userId }) {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchedKey = useRef(null);

  useEffect(() => {
    if (!moduleId || !convId || !payload) return;
    const key = `${moduleId}::${convId}`;
    if (fetchedKey.current === key) return;
    fetchedKey.current = key;

    setLoading(true);
    setError(null);
    setInsight(null);

    fetch('/api/insight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ moduleId, convId, payload, userId }),
    })
      .then(async (r) => {
        if (!r.ok) {
          const t = await r.text();
          throw new Error(`HTTP ${r.status}: ${t.substring(0, 100)}`);
        }
        return r.json();
      })
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setInsight(data);
      })
      .catch((e) => {
        console.error('[InsightCard]', e);
        setError(e.message);
      })
      .finally(() => setLoading(false));
  }, [moduleId, convId, payload, userId]);

  const handleRetry = () => {
    fetchedKey.current = null;
    setError(null);
    setInsight(null);
    setLoading(true);
    // Re-trigger via state change (parent will pass same payload, useEffect will retry)
    setTimeout(() => {
      const evt = new Event('insight-retry');
      window.dispatchEvent(evt);
    }, 10);
  };

  if (loading) return <InsightSkeleton />;
  if (error) return <InsightError error={error} onRetry={handleRetry} />;
  if (!insight) return null;

  return (
    <div className="rounded-3xl p-5 mt-4 mb-2" style={{
      background: 'linear-gradient(135deg, rgba(201,169,97,0.08) 0%, rgba(160,85,54,0.05) 100%)',
      border: '1.5px solid rgba(201,169,97,0.35)',
      boxShadow: '0 8px 24px -12px rgba(201,169,97,0.25)',
    }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #c9a961, #d4b876)' }}>
          <Lightbulb size={14} color="white" strokeWidth={2.5} />
        </div>
        <p className="text-[11px] tracking-[0.3em] uppercase font-bold" style={{ color: '#8b6b3d' }}>Pemahaman</p>
      </div>

      {/* Frasa Kunci */}
      {insight.keyPhrases && insight.keyPhrases.length > 0 && (
        <div className="mb-4">
          <p className="text-[11px] uppercase tracking-widest font-bold mb-2" style={{ color: '#7a3d2a' }}>📌 Frasa Kunci</p>
          <div className="space-y-2">
            {insight.keyPhrases.map((p, i) => (
              <div key={i} className="rounded-xl p-2.5 flex items-center gap-2.5" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.08)' }}>
                <button
                  onClick={() => p.ar && speakArabic(p.ar, { rate: 0.85 })}
                  className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center transition-transform active:scale-90"
                  style={{ background: 'rgba(10,77,60,0.08)' }}
                  aria-label="Dengar"
                >
                  <Volume2 size={12} style={{ color: '#0a4d3c' }} />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-base leading-tight" style={{ fontFamily: 'Amiri, serif', color: '#0a4d3c' }} dir="rtl">{p.ar}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    {p.latin && <p className="text-[10px] italic" style={{ color: '#8b6b3d' }}>{p.latin}</p>}
                    {p.meaning && <p className="text-[11px]" style={{ color: '#3d2817' }}>= {p.meaning}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Konteks Budaya */}
      {insight.cultural && (
        <div className="mb-3 rounded-xl p-3" style={{ background: 'rgba(10,77,60,0.06)' }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Globe2 size={12} style={{ color: '#0a4d3c' }} />
            <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: '#0a4d3c' }}>Konteks Budaya</p>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: '#1a2a1f' }}>{insight.cultural}</p>
        </div>
      )}

      {/* Tip Praktis */}
      {insight.tip && (
        <div className="mb-3 rounded-xl p-3" style={{ background: 'rgba(201,169,97,0.1)' }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Sparkles size={12} style={{ color: '#a05536' }} />
            <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: '#a05536' }}>Tip Praktis</p>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: '#3d2817' }}>{insight.tip}</p>
        </div>
      )}

      {/* Tata Bahasa (optional) */}
      {insight.grammar && insight.grammar.trim() && (
        <div className="rounded-xl p-3" style={{ background: 'rgba(122,61,42,0.08)' }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <BookOpen size={12} style={{ color: '#7a3d2a' }} />
            <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: '#7a3d2a' }}>Tata Bahasa</p>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: '#3d2817' }}>{insight.grammar}</p>
        </div>
      )}

      {insight.cached && (
        <p className="text-[9px] text-right mt-2 opacity-50" style={{ color: '#8b6b3d' }}>⚡ dari cache</p>
      )}
    </div>
  );
}

// ============================================================================
// Sub-components
// ============================================================================

function InsightSkeleton() {
  return (
    <div className="rounded-3xl p-5 mt-4 mb-2" style={{
      background: 'rgba(201,169,97,0.06)',
      border: '1px dashed rgba(201,169,97,0.25)',
    }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-full animate-pulse" style={{ background: 'rgba(201,169,97,0.3)' }} />
        <div className="h-3 w-32 rounded animate-pulse" style={{ background: 'rgba(201,169,97,0.2)' }} />
      </div>
      <div className="space-y-2 mb-3">
        <div className="h-12 rounded-xl animate-pulse" style={{ background: 'rgba(10,77,60,0.06)' }} />
        <div className="h-12 rounded-xl animate-pulse" style={{ background: 'rgba(10,77,60,0.06)' }} />
      </div>
      <div className="h-10 rounded-xl animate-pulse mb-2" style={{ background: 'rgba(10,77,60,0.08)' }} />
      <div className="h-10 rounded-xl animate-pulse" style={{ background: 'rgba(201,169,97,0.1)' }} />
      <p className="text-[10px] text-center mt-3 opacity-70" style={{ color: '#8b6b3d' }}>✨ Menyiapkan pemahaman...</p>
    </div>
  );
}

function InsightError({ error, onRetry }) {
  return (
    <div className="rounded-3xl p-4 mt-4 mb-2 text-center" style={{
      background: 'rgba(160,85,54,0.08)',
      border: '1px dashed rgba(160,85,54,0.3)',
    }}>
      <p className="text-xs mb-2" style={{ color: '#a05536' }}>Pemahaman belum bisa dimuat</p>
      <p className="text-[10px] mb-2 opacity-70" style={{ color: '#8b6b3d' }}>{error?.substring(0, 80)}</p>
      <button
        onClick={onRetry}
        className="text-xs font-semibold inline-flex items-center gap-1 px-3 py-1.5 rounded-full"
        style={{ background: 'white', color: '#a05536', border: '1px solid rgba(160,85,54,0.3)' }}
      >
        <RefreshCw size={11} /> Coba lagi
      </button>
    </div>
  );
}
