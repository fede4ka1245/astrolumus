import React from 'react';
import styles from './Placemark.module.scss';
import classNames from 'classnames';

interface PlacemarkProps {
  isDragging: boolean,
}

const Placemark = ({ isDragging }: PlacemarkProps) => {
  return (
    <div className={classNames(styles.container, { [styles.dragged]: isDragging })}>
      <div className={styles.main} />
    </div>
  );
};

export default Placemark;
