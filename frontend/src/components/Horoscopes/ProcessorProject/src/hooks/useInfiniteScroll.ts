import { useCallback, useRef } from 'react';

const useInfiniteScroll = (callback: (isIntersecting?: boolean) => void, reverse?: boolean) => {
  const intObserver = useRef<any>(null);
  
  return useCallback((item: any) => {
    if (intObserver.current) {
      intObserver.current.disconnect();
    }
    intObserver.current = new IntersectionObserver(items => {
      if (reverse) {
        callback(items[0].isIntersecting);
      } else {
        if (items[0].isIntersecting) {
          callback();
        }
      }
    });
    if (item) {
      intObserver.current.observe(item);
    }
  }, [callback, reverse]);
};

export default useInfiniteScroll;
