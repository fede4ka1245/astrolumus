import React, { useCallback, useMemo, useState } from 'react';
import styles from './MyHoroscope.module.scss';
import { Grid, Typography, Button as MuiButton, CardActionArea } from '@mui/material';
import { myHoroscopeProps } from './myHoroscopeProps';
import { useDeleteHoroscope } from '../../hooks/useDeleteHoroscope';
import { useCountSavedHoroscope } from '../../hooks/useCountSavedHoroscope';
import Modal from '../modal/Modal';
import Button from '../button/Button';
import { getShortLink } from '../../api/getShortLink';
import { buildHoroscopeUrlFromSavedHoroscope } from '../../helpers/horoscopeUrl';
import { Clipboard } from '@capacitor/clipboard';
import { useSnackbarAlert } from '../../hooks/useSnackbarAlert';
import { getSavedHoroscopeLocationLabel } from './helpers/';
import moment from 'moment';

const MyHoroscope = ({ horoscope, onHoroscopeSet }: myHoroscopeProps) => {
  const countSavedHoroscope = useCountSavedHoroscope();
  const onDelete = useDeleteHoroscope();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const snackbarAlert = useSnackbarAlert();

  const userInfo = useMemo(() => {
    if (!horoscope) {
      return;
    }
    
    return {
      name: horoscope.name || '',
      date: moment(horoscope.horoscope.dt.replace('T', ' ').slice(0, 19), 'YYYY-MM-DD hh:mm:ss').format('DD.MM.YYYY'),
      time: moment(horoscope.horoscope.dt.replace('T', ' ').slice(0, 19), 'YYYY-MM-DD hh:mm:ss').format('HH:mm:ss')
    };
  }, [horoscope]);

  const toggleModal = useCallback(() => {
    setIsModalOpen((isOpen) => !isOpen);
  }, []);

  const onHoroscopeClick = useCallback(() => {
    if (onHoroscopeSet) {
      onHoroscopeSet(horoscope);
      return;
    }

    toggleModal();
  }, [toggleModal, onHoroscopeSet, horoscope]);

  const onDeleteButtonClick = useCallback(() => {
    onDelete(horoscope.id as number);
    toggleModal();
  }, [horoscope, onDelete, toggleModal]);

  const onOpenHoroscope = useCallback(() => {
    countSavedHoroscope(horoscope);
    toggleModal();
  }, [horoscope, countSavedHoroscope, toggleModal]);
  
  const onShareClick = useCallback(async () => {
    try {
      const fullUrl = buildHoroscopeUrlFromSavedHoroscope(horoscope);
      let urlToShare = fullUrl;
      
      // Пытаемся получить короткую ссылку
      try {
        urlToShare = await getShortLink(fullUrl);
      } catch (error) {
        console.warn('Failed to create short link, using full URL:', error);
        // Используем полную ссылку, если короткая не создалась
      }

      await Clipboard.write({
        string: urlToShare
      });
      
      snackbarAlert('Ссылка скопирована в буфер обмена');
    } catch (error) {
      console.error('Error sharing horoscope:', error);
      snackbarAlert('Ошибка при создании ссылки');
    }
  }, [horoscope, snackbarAlert]);
  
  const horoscopeLocationLabel = useMemo(() => {
    return getSavedHoroscopeLocationLabel(horoscope);
  }, [horoscope]);

  return (
    <>
      <CardActionArea onClick={onHoroscopeClick}>
        <section
          className={styles.main}
        >
          <Typography pl={2} color={'#292E30'} fontSize={'14px'} fontWeight={500} fontFamily={'Gilroy'}>
            {userInfo?.name}, {userInfo?.date}, {userInfo?.time}, {horoscope?.horoscope?.tzHour}:{horoscope?.horoscope?.tzMinutes}
          </Typography>
          <Typography pl={2} color={'#292E30'} fontSize={'10px'} fontWeight={400} fontFamily={'Gilroy'}>
            {horoscopeLocationLabel}
          </Typography>
        </section>
      </CardActionArea>
      <Modal isOpen={isModalOpen} close={toggleModal} height={'300px'}>
        <Grid display={'flex'} flexDirection={'column'} height={'300px'} m={2}>
          <Grid mb={2}>
            <Button text={'Открыть гороскоп'} onClick={onOpenHoroscope} />
          </Grid>
          <Grid mb={2}>
            <MuiButton fullWidth onClick={onShareClick} variant="outlined" size="large">
              Поделиться гороскопом
            </MuiButton>
          </Grid>
          <Grid mb={2}>
            <MuiButton
              fullWidth
              onClick={onDeleteButtonClick}
              variant="outlined"
              color="error"
              size="large"
            >
              Удалить гороскоп
            </MuiButton>
          </Grid>
        </Grid>
      </Modal>
    </>
  );
};

export default MyHoroscope;
