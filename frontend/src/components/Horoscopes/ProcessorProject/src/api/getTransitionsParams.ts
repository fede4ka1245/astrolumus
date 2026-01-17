import axios from 'axios';
import { TransitionsParams } from '../models/types/transitions/transitionsParams';

export const getTransitionsParams = (): Promise<TransitionsParams> => {
  return axios.get(`${import.meta.env.VITE_APP_API_URL}/horoscope/get-gochara-params/`)
    .then(({ data }) => {
      return {
        transitionsPlanetsParams: data.gochara_planets,
        transitionsPositionsParams: data.gochara_positions
      };
    });
};
