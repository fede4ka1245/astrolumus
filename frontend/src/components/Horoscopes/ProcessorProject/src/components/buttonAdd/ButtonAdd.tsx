import React, { useCallback } from 'react';
import styles from '../../pages/horoscopes/transitions/components/transitionItem/TransitionItem.module.scss';
import { Box } from '@mui/material';
import minus from './assets/minus.svg';
import plus from './assets/plus.svg';
import classNames from 'classnames';

export interface ButtonAddProps {
  isOpen?: boolean,
  children?: React.ReactNode,
  onClick?: Function,
}

const ButtonAdd = ({ isOpen, children, onClick }: ButtonAddProps) => {
  const onButtonClick = useCallback(() => {
    if (onClick) {
      onClick();
    }
  }, [onClick]);

  return (
    <section onClick={onButtonClick} className={styles.label}>
      <Box width={'30px'} height={'30px'} pr={2}>
        {isOpen && <img alt='minus' src={minus} width={'30px'} height={'30px'}/>}
        {!isOpen && <img alt='plus' src={plus} width={'30px'} height={'30px'}/>}
      </Box>
      <p className={classNames({ [styles.textOpened]: isOpen }, { [styles.textClosed]: !isOpen })}>
        {children}
      </p>
    </section>
  );
};

export default ButtonAdd;
