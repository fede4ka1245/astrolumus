import React, { useCallback, useMemo, useState } from 'react';
import { Alert, AlertTitle, Box, Grid, Typography } from '@mui/material';
import Input from '../../../../components/input/Input';
import { InputType } from '../../../../components/input/InputType';
import TransitionItem from '../components/transitionItem/TransitionItem';
import Button from '../../../../components/button/Button';
import { ButtonType } from '../../../../components/button/ButtonProps';
import { getTransitions } from '../../../../api/getTransitions';
import {
  useGetIsTransitionTableLoading,
  useGetTargetPlanets,
  useGetTransitionTable
} from '../../../../store/selectors';
import { Option } from '../../../../models/types/Option';
import HoroscopesLoader from '../../components/horoscopeLoader/HoroscopesLoader';
import Options from '../../../../components/options/Options';
import { useAppDispatch } from '../../../../store/store';
import {
  setIsTransitionTableLoading, setTargetPlanets,
  setTransitionTable
} from '../../../../store/reducers/transitionReduser';
import { TransitionsPlanet } from '../../../../models/types/transitions/transitionsPlanet';
import TransitionTable from '../components/transitionTable/TransitionTable';
import styles from '../components/transitionItem/TransitionItem.module.scss';
import plus from '../components/transitionItem/assets/plus.svg';
import { ignoredOptions, conditionOptions, planetMovingOptions, transitionPlanets } from '../helpers';
import { transitionPositions } from '../components/transitionItem/transitionPositions';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import IconButton from '../../../../components/iconButton/IconButton';
import moment from 'moment/moment';

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
});

