import { useCallback, FC } from 'react';
import styles from './Button.module.scss';
import { ButtonProps, ButtonType } from './ButtonProps';
import classNames from 'classnames';
import { CardActionArea, Typography } from '@mui/material';

const Button: FC<ButtonProps> = ({ text, onClick, type, isDisabled, width, height }) => {
  const onButtonClick = useCallback((event: any) => {
    if (isDisabled) {
      return;
    }

    if (onClick) {
      onClick(event);
    }
  }, [isDisabled, onClick]);

  return (
    <CardActionArea sx={{ borderRadius: '10px' }} disabled={isDisabled}>
      <div
        style={{ width, height }}
        className={
          classNames(
            styles.button,
            { [styles.gradientButton]: ButtonType.outline !== type },
            { [styles.outlineButton]: ButtonType.outline === type },
            { [styles.isDisabled]: isDisabled }
          )
        }
        onClick={onButtonClick}
      >
        <Typography fontFamily={'Gilroy, sans-serif'} fontSize={'18px'} color={'#FFF'} textAlign={'center'}>
          {text}
        </Typography>
        {ButtonType.outline !== type && !isDisabled && <div className={styles.blur}/>}
      </div>
    </CardActionArea>
  );
};

export default Button;
