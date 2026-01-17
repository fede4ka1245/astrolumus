// @ts-nocheck
import React, { useCallback, useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import Input from '../../../../../components/input/Input';
import { InputType } from '../../../../../components/input/InputType';
import TimeZoneForm from '../../../../../components/timeZoneForm/TimeZoneForm';
import { TimeZoneData } from '../../../../../models/types/TimeZoneData';
import Button from '../../../../../components/button/Button';
import { useGetChakrasParams, useGetHoroscopeUserInfo } from '../../../../../store/selectors';
import { useAppDispatch } from '../../../../../store/store';
import { setChakrasParams } from '../../../../../store/reducers/zonesReducer';
import { setIsAppLoading } from '../../../../../store/reducers/preferencesReducer';
import { getChakrasParams } from '../../../../../api/getChakrasParams';
import { Option } from '../../../../../models/types/Option';
import Options from '../../../../../components/options/Options';

interface ChakraFormProps {
  onCountClick?: (props?: any) => any,
}

const timeOptions = [
  {
    value: 1,
    label: 'Текущее время'
  },
  {
    value: 2,
    label: 'Время построения гороскопа'
  }
];

const ChakraForm = ({ onCountClick }: ChakraFormProps) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [timeZone, setTimeZone] = useState<TimeZoneData>({
    hours: '',
    minutes: '',
    greenwich: ''
  });

  const setHours = useCallback((hours: string) => {
    setTimeZone({
      ...timeZone,
      hours
    });
  }, [timeZone, setTimeZone]);

  const setMinutes = useCallback((minutes: string) => {
    setTimeZone({
      ...timeZone,
      minutes
    });
  }, [timeZone, setTimeZone]);

  const setGreenwich = useCallback((greenwich: string) => {
    setTimeZone({
      ...timeZone,
      greenwich
    });
  }, [timeZone, setTimeZone]);

  const chakrasParams = useGetChakrasParams();
  const dispatch = useAppDispatch();

  const [targetStartPoint, setTargetStartPoint] = useState<Option>();
  const [targetNakshatraStartPoint, setTargetNakshatraStartPoint] = useState<Option>();

  useEffect(() => {
    if (chakrasParams) {
      return;
    }

    dispatch(setIsAppLoading(true));

    getChakrasParams()
      .then((params) => {
        dispatch(setChakrasParams(params));
      })
      .finally(() => {
        dispatch(setIsAppLoading(false));
      });
  }, []);

  const _onCountClick = useCallback(() => {
    if (!onCountClick) {
      return;
    }

    onCountClick({
      chakraDate: date,
      chakraTime: time,
      chakraHours: Number(timeZone.hours),
      chakraMinutes: timeZone.minutes,
      chakraGreenwich: timeZone.greenwich,
      nakshatraStartPoint: targetNakshatraStartPoint?.value,
      startPoint: targetStartPoint?.value
    });
  }, [onCountClick, date, timeZone, targetNakshatraStartPoint, targetStartPoint]);

  const [targetTimeOption, setTargetTimeOption] = useState(timeOptions[0]);

  const horoscopeData = useGetHoroscopeUserInfo();

  useEffect(() => {
    if (targetTimeOption.value === 1) {
      const date = new Date();

      setDate(`${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`);
      setTime(`${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:00`);
    } else {
      setDate(horoscopeData.date);
      setTime(horoscopeData.time);
    }
  }, [targetTimeOption]);

  useEffect(() => {
    setTimeZone({
      ...timeZone,
      hours: horoscopeData.hours,
      minutes: horoscopeData.minutes
    });
  }, []);

  return (
    <Grid>
      <Grid item container display={'flex'} pb={2}>
        <Options options={timeOptions} setValue={setTargetTimeOption} value={targetTimeOption.value} />
      </Grid>
      <Grid item container direction={'row'} spacing={2} pb={1}>
        <Grid item xs={6} md={6}>
          <Input placeholder='ДД.ММ.ГГГГ' inputType={InputType.date} value={date} onChange={setDate}/>
        </Grid>
        <Grid item xs={6} md={6}>
          <Input placeholder='00.00.00' inputType={InputType.time} value={time} onChange={setTime}/>
        </Grid>
      </Grid>
      <Grid item container display={'flex'} pb={2}>
        <TimeZoneForm
          greenwich={timeZone?.greenwich}
          setGreenwich={setGreenwich}
          minutes={timeZone?.minutes}
          setMinutes={setMinutes}
          hours={timeZone?.hours}
          setHours={setHours}
        />
      </Grid>
      <Grid item pt={2}>
        <Input
          placeholder='Накшатра планеты отсчета'
          inputType={InputType.options}
          options={chakrasParams?.startPoints}
          setTargetOption={setTargetStartPoint}
          targetOption={targetStartPoint}
        />
      </Grid>
      <Grid item pt={2}>
        <Input
          placeholder='Накшатра отсчета'
          inputType={InputType.options}
          options={chakrasParams?.nakshatrasStartPoints}
          setTargetOption={setTargetNakshatraStartPoint}
          targetOption={targetNakshatraStartPoint}
        />
      </Grid>
      <Grid item width={'100%'} pt={2}>
        <Button text={'Рассчитать'} onClick={_onCountClick}/>
      </Grid>
    </Grid>
  );
};

export default ChakraForm;
