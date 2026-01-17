import axios from 'axios';
import camelcaseKeys from 'camelcase-keys';
import { DeepSkyObject } from '../models/types/DeepSkyObject';

export const getDeepSky = async (): Promise<DeepSkyObject []> => {
  const { data } = await axios.get(`${import.meta.env.VITE_APP_API_URL}/deep_sky/stars/`, {
    params: {
      limit: 1000
    }
  });
  
  return camelcaseKeys(data.results, { deep: true });
};
