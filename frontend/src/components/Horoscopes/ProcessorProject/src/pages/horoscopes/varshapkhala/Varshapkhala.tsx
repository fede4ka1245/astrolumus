import React, { useCallback, useEffect, useMemo, useState } from 'react';
import YearPicker from '../../../components/yearPicker/YearPicker';
import { Grid, Typography } from '@mui/material';
import Button from '../../../components/button/Button';
import planet from './img.png';
import {
  useGetDashiTable,
  useGetHoroscopeAddressInformation,
  useGetHoroscopeUserInfo,
  useGetIsVarshpahalaLoading,
  useGetIsYearPickerActive, useGetLanguage,
  useGetVarshpahalaDate,
  useGetVarshpahalaMuntkha,
  useGetVarshpahalaDegreeTable,
  useGetYearMaster,
  useGetYearMasterTable,
  useGetYogasTable, useGetTargetMapValue, useGetIsDeepSkyActive
} from '../../../store/selectors';
import DashiTable from '../../../components/dashiTable/DashiTable';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import {
  setDashiTable,
  setIsVarshpahalaLoading,
  setIsYearPickerActive,
  setMuntkha,
  setVarshpahalaDate,
  setVarshpahalaMaps,
  setVarshpahalaDegreeTable,
  setYearMaster,
  setYearMasterTable,
  setYogasTable
} from '../../../store/reducers/varshpahalaReducer';
import YogasTable from '../../../components/yogasTable/YogasTable';
import Header from '../../../components/header/Header';
import Modal from '../../../components/modal/Modal';
import YearMasterTable from './yearMasterTable/YearMasterTable';
import HoroscopesLoader from '../components/horoscopeLoader/HoroscopesLoader';
import DegreeTable from '../../../components/degreeTable/DegreeTable';
import ButtonBack from '../../../components/buttonBack/ButtonBack';
import ButtonClose from '../../../components/buttonClose/ButtonClose';
import { DegreeTableParts } from '../../../models/types/DegreeTable';
import { getVarsha } from '../../../api/getVarsha';
import Options from '../../../components/options/Options';
import useLocalStorage from 'use-local-storage';
import Input from '../../../components/input/Input';
import { InputType } from '../../../components/input/InputType';
import { translatePlanetName } from '../../../helpers/translatePlanetName';
import DeepSkySwitch from '../../../components/deepSkySwitch/DeepSkySwitch';
import { setDeepSkyObjects, setIsDeepSkyActive } from '../../../store/reducers/deepSkyReducer';
import { setTargetMapValue } from '../../../store/reducers/horoscopesReducer';
import { getDeepSky } from '../../../api/getDeepSky';
import { setIsAppLoading } from '../../../store/reducers/preferencesReducer';
import { countDeepSky } from '../../../helpers/deepSky/countDeepSky';

const pickerOptions = [
  {
    label: 'Выбрать год',
    value: 'year'
  },
  {
    label: 'Выбрать месяц и год',
    value: 'yearAndMonth'
  }
];

const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

