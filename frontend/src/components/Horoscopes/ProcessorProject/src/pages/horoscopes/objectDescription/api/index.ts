import axios from 'axios';
import camelcaseKeys from 'camelcase-keys';
import { PlanetHouseConnection, SignPlanetConnection, MasterHouseConnection } from '../types/ConnectionTypes';

export const getPlanetSignConnection = (planet: number, sign: number): Promise<SignPlanetConnection | undefined> => {
  return axios.get(`${import.meta.env.VITE_APP_API_URL}/astroprocessor/sign-planet-connection`, {
    params: {
      planet,
      sign
    }
  }).then(({ data }) => {
    return data.results[0];
  }).then((result) => {
    return camelcaseKeys(result, { deep: true }) as SignPlanetConnection;
  });
};

export const getPlanetHouseConnection = (planet: number, house: number): Promise<PlanetHouseConnection | undefined> => {
  return axios.get(`${import.meta.env.VITE_APP_API_URL}/astroprocessor/planet-house-connection`, {
    params: {
      planet,
      house
    }
  }).then(({ data }) => {
    return data.results[0];
  }).then((result) => {
    return camelcaseKeys(result, { deep: true }) as PlanetHouseConnection;
  });
};

export const getHouseMasterConnection = (from: number, to: number): Promise<MasterHouseConnection | undefined> => {
  return axios.get(`${import.meta.env.VITE_APP_API_URL}/astroprocessor/master-house-connection`, {
    params: {
      planet: from,
      house: to
    }
  }).then(({ data }) => {
    return data.results[0];
  }).then((result) => {
    return camelcaseKeys(result, { deep: true }) as MasterHouseConnection;
  });
};
