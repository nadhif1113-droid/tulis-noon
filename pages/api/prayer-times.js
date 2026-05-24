// pages/api/prayer-times.js
// Get prayer times from Aladhan API

import axios from 'axios';

const ALADHAN_API = 'https://api.aladhan.com/v1';
const METHOD = 4;

async function getPrayerTimes(latitude, longitude, date) {
  try {
    const response = await axios.get(ALADHAN_API + '/timings/' + date, {
      params: {
        latitude: latitude.toFixed(4),
        longitude: longitude.toFixed(4),
        method: METHOD,
        school: 0,
      },
    });

    if (response.data.code !== 200) {
      throw new Error('Aladhan API error');
    }

    return response.data.data.timings;
  } catch (error) {
    console.error('Error fetching prayer times:', error.message);
    throw error;
  }
}

async function getPrayerTimesByCity(city, country, date) {
  try {
    const params = { city, method: METHOD };
    if (country) params.country = country;

    const response = await axios.get(ALADHAN_API + '/timingsByCity/' + date, {
      params,
    });

    if (response.data.code !== 200) {
      throw new Error('Aladhan API error');
    }

    return {
      timings: response.data.data.timings,
      meta: response.data.data.meta,
    };
  } catch (error) {
    console.error('Error fetching prayer times by city:', error.message);
    throw error;
  }
}

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

export function timeToMinutes(time) {
  const parts = time.split(':');
  const hours = parseInt(parts[0]);
  const minutes = parseInt(parts[1]);
  return hours * 60 + minutes;
}

export function getNextPrayer(timings, currentMinutes) {
  const prayers = [
    { name: 'Fajr', time: timings.fajr },
    { name: 'Dhuhr', time: timings.dhuhr },
    { name: 'Asr', time: timings.asr },
    { name: 'Maghrib', time: timings.maghrib },
    { name: 'Isha', time: timings.isha },
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

  return {
    name: 'Fajr',
    time: timings.fajr,
    isTomorrow: true,
  };
}

export default async function handler(req, res) {
  const { latitude, longitude, city, country, date } = req.query;

  if (!date) {
    return res.status(400).json({
      error: 'Missing date parameter. Format: DD-MM-YYYY',
    });
  }

  try {
    let result;

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
    } else if (city) {
      const data = await getPrayerTimesByCity(city, country || '', date);
      result = {
        success: true,
        timings: formatPrayerTimes(data.timings),
        city: data.meta.city,
        country: data.meta.country,
        timezone: data.meta.timezone,
        source: 'city',
      };
    } else {
      return res.status(400).json({
        error: 'Provide either coordinates or city',
      });
    }

    if (req.query.currentTime) {
      const parts = req.query.currentTime.split(':');
      const hours = parseInt(parts[0]);
      const minutes = parseInt(parts[1]);
      const currentMinutes = hours * 60 + minutes;
      result.nextPrayer = getNextPrayer(result.timings, currentMinutes);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('API Error:', error.message);
    return res.status(500).json({
      error: 'Failed to fetch prayer times',
      message: error.message,
    });
  }
}

export { getPrayerTimes, getPrayerTimesByCity, formatPrayerTimes };
