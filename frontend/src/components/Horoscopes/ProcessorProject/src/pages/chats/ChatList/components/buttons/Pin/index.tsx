import { FC } from 'react';

import styles from './styles.module.scss';

const Pin = () => {
  return (
    <div className={styles.container}>
      <img src="./__mocks__/icons/pin.svg" style={{ width: 14, height: 14 }}/>
    </div>
  );
};

export default Pin;
