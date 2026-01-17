import { getFormattedGreenwich } from '../helpers/getFormattedGreenwich';
import authRequest from './authRequest';
import { DashiReturnType, GetDashiProps } from '../models/types/GetDashi';

export const getVmdDashi = async ({ horoscopeData, dateStart }: GetDashiProps): Promise<DashiReturnType> => {
  const { userName, longitude, latitude, date, time, greenwich, hours, minutes } = horoscopeData;

  const { data } = await authRequest.post(`${import.meta.env.VITE_APP_API_URL}/horoscope/get-dashi/`, {
    name_user: userName,
    longitude,
    latitude,
    dt: date.split('.').reverse().join('-') + 'T' + time,
    name: 'chd',
    part_world: getFormattedGreenwich(greenwich),
    tz_hour: Number(hours) || null,
    tz_minutes: minutes || null,
    dt_start: dateStart
  });

  return data;
};
