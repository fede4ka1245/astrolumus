import React from 'react';
import { Button as MuiButton, Typography } from '@mui/material';
import { ButtonBackProps } from './ButtonBackProps';

const ButtonBack = ({ label, onClick, color = '#99DAEA' } : ButtonBackProps) => {
  return (
    <MuiButton onClick={onClick} startIcon={<>
      <svg width="9" height="16" viewBox="0 0 7 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.65723 12.3135L1.44164 6.65662L5.65723 0.999768" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </>}>
      <Typography textTransform={'none'} fontFamily={'Gilroy'} fontWeight={'bold'} fontSize={16} color={color} textAlign={'left'}>
        {label}
      </Typography>
    </MuiButton>
  );
};

export default ButtonBack;
