// pages/api/prayer-times.js
// Get prayer times for a location using Aladhan API

import axios from 'axios';

const ALADHAN_API = process.env.ALADHAN_API_URL || 'https://api.aladhan.com/v1';
const METHOD = parseInt(process.env.PRAYER_CALCULATION_METHOD || '4');

/**
 * Get prayer times for a specific date and location
 * @param {number} latitude - Location latitude
 * @param {number} longitude - Location longitude
 * @param {string} date - Date in DD-MM-YYYY format
 * @returns {Promise<Object>} - Prayer times
 */
async function getPrayerTimes(latitude, longitude, date) {
  try {
    const response = await axios.get(`${ALADHAN_API}/timings/${date}`, {
      params: {
        latitude: latitude.toFixed(4),
        longitude: longitude.toFixed(4),
        method: METHOD,
        school: 0, // 0 = Shafi, 1 = Hanafi
        midnightMode: 0,
        latitudeAdjustmentMethod: 'middle',
        tune: '0,0,0,0,0,0,0,0,0',
      },
    });

    if (response.data.code !== 200) {
      throw new Error(`Aladhan API error: ${response.data.status}`);
    }

    return response.data.data.timings;
  } catch (error) {
    console.error('❌ Error fetching prayer times:', error.message);
    throw error;
  }
}

/**
 * Get prayer times for a city
 * @param {string} city - City name
 * @param {string} country - Country name (optional)
 * @param {string} date - Date in DD-MM-YYYY format
 * @returns {Promise<Object>} - Prayer times + city metadata
 */
async function getPrayerTimesByCity(city, country = '', date) {
  try {
    const params = {
      city,
      method: METHOD,
    };

    if (country) {
      params.country = country;
    }

    const response = await axios.get(`${ALADHAN_API}/timingsByCity/${date}`, {
      params,
    });

    if (response.data.code !== 200) {
      throw new Error(`Aladhan API error: ${response.data.status}`);
    }

    return {
      timings: response.data.data.timings,
      meta: response.data.data.meta,
    };
  } catch (error) {
    console.error('❌ Error fetching prayer times by city:', error.message);
    throw error;
  }
}

/**
 * Format prayer times for display
 * @param {Object} timings - Prayer timings object
 * @returns {Object} - Formatted prayer times
 */
function formatPrayerTimes(timings) {
  return {
    fajr: timings.Fajr,
    sunrise: timings.Sunrise,
    dhuhr: timings.Dhuhr,
    asr: timings.Asr,
    sunset: timings.Sunset,
    maghrib: timings.Maghrib,
    isha: timings.Isha,
    imsak: timings.Imsak,
    midnight: timings.Midnight,
  };
}

/**
 * Convert 24-hour time to minutes since midnight
 * @param {string} time - Time in HH:MM format
 * @returns {number} - Minutes since midnight
 */
export function timeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Get next prayer time
 * @param {Object} timings - Prayer timings
 * @param {number} currentMinutes - Current time in minutes since midnight
 * @returns {Object} - Next prayer info
 */
export function getNextPrayer(timings, currentMinutes) {
  const prayers = [
    { name: 'Fajr', time: timings.Fajr },
    { name: 'Dhuhr', time: timings.Dhuhr },
    { name: 'Asr', time: timings.Asr },
    { name: 'Maghrib', time: timings.Maghrib },
    { name: 'Isha', time: timings.Isha },
  ];

  for (const prayer of prayers) {
    const prayerMinutes = timeToMinutes(prayer.time);
    if (prayerMinutes > currentMinutes) {
      return {
        name: prayer.name,
        time: prayer.time,
        minutesUntil: prayerMinutes - currentMinutes,
      };
    }
  }

  // If no prayer today, next is Fajr tomorrow
  return {
    name: 'Fajr',
    time: timings.Fajr,
    isTomorrow: true,
  };
}

// API Handler
export default async function handler(req, res) {
  const { latitude, longitude, city, country, date } = req.query;

  // Validate request
  if (!date) {
    return res.status(400).json({
      error: 'Missing date parameter. Format: DD-MM-YYYY',
    });
  }

  if (process.env.DEBUG_PRAYER_TIMES) {
    console.log('🕌 Prayer times request:', { latitude, longitude, city, date });
  }

  try {
    let result;

    // Get by coordinates
    if (latitude && longitude) {
      const timings = await getPrayerTimes(
        parseFloat(latitude),
        parseFloat(longitude),
        date
      );
      result = {
        success: true,
        timings: formatPrayerTimes(timings),
        source: 'coordinates',
      };
    }
    // Get by city
    else if (city) {
      const data = await getPrayerTimesByCity(city, country || '', date);
      result = {
        success: true,
        timings: formatPrayerTimes(data.timings),
        city: data.meta.city,
        country: data.meta.country,
        timezone: data.meta.timezone,
        source: 'city',
      };
    }
    // No parameters
    else {
      return res.status(400).json({
        error: 'Provide either (latitude & longitude) or (city)',
      });
    }

    // Add next prayer calculation if current time provided
    if (req.query.currentTime) {
      const [hours, minutes] = req.query.currentTime.split(':').map(Number);
      const currentMinutes = hours * 60 + minutes;
      result.nextPrayer = getNextPrayer(result.timings, currentMinutes);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('❌ API Error:', error.message);
    return res.status(500).json({
      error: 'Failed to fetch prayer times',
      message: error.message,
    });
  }
}

// Export for use in other files
export { getPrayerTimes, getPrayerTimesByCity, formatPrayerTimes };
