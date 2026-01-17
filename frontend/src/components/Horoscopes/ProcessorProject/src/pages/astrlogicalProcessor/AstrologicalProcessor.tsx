import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { useLocation, useNavigate, useOutletContext } from '../../contexts/NavigationContext';
import Moon from '../../components/moon/Moon';
import Header from './components/header/Header';
import HoroscopeForm from '../../components/horoscopeForm/HoroscopeForm';
import { HoroscopeAddress } from '../../models/types/HoroscopeAddress';
import { CountHoroscopeProps } from '../../models/types/CountHoroscopeProps';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { setAppAccess, setIsAppLoading } from '../../store/reducers/preferencesReducer';
import {
  setAddressInformation as setGlobalStateAddress,
  setCurrentHoroscopeId,
  setHoroscopeUserInfo,
  setSavedHoroscopeId
} from '../../store/reducers/horoscopesReducer';
import DarkThemeBackground from '../../components/darkThemeBackground/DarkThemeBackground';
import { useLoadHoroscopes } from '../../hooks/useLoadHororscope';
import Button from '../../components/button/Button';
import { ButtonType } from '../../components/button/ButtonProps';
import { useGetAppAccess, useGetCurrentSavedHoroscope, useGetDefaultLocation, useGetEmail } from '../../store/selectors';
import moment from 'moment';
import lodash from 'lodash';
import { processorRoutes } from './processorRoutes';
import { ProcessorContext } from '../../models/interfaces/processorContext';
import VideoBanners from '../../components/videoBanners/VideoBanners';
import { VideoBannerType } from '../../helpers/videoBannerType';
import { getCoordinatesFromText } from '../../helpers/getCoordinatesFromText';
import { useSearchParamsState } from '../../hooks/useSearchParamsState';
import { useGetVideoBanners } from '../../hooks/useGetVideoBanners';
import WarnInfo from '../../components/warnInfo/WarnInfo';
import { logFirebaseEvent } from '../../helpers/firebase';
import { FirebaseEvent } from '../../helpers/firebase/firebaseEvent';
import authRequest from '../../api/authRequest';
import ProcessorRestrictionModal from '../../components/processorRestrictionModal/ProcessorRestrictionModal';
import { useIsPaymentsEnabled } from '../../hooks/useIsPaymentsEnabled';
import { currentUserTariffsApi } from '../../api/tariff';
// import ProcessorRestrictionModal from '../../components/processorRestrictionModal/ProcessorRestrictionModal';

