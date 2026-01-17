import { useEffect } from 'react';
// @ts-ignore
import { disablePageScroll, enablePageScroll } from 'scroll-lock';

export const useLockScroll = () => {
  useEffect(() => {
    disablePageScroll();

    return () => {
      enablePageScroll();
    };
  }, []);
};
