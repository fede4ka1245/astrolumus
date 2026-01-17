import React, { MouseEventHandler } from 'react';
import styles from './Tappable.module.scss';
import classNames from 'classnames';

export interface TappableProps {
  children?: React.ReactNode [] | React.ReactNode;
  onClick?: MouseEventHandler<any> | undefined;
  disabled: boolean
}

const Tappable: React.FC<TappableProps> = ({ children, onClick, disabled = true }) => {
  return (
    <div onClick={onClick} className={classNames(styles.main, { [styles.disabled]: disabled })}>
      {children}
    </div>
  );
};

export default Tappable;
