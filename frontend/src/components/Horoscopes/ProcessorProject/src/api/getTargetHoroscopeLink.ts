import axios from 'axios';

export const getTargetHoroscopeLink = (key: string): Promise<string> => {
  return axios.post(`${import.meta.env.VITE_APP_PREVIEW_PAGE_URL}/api/get-link`, {
    key
  })
    .then(({ data }) => {
      return data.link;
    });
};
