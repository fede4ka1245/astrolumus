import axios from 'axios';

interface DeepSkyInfo {
  title: string,
  description: string
}

export const getDeepSkyInfo = (): Promise<DeepSkyInfo> => {
  return axios.get(`${import.meta.env.VITE_APP_API_URL}/deep_sky/info/`)
    .then(({ data }) => {
      return data;
    });
};
