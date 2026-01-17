import React from 'react';
import moon from './moon.webp';
import styles from './Moon.module.scss';

const Moon = () => {
  return (
    <div className={styles.moon}>
      <img
        alt="moon"
        src={moon}
        width={'100%'}
        height={'100px'}
      />
    </div>
  );
};

export default Moon;
