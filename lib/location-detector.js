// lib/location-detector.js
// Deteksi lokasi user untuk:
// 1. Akurasi waktu sholat (Aladhan API butuh lat/lon)
// 2. Targeted promo (berbeda untuk user di Saudi vs Indonesia vs UAE dll)
// 3. Konten relevan (Arab Hijazi untuk ME user, Fusha untuk pelajar Indonesia)
//
// Strategi:
// A. Native (iOS/Android): Capacitor Geolocation (akurat GPS)
// B. Web: navigator.geolocation (butuh permission)
// C. Fallback: timezone-based country detection (no permission needed)

// Mapping country code → region untuk promo targeting
export const REGION_MAP = {
  // Middle East (target utama Tulis Noon)
  SA: { region: 'middle-east', country: 'Saudi Arabia', currency: 'SAR', promoTier: 'umrah' },
  AE: { region: 'middle-east', country: 'UAE', currency: 'AED', promoTier: 'transit' },
  QA: { region: 'middle-east', country: 'Qatar', currency: 'QAR', promoTier: 'transit' },
  KW: { region: 'middle-east', country: 'Kuwait', currency: 'KWD', promoTier: 'transit' },
  BH: { region: 'middle-east', country: 'Bahrain', currency: 'BHD', promoTier: 'transit' },
  OM: { region: 'middle-east', country: 'Oman', currency: 'OMR', promoTier: 'transit' },
  JO: { region: 'middle-east', country: 'Jordan', currency: 'JOD', promoTier: 'transit' },
  EG: { region: 'middle-east', country: 'Egypt', currency: 'EGP', promoTier: 'study-abroad' },
  YE: { region: 'middle-east', country: 'Yemen', currency: 'YER', promoTier: 'study-abroad' },

  // Indonesia (target sekunder — pre-departure user)
  ID: { region: 'southeast-asia', country: 'Indonesia', currency: 'IDR', promoTier: 'pre-departure' },

  // Asia Tenggara lain
  MY: { region: 'southeast-asia', country: 'Malaysia', currency: 'MYR', promoTier: 'pre-departure' },
  SG: { region: 'southeast-asia', country: 'Singapore', currency: 'SGD', promoTier: 'pre-departure' },
  BN: { region: 'southeast-asia', country: 'Brunei', currency: 'BND', promoTier: 'pre-departure' },
};

// Timezone → country code (fallback kalau geo gak granted)
const TZ_TO_COUNTRY = {
  'Asia/Riyadh': 'SA',
  'Asia/Mecca': 'SA',
  'Asia/Medina': 'SA',
  'Asia/Dubai': 'AE',
  'Asia/Qatar': 'QA',
  'Asia/Bahrain': 'BH',
  'Asia/Kuwait': 'KW',
  'Asia/Muscat': 'OM',
  'Asia/Amman': 'JO',
  'Asia/Aden': 'YE',
  'Africa/Cairo': 'EG',
  'Asia/Jakarta': 'ID',
  'Asia/Pontianak': 'ID',
  'Asia/Makassar': 'ID',
  'Asia/Jayapura': 'ID',
  'Asia/Kuala_Lumpur': 'MY',
  'Asia/Singapore': 'SG',
  'Asia/Brunei': 'BN',
};

/**
 * Dapetin country code dari timezone (fallback ringan, no permission).
 */
function detectCountryFromTimezone() {
  if (typeof window === 'undefined') return null;
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return TZ_TO_COUNTRY[tz] || null;
  } catch (e) {
    return null;
  }
}

/**
 * Reverse geocode lat/lon → city + country (pakai Aladhan API yg juga punya geocoding).
 * Atau bisa pakai BigDataCloud yg gratis tanpa auth.
 */
