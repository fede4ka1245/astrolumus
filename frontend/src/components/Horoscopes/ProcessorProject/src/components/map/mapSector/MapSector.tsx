import React, { useCallback, useContext, useMemo, useRef } from 'react';
import styles from './MapSector.module.scss';
import classNames from 'classnames';
import {
  useGetIsEarthActive,
  useGetIsVarshpahalaLoading,
  useGetIsYearPickerActive,
  useGetVarshpahalaMuntkha
} from '../../../store/selectors';
import southMapMark from './southMapMark.svg';
import { useGetEarth } from '../../../hooks/useGetEarth';
import { MapSection } from '../../../models/types/MapSection';
import { useGetIsHelpersElementsActive } from '../../../hooks/useGetIsHelpersElementsActive';
import MapSectorPlanets from '../mapSectorPlanets/MapSectorPlanets';
import { useLocation, useOutletContext } from '../../../contexts/NavigationContext';
import ObjectsRenderer, { RendererType, SectorPosition } from '../objectsRenderer/ObjectsRenderer';
import { getSectorPosition } from '../objectsRenderer/helpers/getSectorPosition';
import { MapContext } from '../mapContext';
import { MapTypeEnum } from '../../../models/types/MapType';
import { Grid } from '@mui/material';
import { processorRoutes } from '../../../pages/astrlogicalProcessor/processorRoutes';
import { ProcessorContext } from '../../../models/interfaces/processorContext';
import { useAppDispatch } from '../../../store/store';
import { setTargetProcessorObject } from '../../../store/reducers/horoscopesReducer';
import { ProcessorObjectType } from '../../../pages/horoscopes/types';
import { useGetProcessorObject } from '../../../hooks/useGetProcessorObject';
import Tappable from '../../tappable/Tappable';

interface MapSectorProps {
  mapSection: MapSection,
}

