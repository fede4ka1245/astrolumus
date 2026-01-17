import axios from 'axios';
import { HoroscopeData } from '../models/types/HoroscopeData';
import { getFormattedGreenwich } from '../helpers/getFormattedGreenwich';
import { Zone } from '../models/types/Zone';
import { SavatobhadraTableRow } from '../models/types/SavatobhadraTableRow';

interface GetChakraProps {
  horoscopeData: HoroscopeData,
  chakraDate: string,
  chakraTime: string,
  chakraHours?: string,
  chakraMinutes?: string,
  chakraGreenwich?: string,
  chakra: string,
  startPoint?: number,
  nakshatraStartPoint?: number
}

export const getChakra = ({
  horoscopeData,
  chakraDate,
  chakraTime,
  chakraHours,
  chakraMinutes,
  chakraGreenwich,
  chakra,
  nakshatraStartPoint,
  startPoint
}: GetChakraProps): Promise<Zone [] | SavatobhadraTableRow []> => {
  return axios.post(`${import.meta.env.VITE_APP_API_URL}/horoscope/get-chakra/`, {
    'name_user': horoscopeData.userName,
    'latitude': horoscopeData.latitude,
    'longitude': horoscopeData.longitude,
    'dt': horoscopeData.date.split('.').reverse().join('-') + 'T' + horoscopeData.time,
    'part_world': getFormattedGreenwich(horoscopeData.greenwich),
    'tz_hour': horoscopeData.hours,
    'tz_minutes': horoscopeData.minutes,
    chakra,
    'chakra_dt': chakraDate.split('.').reverse().join('-') + 'T' + chakraTime,
    'chakra_part_world': getFormattedGreenwich(chakraGreenwich),
    'chakra_tz_hour': chakraHours,
    'chakra_tz_minutes': chakraMinutes,
    'start_point': startPoint,
    'nakshatra_start_point': nakshatraStartPoint
  })
    .then(({ data }) => {
      return data;
    });
};
