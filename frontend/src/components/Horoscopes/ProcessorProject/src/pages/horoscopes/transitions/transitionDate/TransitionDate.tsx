import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import Input from '../../../../components/input/Input';
import { InputType } from '../../../../components/input/InputType';
import Button from '../../../../components/button/Button';
import { ButtonType } from '../../../../components/button/ButtonProps';
import {
  useGetHoroscopeAddressInformation,
  useGetHoroscopeUserInfo,
  useGetIsTransitionMapsActive,
  useGetTargetMapValue,
  useGetTransitionDate,
  useGetTransitionIsDegreeTableLoading,
  useGetTransitionMaps,
  useGetTransitionDegreeTable,
  useGetTransitionTime
} from '../../../../store/selectors';
import { useAppDispatch } from '../../../../store/store';
import {
  setIsTransitionMapsActive, setIsTransitionDegreeTableLoading, setTransitionDate,
  setTransitionMaps, setTransitionDegreeTable,
  setTransitionTime
} from '../../../../store/reducers/transitionReduser';
import AppLoader from '../../../../components/appLoader/AppLoader';
import MainDashiTable from '../../components/mainDashiTable/MainDashiTable';
import DegreeTable from '../../../../components/degreeTable/DegreeTable';
import HoroscopesLoader from '../../components/horoscopeLoader/HoroscopesLoader';
import { DegreeTableParts } from '../../../../models/types/DegreeTable';
import { countHoroscope } from '../../../../api/countHoroscope';
import Header from '../../../../components/header/Header';
import moment from 'moment';

const TransitionDate = () => {
  const dispatch = useAppDispatch();
  const transitionMaps = useGetTransitionMaps();
  const isTransitionMapsActive = useGetIsTransitionMapsActive();
  const [isLoading, setIsLoading] = useState(false);
  const transitionDate = useGetTransitionDate();
  const transitionTime = useGetTransitionTime();
  const address = useGetHoroscopeAddressInformation();
  const userInfo = useGetHoroscopeUserInfo();

  const onTransitionTimeChange = useCallback((value: string) => {
    dispatch(setTransitionTime(value));
  }, []);

  const onTransitionDateChange = useCallback((value: string) => {
    dispatch(setTransitionDate(value));
  }, []);

  const degreeTable = useGetTransitionDegreeTable();
  const isDegreeTableLoading = useGetTransitionIsDegreeTableLoading();
  const targetMapValue = useGetTargetMapValue();

  const table = useMemo(() => {
    if (!degreeTable) {
      return degreeTable;
    }

    return degreeTable.find((degreeTableItem) => degreeTableItem.tableName === targetMapValue)?.table as DegreeTableParts;
  }, [degreeTable, targetMapValue]);

  const onCountClick = useCallback(() => {
    setIsLoading(true);
    dispatch(setIsTransitionDegreeTableLoading(true));

    countHoroscope({
      address,
      userInfo: {
        ...userInfo,
        date: transitionDate,
        time: transitionTime
      }
    })
      .then(({ maps, degreeTable }) => {
        dispatch(setTransitionMaps(maps));
        dispatch(setTransitionDegreeTable(degreeTable));
      })
      .finally(() => {
        setIsLoading(false);
        dispatch(setIsTransitionDegreeTableLoading(false));
      });
  }, [address, userInfo, transitionDate, transitionTime]);

  useEffect(() => {
    const date = new Date();

    const seconds = '00';
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const year = String(date.getFullYear()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    dispatch(setTransitionDate(`${day}.${month}.${year}`));
    dispatch(setTransitionTime(`${hours}:${minutes}:${seconds}`));
  }, []);

  useEffect(() => {
    return () => {
      dispatch(setTransitionMaps([]));
    };
  }, []);

  const toggleIsTransitionMapsActive = useCallback(() => {
    dispatch(setIsTransitionMapsActive(!isTransitionMapsActive));
  }, [isTransitionMapsActive]);

  useEffect(() => {
    return () => {
      dispatch(setIsTransitionMapsActive(false));
    };
  }, []);
  
  const isDateValid = useMemo(() => {
    return moment(transitionDate, 'DD.MM.YYYY', true).isValid();
  }, [transitionDate]);

  const isTimeValid = useMemo(() => {
    return moment(transitionTime, 'HH:mm:ss', true).isValid();
  }, [transitionTime]);

  return (
    <>
      <AppLoader isLoading={isLoading}/>
      <Grid item container justifyContent={'space-between'} pl={2} pr={2}>
        <Grid item width={'calc(50% - 5px)'}>
          <Input
            placeholder={'Дата транзита'}
            inputType={InputType.date}
            value={transitionDate}
            onChange={onTransitionDateChange}
            isError={!(isDateValid || !transitionDate)}
          />
        </Grid>
        <Grid item width={'calc(50% - 5px)'}>
          <Input
            placeholder={'Время транзита'}
            inputType={InputType.time}
            value={transitionTime}
            onChange={onTransitionTimeChange}
            isError={!(isTimeValid || !transitionTime)}
          />
        </Grid>
      </Grid>
      <Typography mt={2} ml={2} mr={2} color={'#99daea'} fontSize={'15px'} fontFamily={'Gilroy'}>
        {'Транзитная карта строится на место и часовой пояс вашего рождения.'}
      </Typography>
      {!!transitionMaps.length && <Grid pt={3} pl={2} pr={2}>
        <Button
          onClick={toggleIsTransitionMapsActive}
          type={ButtonType.outline}
          text={!isTransitionMapsActive ? 'Добавить натальную карту' : 'Отключить натальную карту'}
        />
      </Grid>}
      <Grid pt={2} pb={2} onClick={onCountClick} pl={2} pr={2}>
        <Button
          type={ButtonType.gradient}
          text={'Рассчитать'}
        />
      </Grid>
      {!!transitionMaps.length && (
        <>
          {!isDegreeTableLoading && degreeTable && (
            <>
              <Grid pl={2} pt={2} pb={2}>
                <Header header={'Дробная таблица'} isIconActive={false} isPlain />
              </Grid>
              <DegreeTable table={table} />
            </>
          )}
          {isDegreeTableLoading && <HoroscopesLoader />}
          <MainDashiTable />
        </>
      )}
    </>
  );
};

export default TransitionDate;
