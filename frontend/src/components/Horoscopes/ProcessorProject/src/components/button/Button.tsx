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
    <CardActionArea sx={{ borderRadius: 'var(--radius-lg)' }} disabled={isDisabled} disableRipple>
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
        <Typography
          fontFamily={'Gilroy, sans-serif'}
          fontSize={'clamp(0.875rem, 2.5vw, 1.125rem)'}
          fontWeight={600}
          color={'var(--bg-primary)'}
          textAlign={'center'}
        >
          {text}
        </Typography>
      </div>
    </CardActionArea>
  );
};

export default Button;
