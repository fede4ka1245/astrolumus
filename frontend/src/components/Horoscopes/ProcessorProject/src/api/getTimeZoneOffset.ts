import processorRequest, { getProcessorProxyUrl } from './processorRequest';
import { AddressCoordinates, TimeZone } from '../models/types/HoroscopeAddress';

export interface GetTimeZoneOffsetResult extends TimeZone, AddressCoordinates {}

export const getTimeZoneOffset = async (key: string, date: string, time: string): Promise<GetTimeZoneOffsetResult> => {
  const { data } = await processorRequest.get(`${getProcessorProxyUrl()}/atlas/`, {
    params: {
      key,
      dt: `${date} ${time}`
    }
  });

  if (!data.data?.timezone) {
    throw new Error('empty response');
  }

  return {
    greenwich: data.data.timezone?.z,
    minutes: data.data.timezone?.i,
    hours: data.data.timezone?.h,
    longitude: data.data.location.lon,
    latitude: data.data.location.lat
  };
};
