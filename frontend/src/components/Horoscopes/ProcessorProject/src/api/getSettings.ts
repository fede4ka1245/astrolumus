import authRequest from './authRequest';

interface getSettingsResponse {

}

export const getSettings = () => {
  return authRequest.get(`${import.meta.env.VITE_APP_API_URL}/horoscope/settings/`)
    .then(({ data }) => {
      return data;
    });
};
