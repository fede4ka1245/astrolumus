import React from 'react';
import ok from './assets/ok.svg';
import { Button as MuiButton, Typography } from '@mui/material';
import { ButtonSaveProps } from './ButtonSaveProps';

const ButtonSave = ({ onClick } : ButtonSaveProps) => {
  return (
    <MuiButton onClick={onClick} startIcon={<>
      <img alt='ok' src={ok}/>
    </>}>
      <Typography textTransform={'none'} color={'white'} fontFamily={'Gilroy'} fontWeight={'bold'} fontSize={14} textAlign={'left'}>
        Сохранить
      </Typography>
    </MuiButton>
  );
};

export default ButtonSave;
