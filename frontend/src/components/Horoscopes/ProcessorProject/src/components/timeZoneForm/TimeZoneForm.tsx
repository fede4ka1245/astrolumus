import React, { useCallback, useEffect, useMemo } from 'react';
import { Grid } from '@mui/material';
import Input from '../input/Input';
import { InputType } from '../input/InputType';
import { Option } from '../../models/types/Option';
import { getGreenwichFromSign } from '../../helpers/getGreenwichFromSign';

interface TimeZoneFormProps {
  isMinutesError?: boolean,
  isHoursError?: boolean,
  isGreenwichError?: boolean,
  hours?: string,
  setHours?: (props: any) => any,
  minutes?: string,
  setMinutes?: (props: any) => any,
  greenwich?: string,
  setGreenwich?: (props: any) => any
}

const getHoursOptions = (): Option [] => {
  return [...Array.from({ length: 14 }).map((_, index) => ({
    value: index,
    label: index >= 10 ? index : `0${index}`
  }))];
};

const getMinutesOptions = (): Option [] => {
  return [...Array.from({ length: 60 }).map((_, index) => ({
    value: index,
    label: index >= 10 ? index : `0${index}`
  }))];
};

const getGreenwichOptions = (): Option [] => {
  return [
    {
      value: 'Восток',
      label: 'Восток (+)'
    },
    {
      value: 'Запад',
      label: 'Запад (-)'
    }
  ];
};

const TimeZoneForm = ({ hours, setHours, minutes, setMinutes, greenwich, setGreenwich, isHoursError, isGreenwichError, isMinutesError }: TimeZoneFormProps) => {
  const hoursOptions = useMemo(() => {
    return getHoursOptions();
  }, []);

  const minutesOptions = useMemo(() => {
    return getMinutesOptions();
  }, []);

  const greenwichOptions = useMemo(() => {
    return getGreenwichOptions();
  }, []);

  const hoursTargetOption = useMemo(() => {
    if (!hours) {
      return;
    }

    return hoursOptions.find(({ label, value }: Option) => label === hours || Number(hours) === value || hours === value);
  }, [hoursOptions, hours]);

  const minutesTargetOption = useMemo(() => {
    if (!minutes) {
      return;
    }

    return minutesOptions.find(({ label, value }: Option) => label === minutes || Number(minutes) === value || minutes === value);
  }, [minutesOptions, minutes]);

  const greenwichTargetOption = useMemo(() => {
    if (!greenwich) {
      return;
    }

    return greenwichOptions.find(({ label, value }: Option) => label === greenwich || getGreenwichFromSign(greenwich as string) === value || greenwich === value);
  }, [greenwichOptions, greenwich]);

  const onHoursSet = useCallback((option: Option) => {
    if (!setHours) {
      return;
    }

    setHours(option.label);
  }, [setHours]);

  const onMinutesSet = useCallback((option: Option) => {
    if (!setMinutes) {
      return;
    }

    setMinutes(option.label);
  }, [setMinutes]);

  const onGreenwichSet = useCallback((option: Option) => {
    if (!setGreenwich) {
      return;
    }

    setGreenwich(option.value);
  }, [setGreenwich]);

  useEffect(() => {
    if (setGreenwich && !greenwich) {
      setGreenwich(getGreenwichOptions()[0].value);
    }
  }, [setGreenwich]);

  return (
    <>
      <Grid item width={'100%'}>
        <Input
          isError={isGreenwichError}
          placeholder='Гринвич'
          inputType={InputType.options}
          setTargetOption={onGreenwichSet}
          targetOption={greenwichTargetOption}
          options={greenwichOptions}
        />
      </Grid>
      <Grid display={'flex'} mt={1} width={'100%'}>
        <Grid item flex={1} mr={1}>
          <Input
            isError={isHoursError}
            placeholder='Час'
            inputType={InputType.options}
            setTargetOption={onHoursSet}
            targetOption={hoursTargetOption}
            options={hoursOptions}
          />
        </Grid>
        <Grid item flex={1}>
          <Input
            isError={isMinutesError}
            placeholder='Мин.'
            inputType={InputType.options}
            setTargetOption={onMinutesSet}
            targetOption={minutesTargetOption}
            options={minutesOptions}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default TimeZoneForm;
