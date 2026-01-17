import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import Input from '../../../components/input/Input';
import { ButtonType } from '../../../components/button/ButtonProps';
import Button from '../../../components/button/Button';
import { InputType } from '../../../components/input/InputType';
import {
  useGetHoroscopeAddressInformation,
  useGetHoroscopeUserInfo, useGetRectification
} from '../../../store/selectors';
import ButtonPrevForward from './components/buttonPrevForward/ButtonPrevForward';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import {
  resetRectification, setAshtakavarga,
  setRectificationAddressInformation,
  setRectificationDashiChr,
  setRectificationDashiVim,
  setRectificationDegreeTable,
  setRectificationMaps,
  setRectificationUserInfo
} from '../../../store/reducers/rectificationReducer';
import DegreeTable from '../../../components/degreeTable/DegreeTable';
import { DegreeTableParts } from '../../../models/types/DegreeTable';
import RectificationDashiTable from './components/rectificationDashiTable/RectificationDashiTable';
import { setIsAppLoading } from '../../../store/reducers/preferencesReducer';
import { countHoroscope } from '../../../api/countHoroscope';
import {
  setAddressInformation, setDashiChr, setDashiVim,
  setDegreeTable,
  setHoroscopeUserInfo,
  setMaps
} from '../../../store/reducers/horoscopesReducer';
import { useSnackbarAlert } from '../../../hooks/useSnackbarAlert';
import { useOutletContext } from '../../../contexts/NavigationContext';
import { ProcessorContext } from '../../../models/interfaces/processorContext';
import { setIsYearPickerActive } from '../../../store/reducers/varshpahalaReducer';
import moment from 'moment/moment';

enum TimeOptionValue {
  ONE_MINUTE,
  FIVE_MINUTES,
  THIRTY_SEC,
  TEN_SEC,
  ONE_SEC
}

type ITimeOptionValue = TimeOptionValue.ONE_MINUTE | TimeOptionValue.FIVE_MINUTES | TimeOptionValue.THIRTY_SEC | TimeOptionValue.TEN_SEC | TimeOptionValue.ONE_SEC;

const timeOptions = [
  {
    label: '5 мин.',
    value: TimeOptionValue.FIVE_MINUTES
  },
  {
    label: '1 мин.',
    value: TimeOptionValue.ONE_MINUTE
  },
  {
    label: '30 сек.',
    value: TimeOptionValue.THIRTY_SEC
  },
  {
    label: '10 сек.',
    value: TimeOptionValue.TEN_SEC
  },
  {
    label: '1 сек.',
    value: TimeOptionValue.ONE_SEC
  }
];

const getMsTime = (value: ITimeOptionValue) => {
  if (value === TimeOptionValue.FIVE_MINUTES) {
    return 5 * 60 * 1000;
  } else if (value === TimeOptionValue.ONE_MINUTE) {
    return 60 * 1000;
  } else if (value === TimeOptionValue.THIRTY_SEC) {
    return 30 * 1000;
  } else if (value === TimeOptionValue.TEN_SEC) {
    return 10 * 1000;
  } else {
    return 1000;
  }
};

