import { DashiReturnType } from '../models/types/GetDashi';
import { CountHoroscopeProps } from '../models/types/CountHoroscopeProps';
import processorRequest, { getProcessorProxyUrl } from './processorRequest';
import { getTimeZoneOffsetFromGreenwichData } from '../helpers/getTimeZoneOffsetFromGreenwichData';
import { getFormattedDashi } from '../helpers/getFormattedDashi';

export interface GetCharaDashi extends CountHoroscopeProps {
  dateStart?: string
}

export const getCharaDashi = async ({ address, userInfo, dateStart }: GetCharaDashi): Promise<DashiReturnType> => {
  const { data } = await processorRequest.get(`${getProcessorProxyUrl()}/jataka`, {
    params: {
      lat: address.coordinates.latitude,
      lon: address.coordinates.longitude,
      tz: getTimeZoneOffsetFromGreenwichData(address.timeZone.greenwich, address.timeZone.hours, address.timeZone.minutes),
      dt: `${userInfo.date} ${userInfo.time}`,
      'config[karaka-scheme]': 'srath',
      'config[arudha-scheme]': 'srath',
      'config[dasa][system]': 'chara-knrao',
      data: dateStart ? `start_date=${dateStart}` : undefined
    }
  });

  return getFormattedDashi(data.data.dasa.periods);
};
