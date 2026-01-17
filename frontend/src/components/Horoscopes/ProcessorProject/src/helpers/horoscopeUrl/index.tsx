import { HoroscopeAddress } from '../../models/types/HoroscopeAddress';
import { HoroscopeUserInfo } from '../../models/types/HoroscopeUserInfo';
import moment from 'moment/moment';
import { SavedHoroscope } from '../../models/types/SavedHoroscopes';
import { getTargetHoroscopeLink } from '../../api/getTargetHoroscopeLink';
import { getPreviewUrl } from '../getApiUrl';

export const buildHoroscopeUrlFromSavedHoroscope = (horoscope: SavedHoroscope) => {
  const userInfo = {
    name: horoscope.name || '',
    date: moment(horoscope.horoscope.dt.replace('T', ' ').slice(0, 19), 'YYYY-MM-DD hh:mm:ss').format('DD.MM.YYYY'),
    time: moment(horoscope.horoscope.dt.replace('T', ' ').slice(0, 19), 'YYYY-MM-DD hh:mm:ss').format('HH:mm:ss')
  };

  const address : HoroscopeAddress = {
    timeZone: {
      hours: horoscope.horoscope.tzHour.replace('-', ''),
      minutes: horoscope.horoscope.tzMinutes,
      greenwich: horoscope.horoscope.tzHour.includes('-') ? '-' : '+'
    },
    location: {
      key: '',
      value: horoscope.city as string
    },
    coordinates: {
      longitude: horoscope.horoscope.longitude,
      latitude: horoscope.horoscope.latitude
    }
  };

  return buildHoroscopeUrl(address, userInfo);
};

export const buildHoroscopeUrl = (address: HoroscopeAddress, userInfo: HoroscopeUserInfo) => {
  const previewUrl = getPreviewUrl();
  const url = `${previewUrl}/`;

  const params = Array.from([
    ['city', address.location.value],
    ...Object.entries(address.timeZone),
    ...Object.entries(address.coordinates),
    ...Object.entries(userInfo)
  ].map(([key, value]) => {
    return `${key}=${value.replaceAll('=', '')}`;
  }));

  return encodeURI(`${url}?${params.join('&')}`);
};

export interface ParsedUrlData {
  address: HoroscopeAddress,
  userInfo: HoroscopeUserInfo
}

export const parseHoroscopeUrl = (url: string): ParsedUrlData | undefined => {
  if (!url.includes('?')) {
    return;
  }

  const urlParams = url.split('?')[1];
  const params = JSON.parse('{"' + decodeURIComponent(urlParams.toString())
    .replaceAll(' = ', '')
    .replace(/"/g, '\\"')
    .replace(/&/g, '","')
    .replace(/=/g, '":"') + '"}');
  
  return {
    address: {
      coordinates: {
        latitude: params.latitude,
        longitude: params.longitude
      },
      location: {
        value: params.city,
        key: ''
      },
      timeZone: {
        greenwich: params.greenwich,
        minutes: params.minutes,
        hours: params.hours
      }
    },
    userInfo: {
      name: params.name,
      time: params.time,
      date: params.date
    }
  };
};

export const parseShortHoroscopeUrl = async (url: string): Promise<ParsedUrlData | undefined> => {
  const previewUrl = getPreviewUrl();
  
  if (!previewUrl || !url.includes(previewUrl)) {
    return;
  }

  const link = await getTargetHoroscopeLink(url.split('api/')[1]);

  if (!link) {
    return;
  }

  const parsedHoroscope = parseHoroscopeUrl(link);

  if (!parsedHoroscope) {
    return;
  }

  return parsedHoroscope;
};
