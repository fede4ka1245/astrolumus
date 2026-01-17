import React, { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import styles from './MapSectorPlanets.module.scss';
import { Planet } from '../../../models/types/Planet';
import { Language } from '../../../models/enums/Language';
import { translatePlanetName } from '../../../helpers/translatePlanetName';
import { useGetLanguage } from '../../../store/selectors';
import { useGetProcessorObject } from '../../../hooks/useGetProcessorObject';
import { ProcessorObjectType } from '../../../pages/horoscopes/types';
import { setTargetProcessorObject } from '../../../store/reducers/horoscopesReducer';
import { useAppDispatch } from '../../../store/store';
import Tappable from '../../tappable/Tappable';

interface MapSectorPlanetsProps {
  planet: Planet,
  type: string
}

const formatPlanet = (planet: string, language: Language) => {
  return translatePlanetName(planet, language, true);
};

const MapSectorPlanet : React.FC<MapSectorPlanetsProps> = ({ planet, type }) => {
  const language = useGetLanguage();
  const formattedPlanet = useMemo(() => {
    return {
      id: planet.id,
      planet: formatPlanet(planet.name, language),
      isRetragraded: planet.movement === 'R'
    };
  }, [planet, language]);
  const dispatch = useAppDispatch();
  const processorPlanetObject = useGetProcessorObject(ProcessorObjectType.Planet, formattedPlanet.id);
  const arudhaObject = useGetProcessorObject(ProcessorObjectType.Arudhs, formattedPlanet.id);

  const onPlanetClick = useCallback((event: any) => {
    event.stopPropagation();

    if (planet.isArudha) {
      if (arudhaObject) {
        dispatch(setTargetProcessorObject(arudhaObject));
      }

      return;
    }

    dispatch(setTargetProcessorObject(processorPlanetObject));
  }, [processorPlanetObject, arudhaObject]);

  return (
    <Tappable disabled={processorPlanetObject === undefined && arudhaObject === undefined} onClick={onPlanetClick}>
      <div className={classNames(styles.planet, type)}>
        {formattedPlanet.isRetragraded ? `(${formattedPlanet.planet})` : formattedPlanet.planet}
      </div>
    </Tappable>
  );
};

export default MapSectorPlanet;