const TransitionSearch = () => {
  const dispatch = useAppDispatch();
  const [dateStart, setDateStart] = useState<string>();
  const [dateTo, setDateTo] = useState<string>();
  const [currentIgnoredOptions, setCurrentIgnoredOptions] = useState<Option []>([]);
  const [condition, setCondition] = useState(conditionOptions[0]);
  const [isSearchFailed, setIsSearchFailed] = useState(false);
  const [planets, setPlanets] = useState<TransitionsPlanet []>([
    {
      planet: 1,
      position: transitionPositions[0],
      direction: planetMovingOptions[0].value,
      min: 0,
      max: 30
    }
  ]);
  const transitionTable = useGetTransitionTable();
  const isTransitionsTableLoading = useGetIsTransitionTableLoading();

  const isMovementMerge = useMemo(() => {
    return !!currentIgnoredOptions.find((item) => item.value === 'planet');
  }, [currentIgnoredOptions]);

  const isRasiMerge = useMemo(() => {
    return !!currentIgnoredOptions.find((item) => item.value === 'newSign');
  }, [currentIgnoredOptions]);

  const setPlanet = useCallback((planet: TransitionsPlanet, index: number) => {
    const newPlanetes = [...planets];

    newPlanetes[index] = planet;

    setPlanets(newPlanetes);
  }, [planets]);

  const addTransit = useCallback(() => {
    setPlanets([
      ...planets,
      {
        planet: 1,
        position: transitionPositions[0],
        direction: planetMovingOptions[0].value,
        min: 0,
        max: 30
      }
    ]);
  }, [planets]);

  const onClose = useCallback((index: number) => {
    setPlanets([...planets].filter((planet, order) => index !== order));
  }, [planets, setPlanets]);

  const targetPlanets = useGetTargetPlanets();

  const planetsNames = useMemo(() => {
    if (!(!!targetPlanets.length && !!transitionPlanets.length)) {
      return;
    }

    return [...targetPlanets.map((planet) => {
      return transitionPlanets.find((_planet) => _planet.id === planet.planet)?.planet as string;
    })];
  }, [targetPlanets]);

  const isDateStartValid = useMemo(() => {
    return moment(dateStart, 'DD.MM.YYYY', true).isValid();
  }, [dateStart]);

  const isDateToValid = useMemo(() => {
    return moment(dateTo, 'DD.MM.YYYY', true).isValid();
  }, [dateTo]);

  const onCountClick = useCallback(() => {
    if (!isDateStartValid || !isDateToValid || !dateStart || !dateTo) {
      alert('Введите диапазон для поиска транзита!');
      return;
    }

    dispatch(setTransitionTable([]));
    dispatch(setIsTransitionTableLoading(true));
    dispatch(setTargetPlanets(planets));
    setIsSearchFailed(false);

    getTransitions({
      dateStart,
      dateTo,
      planets,
      isMovementMerge,
      isRasiMerge,
      condition: condition.value
    }).then((table) => {
      dispatch(setTransitionTable(table));

      if (!table?.length) {
        setIsSearchFailed(true);
      } else {
        setIsSearchFailed(false);
      }
    }).finally(() => {
      dispatch(setIsTransitionTableLoading(false));
    });

    setTimeout(() => {
      window.scrollTo(2, document.body.scrollHeight);
    }, 100);
  }, [dateStart, isDateStartValid, isDateToValid, dateTo, dispatch, planets, isMovementMerge, isRasiMerge, condition.value]);

  return (
    <>
      <Grid pl={2} pr={2} overflow={'hidden'}>
        <Grid item container justifyContent={'space-between'}>
          <Grid key={'Начальная дата'} item width={'calc(50% - 5px)'}>
            <Input
              placeholder={'Начальная дата'}
              inputType={InputType.date}
              value={dateStart}
              onChange={setDateStart}
              isError={!(isDateStartValid || !dateStart)}
              textError={'*'}
            />
          </Grid>
          <Grid key={'Конечная дата'} item width={'calc(50% - 5px)'} zIndex={10}>
            <Input
              placeholder={'Конечная дата'}
              inputType={InputType.date}
              value={dateTo}
              onChange={setDateTo}
              isError={!(isDateToValid || !dateTo)}
              textError={'*'}
            />
          </Grid>
        </Grid>
        <Typography mt={2} color={'#99daea'} fontSize={'15px'} fontFamily={'Gilroy'}>
          {'Расчет данных ограничен до 2099 года'}
        </Typography>
        <Grid item pt={2} pb={2}>
          <Typography font-family={'Gilroy'} fontStyle={'normal'} fontWeight={600} color={'white'} fontSize={'16px'}>
                Игнорировать
          </Typography>
          <Options options={ignoredOptions} value={currentIgnoredOptions} setValue={setCurrentIgnoredOptions} />
        </Grid>
        <Grid item pt={2}>
          <Typography font-family={'Gilroy'} fontStyle={'normal'} fontWeight={600} color={'white'} fontSize={'16px'}>
                Условие
          </Typography>
          <Options options={conditionOptions} value={condition?.value} setValue={setCondition} />
        </Grid>
        <Grid item pt={1}>
          {
            planets.map((_, index) => (
              <TransitionItem
                key={index}
                planet={planets[index]}
                label={`Транзит планеты ${index + 1}`}
                setPlanet={(planet: TransitionsPlanet) => setPlanet(planet, index)}
                close={() => onClose(index)}
              />
            ))
          }
        </Grid>
        {planets.length < 2 && <Grid display={'flex'} alignItems={'center'} pt={2} onClick={addTransit}>
          <Box width={'30px'} height={'30px'} pr={2}>
            <IconButton>
              <img alt='plus' src={plus} width={'30px'} height={'30px'}/>
            </IconButton>
          </Box>
          <p className={styles.textClosed}>
                Добавить транзит
          </p>
        </Grid>}
        <Grid pt={3} mb={5}>
          <Button onClick={onCountClick} type={ButtonType.gradient} text={'Рассчитать'}/>
        </Grid>
      </Grid>
      <Grid>
        {!!transitionTable.length && !isTransitionsTableLoading && <TransitionTable planetsNames={planetsNames} rows={transitionTable} />}
        {isTransitionsTableLoading && <HoroscopesLoader />}
      </Grid>
      {isSearchFailed && <ThemeProvider theme={darkTheme}>
        <Grid p={2}>
          <Alert severity="info" variant="outlined">
            <AlertTitle><strong>По заданному диапазону ничего не найдено</strong></AlertTitle>
          </Alert>
        </Grid>
      </ThemeProvider>}
    </>
  );
};

export default TransitionSearch;
