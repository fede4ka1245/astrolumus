import { store } from '../store/store';
import { DomainConfig } from '../api/getDomains';

/**
 * Получает список всех возможных доменов из конфигурации
 */
const getAllPossibleDomains = (): string[] => {
  const state = store.getState();
  const availableDomains = state.domains.availableDomains;
  
  const allDomains: string[] = [];
  
  availableDomains.forEach((domain: DomainConfig) => {
    allDomains.push(domain.backend);
    allDomains.push(domain.preview);
    allDomains.push(domain.storage);
  });
  
  return allDomains;
};

/**
 * Получает текущие домены
 */
const getCurrentDomains = (): DomainConfig | null => {
  const state = store.getState();
  return state.domains.activeDomain;
};

/**
 * Заменяет домен в URL на актуальный
 */
export const replaceDomainInUrl = (url: string): string => {
  if (!url) return url;
  
  try {
    const urlObj = new URL(url);
    const origin = urlObj.origin;
    
    const allDomains = getAllPossibleDomains();
    const currentDomains = getCurrentDomains();
    
    if (!currentDomains) return url;
    
    // Проверяем, является ли этот домен одним из наших
    const isOurDomain = allDomains.some(domain => {
      try {
        const domainUrl = new URL(domain);
        return domainUrl.origin === origin;
      } catch {
        return false;
      }
    });
    
    if (!isOurDomain) return url;
    
    // Определяем тип домена и заменяем на актуальный
    for (const domain of allDomains) {
      try {
        const domainUrl = new URL(domain);
        if (domainUrl.origin === origin) {
          // Определяем какой это тип (backend, preview, storage)
          let newDomain = '';
          
          // Проверяем по всем доступным доменам
          const state = store.getState();
          const availableDomains = state.domains.availableDomains;
          
          for (const availDomain of availableDomains) {
            if (availDomain.backend === domain) {
              newDomain = currentDomains.backend;
              break;
            }
            if (availDomain.preview === domain) {
              newDomain = currentDomains.preview;
              break;
            }
            if (availDomain.storage === domain) {
              newDomain = currentDomains.storage;
              break;
            }
          }
          
          if (newDomain) {
            urlObj.protocol = new URL(newDomain).protocol;
            urlObj.host = new URL(newDomain).host;
            return urlObj.toString();
          }
        }
      } catch {
        continue;
      }
    }
    
    return url;
  } catch {
    return url;
  }
};

/**
 * Заменяет все ссылки в HTML контенте
 */
export const replaceDomainsInHtml = (html: string): string => {
  if (!html) return html;
  
  // Заменяем в src атрибутах (изображения, видео)
  let result = html.replace(/src="([^"]+)"/gi, (match, url) => {
    const newUrl = replaceDomainInUrl(url);
    return `src="${newUrl}"`;
  });
  
  // Заменяем в href атрибутах (ссылки)
  result = result.replace(/href="([^"]+)"/gi, (match, url) => {
    const newUrl = replaceDomainInUrl(url);
    return `href="${newUrl}"`;
  });
  
  // Заменяем в srcset атрибутах
  result = result.replace(/srcset="([^"]+)"/gi, (match, srcset) => {
    const newSrcset = srcset.split(',').map((src: string) => {
      const parts = src.trim().split(' ');
      parts[0] = replaceDomainInUrl(parts[0]);
      return parts.join(' ');
    }).join(', ');
    return `srcset="${newSrcset}"`;
  });
  
  return result;
};

/**
 * Добавляет email пользователя к URL (для тарифов)
 */
export const addUserEmailToUrl = (url: string, email: string): string => {
  if (!url || !email) return url;
  
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set('email', email);
    return urlObj.toString();
  } catch {
    // Если URL невалидный, просто добавляем email через & или ?
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}email=${encodeURIComponent(email)}`;
  }
};

/**
 * Обрабатывает ссылку тарифа: заменяет домен и добавляет email
 */
export const processTariffLink = (url: string, email?: string): string => {
  let processedUrl = replaceDomainInUrl(url);
  
  if (email) {
    processedUrl = addUserEmailToUrl(processedUrl, email);
  }
  
  return processedUrl;
};

/**
 * Обрабатывает массив URL (для списков изображений, видео и т.д.)
 */
export const replaceDomainsInUrls = (urls: string[]): string[] => {
  return urls.map(url => replaceDomainInUrl(url));
};