const MapSector = ({ mapSection }: MapSectorProps) => {
  const earth = useGetEarth();
  const isEarthActive = useGetIsEarthActive();
  const muntha = useGetVarshpahalaMuntkha();
  const isVarshpahalaLoading = useGetIsVarshpahalaLoading();
  const isYearPickerActive = useGetIsYearPickerActive();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { value, setValue } = useContext(MapContext);
  const { route } = useOutletContext<ProcessorContext>();

  const { signId, aspects: planetsAspects, specialLagna, arudhs, primaryData, house, mandyGulika, upagraha, transsaturns } = mapSection;

  const isVarshaActive = useMemo(() => {
    return !isYearPickerActive && !isVarshpahalaLoading && location.pathname.includes(route + processorRoutes.varshapkhala);
  }, [route, isVarshpahalaLoading, isYearPickerActive, location]);

  const targetMuntha = useMemo(() => {
    return muntha.find((target) => target.mapName === (value.mapName || value.targetMapValue));
  }, [value.targetMapValue, muntha, value.mapName]);

  const isMunthaActive = useMemo(() => {
    return isVarshaActive && targetMuntha?.sign === signId;
  }, [targetMuntha, isVarshaActive, signId]);

  const isSelected = useMemo(() => {
    return signId === value.selectedSector;
  }, [signId, value.selectedSector]);

  const isPositiveAspect = useMemo(() => {
    if (!value.targetAspectIndex) {
      return false;
    }

    return value.signAspects.positiveAspects.includes(Number(signId));
  }, [value, signId]);

  const isNegativeAspect = useMemo(() => {
    if (!value.targetAspectIndex) {
      return false;
    }

    return value.signAspects.negativeAspects.includes(Number(signId));
  }, [value, signId]);

  const highlightedElementRef = useRef<HTMLDivElement>(null);

  const onHighlightedClick = useCallback(() => {
    if (!isSelected && value.targetAspectIndex) {
      setValue(() => ({
        ...value,
        targetAspectIndex: undefined
      }));
      return;
    }

    if (!value.targetAspectIndex && !isSelected && !value.selectedSector) {
      setValue((value) => ({
        ...value,
        selectedSector: signId
      }));
      return;
    }

    if (!value.targetAspectIndex && !isSelected && value.selectedSector) {
      setValue(() => ({
        ...value,
        selectedSector: undefined
      }));
      return;
    }

    if (!value.targetAspectIndex && isSelected) {
      setValue(() => ({
        ...value,
        selectedSector: undefined,
        targetAspectIndex: signId
      }));
    }
  }, [isSelected, setValue, signId, value]);


  const order = useMemo(() => {
    if (value.mapType === MapTypeEnum.North) {
      return house;
    }

    return signId;
  }, [signId, house, value.mapType]);

  const {
    isTranssaturnsActive,
    isArudhsActive,
    isMandyAndGulikaActive,
    isSpecialLagnaActive,
    isUpagrahsActive,
    isAspectsActive
  } = useGetIsHelpersElementsActive();

  const isPlanetAspectShowed = useMemo(() => {
    return isAspectsActive && 
      !(!isYearPickerActive && !isVarshpahalaLoading && location.pathname.includes(route + processorRoutes.varshapkhala)) &&
      !value.isTransit;
  }, [isAspectsActive, route, value.isTransit, isVarshpahalaLoading, isYearPickerActive, location]);
  
  const { gradientArudhs, targetArudhs, gradientLagnas, tagetLagnas } = useMemo(() => {
    const gradientArudhs = arudhs.filter((value) => ['AL', 'UL'].includes(value.name));
    const targetArudhs = arudhs.filter((value) => !['AL', 'UL'].includes(value.name));
    const gradientLagnas = specialLagna.filter((value) => ['Ghati Lagna', 'Sree Lagna', 'Hora Lagna'].includes(value.name));
    const tagetLagnas = specialLagna.filter((value) => !['Ghati Lagna', 'Sree Lagna', 'Hora Lagna'].includes(value.name));

    return { gradientArudhs, targetArudhs, gradientLagnas, tagetLagnas };
  }, [arudhs, specialLagna]);

  const sectorPosition = useMemo(() => {
    if (value.mapType === MapTypeEnum.South) {
      return SectorPosition.South;
    }
    
    return getSectorPosition(house);
  }, [house, value.mapType]);

  const renderType = useMemo(() => {
    return RendererType.Flex;
  }, [value.mapType]);

  const processorPlanetObject = useGetProcessorObject(ProcessorObjectType.House, order);

  const onIndexClick = useCallback(() => {
    dispatch(setTargetProcessorObject({
      ...processorPlanetObject,
      house: {
        house: order,
        sign: signId
      }
    }));
  }, [dispatch, processorPlanetObject, order, signId]);

  return (
    <div className={`sector sector-${order}`}>
      <ObjectsRenderer rendererType={renderType} sectorPosition={sectorPosition}>
        <MapSectorPlanets planets={primaryData} type={'main-info'} />
        {isPlanetAspectShowed && <MapSectorPlanets planets={planetsAspects} type={'aspects'} />}
        {isMunthaActive && (
          <h3 className={'mun'}>
            Mun
          </h3>
        )}
        {isTranssaturnsActive && <MapSectorPlanets planets={transsaturns} type={'transsaturns'} />}
        {isMandyAndGulikaActive && <MapSectorPlanets planets={mandyGulika} type={'mandyGulika'} />}
        {isSpecialLagnaActive && <MapSectorPlanets planets={gradientLagnas} type={'gradient'} />}
        {isSpecialLagnaActive && <MapSectorPlanets planets={tagetLagnas} type={'additional-info'} />}
        {isArudhsActive && <MapSectorPlanets planets={gradientArudhs} type={'gradient'} />}
        {isArudhsActive && <MapSectorPlanets planets={targetArudhs} type={'arudhs'} />}
        {isUpagrahsActive && <MapSectorPlanets planets={upagraha} type={'additional-info'} />}
      </ObjectsRenderer>
      <h3 className={'index'} onClick={onIndexClick}>
        {signId}
      </h3>
      <div
        onClick={onHighlightedClick}
        ref={highlightedElementRef}
        className={classNames('highlighted', {
          [styles.positiveAspect]: isPositiveAspect,
          [styles.negativeAspect]: isNegativeAspect,
          [styles.selected]: isSelected
        })}
      />
      {isSelected &&
        <Grid mb={'4px'} className={'map-house-btn'}>
          <Tappable disabled={false} onClick={onIndexClick}>
            <div>
              {`Дом ${house}`}
            </div>
          </Tappable>
        </Grid>
      }
      {isSelected && <div className={'aspectsHint'} onClick={onHighlightedClick}>
        <Grid m={'4px'}>
          <Tappable disabled={false}>
            <div>
              {isVarshaActive ? 'Аспекты' : 'Знаковые аспекты'}
            </div>
          </Tappable>
        </Grid>
      </div>}
      {!(value.mapType === MapTypeEnum.North) && Number(house) === 1 && (
        <img alt={'southMapMark'} src={southMapMark} className={styles.mark}/>
      )}
    </div>
  );
};

export default MapSector;
