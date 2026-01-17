import axios from 'axios';

export interface DomainConfig {
  backend: string;
  preview: string;
  storage: string;
}

const FIREBASE_DOMAINS_URL = 'https://alpha-6a5fd-default-rtdb.europe-west1.firebasedatabase.app/domains.json';

export const getDomainsFromFirebase = async (): Promise<DomainConfig[]> => {
  try {
    const { data } = await axios.get<DomainConfig[]>(FIREBASE_DOMAINS_URL);
    
    if (!data || !Array.isArray(data)) {
      throw new Error('Invalid domains data from Firebase');
    }
    
    return data;
  } catch (error) {
    console.error('Failed to fetch domains from Firebase:', error);
    // Fallback на дефолтные домены
    return [{
      backend: import.meta.env.VITE_APP_API_URL || 'https://backm.alpha-astro.com',
      preview: import.meta.env.VITE_APP_PREVIEW_PAGE_URL || 'https://app.alpha-astro.com',
      storage: import.meta.env.VITE_APP_STORAGE_URL || 'https://media.alpha-astro.com'
    }];
  }
};

export const pingBackend = async (backendUrl: string): Promise<number> => {
  const startTime = performance.now();
  
  try {
    await axios.get(`${backendUrl}/ping`, {
      timeout: 5000 // 5 секунд таймаут
    });
    
    const endTime = performance.now();
    return endTime - startTime;
  } catch (error) {
    console.warn(`Failed to ping ${backendUrl}:`, error);
    return Infinity; // Возвращаем бесконечность если не удалось
  }
};

export const findFastestDomain = async (domains: DomainConfig[]): Promise<DomainConfig> => {
  console.log('🔍 Testing domains for fastest backend...');
  
  const pingPromises = domains.map(async (domain) => {
    const responseTime = await pingBackend(domain.backend);
    return {
      domain,
      responseTime
    };
  });
  
  const results = await Promise.all(pingPromises);
  
  // Сортируем по времени отклика
  results.sort((a, b) => a.responseTime - b.responseTime);
  
  const fastest = results[0];
  
  if (fastest.responseTime === Infinity) {
    console.error('❌ All backends are unavailable, using first domain as fallback');
    return domains[0];
  }
  
  console.log(`✅ Fastest backend: ${fastest.domain.backend} (${Math.round(fastest.responseTime)}ms)`);
  
  return fastest.domain;
};
