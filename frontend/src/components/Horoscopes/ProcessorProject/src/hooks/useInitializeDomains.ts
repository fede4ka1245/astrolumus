import { useEffect } from 'react';
import { useAppDispatch } from '../store/store';
import { setCurrentDomain, setAvailableDomains, setDomainsLoading } from '../store/reducers/domainsReducer';
import { getDomainsFromFirebase, findFastestDomain } from '../api/getDomains';
import { useGetDomainsInitialized } from '../store/selectors';

export const useInitializeDomains = () => {
  const dispatch = useAppDispatch();
  const isInitialized = useGetDomainsInitialized();

  useEffect(() => {
    if (isInitialized) {
      console.log('✅ Domains already initialized');
      return;
    }

    const initializeDomains = async () => {
      console.log('🚀 Initializing domains from Firebase...');
      dispatch(setDomainsLoading(true));

      try {
        // 1. Получаем список доменов из Firebase
        const domains = await getDomainsFromFirebase();
        dispatch(setAvailableDomains(domains));

        console.log(`📋 Found ${domains.length} domain(s)`);

        // 2. Находим самый быстрый backend
        const fastestDomain = await findFastestDomain(domains);
        console.log('🔍 Fastest domain:', fastestDomain);
        // 3. Сохраняем выбранный домен
        dispatch(setCurrentDomain(fastestDomain));

        console.log('✅ Domains initialized successfully');
        console.log('Selected domains:', fastestDomain);
      } catch (error) {
        console.error('❌ Failed to initialize domains:', error);
        
        // Fallback на env переменные
        const fallbackDomain = {
          backend: import.meta.env.VITE_APP_API_URL || 'https://backm.alpha-astro.com',
          preview: import.meta.env.VITE_APP_PREVIEW_PAGE_URL || 'https://app.alpha-astro.com',
          storage: import.meta.env.VITE_APP_STORAGE_URL || 'https://media.alpha-astro.com'
        };
        
        dispatch(setCurrentDomain(fallbackDomain));
        console.log('Using fallback domains:', fallbackDomain);
      } finally {
        dispatch(setDomainsLoading(false));
      }
    };

    initializeDomains();
  }, [dispatch, isInitialized]);
};