const AstrologicalProcessor = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const loadHoroscopes = useLoadHoroscopes();
  const defaultLocation = useGetDefaultLocation();
  const isPaymentsEnabled = useIsPaymentsEnabled();
  const userEmail = useGetEmail();
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [addressInformation, setAddressInformation] = useState<HoroscopeAddress>({
    timeZone: {
      hours: '',
      minutes: '',
      greenwich: ''
    },
    coordinates: {
      longitude: '',
      latitude: ''
    },
    location: {
      value: '',
      key: ''
    }
  });
  const settings = useAppSelector((state) => state.horoscopeSettings);
  const currentSavedHoroscope = useGetCurrentSavedHoroscope();
  const appAccess = useGetAppAccess();
  const { route, isExternalHoroscope } = useOutletContext<ProcessorContext>();
  const location = useLocation();
  const [isRestrictionModalOpen, setIsRestrictionModalOpen] = useSearchParamsState('ispmo', false, false);

  const onHoroscopeCountClick = useCallback(async ({ address, userInfo }: CountHoroscopeProps) => {
    // Специальный пользователь имеет полный доступ без проверок
    if (userEmail === 'fedechka06@gmail.com') {
      // Пропускаем все проверки подписки для этого пользователя
    } else if (isPaymentsEnabled) {
      try {
        dispatch(setIsAppLoading(true));
        
        // Проверяем права пользователя и наличие активных тарифов
        const [rightsResponse, tariffsResponse] = await Promise.all([
          authRequest.get(`${import.meta.env.VITE_APP_API_URL}/users/current-user-rights/`),
          authRequest.get(currentUserTariffsApi())
        ]);

        const { data: rightsData } = rightsResponse;
        const { data: tariffs } = tariffsResponse;

        dispatch(setAppAccess({
          isAstroprocessorRestricted: rightsData.restriction_astroprocessor,
          isForumRestricted: rightsData.restriction_forum
        }));

        // Проверяем наличие активных тарифов
        const hasActiveTariff = tariffs && Array.isArray(tariffs) && tariffs.length > 0;
        const hasActiveTariffNow = hasActiveTariff && tariffs.some((tariff: any) => {
          if (!tariff.current_user_activates || tariff.current_user_activates.length === 0) {
            return false;
          }
          return tariff.current_user_activates.some((activated: string) => {
            const activatedDate = new Date(activated);
            const expiryDate = new Date(activatedDate.getTime() + tariff.validity_days * 24 * 60 * 60 * 1000);
            return expiryDate.getTime() > Date.now() && activatedDate.getTime() <= Date.now();
          });
        });

        // Если нет активных тарифов или есть ограничение, показываем модальное окно
        if (rightsData.restriction_astroprocessor || !hasActiveTariffNow) {
          setIsRestrictionModalOpen(true);
          return;
        }
      } finally {
        dispatch(setIsAppLoading(false));
      }
    } else if (appAccess.isAstroprocessorRestricted) {
      // Если подписки отключены, но есть ограничение в состоянии
      try {
        dispatch(setIsAppLoading(true));
        const { data } = await authRequest.get(`${import.meta.env.VITE_APP_API_URL}/users/current-user-rights/`);

        dispatch(setAppAccess({
          isAstroprocessorRestricted: data.restriction_astroprocessor,
          isForumRestricted: data.restriction_forum
        }));

        if (data.restriction_astroprocessor) {
          setIsRestrictionModalOpen(true);
          return;
        }
      } finally {
        dispatch(setIsAppLoading(false));
      }
    }

    dispatch(setIsAppLoading(true));
    dispatch(setGlobalStateAddress(address));
    dispatch(setHoroscopeUserInfo(userInfo));
    
    let isCaching = true;

    if (currentSavedHoroscope) {
      const currentHoroscopeUserInfo = {
        name: currentSavedHoroscope.name || '',
        date: moment(currentSavedHoroscope.horoscope.dt.replace('T', ' ').slice(0, 19), 'YYYY-MM-DD hh:mm:ss').format('DD.MM.YYYY'),
        time: moment(currentSavedHoroscope.horoscope.dt.replace('T', ' ').slice(0, 19), 'YYYY-MM-DD hh:mm:ss').format('HH:mm:ss')
      };

      const currentHoroscopeAddress : HoroscopeAddress = {
        timeZone: {
          hours: currentSavedHoroscope.horoscope.tzHour.replace('-', ''),
          minutes: currentSavedHoroscope.horoscope.tzMinutes,
          greenwich: currentSavedHoroscope.horoscope.tzHour.includes('-') ? '-' : '+'
        },
        location: {
          key: '',
          value: currentSavedHoroscope.city as string
        },
        coordinates: {
          longitude: currentSavedHoroscope.horoscope.longitude,
          latitude: currentSavedHoroscope.horoscope.latitude
        }
      };

      if (
        lodash.isEqual(currentHoroscopeAddress.timeZone, address?.timeZone) &&
        lodash.isEqual(currentHoroscopeAddress.coordinates, address?.coordinates) &&
        lodash.isEqual(userInfo, currentHoroscopeUserInfo)
      ) {
        isCaching = false;
      }
    }

    loadHoroscopes({ address, userInfo, settings, isCaching })
      .then(() => {
        navigate(route + processorRoutes.horoscopes, {
          replace: isExternalHoroscope
        });
        dispatch(setIsAppLoading(false));
        
        if (isCaching) {
          logFirebaseEvent({
            name: FirebaseEvent.createHoroscope
          });
        }

        if (!isCaching && currentSavedHoroscope) {
          dispatch(setSavedHoroscopeId(currentSavedHoroscope.horoscope.id as number));
          dispatch(setCurrentHoroscopeId(currentSavedHoroscope.id as number));
        }
      });
  }, [appAccess.isAstroprocessorRestricted, dispatch, currentSavedHoroscope, loadHoroscopes, settings, navigate, route, isExternalHoroscope, isPaymentsEnabled, setIsRestrictionModalOpen, userEmail]);

  const onMyHoroscopesClick = () => {
    // Специальный пользователь имеет полный доступ
    if (userEmail === 'fedechka06@gmail.com') {
      navigate(route + processorRoutes.myHoroscopes);
      return;
    }
    
    if (appAccess.isAstroprocessorRestricted && isPaymentsEnabled) {
      dispatch(setIsAppLoading(true));
      authRequest.get(`${import.meta.env.VITE_APP_API_URL}/users/current-user-rights/`)
        .then(({ data }) => {
          dispatch(setAppAccess({
            isAstroprocessorRestricted: data.restriction_astroprocessor,
            isForumRestricted: data.restriction_forum
          }));

          if (data.restriction_astroprocessor) {
            setIsRestrictionModalOpen(true);
            return;
          }

          navigate(route + processorRoutes.myHoroscopes, {
            replace: true
          });
        })
        .finally(() => {
          dispatch(setIsAppLoading(false));
        });
      return;
    }
    
    navigate(route + processorRoutes.myHoroscopes);
  };
  
  useEffect(() => {
    if (!location.state?.address) {
      setAddressInformation((address) => ({
        ...address,
        location: defaultLocation,
        coordinates: getCoordinatesFromText(defaultLocation.value)
      }));
    }
  }, []);

  useEffect(() => {
    if (!location?.state?.address || !location?.state?.userInfo) {
      return;
    }

    const { address, userInfo } = location.state;

    if (address) {
      setAddressInformation(address);
    } else if (defaultLocation) {
      setAddressInformation((address) => ({
        ...address,
        location: defaultLocation,
        coordinates: getCoordinatesFromText(defaultLocation.value)
      }));
    }
    
    if (userInfo) {
      setName(userInfo?.name);
      setTime(userInfo?.time);
      setDate(userInfo?.date);
    }

    navigate(location.pathname + location.search, {
      state: { isChange: true },
      replace: true
    });
  }, [location.state]);

  const { banners } = useGetVideoBanners(VideoBannerType.processor);

  return (
    <DarkThemeBackground fillBody>
      <Grid>
        <Moon />
        <Grid ml={2} mr={2}>
          <WarnInfo mode={'dark'} />
        </Grid>
        <Grid container direction={'column'} pl={2} pr={2}>
          <Grid item pb={2}>
            <Header />
          </Grid>
          <Grid>
            <HoroscopeForm
              name={name}
              setName={setName}
              date={date}
              setDate={setDate}
              time={time}
              setTime={setTime}
              addressInformation={addressInformation}
              setAddressInformation={setAddressInformation}
              onCountHoroscopeClick={onHoroscopeCountClick}
              isFormDisabled={isExternalHoroscope}
            />
          </Grid>
          {!isExternalHoroscope && <Grid item width={'100%'}>
            <Button text={'Мои гороскопы'} type={ButtonType.outline} onClick={onMyHoroscopesClick}/>
          </Grid>}
        </Grid>
        <Grid height={'max-content'} mt={3} ml={2} mr={2}>
          <VideoBanners color={'white'} banners={banners} />
        </Grid>
        {/* <Grid container pt={4} px={4} rowSpacing={2}> */}
          {/* <Grid item width={'100%'}> */}
          {/*  <Typography color={'white'} fontWeight={'bold'} fontFamily={'Playfair Display'} fontSize={24} textAlign={'center'}> */}
          {/*    Мастер класс месяца */}
          {/*  </Typography> */}
          {/* </Grid> */}
          {/* <Grid item> */}
          {/*  <MasterClass /> */}
          {/* </Grid> */}
          {/* <Grid item width={'100%'}> */}
          {/*  <Typography color={'white'} fontWeight={'bold'} fontFamily={'Playfair Display'} fontSize={24} textAlign={'center'}> */}
          {/*    Как это работает */}
          {/*  </Typography> */}
          {/* </Grid> */}
          {/* <Grid item width={'100%'}> */}
          {/*  <Video /> */}
          {/* </Grid> */}
        {/* </Grid> */}
        <ProcessorRestrictionModal isOpen={isRestrictionModalOpen} close={() => navigate(-1)} /> 
      </Grid>
    </DarkThemeBackground>
  );
};

export default AstrologicalProcessor;
