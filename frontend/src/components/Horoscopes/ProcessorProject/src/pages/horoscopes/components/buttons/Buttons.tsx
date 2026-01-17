import React, { useCallback, useState } from 'react';
import styles from './Buttons.module.scss';
import folder from './assets/folder.svg';
import share from './assets/share.svg';
import home from './assets/home.svg';
import pen from './assets/pen.svg';
import settings from './assets/settings.svg';
import wallet from '../../../astrlogicalProcessor/components/header/assets/wallet.svg';
import { Grid } from '@mui/material';
import { useNavigate, useOutletContext } from '../../../../contexts/NavigationContext';
import SettingsModal from '../../../../components/settingsModal/SettingsModal';
import EditHoroscopeModal from '../editHoroscopeModal/EditHoroscopeModal';
import RatesModal from '../../../../components/ratesModal/RatesModal';
import { useSaveCurrentHoroscope } from '../../../../hooks/useSaveCurrentHoroscope';
import {
  useGetCurrentHoroscopeId,
  useGetHoroscopeAddressInformation,
  useGetHoroscopeUserInfo,
  useGetSavedHoroscopeId
} from '../../../../store/selectors';
import { Clipboard } from '@capacitor/clipboard';
import { buildHoroscopeUrl } from '../../../../helpers/horoscopeUrl';
import { useSnackbarAlert } from '../../../../hooks/useSnackbarAlert';
import { getShortLink } from '../../../../api/getShortLink';
import { useAppDispatch } from '../../../../store/store';
import { setSavedHoroscopeId, setCurrentHoroscopeId } from '../../../../store/reducers/horoscopesReducer';
import { processorRoutes } from '../../../astrlogicalProcessor/processorRoutes';
import { ProcessorContext } from '../../../../models/interfaces/processorContext';
import { useSearchParamsState } from '../../../../hooks/useSearchParamsState';
import authRequest from '../../../../api/authRequest';
import { useIsPaymentsEnabled } from '../../../../hooks/useIsPaymentsEnabled';

const Buttons = () => {
  const horoscopeUserInfo = useGetHoroscopeUserInfo();
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useSearchParamsState('isSettingsModalOpen', false, false);
  const [isEditModalOpen, setIsEditModalOpen] = useSearchParamsState('isEditModalOpen', false, false);
  const [isRatesModalOpen, setIsRatesModalOpen] = useState(false);
  const navigate = useNavigate();
  const horoscopeId = useGetCurrentHoroscopeId();
  const savedHoroscopeId = useGetSavedHoroscopeId();
  const saveHoroscope = useSaveCurrentHoroscope();
  const userInfo = useGetHoroscopeUserInfo();
  const address = useGetHoroscopeAddressInformation();
  const snackbarAlert = useSnackbarAlert();
  const dispatch = useAppDispatch();
  const { route, isExternalHoroscope } = useOutletContext<ProcessorContext>();
  const isPaymentsEnabled = useIsPaymentsEnabled();

  const onHomeClick = useCallback(() => {
    navigate(route + processorRoutes.index, {
      replace: true
    });
  }, [navigate, route]);

  const onSaveHoroscope = useCallback(() => {
    if (savedHoroscopeId) {
      snackbarAlert('Гороскоп сохранен!');
      return;
    }

    saveHoroscope()
      ?.then((data) => {
        dispatch(setSavedHoroscopeId(data?.horoscope?.id));
        dispatch(setCurrentHoroscopeId(data?.id));

        authRequest.patch(`${import.meta.env.VITE_APP_API_URL}/horoscope/my-horoscopes/${data?.id}/`, {
          city: address.location.value,
          name: horoscopeUserInfo.name
        });

        authRequest.patch(`${import.meta.env.VITE_APP_API_URL}/horoscope/horoscopes/${data?.horoscope?.id}/`, {
          longitude: address.coordinates.longitude,
          latitude: address.coordinates.latitude,
          dt: horoscopeUserInfo.date.split('.').reverse().join('-') + 'T' + horoscopeUserInfo.time,
          tz_hour: Number(address.timeZone.greenwich + address.timeZone.hours),
          tz_minutes: address.timeZone.minutes
        });
      });
  }, [address.coordinates.latitude, address.coordinates.longitude, address.location.value, address.timeZone.greenwich, address.timeZone.hours, address.timeZone.minutes, dispatch, horoscopeUserInfo.date, horoscopeUserInfo.name, horoscopeUserInfo.time, saveHoroscope, savedHoroscopeId, snackbarAlert]);

  const toggleSettingsModal = useCallback(() => {
    setIsSettingsModalOpen(!isSettingsModalOpen);
  }, [isSettingsModalOpen, setIsSettingsModalOpen]);

  const closeSettingsModal = useCallback(() => {
    navigate(-1);
  }, []);

  const onShareClick = useCallback(async () => {
    const horoscopeUrl = await getShortLink(buildHoroscopeUrl(address, userInfo));

    Clipboard.write({
      string: horoscopeUrl
    }).then(() => {
      snackbarAlert('Ссылка скопирована в буфер обмена');
    }).catch(() => {
      snackbarAlert('Ошибка создании ссылки');
    });
  }, [address, snackbarAlert, userInfo]);

  const toggleEditModal = useCallback(() => {
    if (isEditModalOpen) {
      navigate(-1);
    } else {
      setIsEditModalOpen(true);
    }
  }, [isEditModalOpen, setIsEditModalOpen]);

  return (
    <Grid container direction={'row'} justifyContent={'start'} width={'100%'}>
      {!isExternalHoroscope && <Grid item>
        <div className={styles.button} onClick={onHomeClick}>
          <img alt='home' src={home}/>
        </div>
      </Grid>}
      <Grid item ml={1}>
        <div className={styles.button} onClick={toggleSettingsModal}>
          <img alt='plus' src={settings}/>
        </div>
        <SettingsModal isOpen={isSettingsModalOpen} close={closeSettingsModal} />
      </Grid>
      {!isExternalHoroscope && <Grid item ml={1}>
        <div className={styles.button} onClick={toggleEditModal}>
          <img alt='pen' src={pen}/>
        </div>
        <EditHoroscopeModal isEditModalOpen={isEditModalOpen} toggleEditModal={toggleEditModal} />
      </Grid>}
      <Grid item ml={!isExternalHoroscope && isPaymentsEnabled ? 1 : 'auto'}>
        {!!horoscopeId && <div className={styles.button}>
          <img alt='folder' src={folder} onClick={onSaveHoroscope} />
        </div>}
      </Grid>
      <Grid item pl={1}>
        <div className={styles.button}> 
          <img alt='share' src={share} onClick={onShareClick} />
        </div> 
      </Grid> 
      {/* <Grid item> */}
      {/*  <div className={styles.button}> */}
      {/*    <img alt='chat' src={send}/> */}
      {/*  </div> */}
      {/* </Grid> */}
    </Grid>
  );
};

export default Buttons;
