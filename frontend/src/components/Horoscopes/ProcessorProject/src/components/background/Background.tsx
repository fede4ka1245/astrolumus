import React, { useEffect, useRef } from 'react';

interface BackgroundProps {
  background: string
}

const Background = ({ background }: BackgroundProps) => {
  const main = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!main.current) {
      return;
    }

    main.current.style.background = background;
    main.current.style.minHeight = `${window.innerHeight}px`;
  }, []);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, zIndex: -1, height: '100%', width: '100%' }}>
      <div ref={main} style={{ zIndex: -2, position: 'fixed', top: 0, left: 0, height: '110%', width: '100%', transform: 'translateY(-10px)' }}/>
    </div>
  );
};

export default Background;
