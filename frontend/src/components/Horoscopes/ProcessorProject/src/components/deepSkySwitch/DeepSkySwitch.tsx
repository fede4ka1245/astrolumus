import React, { useCallback } from 'react';
import styles from './DeepSkySwitch.module.scss';
import img from './img.png';
import { Grid } from '@mui/material';
import IconButton from '../iconButton/IconButton';
import deepSky from './deepSky.svg';
import Switch from '../switch/Switch';
import { useSearchParamsState } from '../../hooks/useSearchParamsState';
import DeepSkyModal from './deepSkyModal/DeepSkyModal';
import { useNavigate } from '../../contexts/NavigationContext';

interface DeepSkySwitchProps {
  isDeepSkyActive: boolean,
  toggleDeepSky: (...props: any | any[]) => any
}

const DeepSkySwitch : React.FC<DeepSkySwitchProps> = ({ isDeepSkyActive, toggleDeepSky }) => {
  const [isDeepSkyModalActive, setIsDeepSkyModalActive] = useSearchParamsState('isDeepSkySwitchModalActive', false, false);
  const navigate = useNavigate();

  const closeDeepSkyModal = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const openDeepSkyModal = useCallback(() => {
    setIsDeepSkyModalActive(true, false);
  }, [setIsDeepSkyModalActive]);

  return (
    <section className={styles.main}>
      <img alt='background' src={img} className={styles.background}/>
      <Grid ml={1}>
        <IconButton fillStyle={{ width: '32px', height: '32px' }} onClick={openDeepSkyModal}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="18" height="18" rx="9" fill="#C4C4C4" stroke="#C3C9CD" strokeWidth="2"/>
            <path d="M7.5 6.66667C7.5 6.66667 8.33333 5 10 5C11.6667 5 12.2594 5.91974 12.5 6.66667C13.0634 8.41562 11.25 9.58333 11.25 9.58333C11.25 9.58333 10 10.6607 10 11.25C10 11.6667 10 12.0833 10 12.0833" stroke="#282363" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="10.0007" cy="14.7917" r="1.04167" fill="#282363"/>
          </svg>
        </IconButton>
      </Grid>
      <img alt='deepSky' src={deepSky} style={{ margin: '0 auto 0 5px' }} />
      <Grid zIndex={100}>
        <Switch onChange={toggleDeepSky} checked={isDeepSkyActive} />
      </Grid>
      <DeepSkyModal isOpen={isDeepSkyModalActive} close={closeDeepSkyModal} />
    </section>
  );
};

export default DeepSkySwitch;
