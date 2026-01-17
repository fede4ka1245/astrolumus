import { useState, useEffect, useCallback, useRef } from 'react';

const NAVIGATION_KEY = 'processor_current_route';
const NAVIGATION_SEARCH_KEY = 'processor_current_search';
const NAVIGATION_HISTORY_KEY = 'processor_navigation_history';

export const useNavigation = () => {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return localStorage.getItem(NAVIGATION_KEY) || '/processor/horoscopes';
  });

  const [searchParams, setSearchParams] = useState<string>(() => {
    return localStorage.getItem(NAVIGATION_SEARCH_KEY) || '';
  });

  // История навигации для поддержки navigate(-1)
  const [history, setHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(NAVIGATION_HISTORY_KEY);
      return saved ? JSON.parse(saved) : [currentRoute + searchParams];
    } catch {
      return [currentRoute + searchParams];
    }
  });

  const historyIndexRef = useRef<number>(history.length - 1);

  // Сохраняем текущий роут в localStorage
  useEffect(() => {
    localStorage.setItem(NAVIGATION_KEY, currentRoute);
  }, [currentRoute]);

  // Сохраняем search params в localStorage
  useEffect(() => {
    localStorage.setItem(NAVIGATION_SEARCH_KEY, searchParams);
  }, [searchParams]);

  // Сохраняем историю в localStorage
  useEffect(() => {
    try {
      localStorage.setItem(NAVIGATION_HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn('Failed to save navigation history:', e);
    }
  }, [history]);

  const navigate = useCallback((path: string | number, options?: { replace?: boolean }) => {
    if (typeof path === 'number') {
      // Если передан number, это означает навигацию назад/вперед по истории
      if (path === -1) {
        // Навигация назад
        if (historyIndexRef.current > 0) {
          historyIndexRef.current -= 1;
          const previousPath = history[historyIndexRef.current];
          const [pathname, search = ''] = previousPath.split('?');
          setCurrentRoute(pathname);
          setSearchParams(search ? `?${search}` : '');
        }
      } else if (path === 1) {
        // Навигация вперед
        if (historyIndexRef.current < history.length - 1) {
          historyIndexRef.current += 1;
          const nextPath = history[historyIndexRef.current];
          const [pathname, search = ''] = nextPath.split('?');
          setCurrentRoute(pathname);
          setSearchParams(search ? `?${search}` : '');
        }
      }
      return;
    }
    
    // Извлекаем pathname и search из пути
    const [pathname, search = ''] = path.split('?');
    const fullPath = search ? `${pathname}?${search}` : pathname;
    
    // Обновляем состояние сразу, не дожидаясь обновления истории
    setCurrentRoute(pathname);
    setSearchParams(search ? `?${search}` : '');
    
    if (options?.replace) {
      // Заменяем текущую запись в истории
      setHistory(prev => {
        const newHistory = [...prev];
        if (newHistory.length > 0) {
          newHistory[historyIndexRef.current] = fullPath;
        } else {
          newHistory.push(fullPath);
          historyIndexRef.current = 0;
        }
        return newHistory;
      });
    } else {
      // Добавляем новую запись в историю
      setHistory(prev => {
        // Удаляем все записи после текущего индекса (если есть)
        const newHistory = prev.slice(0, historyIndexRef.current + 1);
        newHistory.push(fullPath);
        historyIndexRef.current = newHistory.length - 1;
        return newHistory;
      });
    }
  }, [history, currentRoute]);

  // Обновляем historyIndexRef при изменении истории
  useEffect(() => {
    historyIndexRef.current = history.length - 1;
  }, [history]);

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return {
    currentRoute,
    navigate,
    goBack,
    pathname: currentRoute,
    search: searchParams
  };
};
