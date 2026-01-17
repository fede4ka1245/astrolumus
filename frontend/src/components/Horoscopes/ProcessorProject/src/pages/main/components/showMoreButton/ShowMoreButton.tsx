import React from 'react';
import styles from './ShowMoreButton.module.scss';
import TextGradient from '../../../../components/textGradient/TextGradient';
import { Grid } from '@mui/material';

interface ShowMoreButtonProps {
  text?: string
}

const ShowMoreButton: React.FC<ShowMoreButtonProps> = ({ text }) => {
  return (
    <div className={styles.main}>
      <Grid container p={2} display={'flex'} alignItems={'center'}>
        <TextGradient flex={1} fontFamily={'Gilroy'} fontWeight={700} fontSize={'14px'}>
          {text || 'Показать еще'}
        </TextGradient>
        <svg width="7" height="14" viewBox="0 0 7 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 12.5L5.24095 7.31662C5.39164 7.13244 5.39164 6.86756 5.24095 6.68338L1 1.5" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </Grid>
    </div>
  );
};

export default ShowMoreButton;
