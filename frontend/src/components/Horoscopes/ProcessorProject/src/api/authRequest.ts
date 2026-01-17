import axios, {
  AxiosRequestConfig,
  AxiosInstance,
  AxiosError,
  AxiosResponse
} from 'axios';
import { LocalStorageKey } from '../models/enums/LocalStorageKey';

const authRequest = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const j108Request = axios.create({
  baseURL: import.meta.env.VITE_APP_J108_API_URL || 'https://j108.net/api',
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
        const res = await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/token/refresh/`, {
          refresh: localStorage.getItem(LocalStorageKey.refresh)
        });
        const { access } = res.data;
        localStorage.setItem(LocalStorageKey.access, access);
        error.config!.headers = { ...error.config!.headers };
        return authRequest(error.config);
      } catch (_error) {
        localStorage.removeItem(LocalStorageKey.access);
        localStorage.removeItem(LocalStorageKey.refresh);
        return Promise.reject(_error);
      }
    }
  }

  return Promise.reject(error);
};

export const setupInterceptorsTo = (
  axiosInstance: AxiosInstance
): AxiosInstance => {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
};

// Interceptor для j108 API - добавляет X-API-Key заголовок
const onJ108Request = (config: AxiosRequestConfig): any => {
  if (config?.headers) {
    const apiKey = import.meta.env.VITE_APP_PROCESSOR_API_KEY;
    if (apiKey) {
      config.headers['X-API-Key'] = apiKey;
    }
  }
  return config;
};

j108Request.interceptors.request.use(onJ108Request, onRequestError);
j108Request.interceptors.response.use(onResponse, onResponseError);

export default setupInterceptorsTo(authRequest);
export { j108Request };