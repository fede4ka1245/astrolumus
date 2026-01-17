import React, { createContext, useContext, ReactNode } from 'react';
import { useNavigation } from '../hooks/useNavigation';
import { ProcessorContext } from '../models/interfaces/processorContext';

interface NavigationContextType {
  currentRoute: string;
  navigate: (path: string | number, options?: { replace?: boolean }) => void;
  goBack: () => void;
  pathname: string;
  search: string;
  processorContext: ProcessorContext;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigation = useNavigation();
  
  const processorContext: ProcessorContext = {
    route: '/processor',
    isExternalHoroscope: false
  };

  const value: NavigationContextType = {
    ...navigation,
    processorContext
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigationContext = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigationContext must be used within NavigationProvider');
  }
  return context;
};

// Хуки для совместимости с react-router-dom API
export const useNavigate = () => {
  const { navigate } = useNavigationContext();
  return navigate as (path: string | number, options?: { replace?: boolean }) => void;
};

export const useLocation = () => {
  const { pathname, search } = useNavigationContext();
  return { pathname, search };
};

export const useOutletContext = <T extends ProcessorContext>(): T => {
  const { processorContext } = useNavigationContext();
  return processorContext as T;
};
