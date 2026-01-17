import { useNavigate } from '../contexts/NavigationContext';
import { useCallback } from 'react';
import { useNavigationContext } from '../contexts/NavigationContext';

export const useNavigateBack = () => {
  const navigate = useNavigate();
  const { pathname } = useNavigationContext();
  
  return useCallback(() => {
    // Просто используем navigate(-1) для возврата назад по нашей истории
    navigate(-1);
  }, [navigate]);
};
