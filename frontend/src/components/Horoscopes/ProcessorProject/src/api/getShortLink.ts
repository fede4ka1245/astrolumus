import axios from 'axios';
import { getPreviewUrl } from '../helpers/getApiUrl';

export const getShortLink = (link: string): Promise<string> => {
  const previewUrl = getPreviewUrl();
  
  return axios.post(`${previewUrl}/api`, {
    link
  }).then(({ data }) => {
    return data.shortLink;
  }).catch((error) => {
    console.warn('Failed to create short link, using full URL:', error);
    // Возвращаем полную ссылку если сервис недоступен
    return link;
  });
};
