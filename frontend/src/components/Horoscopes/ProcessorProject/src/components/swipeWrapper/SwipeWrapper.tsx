import React, { useCallback, useEffect, useRef } from 'react';
import { ClickAwayListener } from '@mui/material';

interface SwipeWrapperProps {
  children?: React.ReactNode;
  backgroundComponent?: React.ReactNode,
  maxMove?: number,
  closeOnClickAway?: boolean,
  fastSwipeThreshold?: number,
  swipeThreshold?: number
}

const SwipeWrapper = ({ children, backgroundComponent, maxMove, swipeThreshold = 0, closeOnClickAway = true, fastSwipeThreshold = 2 }: SwipeWrapperProps) => {
  const main = useRef<HTMLElement>(null);
  const data = useRef<any>({});

  useEffect(() => {
    data.current.startPosition = 0;
    data.current.currentPosition = 0;
    data.current.isFastSwipe = true;
    data.current.timeoutId = null;
    data.current.isSwiped = false;
    let maximumMove = main.current ? main.current.clientWidth / 2 : 200;

    if (maxMove) {
      maximumMove = maxMove;
    }

    const onTouchMove = (event: any) => {
      if (data.current.isSwiped) {
        return;
      }

      const touchX = event.touches[0].pageX;
      data.current.currentPosition = Math.min(data.current.startPosition - touchX, maximumMove);

      if (!data.current.startPosition) {
        data.current.startPosition = touchX;
      }

      if (data.current.currentPosition < swipeThreshold) {
        return;
      }

      if (main.current) {
        main.current.style.transform = `translateX(-${data.current.currentPosition}px)`;
      }
    };

    const onTouchStart = () => {
      if (data.current.isSwiped && main.current) {
        data.current.currentPosition = 0;
        main.current.style.transform = 'translateX(0px)';
        return;
      }

      data.current.timeoutId = setTimeout(() => {
        data.current.isFastSwipe = false;
      }, 300);

      if (main.current) {
        main.current.addEventListener('touchmove', onTouchMove, { passive: true });
      }
    };

    const onTouchEnd = (event: any) => {
      clearTimeout(data.current.timeoutId);

      if (data.current.isSwiped || data.current.currentPosition < swipeThreshold) {
        data.current.startPosition = 0;
        data.current.isSwiped = false;

        if (main.current) {
          main.current.removeEventListener('touchmove', onTouchMove);

          main.current.style.transform = 'translateX(0px)';
          data.current.isSwiped = false;
          data.current.currentPosition = 0;
        }

        return;
      }

      data.current.startPosition = 0;

      if (data.current.isFastSwipe && main.current && data.current.currentPosition !== maximumMove && data.current.currentPosition > fastSwipeThreshold) {
        main.current.style.transform = `translateX(-${maximumMove}px)`;
        data.current.isSwiped = true;
        return;
      }

      if (main.current) {
        main.current.removeEventListener('touchmove', onTouchMove);

        if (maximumMove > data.current.currentPosition) {
          main.current.style.transform = 'translateX(0px)';
          data.current.isSwiped = false;
          data.current.currentPosition = 0;
        } else {
          data.current.isSwiped = true;
        }
      }

      data.current.isFastSwipe = true;
    };

    if (main.current) {
      main.current.addEventListener('touchstart', onTouchStart, { passive: true });
      main.current.addEventListener('touchend', onTouchEnd, { passive: true });
    }

    return () => {
      if (main.current) {
        main.current.removeEventListener('touchstart', onTouchStart);
        main.current.removeEventListener('touchend', onTouchEnd);
      }
    };
  }, []);

  const onClickAway = useCallback(() => {
    if (!main.current || !data.current || !closeOnClickAway) {
      return;
    }

    main.current.style.transform = 'translateX(0px)';
    data.current.isSwiped = false;
    data.current.startPosition = 0;
    data.current.currentPosition = 0;
    data.current.isFastSwipe = true;
  }, [closeOnClickAway]);

  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <div style={{ position: 'relative' }}>
        <section style={{ zIndex: 10, opacity: 1, position: 'relative' }} ref={main}>
          {children}
        </section>
        <section style={{ width: '100%', height: '60px', top: 0, left: 0, zIndex: 1, position: 'absolute', borderRadius: '10px' }}>
          {backgroundComponent}
        </section>
      </div>
    </ClickAwayListener>
  );
};

export default SwipeWrapper;
