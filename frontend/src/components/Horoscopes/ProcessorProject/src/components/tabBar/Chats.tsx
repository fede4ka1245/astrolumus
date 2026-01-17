import { Grid } from '@mui/material';
import styles from './TabBar.module.scss';
import { useAppSelector } from '../../store/store';
import React from 'react';

const Chats = () => {
  const { hasNewMessages } = useAppSelector(state => state.notification);

  return (
    <Grid position={'relative'}>
      {
        hasNewMessages && (
          <Grid width={10} height={10} bgcolor="#DC1616" borderRadius={'50%'} position={'absolute'} right={-5} top={-5}/>
        )
      }
      <svg className={styles.stroke} width="24" height="27" viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.5">
          <path fillRule="evenodd" clipRule="evenodd" d="M11.8911 4.42047C10.1533 4.41652 7.78321 4.33899 6.89731 5.41403C6.0709 6.41678 6.28386 7.12254 6.14947 8.95326C6.01381 10.7853 0.628468 16.0649 2.33187 19.0456C3.5411 20.5832 6.07599 20.6975 11.8911 20.6975C17.7061 20.6975 20.241 20.5832 21.4501 19.0456C23.1548 16.0649 17.7682 10.7853 17.6326 8.95326C17.4982 7.12254 17.7111 6.41679 16.8848 5.41403C15.9988 4.33899 13.6287 4.41652 11.8911 4.42047Z" stroke="#9C9EA8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M15.6875 23.6102C13.8636 25.4633 9.91036 25.4633 8.0966 23.6102" stroke="#9C9EA8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13.2741 3.38977C13.4502 1.53672 10.3232 1.53672 10.5095 3.38977" stroke="#9C9EA8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
      </svg>
    </Grid>

  );
};

export default Chats;
