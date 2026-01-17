import React, { useCallback, useMemo, useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Alert, Grid, Typography, AlertTitle } from '@mui/material';
import Input from '../input/Input';
import { InputType } from '../input/InputType';
import AddressInput from '../addressInput/AddressInput';
import Button from '../button/Button';
import { useLoadHoroscopes } from '../../hooks/useLoadHororscope';
import TimeZoneForm from '../timeZoneForm/TimeZoneForm';
import { getTimeZoneOffset } from '../../api/getTimeZoneOffset';
import { AddressLocation, HoroscopeAddress } from '../../models/types/HoroscopeAddress';
import { getTimeZoneOffsetFromGreenwichData } from '../../helpers/getTimeZoneOffsetFromGreenwichData';
import { useNavigate, useOutletContext } from '../../contexts/NavigationContext';
import { CountHoroscopeProps } from '../../models/types/CountHoroscopeProps';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ModalMaps from '../modalMaps/ModalMaps';
// @ts-ignore
import { validationLatitudeLongitude } from 'validation-latitude-longitude';
import { processorRoutes } from '../../pages/astrlogicalProcessor/processorRoutes';
import { ProcessorContext } from '../../models/interfaces/processorContext';
import moment from 'moment';
import { getCoordinatesFromText } from '../../helpers/getCoordinatesFromText';
import QuestionButton from '../QuestionButton';
import { useSearchParamsState } from '../../hooks/useSearchParamsState';
import { getLocations } from '../../api/getLocations';

interface HoroscopeFormProps {
  name: string,
  isFormDisabled: boolean,
  setName: (name: string) => any,
  date: string,
  setDate: (date: string) => any,
  time: string,
  setTime: (time: string) => any,
  addressInformation: HoroscopeAddress,
  setAddressInformation: (addressInformation: HoroscopeAddress) => any,
  onCountHoroscopeClick?: (horoscopeProps: CountHoroscopeProps) => any,
  isCountHoroscopeButtonDisabled?: boolean,
  horoscopeCountButtonText?: string
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
});

