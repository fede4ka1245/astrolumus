import { MapOption } from '../models/types/MapOption';
import { j108Request } from './authRequest';
import { CountHoroscopeProps } from '../models/types/CountHoroscopeProps';
import { getTimeZoneOffsetFromGreenwichData } from '../helpers/getTimeZoneOffsetFromGreenwichData';
import { DegreeTable } from '../models/types/DegreeTable';
import { DashiReturnType } from '../models/types/GetDashi';
import { AshtakavargaTable } from '../models/types/AshtakavargaTable';
import { formatHoroscopeData } from '../helpers/formatHorscopeData';
import { getSettingsParams } from '../helpers/horoscopeSettings';

export interface JatakaResponse {
  maps: MapOption [],
  degreeTable: DegreeTable,
  dashiVim: DashiReturnType,
  ashtakavarga: AshtakavargaTable[],
  data: string
}

export const countHoroscope = async ({ address, userInfo, settings }: CountHoroscopeProps): Promise<JatakaResponse> => {
  const { data } = await j108Request.get('/jataka', {
    params: {
      lat: address.coordinates.latitude,
      lon: address.coordinates.longitude,
      tz: getTimeZoneOffsetFromGreenwichData(address.timeZone.greenwich, address.timeZone.hours, address.timeZone.minutes),
      dt: `${userInfo.date} ${userInfo.time}`,
      ...getSettingsParams(settings)
    }
  });

  return { ...formatHoroscopeData(data.data), data: data.data };
};
