import { useEffect, useRef } from 'react';

export const useLifecycleUpdate = (func: (props?: any) => any, params?: any []) => {
  const isFirstRender = useRef(true);
  
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    func();
  }, params);
};