const HoroscopeForm = ({ name, setName, date, setDate, time, setTime, addressInformation, setAddressInformation, onCountHoroscopeClick, isCountHoroscopeButtonDisabled, horoscopeCountButtonText, isFormDisabled } : HoroscopeFormProps) => {
  const [isCustomCoordinates, setIsCustomCoordinates] = useState(false);
  const [isFormError, setIsFormError] = useState(false);
  const [isLocationCounted, setIsLocationCounted] = useState(false);
  const addressInformationRef = useRef<HoroscopeAddress>();
  const navigate = useNavigate();
  const { route } = useOutletContext<ProcessorContext>();
  const isFirstUpdate = useRef(true);

  useLayoutEffect(() => {
    if (addressInformation?.isCustomCoordinates && isFirstUpdate.current) {
      setIsCustomCoordinates(true);
      isFirstUpdate.current = false;
    }
  }, [addressInformation?.isCustomCoordinates]);

  const setLatitude = useCallback((latitude: string) => {
    setAddressInformation({
      ...addressInformation,
      coordinates: { ...addressInformation.coordinates, latitude }
    });
  }, [addressInformation, setAddressInformation]);

  const setLongitude = useCallback((longitude: string) => {
    setAddressInformation({
      ...addressInformation,
      coordinates: { ...addressInformation.coordinates, longitude }
    });
  }, [addressInformation, setAddressInformation]);
  
  useEffect(() => {
    if (!addressInformation.location.value || addressInformation.location.key || addressInformation.isCustomCoordinates) {
      return;
    }

    getLocations(addressInformation.location.value)
      .then((locations) => {
        const targetLocation = locations.find(({ value }) => {
          return addressInformation.location.value === value;
        }) || locations[0];
        
        setAddressInformation({
          ...addressInformation,
          location: targetLocation
        });
      });
  }, [addressInformation.location.value]);

  const isTimeValid = useMemo(() => {
    return moment(time, 'HH:mm:ss', true).isValid();
  }, [time]);

  const isDateValid = useMemo(() => {
    return moment(date, 'DD.MM.YYYY', true).isValid();
  }, [date]);

  const toggleCustomCoordinates = useCallback(() => {
    if (isCustomCoordinates && addressInformationRef.current) {
      setAddressInformation({ ...addressInformationRef.current, isCustomCoordinates: false });
    } else {
      setAddressInformation({
        ...addressInformation,
        location: {
          key: '',
          value: ''
        },
        isCustomCoordinates: true
      });
      addressInformationRef.current = addressInformation;
    }

    setIsCustomCoordinates(!isCustomCoordinates);
  }, [isCustomCoordinates, setAddressInformation, addressInformation]);

  useLayoutEffect(() => {
    setAddressInformation({
      ...addressInformation,
      isCustomCoordinates: isCustomCoordinates
    });
  }, [isCustomCoordinates]);

  const loadHoroscopes = useLoadHoroscopes();

  const onCountHoroscopesClick = useCallback(() => {
    if (!(addressInformation.timeZone?.greenwich && addressInformation.timeZone?.hours && addressInformation.timeZone?.minutes)) {
      return;
    }

    if (onCountHoroscopeClick) {
      onCountHoroscopeClick({
        address: addressInformation,
        userInfo: {
          name,
          date,
          time
        }
      });

      return;
    }

    loadHoroscopes({
      userInfo: {
        name,
        date,
        time
      },
      address: addressInformation
    }).then(() => {
      navigate(route + processorRoutes.horoscopes);
    });
  }, [addressInformation, onCountHoroscopeClick, loadHoroscopes, name, date, time, navigate, route]);

  const isButtonDisabled = useMemo(() => {
    return !addressInformation.coordinates.latitude || !addressInformation.coordinates.latitude || !(addressInformation.timeZone?.greenwich && addressInformation.timeZone?.hours && addressInformation.timeZone?.minutes) ||
      !isDateValid || !name || !isTimeValid || isCountHoroscopeButtonDisabled || !isLocationCounted && !(isCustomCoordinates || isFormDisabled);
  }, [addressInformation, isDateValid, name, isTimeValid, isCountHoroscopeButtonDisabled, isLocationCounted, isCustomCoordinates]);

  const setAddressLocation = useCallback((location: AddressLocation) => {
    const { longitude, latitude } = getCoordinatesFromText(location.value);
    setAddressInformation({
      ...addressInformation,
      location,
      coordinates: { longitude, latitude }
    });
  }, [addressInformation, setAddressInformation]);

  useEffect(() => {
    if (isDateValid && isTimeValid && addressInformation.location.key && !addressInformation.isCustomCoordinates && !isFormDisabled) {
      setIsLocationCounted(false);

      getTimeZoneOffset(addressInformation.location.key, date, time)
        .then(({ hours, minutes, greenwich, longitude, latitude }) => {
          setAddressInformation({
            ...addressInformation,
            coordinates: { longitude, latitude },
            timeZone: { hours, minutes, greenwich }
          });
          setIsLocationCounted(true);
        })
        .catch((err) => {
          if (err.message === 'empty response') {
            alert('К сожалению, автоматический расчет часового пояса для этого года и места недоступен. Воспользуйтесь вводом вручную в поле ниже.');
            setIsCustomCoordinates(true);
          }
        });
    }
  }, [isDateValid, isTimeValid, addressInformation.location.key]);

  const formattedTimeZone = useMemo(() => {
    const { greenwich, hours, minutes } = addressInformation.timeZone;

    if (!(greenwich && hours && minutes)) {
      return;
    }

    return getTimeZoneOffsetFromGreenwichData(greenwich, hours, minutes);
  }, [addressInformation.timeZone]);

  const setGreenwich = useCallback((greenwich: string) => {
    setAddressInformation({
      ...addressInformation,
      timeZone: { ...addressInformation.timeZone, greenwich }
    });
  }, [addressInformation, setAddressInformation]);

  const setHours = useCallback((hours: string) => {
    setAddressInformation({
      ...addressInformation,
      timeZone: { ...addressInformation.timeZone, hours }
    });
  }, [addressInformation, setAddressInformation]);

  const setMinutes = useCallback((minutes: string) => {
    setAddressInformation({
      ...addressInformation,
      timeZone: { ...addressInformation.timeZone, minutes }
    });
  }, [addressInformation, setAddressInformation]);

  const [isMapOpen, setIsMapOpen] = useSearchParamsState('isMapOpen', false, false);

  const setCoordinates = useCallback((coordinates: number []) => {
    setAddressInformation({
      ...addressInformation,
      location: {
        key: '',
        value: ''
      },
      coordinates: { longitude: coordinates[1].toFixed(2), latitude: coordinates[0].toFixed(2) }
    });
  }, [addressInformation, setAddressInformation]);

  const openMap = useCallback(() => {
    setIsMapOpen(true);
  }, []);
  
  const closeMap = useCallback(() => {
    navigate(-1);
  }, []);

  const { latitudeTextError, isLatitudeError } = useMemo(() => {
    if (addressInformation.coordinates.latitude === undefined || addressInformation.coordinates.latitude === '') {
      return {
        latitudeTextError: 'Пусто *',
        isLatitudeError: true
      };
    } else if (
      !validationLatitudeLongitude.latitude(Number(addressInformation.coordinates.latitude)) ||
      !String(addressInformation.coordinates.latitude).includes('.') ||
      String(addressInformation.coordinates.latitude).endsWith('.')
    ) {
      return {
        latitudeTextError: 'Ошибка валидации *',
        isLatitudeError: true
      };
    } else {
      return {
        latitudeTextError: null,
        isLatitudeError: false
      };
    }
  }, [addressInformation.coordinates]);

  const { longitudeTextError, isLongitudeError } = useMemo(() => {
    if (addressInformation.coordinates.longitude === undefined || addressInformation.coordinates.longitude === '') {
      return {
        isLongitudeError: true,
        longitudeTextError: 'Пусто *'
      };
    } else if (
      !validationLatitudeLongitude.longitude(Number(addressInformation.coordinates.longitude)) ||
      !String(addressInformation.coordinates.longitude).includes('.') ||
      String(addressInformation.coordinates.longitude).endsWith('.')
    ) {
      return {
        isLongitudeError: true,
        longitudeTextError: 'Ошибка валидации *'
      };
    } else {
      return {
        isLongitudeError: false,
        longitudeTextError: null
      };
    }
  }, [addressInformation.coordinates]);

  return (
    <Grid height={'100%'} position={'relative'}>
      <Grid item xs={12} md={12} pb={2}>
        <Input
          isError={Boolean(isFormError && !name)}
          placeholder='ФИО'
          value={name}
          disabled={isFormDisabled}
          onChange={setName}
        />
      </Grid>
      <Grid item container direction={'row'} spacing={2} pb={2}>
        <Grid item xs={6} md={6}>
          <Input
            isError={Boolean(isFormError && !isDateValid || !isDateValid && date.length === 10)}
            placeholder='ДД.ММ.ГГГГ'
            textError={!isDateValid && date.length === 10 ? 'Ошибка *' : '*'}
            inputType={InputType.date}
            value={date}
            disabled={isFormDisabled}
            onChange={setDate}
          />
        </Grid>
        <Grid item xs={6} md={6}>
          <Input
            isError={Boolean(isFormError && !isDateValid || !isTimeValid && time.length === 8)}
            textError={!isTimeValid && time.length === 8 ? 'Ошибка *' : '*'}
            placeholder='00:00:00'
            inputType={InputType.time}
            disabled={isFormDisabled}
            value={time}
            onChange={setTime}
          />
        </Grid>
      </Grid>
      <Grid item xs={12} md={12}>
        <AddressInput
          isError={Boolean(isFormError && !addressInformation.location?.value && !(isCustomCoordinates || isFormDisabled))}
          setAddressLocation={setAddressLocation}
          placeholder={'Место рождения'}
          disabled={isCustomCoordinates || isFormDisabled}
          addressLocation={!addressInformation.location.value && (isCustomCoordinates || isFormDisabled) ? { value: 'Место выбрано на карте', key: '' } : addressInformation.location}
        />
      </Grid>
      <Grid item container direction={'row'} color={'#ABB0B2'} display={'flex'} pt={2}>
        <Grid item flex={1}>
          <Typography color={'#ABB0B2'} fontFamily={'Gilroy'} fontSize={'12px'} textAlign={'left'}>
            Широта: {addressInformation.coordinates?.latitude || '--'}
          </Typography>
        </Grid>
        <Grid item flex={1}>
          <Typography color={'#ABB0B2'} fontFamily={'Gilroy'} fontSize={'12px'} textAlign={'center'}>
            Долгота: {addressInformation.coordinates?.longitude || '--'}
          </Typography>
        </Grid>
        <Grid item flex={1}>
          <Typography color={'#ABB0B2'} fontFamily={'Gilroy'} fontSize={'12px'} textAlign={'right'}>
            Час. пояс: {formattedTimeZone || '--'}
          </Typography>
        </Grid>
      </Grid>
      <Collapse in={isLocationCounted && !isCustomCoordinates} timeout="auto" unmountOnExit>
        <Typography mt={1} color={'#99daea'} fontSize={'13px'} fontFamily={'Gilroy'}>
          {'Часовой пояс успешно определен. Вы можете его поменять на своё усмотрение в поле "Ввести координаты вручную".'}
        </Typography>
      </Collapse>
      {!isFormDisabled && <ListItemButton sx={{ padding: '8px 4px', marginTop: '10px' }} onClick={toggleCustomCoordinates}>
        <ListItemText primary={<Typography fontFamily={'Gilroy'} color={'white'} fontSize={'16px'} fontWeight={500}>
            Ввести координаты вручную
        </Typography>} />
        {isCustomCoordinates ? <ExpandLess fill={'white'} style={{ color: '#fff' }} /> : <ExpandMore style={{ color: '#fff' }} />}
      </ListItemButton>}
      <Collapse in={isCustomCoordinates && !isFormDisabled} timeout="auto" unmountOnExit>
        <Grid item container display={'flex'} pt={2} pb={2}>
          <TimeZoneForm
            isGreenwichError={Boolean(!addressInformation.timeZone?.greenwich && isFormError)}
            isMinutesError={Boolean(!addressInformation.timeZone?.minutes && isFormError)}
            isHoursError={Boolean(!addressInformation.timeZone?.hours && isFormError)}
            greenwich={addressInformation.timeZone?.greenwich}
            setGreenwich={setGreenwich}
            minutes={addressInformation.timeZone?.minutes}
            setMinutes={setMinutes}
            hours={addressInformation.timeZone?.hours}
            setHours={setHours}
          />
        </Grid>
        <Grid item container display={'flex'} flexDirection={'column'} pb={1}>
          <Grid display={'flex'} alignItems={'center'} mr={'13px'}>
            <Grid mr={'14px'}>
              <QuestionButton
                isDark
                title="Широта изменяется от -90 до +90. Ноль — экватор, минусовые значения — южное полушарие, плюсовые — северное."
              />
            </Grid>
            <Grid fontFamily={'Gilroy'} color={'#C4C4C4'} fontWeight={'700'} fontSize={'16px'} lineHeight={'16px'}>
              Широта
            </Grid>
          </Grid>
          <Grid item mt={2}>
            <Input
              isError={isLatitudeError}
              textError={latitudeTextError || '*'}
              placeholder='Широта (+/- 00.00)'
              inputType={InputType.coordinates}
              value={addressInformation.coordinates.latitude}
              onChange={setLatitude}
            />
          </Grid>
          <Grid display={'flex'} alignItems={'center'} mr={'13px'} mt={2}>
            <Grid mr={'14px'}>
              <QuestionButton
                isDark
                title="Долгота изменяется от -180 до +180; Ноль — Основной меридиан, проходящий через Гринвич, минусовые значения — западное полушарие, плюсовые — восточное."
              />
            </Grid>
            <Grid fontFamily={'Gilroy'} color={'#C4C4C4'} fontWeight={'700'} fontSize={'16px'} lineHeight={'16px'}>
              Долгота
            </Grid>
          </Grid>
          <Grid item mt={2}>
            <Input
              isError={isLongitudeError}
              textError={longitudeTextError || '*'}
              placeholder='Долгота (+/- 00.00 или +/- 000.00)'
              inputType={InputType.coordinatesLongitude}
              value={addressInformation.coordinates.longitude}
              onChange={setLongitude}
            />
          </Grid>
        </Grid>
        <Typography mt={2} mb={2} color={'#99daea'} fontSize={'15px'} fontFamily={'Gilroy'}>
          {'Вводите значения широты и долготы без указания секунд'}
        </Typography>
        <ListItemButton sx={{ padding: '8px 4px' }}>
          <LocationOnIcon style={{ color: '#fff', paddingRight: '8px' }} />
          <ListItemText onClick={openMap} primary={<Typography fontFamily={'Gilroy'} color={'white'} fontSize={'16px'} fontWeight={500}>
              Выбрать на карте
          </Typography>} />
        </ListItemButton>
      </Collapse>
      {isFormDisabled && <Typography mt={2} color={'#99daea'} fontSize={'15px'} fontFamily={'Gilroy'}>
        {'Вы строите гороскоп по заданным параметрам от автора темы. Редактирование полей ввода отключено. Вы можете сохранить этот гороскоп к себе в сохраненные гороскопы и производить редактирование. Сохранение гороскопа происходит на исходные параметры введённые автором.'}
      </Typography>}
      <Grid item width={'100%'} onClick={() => setIsFormError(true)} mt={2}>
        <Button text={horoscopeCountButtonText || 'Рассчитать гороскоп'} onClick={onCountHoroscopesClick} isDisabled={isButtonDisabled}/>
      </Grid>
      <ThemeProvider theme={darkTheme}>
        <Grid pt={2} pb={2}>
          <Alert severity="warning" variant="outlined">
            Для мест на территории СНГ начните набирать название кириллицей или латиницей, для остальных городов мира — только латиницей.
          </Alert>
        </Grid>
      </ThemeProvider>
    </Grid>
  );
};

export default HoroscopeForm;
