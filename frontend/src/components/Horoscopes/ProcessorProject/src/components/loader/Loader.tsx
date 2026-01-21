import React from 'react';
import styles from './loader.module.scss';

const Loader = () => {
  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div className={styles.centerCircle}></div>
        <div className={styles.middleRing}>
          <div className={styles.ringDot}></div>
        </div>
        <div className={styles.outerRing}>
          <div className={styles.ringDot}></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