const Varshapkhala = () => {
  const userInfo = useGetHoroscopeUserInfo();
  const address = useGetHoroscopeAddressInformation();
  const dashiTable = useGetDashiTable();
  const yogasTable = useGetYogasTable();
  const yearMasterTable = useGetYearMasterTable();
  const isVarshpahalaLoading = useGetIsVarshpahalaLoading();
  const dispatch = useAppDispatch();
  const [isYearMasterModalOpen, setIsYearMasterModalOpen] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());
  const [targetPickerOption, setTargetPickerOption] = useLocalStorage('varshapkhala-target-picker', pickerOptions[0]);
  const [month, setMonth] = useState(months[0]);
  const yearMaster = useGetYearMaster();
  const isYearPickerActive = useGetIsYearPickerActive();
  const degreeTable = useGetVarshpahalaDegreeTable();
  const horoscopeDate = useGetVarshpahalaDate();
  const muntha = useGetVarshpahalaMuntkha();
  const settings = useAppSelector((state) => state?.horoscopeSettings);
  const startYear = useMemo(() => {
    return Number(userInfo.date.split('.')[2]);
  }, [userInfo]);
  const years = useMemo(() => {
    if (startYear >= new Date().getFullYear()) {
      return [...(Array.from({ length: 120 }).map((_, index) => startYear + index))].reverse();
    }

    return [...(Array.from({ length: new Date().getFullYear() - startYear + 120 }).map((_, index) => startYear + index))].reverse();
  }, [startYear]);

  const toggleIsYearPickerActive = useCallback(() => {
    dispatch(setIsYearPickerActive(!isYearPickerActive));
  }, [isYearPickerActive]);

  const table = useMemo(() => {
    return degreeTable.find((degreeTable) => degreeTable.tableName === 'D-1')?.table as DegreeTableParts;
  }, [degreeTable]);

  const onCreateHoroscopeClick = useCallback(() => {
    dispatch(setIsVarshpahalaLoading(true));

    getVarsha({
      address,
      userInfo,
      year,
      month: targetPickerOption.value === pickerOptions[1].value && !!month
        ? months.findIndex((_month) => _month === month) + 1
        : undefined,
      settings
    })
      .then(({
        dashi,
        degreeTable,
        maps,
        muntha,
        yearMaster,
        yearMasterTable,
        date,
        yogasTable
      }) => {
        dispatch(setDashiTable(dashi.table));
        dispatch(setVarshpahalaDegreeTable(degreeTable));
        dispatch(setVarshpahalaMaps(maps));
        dispatch(setMuntkha(muntha));
        dispatch(setYearMaster(yearMaster));
        dispatch(setYearMasterTable(yearMasterTable));
        dispatch(setVarshpahalaDate(date));
        dispatch(setYogasTable(yogasTable));
        toggleIsYearPickerActive();
      }).finally(() => {
        dispatch(setIsVarshpahalaLoading(false));
      });
  }, [year, settings, address, userInfo, toggleIsYearPickerActive, dispatch, targetPickerOption, month]);

  const toggleYearMasterModal = useCallback(() => {
    setIsYearMasterModalOpen(!isYearMasterModalOpen);
  }, [isYearMasterModalOpen]);

  const language = useGetLanguage();

  const rasiMuntha = useMemo(() => {
    return muntha.find(({ mapName }) => mapName === 'D-1');
  }, [muntha]);

  const targetMapValue = useGetTargetMapValue();
  const { date } = useGetHoroscopeUserInfo();
  const isDeepSkyActive = useGetIsDeepSkyActive();

  const toggleDeepSky = useCallback((_: any, checked: boolean) => {
    dispatch(setIsDeepSkyActive(checked));

    if (!checked) {
      return;
    }

    dispatch(setIsAppLoading(true));
    dispatch(setTargetMapValue('D-1'));

    getDeepSky()
      .then((deepSkyObjects) => {
        const result = countDeepSky(deepSkyObjects, degreeTable, Number(year), 'D-1');

        dispatch(setDeepSkyObjects(result.targetDeepSkyObjects));
        dispatch(setVarshpahalaDegreeTable(result.degreeTable));
      })
      .finally(() => {
        dispatch(setIsAppLoading(false));
      });
  }, [degreeTable, date, targetMapValue]);

  useEffect(() => {
    if (!isDeepSkyActive) {
      return;
    }
    if (targetMapValue !== 'D-1') {
      dispatch(setIsDeepSkyActive(false));
    }
    // dispatch(setIsAppLoading(true));
    //
    // getDeepSky()
    //   .then((deepSkyObjects) => {
    //     const result = countDeepSky(deepSkyObjects, degreeTable, Number(year), targetMapValue);
    //
    //     dispatch(setDeepSkyObjects(result.targetDeepSkyObjects));
    //     dispatch(setVarshpahalaDegreeTable(result.degreeTable));
    //   })
    //   .finally(() => {
    //     dispatch(setIsAppLoading(false));
    //   });
  }, [targetMapValue]);

  useEffect(() => {
    if (isYearPickerActive) {
      dispatch(setIsDeepSkyActive(false));
    }
  }, [isYearPickerActive]);

  useEffect(() => {
    return () => {
      dispatch(setIsDeepSkyActive(false));
    };
  }, []);

  return (
    <Grid container direction={'column'} position='relative'>
      {isVarshpahalaLoading && <Grid display={'flex'} height={'382px'} direction={'column'} alignItems={'center'} justifyItems={'center'}>
        <Grid width={'50px'} height={'50px'}>
          <HoroscopesLoader/>
        </Grid>
        <Typography mt={1} color={'#99daea'} fontSize={'13px'} fontFamily={'Gilroy'}>
          Время расчета ~15 секунд
        </Typography>
      </Grid>}
      {isYearPickerActive && !isVarshpahalaLoading && (
        <>
          <img
            src={planet}
            height={'582px'}
            width={'100%'}
            style={{ objectFit: 'cover', position: 'absolute', opacity: 0.5, zIndex: -1, overflowY: 'visible', top: '-250px' }}
          />
          <Grid p={2}>
            <Options options={pickerOptions} setValue={setTargetPickerOption} value={targetPickerOption.value} />
          </Grid>
          {targetPickerOption.value === 'year' && <Grid height={'250px'}>
            <Grid item pt={'30px'} pb={'30px'}>
              <YearPicker setYear={setYear} years={years} year={year} />
            </Grid>
          </Grid>}
          {targetPickerOption.value === 'yearAndMonth' && <Grid height={'250px'}>
            <Grid item p={2}>
              <Input
                placeholder={'Выберите год'}
                targetOption={{ label: year, value: year }}
                inputType={InputType.options}
                setTargetOption={({ value }) => setYear(value)}
                options={[...years.map((year) => ({ label: year, value: year }))].reverse()}
              />
            </Grid>
            <Grid item pl={2} pr={2}>
              <Input
                placeholder={'Выберите месяц'}
                targetOption={{ label: month, value: month }}
                inputType={InputType.options}
                setTargetOption={({ value }) => setMonth(value)}
                options={[...months.map((month) => ({ label: month, value: month }))]}
              />
            </Grid>
          </Grid>}
          <Grid pr={2} pl={2} mt={'auto'} pb={2}>
            <Button text={'Построить гороскоп'} onClick={onCreateHoroscopeClick}/>
          </Grid>
        </>
      )}
      {!isYearPickerActive && !isVarshpahalaLoading && (
        <>
          <Grid item padding={1}>
            <ButtonBack label={'Вернуться к выбору года'} onClick={toggleIsYearPickerActive} />
          </Grid>
          <Typography color={'white'} width={'100%'} fontWeight={700} fontFamily={'Gilroy'} fontSize={'20px'} mr={'auto'} pb={2} textAlign={'center'}>
            {horoscopeDate}
          </Typography>
          <Grid item pl={2} pr={2} pb={2}>
            <DeepSkySwitch
              isDeepSkyActive={isDeepSkyActive}
              toggleDeepSky={toggleDeepSky}
            />
          </Grid>
          <Grid item>
            <DegreeTable table={table} isDeepSkyActive={isDeepSkyActive} />
          </Grid>
          <Grid item paddingTop={2} pl={2} pr={2} fontFamily={'Playfair Display'} fontSize={'24px'} fontWeight={'700'} color={'white'}>
            {rasiMuntha?.house && <Typography color={'white'} width={'100%'} fontWeight={700} fontFamily={'Gilroy'} fontSize={'20px'} mr={'auto'} pb={2} textAlign={'center'}>
              Мунтха - в {rasiMuntha?.house} доме, в D-1
            </Typography>}
            <Button
              text={`${pickerOptions[0].value === targetPickerOption.value ? 'Определить хозяина года' : 'ПВБ'}`}
              onClick={toggleYearMasterModal}
            />
            <Modal isOpen={isYearMasterModalOpen} close={toggleYearMasterModal} height={'360px'}>
              <Grid pl={2} pt={1} pr={1} ml={'auto'} display={'flex'} width={'100%'}>
                {pickerOptions[0].value === targetPickerOption.value && <Typography color={'#292E30'} fontWeight={700} fontFamily={'Gilroy'} fontSize={'20px'} mr={'auto'}>
                  Хозяин года - {translatePlanetName(yearMaster, language)}
                </Typography>}
                {pickerOptions[1].value === targetPickerOption.value && <Typography color={'#292E30'} fontWeight={700} fontFamily={'Gilroy'} fontSize={'20px'} mr={'auto'}>
                  ПВБ
                </Typography>}
                <ButtonClose onClick={toggleYearMasterModal} />
              </Grid>
              <Grid item>
                <YearMasterTable rows={yearMasterTable} />
              </Grid>
              <Typography mt={2} ml={2} mr={2} color={'#37366B'} fontSize={'15px'} fontFamily={'Gilroy'}>
                * расчёт согласно Чараку
              </Typography>
            </Modal>
          </Grid>
          <Grid item paddingTop={2} pl={2} >
            <Header header={'Йоги варшапхала'} isIconActive={false} />
          </Grid>
          <Grid item paddingTop={2}>
            <YogasTable rows={yogasTable}/>
          </Grid>
          <Grid item paddingTop={2} pl={2}>
            <Header header={'МУДДА ДАША'} isIconActive={false} />
          </Grid>
          <Grid item paddingTop={3}>
            <DashiTable rows={dashiTable.slice(0, 9)} maxPlanets={pickerOptions[1].value === targetPickerOption.value ? -1 : 4} isAgesDisabled />
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default Varshapkhala;
