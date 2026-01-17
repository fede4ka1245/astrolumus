import { useNavigate, useLocation } from '../contexts/NavigationContext';
import { useCallback, useEffect, useMemo } from 'react';
import lodash from 'lodash';

// Простая замена createSearchParams
const createSearchParams = (params: Record<string, string>): URLSearchParams => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    searchParams.set(key, value);
  });
  return searchParams;
};

export function useSearchParamsState<Type> (
  searchParamName: string,
  defaultValue: Type,
  replace: boolean = true
): readonly [
  searchParamsState: Type,
  setSearchParamsState: (newState: Type, isReplace?: boolean) => void
] {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParamsState = useMemo(() => {
    // Используем search из контекста вместо document.location.search
    const searchString = location.search.replace(/^\?/, '');
    const searchParams = new URLSearchParams(searchString);
    const acquiredSearchParam = searchParams.get(searchParamName);

    if (acquiredSearchParam) {
      try {
        return JSON.parse(acquiredSearchParam) as Type;
      } catch {
        return acquiredSearchParam;
      }
    }

    return defaultValue;
  }, [defaultValue, searchParamName, location]);

  const setSearchParamsState = useCallback((newState: Type, isReplace: boolean = replace) => {
    // Используем search из контекста вместо document.location.search
    const searchString = location.search.replace(/^\?/, '');
    const searchParams = new URLSearchParams(searchString);

    const params = Object.assign(
      {},
      [...searchParams?.entries()].reduce(
        (o, [key, value]) => ({ ...o, [key]: value }),
        {}
      ),
      { [searchParamName]: JSON.stringify(newState) }
    );

    if (!lodash.isEqual([...searchParams?.entries()].reduce(
      (o, [key, value]) => ({ ...o, [key]: value }),
      {}
    ), params)) {
      const newPath = location.pathname + '?' + createSearchParams(params).toString();
      navigate(newPath, {
        replace: isReplace
      });
    }
  }, [navigate, replace, searchParamName, location]);

  useEffect(() => {
    // Используем search из контекста вместо document.location.search
    const searchString = location.search.replace(/^\?/, '');
    const searchParams = new URLSearchParams(searchString);

    if (searchParams.get(searchParamName)) {
      return;
    }

    const params = Object.assign(
      {},
      [...searchParams?.entries()].reduce(
        (o, [key, value]) => ({ ...o, [key]: value }),
        {}
      ),
      { [searchParamName]: JSON.stringify(defaultValue) }
    );

    const newPath = location.pathname + '?' + createSearchParams(params).toString();
    navigate(newPath, {
      replace: true
    });
  }, [defaultValue, searchParamName, location, navigate]);

  return [searchParamsState as Type, setSearchParamsState];
}
