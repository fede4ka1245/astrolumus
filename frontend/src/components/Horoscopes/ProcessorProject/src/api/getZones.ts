import axios from 'axios';
import { HoroscopeData } from '../models/types/HoroscopeData';
import { SudarshanaItem } from '../models/types/SudarshanaItem';
import { getFormattedGreenwich } from '../helpers/getFormattedGreenwich';

const getFormattedSudarshanaCircle = (circle: any) => {
  return [...circle.map((item: any) => ({
    main: {
      value: item.rs.value,
      title: item.rs.title
    },
    elements: item.bh as SudarshanaItem []
  }))];
};

export const getZones = async ({ userName, latitude, longitude, date, time, hours, minutes, greenwich }: HoroscopeData) => {
  const { data } = await axios.post(`${import.meta.env.VITE_APP_API_URL}/horoscope/get-chakras/`, {
    name_user: userName,
    latitude,
    longitude,
    dt: date.split('.').reverse().join('-') + 'T' + time,
    part_world: getFormattedGreenwich(greenwich),
    tz_hour: Number(hours) || null,
    tz_minutes: minutes || null
  });

  const { circleLg, circleCh, circleSy } = data.sudarsana;

  return {
    savatobhadra: data.sarvatobhadra,
    shani: data.sani,
    calanala: data.suryaKalanala,
    compass: data.chandraKalanala,
    sudarshana: [...getFormattedSudarshanaCircle(circleLg), ...getFormattedSudarshanaCircle(circleCh), ...getFormattedSudarshanaCircle(circleSy)]
  };
};
