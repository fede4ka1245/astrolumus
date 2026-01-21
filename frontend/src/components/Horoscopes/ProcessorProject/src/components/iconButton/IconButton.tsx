import React, { CSSProperties, MouseEventHandler } from 'react';
import styles from './IconButtom.module.scss';

export interface IconButtonProps {
  children: React.ReactNode [] | React.ReactNode;
  onClick?: MouseEventHandler | undefined;
  fillStyle?: CSSProperties | undefined;
  style?: CSSProperties | undefined;
}

const IconButton = ({ children, onClick, style }: IconButtonProps) => {
  return (
    <div className={styles.main} style={style}>
      <button className={styles.container} onClick={onClick} type="button">
        { children }
      </button>
    </div>
  );
};

export default IconButton;
