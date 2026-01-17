import React from 'react';
import styles from './ButtonPrevForward.module.scss';

interface ButtonPrevForwardProps {
  onClick: (props?: any) => any,
  type: 'forward' | 'prev'
}

const ButtonPrevForward = ({ type, onClick }: ButtonPrevForwardProps) => {
  return (
    <div onClick={onClick} className={styles.main}>
      {type === 'forward'
        ? (
          <svg width="11" height="13" viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 12L5.24095 6.81662C5.39164 6.63244 5.39164 6.36756 5.24095 6.18338L1 1" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
            <path d="M5 12L9.24095 6.81662C9.39164 6.63244 9.39164 6.36756 9.24095 6.18338L5 1" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )
        : (
          <svg width="11" height="13" viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 12L5.75905 6.81662C5.60836 6.63244 5.60836 6.36756 5.75905 6.18338L10 1" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
            <path d="M6 12L1.75905 6.81662C1.60836 6.63244 1.60836 6.36756 1.75905 6.18338L6 1" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )}
    </div>
  );
};

export default ButtonPrevForward;