const Rectification = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [targetTimeOption, setTargetTimeOption] = useState(timeOptions[0]);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const address = useGetHoroscopeAddressInformation();
  const dispatch = useAppDispatch();
  const horoscopeUserInfo = useGetHoroscopeUserInfo();
  const name = useMemo(() => {
    return horoscopeUserInfo.name;
  }, [horoscopeUserInfo]);
  const timeZone = useMemo(() => {
    return {
      hours: address.timeZone.hours,
      minutes: address.timeZone.minutes,
      greenwich: address.timeZone.greenwich
    };
  }, [address]);
  const rectification = useGetRectification();
  const horoscopes = useAppSelector((state) => state?.horoscopes);
  const snackbarAlert = useSnackbarAlert();
  const { isExternalHoroscope } = useOutletContext<ProcessorContext>();

  const isButtonDisabled = useMemo(() => {
    return !(timeZone?.greenwich && timeZone?.hours && timeZone?.minutes) || !date || !name || !time;
  }, [date, name, time, timeZone]);

  const settings = useAppSelector((state) => state?.horoscopeSettings);

  const updateHoroscope = useCallback(() => {
    dispatch(setAddressInformation(rectification.addressInformation));
    dispatch(setHoroscopeUserInfo(rectification.horoscopeUserInfo));
    dispatch(setMaps(rectification.maps));
    dispatch(setDegreeTable(rectification.degreeTable));
    if (rectification.dashiChr) {
      dispatch(setDashiChr(rectification.dashiChr));
    } else {
      dispatch(setDashiChr(undefined));
    }
    if (rectification.dashiVim) {
      dispatch(setDashiVim(rectification.dashiVim));
    } else {
      dispatch(setDashiVim(undefined));
    }
    setIsUpdateAvailable(false);
    dispatch(setIsYearPickerActive(true));
    snackbarAlert('Время рождения обновлено');
  }, [dispatch, rectification.addressInformation, rectification.dashiChr, rectification.dashiVim, rectification.degreeTable, rectification.horoscopeUserInfo, rectification.maps, snackbarAlert]);

  const isTimeValid = useMemo(() => {
    return moment(time, 'HH:mm:ss', true).isValid();
  }, [time]);

  const isDateValid = useMemo(() => {
    return moment(date, 'DD.MM.YYYY', true).isValid();
  }, [date]);

  const onCountHoroscopesClick = useCallback(() => {
    if (!isTimeValid || !isDateValid) {
      return;
    }

    if (!(timeZone?.greenwich && timeZone?.hours && timeZone?.minutes)) {
      return;
    }

    dispatch(setIsAppLoading(true));

    countHoroscope({
      address,
      userInfo: {
        name: horoscopeUserInfo.name,
        date,
        time
      },
      settings
    })
      .then(({ maps, degreeTable, dashiVim, ashtakavarga }) => {
        setIsUpdateAvailable(true);
        dispatch(resetRectification());
        dispatch(setRectificationAddressInformation(address));
        dispatch(setRectificationUserInfo({
          name: horoscopeUserInfo.name,
          date,
          time
        }));
        dispatch(setRectificationDegreeTable(degreeTable));
        dispatch(setRectificationMaps(maps));
        dispatch(setRectificationDashiVim(dashiVim));
        dispatch(setAshtakavarga(ashtakavarga));
      })
      .finally(() => {
        dispatch(setIsAppLoading(false));
      });
  }, [timeZone?.greenwich, isTimeValid, isDateValid, timeZone?.hours, timeZone?.minutes, dispatch, address, horoscopeUserInfo.name, date, time, settings]);

  useEffect(() => {
    setDate(horoscopeUserInfo.date);
    setTime(horoscopeUserInfo.time);

    if (rectification.horoscopeUserInfo.name === '') {
      dispatch(setRectificationAddressInformation(address));
      dispatch(setRectificationUserInfo(horoscopeUserInfo));
      dispatch(setRectificationMaps(horoscopes.maps));
      dispatch(setRectificationDegreeTable(horoscopes.degreeTable));
      if (horoscopes.dashiChr) {
        dispatch(setRectificationDashiChr(horoscopes.dashiChr));
      }
      if (horoscopes.dashiVim) {
        dispatch(setRectificationDashiVim(horoscopes.dashiVim));
      }
    }

    return () => {
      dispatch(resetRectification());
    };
  }, []);

  const targetUserDate = useMemo(() => {
    const [day, month, year] = date.split('.').map(Number);
    const [hours, minutes, seconds] = time.split(':').map(Number);

    return new Date(year, month - 1, day, hours, minutes, seconds);
  }, [date, time]);

  const onChangeTimeButtonClick = useCallback((isForward: boolean) => {
    let date;

    if (isForward) {
      date = new Date(targetUserDate.getTime() + getMsTime(targetTimeOption.value as ITimeOptionValue));
    } else {
      date = new Date(targetUserDate.getTime() - getMsTime(targetTimeOption.value as ITimeOptionValue));
    }

    const seconds = String(date.getSeconds()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const year = String(date.getFullYear()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    setDate(`${day}.${month}.${year}`);
    setTime(`${hours}:${minutes}:${seconds}`);
  }, [targetTimeOption, targetUserDate]);

  const table = useMemo<DegreeTableParts>(() => {
    return rectification.degreeTable
      .find((degreeTableItem) => degreeTableItem.tableName === horoscopes.targetMapValue)?.table as DegreeTableParts;
  }, [rectification.degreeTable, horoscopes.targetMapValue]);

  return (
    <>
      <Grid container direction={'column'} p={2}>
        {isExternalHoroscope && <Typography mt={2} mb={2} color={'#99daea'} fontSize={'15px'} fontFamily={'Gilroy'}>
          {'Сохранение гороскопа происходит на исходные параметры введённые автором.'}
        </Typography>}
        <Grid item container direction={'row'} spacing={2} pb={2}>
          <Grid item xs={6} md={6}>
            <Input
              placeholder='Дата'
              inputType={InputType.date}
              value={date}
              onChange={setDate}
              isError={!(isDateValid || !date)}
              textError={'*'}
            />
          </Grid>
          <Grid item xs={6} md={6}>
            <Input
              placeholder='Время'
              inputType={InputType.time}
              value={time}
              onChange={setTime}
              isError={!(isTimeValid || !time)}
              textError={'*'}
            />
          </Grid>
        </Grid>
        <Grid item container flexDirection={'row'} display={'flex'} pb={2}>
          <Grid item width={'40px'}>
            <ButtonPrevForward onClick={() => onChangeTimeButtonClick(false)} type={'prev'}/>
          </Grid>
          <Grid item flex={1} ml={2} mr={2}>
            <Input placeholder='Шаг' options={timeOptions} setTargetOption={setTargetTimeOption} targetOption={targetTimeOption} inputType={InputType.options}/>
          </Grid>
          <Grid item width={'40px'}>
            <ButtonPrevForward onClick={() => onChangeTimeButtonClick(true)} type={'forward'}/>
          </Grid>
        </Grid>
        <Grid item pt={2}>
          <Button text={'Рассчитать'} isDisabled={isButtonDisabled} onClick={onCountHoroscopesClick} type={ButtonType.gradient}/>
        </Grid>
        {isUpdateAvailable && <Grid item pt={2}>
          <Button text={'Обновить время рождения'} type={ButtonType.outline} onClick={updateHoroscope} />
        </Grid>}
      </Grid>
      <DegreeTable table={table} />
      <RectificationDashiTable />
    </>
  );
};

export default Rectification;
