import React from 'react';
import styles from './loader.module.scss';
import loader from './assets/loader.png';

const Loader = () => {
  return (
    <div className={styles.main}>
      <img src={loader} width={'70px'} height={'70px'} className={styles.image}/>
    </div>
  );
};

export default Loader;
