import React, { useCallback, useEffect, useState } from 'react';
import styles from '../myHororscope/MyHoroscope.module.scss';
import { CardActionArea, Typography } from '@mui/material';
import { useGetDefaultLocation } from '../../store/selectors';
import moment from 'moment';
import { getTimeZoneOffset } from '../../api/getTimeZoneOffset';
import { HoroscopeAddress } from '../../models/types/HoroscopeAddress';
import { useAppDispatch } from '../../store/store';
import { setDefaultLocation } from '../../store/reducers/settingsReducer';
import { useNavigate } from 'react-router-dom';
import MyHoroscopeLoader from '../myHoroscopeLoader/MyHoroscopeLoader';
import { routes } from '../../models/enums/routes';
// import Modal from '../modal/Modal';
// import Button from '../button/Button';

const SavedHoroscopeHereAndNow = () => {
  const defaultLocation = useGetDefaultLocation();
  const [address, setAddress] = useState<HoroscopeAddress>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // const [isModalOpen, setIsModalOpen] = useState(false);
  //
  // const toggleModal = useCallback(() => {
  //   setIsModalOpen((isOpen) => !isOpen);
  // }, []);

  const onHoroscopeClick = useCallback(() => {
    if (!address) {
      return;
    }

    const date = moment().format('DD.MM.YYYY');
    const time = moment().format('HH:mm:ss');

    navigate(routes.astrologicalProcessor, {
      state: {
        userInfo: {
          name: 'Гороскоп на здесь и сейчас',
          date,
          time
        },
        address
      }
    });
  }, [address, navigate]);
  
  useEffect(() => {
    const date = moment().format('DD.MM.YYYY');
    const time = moment().format('HH:mm:ss');

    if (!defaultLocation) {
      dispatch(setDefaultLocation({
        key: '2591,JMC,37e37,55n45',
        value: 'Москва, Московская обл., Россия, 37e37, 55n45'
      }));
      return;
    }

    getTimeZoneOffset(defaultLocation.key, date, time)
      .then(({ hours, minutes, greenwich, longitude, latitude }) => {
        setAddress({
          location: defaultLocation,
          coordinates: { longitude, latitude },
          timeZone: { hours, minutes, greenwich }
        });
      });
  }, [defaultLocation, dispatch]);

  if (!address) {
    return (
      <MyHoroscopeLoader />
    );
  }
  
  return (
    <>
      <CardActionArea onClick={onHoroscopeClick}>
        <section
          className={styles.main}
        >
          <Typography pl={2} color={'#292E30'} fontSize={'14px'} fontWeight={500} fontFamily={'Gilroy'}>
          Гороскоп на здесь и сейчас
          </Typography>
          <Typography pl={2} color={'#292E30'} fontSize={'10px'} fontWeight={400} fontFamily={'Gilroy'}>
            {defaultLocation?.value}
          </Typography>
        </section>
      </CardActionArea>
      {/* <Modal isOpen={isModalOpen} close={toggleModal} height={'216px'}> */}
      {/*  <Grid display={'flex'} flexDirection={'column'} m={2}> */}
      {/*    <Grid mb={2}> */}
      {/*      <Button text={'Рассчитать гороскоп'} onClick={onHoroscopeClick} /> */}
      {/*    </Grid> */}
      {/*  </Grid> */}
      {/* </Modal> */}
    </>
  );
};

export default SavedHoroscopeHereAndNow;
