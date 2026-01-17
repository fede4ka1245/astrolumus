import React, { CSSProperties, MouseEventHandler } from 'react';
import styles from './IconButtom.module.scss';
import Ripples from 'react-ripples';

export interface IconButtonProps {
  children: React.ReactNode [] | React.ReactNode;
  onClick?: MouseEventHandler | undefined;
  fillStyle?: CSSProperties | undefined;
  style?: CSSProperties | undefined;
}

const IconButton = ({ children, onClick, style }: IconButtonProps) => {
  return (
    <div className={styles.main} style={style}>
      <Ripples className={styles.fill} onClick={onClick}>
      </Ripples>
      <button className={styles.container}>
        { children }
      </button>
    </div>
  );
};

export default IconButton;
