import { HoroscopeData } from '../models/types/HoroscopeData';
import { getFormattedGreenwich } from '../helpers/getFormattedGreenwich';
import { DegreeTable } from '../models/types/DegreeTable';
import { getFormattedDegreeTable } from '../helpers/getFormattedDegreeTable';
import authRequest from './authRequest';

export const getRashiTable = async ({ userName, latitude, longitude, date, time, hours, minutes, greenwich }: HoroscopeData): Promise<DegreeTable> => {
  const { data } = await authRequest.post(`${import.meta.env.VITE_APP_API_URL}/horoscope/get-general-table/`, {
    name_user: userName,
    longitude,
    latitude,
    dt: date.split('.').reverse().join('-') + 'T' + time,
    part_world: getFormattedGreenwich(greenwich),
    tz_hour: Number(hours) || null,
    tz_minutes: minutes || null
  });

  return getFormattedDegreeTable(data.data) as DegreeTable;
};
