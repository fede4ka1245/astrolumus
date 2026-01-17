import { store } from '../store/store';

/**
 * Получает текущий backend URL из store или использует fallback
 */
export const getBackendUrl = (): string => {
  const state = store.getState();
  const currentDomain = state.domains.currentDomain;
  
  if (currentDomain?.backend) {
    return currentDomain.backend;
  }
  
  // Fallback на env переменную
  return import.meta.env.VITE_APP_API_URL || 'https://backm.alpha-astro.com';
};

/**
 * Получает текущий preview URL из store или использует fallback
 */
export const getPreviewUrl = (): string => {
  const state = store.getState();
  const currentDomain = state.domains.currentDomain;
  
  if (currentDomain?.preview) {
    return currentDomain.preview;
  }
  
  // Fallback на env переменную
  return import.meta.env.VITE_APP_PREVIEW_PAGE_URL || 'https://app.alpha-astro.com';
};

/**
 * Получает текущий storage URL из store или использует fallback
 */
export const getStorageUrl = (): string => {
  const state = store.getState();
  const currentDomain = state.domains.currentDomain;
  
  if (currentDomain?.storage) {
    return currentDomain.storage;
  }
  
  // Fallback на env переменную
  return import.meta.env.VITE_APP_STORAGE_URL || 'https://media.alpha-astro.com';
};

/**
 * Получает URL прокси к j108.net API через бэкенд
 * Прокси автоматически добавляет X-API-Key
 * 
 * @example
 * getProcessorProxyUrl() // https://backm.alpha-astro.com/api/j108
 */
export const getProcessorProxyUrl = (): string => {
  return `${getBackendUrl()}/api/j108`;
};
