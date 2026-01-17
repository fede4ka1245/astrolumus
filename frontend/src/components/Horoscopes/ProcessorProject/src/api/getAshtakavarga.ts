import { HoroscopeData } from '../models/types/HoroscopeData';
import axios from 'axios';
import { getFormattedGreenwich } from '../helpers/getFormattedGreenwich';

export const getAshtakavarga = async ({ userName, latitude, longitude, date, time, hours, minutes, greenwich }: HoroscopeData) => {
  const { data } = await axios.post(`${import.meta.env.VITE_APP_API_URL}/horoscope/get-ashtakavarga/`, {
    name_user: userName,
    longitude,
    latitude,
    dt: date.split('.').reverse().join('-') + 'T' + time,
    part_world: getFormattedGreenwich(greenwich),
    tz_hour: Number(hours) || null,
    tz_minutes: minutes || null
  });

  return data?.data;
};
