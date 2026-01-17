import React from 'react';
import styles from './OptionsSkeleton.module.scss';

const OptionsSkeleton = () => {
  return (
    <div className={styles.skeleton}>
      <div className={styles.item}/>
    </div>
  );
};

export default OptionsSkeleton;
