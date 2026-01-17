import { HoroscopeData } from '../models/types/HoroscopeData';
import { getFormattedGreenwich } from '../helpers/getFormattedGreenwich';
import { getFormattedMaps } from '../helpers/getFormattedMaps';
import { j108Request } from './authRequest';

export const getMaps = async ({ userName, latitude, longitude, date, time, hours, minutes, greenwich }: HoroscopeData) => {
  const { data } = await j108Request.post('/horoscope/get-horoscope/', {
    name_user: userName,
    longitude,
    latitude,
    dt: date.split('.').reverse().join('-') + 'T' + time,
    part_world: getFormattedGreenwich(greenwich),
    tz_hour: Number(hours) || null,
    tz_minutes: minutes || null
  });

  return getFormattedMaps(data.data);
};
