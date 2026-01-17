import React, { useCallback, useMemo, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import plus from './assets/plus.svg';
import minus from './assets/minus.svg';
import Input from '../../../../../components/input/Input';
import classNames from 'classnames';
import styles from './TransitionItem.module.scss';
import Options from '../../../../../components/options/Options';
import Slider from '../../../../../components/slider/Slider';
import { InputType } from '../../../../../components/input/InputType';
import { Option } from '../../../../../models/types/Option';
import { TransitionPosition, TransitionsPlanet } from '../../../../../models/types/transitions/transitionsPlanet';
import { planetMovingOptions, transitionPlanets } from '../../helpers';
import { transitionPositions } from './transitionPositions';
import { translatePlanetPosition } from '../../../../../helpers/translatePlanetPosition';
import { useGetLanguage } from '../../../../../store/selectors';
import { translatePlanetName } from '../../../../../helpers/translatePlanetName';

interface TransitionItemProps {
  label: string,
  setPlanet: (planet: TransitionsPlanet) => any,
  planet?: TransitionsPlanet,
  close?: () => any,
}

const TransitionItem = ({ label, setPlanet, planet, close }: TransitionItemProps) => {
  const [isOpen, setIsOpen] = useState(!!planet);
  const lang = useGetLanguage();

  const planetsOptions = useMemo<Option []>(() => {
    return [...transitionPlanets.map(({ id, planet }) => ({
      value: id,
      label: translatePlanetName(planet, lang)
    }))];
  }, [lang]);

  const positionOptions = useMemo<Option []>(() => {
    return [...transitionPositions.map(({ id, value }) => ({
      value,
      label: translatePlanetPosition(value, lang)
    }))];
  }, [lang]);

  const toggleIsOpen = useCallback(() => {
    if (!setIsOpen) {
      return;
    }

    if (isOpen && close) {
      close();
    }

    setIsOpen(!isOpen);
  }, [close, isOpen]);

  const setDirection = useCallback((direction: Option) => {
    if (!planet) {
      return;
    }

    setPlanet({
      ...planet,
      direction: direction.value
    });
  }, [planet, setPlanet]);

  const setPosition = useCallback((position: Option) => {
    if (!planet) {
      return;
    }

    setPlanet({
      ...planet,
      position: transitionPositions.find((option) => option.value === position?.value) as TransitionPosition
    });
  }, [planet, setPlanet]);

  const setPlanetValue = useCallback((planetOption: Option) => {
    if (!planet) {
      return;
    }

    setPlanet({
      ...planet,
      planet: planetOption.value as number
    });
  }, [planet, setPlanet]);

  const targetPosition = useMemo(() => {
    return positionOptions.find((option) => option.value === planet?.position?.value);
  }, [planet, positionOptions, lang]);

  const targetPlanetOption = useMemo(() => {
    return planetsOptions.find((option) => option.value === planet?.planet);
  }, [planet, planetsOptions]);

  const slideValue = useMemo(() => {
    return planet && [planet?.min, planet?.max];
  }, [planet]);

  const onSliderChange = (event: Event, newValue: number | number[]) => {
    if (!planet || planet?.min === undefined || planet?.max === undefined) {
      return;
    }

    const [min, max] = newValue as number[];

    setPlanet({
      ...planet,
      min,
      max
    });
  };

  return (
    <Box pt={2}>
      <section onClick={toggleIsOpen} className={styles.label}>
        <Box width={'30px'} height={'30px'} pr={2}>
          {isOpen && <img alt='minus' src={minus} width={'30px'} height={'30px'}/>}
          {!isOpen && <img alt='plus' src={plus} width={'30px'} height={'30px'}/>}
        </Box>
        <p className={classNames({ [styles.textOpened]: isOpen }, { [styles.textClosed]: !isOpen })}>
          {label}
        </p>
      </section>
      {isOpen && <Grid container direction={'column'}>
        <Grid pt={2} item container direction={'row'} justifyContent={'space-between'}>
          <Grid item width={'calc(50% - 5px)'}>
            <Input
              placeholder={'Планета'}
              options={planetsOptions}
              targetOption={targetPlanetOption}
              setTargetOption={setPlanetValue}
              inputType={InputType.options}
            />
          </Grid>
          <Grid item width={'calc(50% - 5px)'}>
            <Input
              placeholder={'Созвездие'}
              options={positionOptions}
              targetOption={targetPosition}
              setTargetOption={setPosition}
              inputType={InputType.options}
            />
          </Grid>
        </Grid>
        <Grid item pt={2}>
          <Typography font-family={'Gilroy'} fontStyle={'normal'} fontWeight={600} color={'white'} fontSize={'14px'}>
            Движение планеты
          </Typography>
          <Options options={planetMovingOptions} value={planet?.direction} setValue={setDirection} />
        </Grid>
        <Grid item pt={2}>
          <Typography font-family={'Gilroy'} fontStyle={'normal'} fontWeight={600} color={'white'} fontSize={'14px'}>
            Положение планеты в градусе
          </Typography>
          <Slider max={30} value={slideValue} onChange={onSliderChange} disableSwap valueLabelDisplay="on"/>
        </Grid>
      </Grid>}
    </Box>
  );
};

export default TransitionItem;
