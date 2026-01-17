import { HoroscopeAddress } from '../../models/types/HoroscopeAddress';
import { HoroscopeUserInfo } from '../../models/types/HoroscopeUserInfo';
import authRequest from '../authRequest';
import moment from 'moment';
import camelcaseKeys from 'camelcase-keys';
import { getFormattedGreenwich } from '../../helpers/getFormattedGreenwich';

export interface CacheHoroscopeProps {
  address: HoroscopeAddress,
  userInfo: HoroscopeUserInfo,
  horoscope: string,
  settings: string
}

export const cacheHoroscope = ({ address, userInfo, horoscope, settings }: CacheHoroscopeProps) => {
  return authRequest.post(`${import.meta.env.VITE_APP_API_URL}/horoscope/horoscopes/`, {
    data: {},
    settings,
    latitude: address.coordinates.latitude,
    longitude: address.coordinates.longitude,
    dt: moment(`${userInfo.date} ${userInfo.time}`, 'DD.MM.YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
    tz_hour: Number(`${getFormattedGreenwich(address.timeZone.greenwich || '')}${address.timeZone.hours}`),
    tz_minutes: address.timeZone.minutes
  })
    .then(({ data }) => {
      return data;
    });
};

export const getHoroscope = (id: number) => {
  return authRequest.get(`${import.meta.env.VITE_APP_API_URL}/horoscope/horoscopes/${id}/`)
    .then(({ data }) => {
      return data;
    });
};

export const searchMyHoroscopes = async (query: string) => {
  const result = await Promise.all([authRequest.get(`${import.meta.env.VITE_APP_API_URL}/horoscope/my-horoscopes/`, {
    params: {
      name__icontains: query
    }
  })
    .then(({ data }) => {
      return camelcaseKeys(data, { deep: true });
    }), authRequest.get(`${import.meta.env.VITE_APP_API_URL}/horoscope/my-horoscopes/`, {
    params: {
      city__icontains: query
    }
  })
    .then(({ data }) => {
      return camelcaseKeys(data, { deep: true });
    })]);

  const uniqueHoroscopesIds: number[] = [];

  return [...result[0].results, ...result[1].results].filter(({ id }) => {
    if (uniqueHoroscopesIds.includes(id)) {
      return false;
    }

    uniqueHoroscopesIds.push(id);
    return true;
  });
};

export interface SaveMyHoroscopeProps {
  id: number,
  name: string,
  city: string,
}

export const saveMyHoroscope = ({ id, name, city }: SaveMyHoroscopeProps) => {
  return authRequest.post(`${import.meta.env.VITE_APP_API_URL}/horoscope/my-horoscopes/`, {
    name,
    horoscope_id: id,
    city
  }).then(({ data }) => {
    return data;
  });
};

export const removeMyHoroscope = (id: number) => {
  return authRequest.delete(`${import.meta.env.VITE_APP_API_URL}/horoscope/my-horoscopes/${id}/`);
};
