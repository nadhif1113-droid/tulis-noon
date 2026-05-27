// lib/tts.js
// Client-side helper untuk play TTS Arab.
//
// Strategi:
//   1. Coba server TTS (/api/tts → Google Cloud TTS) — jamin suara Arab di SEMUA device.
//   2. Fallback ke Web Speech API (speechSynthesis) kalau server gagal & device punya voice Arab.
//
// Cache audio per-teks di memory (Map) biar replay instan & hemat request.

const audioCache = new Map(); // text -> objectURL (data audio MP3)
let currentAudio = null;       // Audio element yang lagi main (buat di-stop)

/**
 * Stop audio yang lagi main (kalau ada).
 */
export function stopSpeaking() {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch (e) {}
    currentAudio = null;
  }
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try { window.speechSynthesis.cancel(); } catch (e) {}
  }
}

/**
 * Fallback: Web Speech API (cuma jalan kalau device punya voice Arab).
 */
function speakViaWebSpeech(text, rate = 0.85) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return false;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ar-SA';
    u.rate = rate;
    // Coba pilih voice Arab eksplisit kalau ada
    const voices = window.speechSynthesis.getVoices() || [];
    const arVoice = voices.find((v) => /^ar(-|_|$)/i.test(v.lang));
    if (arVoice) u.voice = arVoice;
    window.speechSynthesis.speak(u);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Play teks Arab. Server TTS dulu, fallback Web Speech.
 * @param {string} text - teks Arab
 * @param {object} opts - { voice: 'male'|'female'|'male2', rate: number, onStart, onEnd, onError }
 * @returns {Promise<boolean>} true kalau berhasil main (server atau fallback)
 */
export async function speakArabic(text, opts = {}) {
  if (typeof window === 'undefined') return false;
  const clean = (text || '').toString().trim();
  if (!clean) return false;

  const { voice = 'male', rate = 0.85, onStart, onEnd, onError } = opts;

  // Stop apa pun yang lagi main
  stopSpeaking();

  const cacheKey = `${voice}:${rate}:${clean}`;

  // 1) Cek cache
  if (audioCache.has(cacheKey)) {
    return playUrl(audioCache.get(cacheKey), { onStart, onEnd, onError, fallbackText: clean, rate });
  }

  // 2) Coba server TTS
  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: clean, voice, rate }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.audioContent) {
        const url = `data:${data.mime || 'audio/mp3'};base64,${data.audioContent}`;
        audioCache.set(cacheKey, url);
        return playUrl(url, { onStart, onEnd, onError, fallbackText: clean, rate });
      }
    } else {
      console.warn('Server TTS failed:', res.status);
    }
  } catch (e) {
    console.warn('Server TTS request error:', e);
  }

  // 3) Fallback ke Web Speech API
  const ok = speakViaWebSpeech(clean, rate);
  if (ok) {
    onStart?.();
    // speechSynthesis gak punya callback reliable di semua browser, kira-kira aja
  } else {
    onError?.(new Error('TTS unavailable'));
  }
  return ok;
}

/**
 * Play audio dari URL (data URI / objectURL).
 */
function playUrl(url, { onStart, onEnd, onError, fallbackText, rate } = {}) {
  return new Promise((resolve) => {
    try {
      const audio = new Audio(url);
      currentAudio = audio;
      audio.onplay = () => onStart?.();
      audio.onended = () => {
        if (currentAudio === audio) currentAudio = null;
        onEnd?.();
        resolve(true);
      };
      audio.onerror = () => {
        if (currentAudio === audio) currentAudio = null;
        // Fallback terakhir ke Web Speech
        const ok = fallbackText ? speakViaWebSpeech(fallbackText, rate) : false;
        if (!ok) onError?.(new Error('audio playback failed'));
        resolve(ok);
      };
      const p = audio.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          // Autoplay block / error → fallback
          const ok = fallbackText ? speakViaWebSpeech(fallbackText, rate) : false;
          if (!ok) onError?.(new Error('autoplay blocked'));
          resolve(ok);
        });
      }
    } catch (e) {
      const ok = fallbackText ? speakViaWebSpeech(fallbackText, rate) : false;
      if (!ok) onError?.(e);
      resolve(ok);
    }
  });
}
