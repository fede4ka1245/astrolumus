import { useLocation, useNavigate } from '../contexts/NavigationContext';
import { useEffect } from 'react';
import { App } from '@capacitor/app';
import { LocalStorageKey } from '../models/enums/LocalStorageKey';

export const usePauseResumeEffect = () => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem(LocalStorageKey.restoredPathname, pathname + search);
  }, [pathname, search]);

  useEffect(() => {
    App.addListener('appStateChange', ({ isActive }) => {
      if (isActive) {
        navigate(localStorage.getItem(LocalStorageKey.restoredPathname) || '', {
          replace: true
        });
      }
    });
  }, []);
};
