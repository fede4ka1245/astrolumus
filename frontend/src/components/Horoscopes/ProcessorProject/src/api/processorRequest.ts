import axios, {
  AxiosRequestConfig,
  AxiosInstance,
  AxiosError,
  AxiosResponse
} from 'axios';
import { LocalStorageKey } from '../models/enums/LocalStorageKey';
import { getBackendUrl } from '../helpers/getApiUrl';

/**
 * Axios instance для запросов к j108.net через бэкенд-прокси
 * 
 * Прокси автоматически добавляет X-API-Key на бэкенде,
 * frontend отправляет только JWT токен для авторизации
 */
const processorRequest = axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
});

const onRequest = (config: AxiosRequestConfig): any => {
  if (config?.headers) {
    config.headers.Authorization = `Bearer ${localStorage.getItem(LocalStorageKey.access) || ''}`;
  }
  return config;
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error);
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
  return response;
};

const onResponseError = async (error: any): Promise<AxiosError> => {
  if (error.response && error.config) {
    if ((error.response.status === 401 || error.response.status === 403) && !error.config?.isRetry) {
      error.config.isRetry = true;
      try {
        const res = await axios.post(`${getBackendUrl()}/api/token/refresh/`, {
          refresh: localStorage.getItem(LocalStorageKey.refresh)
        });
        const { access } = res.data;
        localStorage.setItem(LocalStorageKey.access, access);
        error.config!.headers = { ...error.config!.headers };
        return processorRequest(error.config);
      } catch (_error) {
        localStorage.removeItem(LocalStorageKey.access);
        localStorage.removeItem(LocalStorageKey.refresh);
        return Promise.reject(_error);
      }
    }
  }

  return Promise.reject(error);
};

const setupInterceptorsTo = (
  axiosInstance: AxiosInstance
): AxiosInstance => {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
};

export default setupInterceptorsTo(processorRequest);

/**
 * Получает URL прокси к j108.net API
 * Пример: https://backm.alpha-astro.com/api/j108
 */
export const getProcessorProxyUrl = (): string => {
  return `${getBackendUrl()}/api/j108`;
};
