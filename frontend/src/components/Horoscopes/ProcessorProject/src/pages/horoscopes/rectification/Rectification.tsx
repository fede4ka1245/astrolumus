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
import Header from '../../../components/header/Header';
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
import { OptionSelector } from '../../../components/optionSelector/OptionSelector';

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

const pad2 = (value: number) => String(value).padStart(2, '0');

const Rectification = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedSecond, setSelectedSecond] = useState(0);
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

  useEffect(() => {
    if (!date) {
      return;
    }

    const [day, month, year] = date.split('.').map(Number);
    if (!Number.isFinite(day) || !Number.isFinite(month) || !Number.isFinite(year)) {
      return;
    }

    setSelectedDay(day);
    setSelectedMonth(month);
    setSelectedYear(year);
  }, [date]);

  useEffect(() => {
    if (!time) {
      return;
    }

    const [hours, minutes, seconds] = time.split(':').map(Number);
    if (!Number.isFinite(hours) || !Number.isFinite(minutes) || !Number.isFinite(seconds)) {
      return;
    }

    setSelectedHour(hours);
    setSelectedMinute(minutes);
    setSelectedSecond(seconds);
  }, [time]);

  const dayCount = useMemo(() => {
    return new Date(selectedYear, selectedMonth, 0).getDate();
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    if (selectedDay > dayCount) {
      setSelectedDay(dayCount);
    }
  }, [dayCount, selectedDay]);

  useEffect(() => {
    if (!date) {
      return;
    }

    setDate(`${pad2(selectedDay)}.${pad2(selectedMonth)}.${String(selectedYear).padStart(4, '0')}`);
  }, [selectedDay, selectedMonth, selectedYear]);

  useEffect(() => {
    if (!time) {
      return;
    }

    setTime(`${pad2(selectedHour)}:${pad2(selectedMinute)}:${pad2(selectedSecond)}`);
  }, [selectedHour, selectedMinute, selectedSecond]);

  const dayOptions = useMemo(() => {
    return Array.from({ length: dayCount }, (_, index) => ({
      label: pad2(index + 1),
      value: index + 1
    }));
  }, [dayCount]);

  const monthOptions = useMemo(() => {
    return Array.from({ length: 12 }, (_, index) => ({
      label: pad2(index + 1),
      value: index + 1
    }));
  }, []);

  const yearOptions = useMemo(() => {
    const options = [];
    for (let year = 1000; year <= 3000; year += 1) {
      options.push({ label: String(year), value: year });
    }
    return options;
  }, []);

  const hourOptions = useMemo(() => {
    return Array.from({ length: 24 }, (_, index) => ({
      label: pad2(index),
      value: index
    }));
  }, []);

  const minuteOptions = useMemo(() => {
    return Array.from({ length: 60 }, (_, index) => ({
      label: pad2(index),
      value: index
    }));
  }, []);

  const secondOptions = useMemo(() => {
    return Array.from({ length: 60 }, (_, index) => ({
      label: pad2(index),
      value: index
    }));
  }, []);

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
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <OptionSelector
                  options={dayOptions}
                  value={selectedDay}
                  onChange={(option) => setSelectedDay(Number(option.value))}
                  placeholder="День"
                  type="normal"
                  itemHeight={25}
                  compact
                  centered
                />
              </Grid>
              <Grid item xs={4}>
                <OptionSelector
                  options={monthOptions}
                  value={selectedMonth}
                  onChange={(option) => setSelectedMonth(Number(option.value))}
                  placeholder="Месяц"
                  type="normal"
                  itemHeight={25}
                  compact
                  centered
                />
              </Grid>
              <Grid item xs={4}>
                <OptionSelector
                  options={yearOptions}
                  value={selectedYear}
                  onChange={(option) => setSelectedYear(Number(option.value))}
                  placeholder="Год"
                  type="normal"
                  itemHeight={25}
                  compact
                  centered
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6} md={6}>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <OptionSelector
                  options={hourOptions}
                  value={selectedHour}
                  onChange={(option) => setSelectedHour(Number(option.value))}
                  placeholder="Часы"
                  type="normal"
                  itemHeight={25}
                  compact
                  centered
                />
              </Grid>
              <Grid item xs={4}>
                <OptionSelector
                  options={minuteOptions}
                  value={selectedMinute}
                  onChange={(option) => setSelectedMinute(Number(option.value))}
                  placeholder="Минуты"
                  placeholderShort="Мин"
                  type="normal"
                  itemHeight={25}
                  compact
                  centered
                />
              </Grid>
              <Grid item xs={4}>
                <OptionSelector
                  options={secondOptions}
                  value={selectedSecond}
                  onChange={(option) => setSelectedSecond(Number(option.value))}
                  placeholder="Секунды"
                  placeholderShort="Сек"
                  type="normal"
                  itemHeight={25}
                  compact
                  centered
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item pt={2}>
          <Button text={'Рассчитать'} isDisabled={isButtonDisabled} onClick={onCountHoroscopesClick} type={ButtonType.gradient}/>
        </Grid>
        {isUpdateAvailable && <Grid item pt={2}>
          <Button text={'Обновить время рождения'} type={ButtonType.outline} onClick={updateHoroscope} />
        </Grid>}
      </Grid>
      <Grid pl={2} pt={2} pb={2}>
        <Header header={'Дробная таблица'} isIconActive={false} isPlain />
      </Grid>
      <DegreeTable table={table} />
      <RectificationDashiTable />
    </>
  );
};

export default Rectification;
