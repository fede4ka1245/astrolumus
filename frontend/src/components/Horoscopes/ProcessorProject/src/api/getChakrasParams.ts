import axios from 'axios';
import { ChakrasParams } from '../models/types/chakrasParams';

export const getChakrasParams = (): Promise<ChakrasParams> => {
  return axios.get(`${import.meta.env.VITE_APP_API_URL}/horoscope/get-chakras-params/`)
    .then(({ data }) => {
      return {
        startPoints: data.start_points,
        nakshatrasStartPoints: data.nakshatras_start_points
      };
    });
};