async function reverseGeocode(lat, lon) {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=id`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return {
      city: data.city || data.locality || data.principalSubdivision || null,
      country: data.countryName || null,
      countryCode: data.countryCode || null,
      timezone: data.timezone || null,
    };
  } catch (e) {
    console.error('Reverse geocode error:', e);
    return null;
  }
}

/**
 * Detect lokasi via GPS (native) atau navigator (web).
 * Returns: { latitude, longitude, city, country, countryCode, region, promoTier } atau null.
 */
export async function detectLocation({ requestPermission = false } = {}) {
  if (typeof window === 'undefined') return null;

  // Try native Capacitor Geolocation
  try {
    const { Capacitor } = await import('@capacitor/core');
    if (Capacitor.isNativePlatform()) {
      const { Geolocation } = await import('@capacitor/geolocation');

      // Permission check
      if (requestPermission) {
        const perm = await Geolocation.requestPermissions();
        if (perm.location !== 'granted') {
          console.log('Native geo permission denied — fallback to timezone');
          return getFallbackLocation();
        }
      }

      const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: false, timeout: 10000 });
      const { latitude, longitude } = pos.coords;
      const geo = await reverseGeocode(latitude, longitude);
      return enrichLocation({ latitude, longitude, ...(geo || {}) });
    }
  } catch (e) {
    console.warn('Native geo failed:', e);
  }

  // Web fallback: navigator.geolocation
  if (typeof navigator !== 'undefined' && navigator.geolocation && requestPermission) {
    try {
      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 1000 * 60 * 60 * 24, // 24h cache
        });
      });
      const { latitude, longitude } = pos.coords;
      const geo = await reverseGeocode(latitude, longitude);
      return enrichLocation({ latitude, longitude, ...(geo || {}) });
    } catch (e) {
      console.warn('Web geo failed:', e);
    }
  }

  // Final fallback: timezone-based
  return getFallbackLocation();
}

/**
 * Fallback: deteksi country dari timezone, default ke Madinah coordinates.
 */
function getFallbackLocation() {
  const countryCode = detectCountryFromTimezone();
  const regionInfo = REGION_MAP[countryCode] || REGION_MAP.SA;

  // Default coordinates per country (untuk Aladhan API butuh lat/lon)
  const defaultCoords = {
    SA: { latitude: 24.4686, longitude: 39.6142, city: 'Madinah' },     // Madinah
    AE: { latitude: 25.2048, longitude: 55.2708, city: 'Dubai' },
    QA: { latitude: 25.2854, longitude: 51.5310, city: 'Doha' },
    ID: { latitude: -6.2088, longitude: 106.8456, city: 'Jakarta' },
    MY: { latitude: 3.1390, longitude: 101.6869, city: 'Kuala Lumpur' },
    EG: { latitude: 30.0444, longitude: 31.2357, city: 'Cairo' },
  };

  const coords = defaultCoords[countryCode] || defaultCoords.SA;

  return enrichLocation({
    ...coords,
    countryCode: countryCode || 'SA',
    country: regionInfo.country,
    isDetected: false,
    source: 'timezone-fallback',
  });
}

/**
 * Enrich location dengan promo metadata.
 */
function enrichLocation(loc) {
  const code = loc.countryCode || 'SA';
  const regionInfo = REGION_MAP[code] || REGION_MAP.SA;
  return {
    latitude: loc.latitude,
    longitude: loc.longitude,
    city: loc.city,
    country: loc.country || regionInfo.country,
    countryCode: code,
    timezone: loc.timezone,
    region: regionInfo.region,
    currency: regionInfo.currency,
    promoTier: regionInfo.promoTier,
    isDetected: loc.isDetected !== false,
    source: loc.source || 'geolocation',
    detectedAt: new Date().toISOString(),
  };
}

/**
 * Cek apakah user sekarang lagi di Saudi (untuk show Tanya Cepat FAB & promo umrah).
 */
export function isInSaudi(location) {
  return location?.countryCode === 'SA';
}

/**
 * Cek apakah user di Middle East region.
 */
export function isInMiddleEastRegion(location) {
  return location?.region === 'middle-east';
}

/**
 * Get promo content sesuai lokasi user.
 */
export function getPromoForLocation(location) {
  const tier = location?.promoTier || 'pre-departure';
  const promos = {
    'umrah': {
      title: '🕋 Diskon Khusus di Saudi!',
      subtitle: 'Pakai Tulis Noon di kota suci',
      cta: 'Aktifkan Tanya Cepat',
      emoji: '🕋',
    },
    'transit': {
      title: '✈️ Transit di Middle East?',
      subtitle: 'Pelajari frasa darurat sebelum lanjut',
      cta: 'Belajar 5 menit',
      emoji: '✈️',
    },
    'study-abroad': {
      title: '🎓 Mahasiswa di luar negeri',
      subtitle: 'Path Fusha untuk akademik',
      cta: 'Mulai modul kampus',
      emoji: '🎓',
    },
    'pre-departure': {
      title: '🛫 Sebelum berangkat',
      subtitle: 'Siapkan diri untuk umrah/haji',
      cta: 'Lihat panduan',
      emoji: '🛫',
    },
  };
  return promos[tier] || promos['pre-departure'];
}
