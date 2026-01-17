import processorRequest, { getProcessorProxyUrl } from './processorRequest';
import { AddressLocation } from '../models/types/HoroscopeAddress';

export const getLocations = async (query: string): Promise<AddressLocation []> => {
  const { data } = await processorRequest.get(`${getProcessorProxyUrl()}/atlas/locations/`, {
    params: {
      q: query
    }
  });

  return data.data;
};
