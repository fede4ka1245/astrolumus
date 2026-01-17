import React, { useEffect, useState } from 'react';
import styles from './DeepSkyInfoImage.module.scss';
import { useInView } from 'react-intersection-observer';

interface DeepSkyInfoImageProps {
  url: string
}

const DeepSkyInfoImage: React.FC<DeepSkyInfoImageProps> = ({ url }) => {
  const [isRendered, setIsRendered] = useState(false);

  const { ref, inView } = useInView({
    delay: 200
  });

  useEffect(() => {
    if (inView) {
      setIsRendered(true);
    }
  }, [inView]);

  return (
    <div ref={ref}>
      {!isRendered && <div className={styles.imageSkeleton} />}
      {isRendered && (
        <>
          <img
            src={url}
            width={'100px'}
            height={'100px'}
            className={styles.deepSkyImage}
            alt={'deepsky'}
          />
          <img
            width={'100px'}
            height={'100px'}
            alt={'deepsky_background'}
            src={url}
            className={styles.deepSkyImageBackground}
          />
        </>
      )}
    </div>
  );
};

export default DeepSkyInfoImage;
