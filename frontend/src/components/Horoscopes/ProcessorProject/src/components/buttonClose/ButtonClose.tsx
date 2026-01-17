import React, { useCallback } from 'react';
import IconButton from '../iconButton/IconButton';

interface ButtonCloseProps {
  onClick?: (props?: any) => any,
}

const ButtonClose = ({ onClick }: ButtonCloseProps) => {
  const onButtonClick = useCallback(() => {
    if (onClick) {
      onClick();
    }
  }, [onClick]);

  return (
    <IconButton onClick={onButtonClick}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.58398 1.58334L14.4173 14.4167" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
        <path d="M14.416 1.58334L1.58268 14.4167" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </IconButton>
  );
};

export default ButtonClose;
