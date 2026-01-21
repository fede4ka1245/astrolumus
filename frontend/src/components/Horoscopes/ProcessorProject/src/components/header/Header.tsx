import React from 'react';
import { Grid, Typography } from '@mui/material';

interface HeaderProps {
  header?: string,
  isIconActive?: boolean,
  isPlain?: boolean
}

const Header = ({ header, isIconActive = true, isPlain = false }: HeaderProps) => {
  return (
    <Grid display={'flex'} alignItems={'flex-end'}>
      {isIconActive && <svg style={{ marginRight: '8px' }} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="18" height="18" rx="9" fill="#C4C4C4" stroke="#C3C9CD" strokeWidth="2"/>
        <path d="M7.5 6.66667C7.5 6.66667 8.33333 5 10 5C11.6667 5 12.2594 5.91974 12.5 6.66667C13.0634 8.41562 11.25 9.58333 11.25 9.58333C11.25 9.58333 10 10.6607 10 11.25C10 11.6667 10 12.0833 10 12.0833" stroke="#282363" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="10.0007" cy="14.7917" r="1.04167" fill="#282363"/>
      </svg>}
      <Typography
        letterSpacing={isPlain ? '0' : '0.08em'}
        color={'#F0F0F3'}
        fontFamily={'Gilroy'}
        fontWeight={700}
        textTransform={isPlain ? 'none' : 'uppercase'}
        lineHeight={isPlain ? '1.3' : '20px'}
        fontSize={isPlain ? '22px' : '20px'}
        sx={{
          '@media (max-width: 430px)': {
            fontSize: isPlain ? '20px' : '18px'
          },
          '@media (max-width: 320px)': {
            fontSize: isPlain ? '18px' : '16px'
          },
          '@media (min-width: 500px)': {
            fontSize: isPlain ? '26px' : '22px'
          }
        }}
      >
        { header }
      </Typography>
    </Grid>
  );
};

export default Header;
