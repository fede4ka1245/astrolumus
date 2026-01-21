import { useCallback, useEffect, useMemo, useState } from 'react';
import northMap from './assets/northMap.png';
import southMap from './assets/southMap.svg';
import deepSkyNorthMap from './assets/deepSkyNorthMap.png';
import deepSkySouthMap from './assets/deepSkySouthMap.png';
import { MapSection } from '../../models/types/MapSection';
import classNames from 'classnames';
import MapSector from './mapSector/MapSector';
import './SouthMap.scss';
import './NorthMap.scss';
import { MapTypeEnum } from '../../models/types/MapType';
import './Map.scss';
import MapSectorPlanets from './mapSectorPlanets/MapSectorPlanets';
import { MapContext } from './mapContext';
import { AspectType, MapContextValue, MapProps, TargetMapSections } from './types';
import { getSignAspects } from './helpers/getSignAspects';
import { getVarshaSignAspects } from './helpers/getVarshaSignAspects';
import AspectRatio from '@mui/joy/AspectRatio';
import { useInView } from 'react-intersection-observer';

const Map = ({ mapSections, isTransit, mapTransitSections, targetMapValue, mapName, aspectType = AspectType.SignApsects, mapType = MapTypeEnum.North }: MapProps) => {
  const formattedMapSections = useMemo(() => {
    if (!mapSections) {
      return;
    }

    if (mapType === MapTypeEnum.North) {
      return [...mapSections]?.sort((a, b) => Number(a?.house) - Number(b?.house));
    }

    return [...mapSections]?.sort((a, b) => Number(a?.house) - Number(b?.house));
  }, [mapSections, mapType]);

  const formattedMapTransitSections = useMemo(() => {
    if (!mapTransitSections) {
      return;
    }

    if (mapType === MapTypeEnum.North) {
      return [...mapTransitSections]?.sort((a, b) => Number(a?.house) - Number(b?.house));
    }

    return [...mapTransitSections]?.sort((a, b) => Number(a?.signId) - Number(b?.signId));
  }, [mapTransitSections, mapType]);

  const getTransitHouse = useCallback((sighId: number) => {
    if (!formattedMapSections) {
      return sighId;
    }

    if (mapType === MapTypeEnum.South) {
      return sighId;
    }
    
    return formattedMapSections?.find((section) => section.signId === sighId)?.house || sighId;
  }, [formattedMapSections, mapType]);

  const formatTransitSection = useCallback((mapSection: MapSection) => {
    return [...mapSection.primaryData, ...mapSection.transsaturns]
      .filter(({ name }) => {
        return name !== 'Ascendant';
      });
  }, []);

  const [mapValue, setMapValue] = useState<MapContextValue>({
    isDeepSkyActive: true, // Включаем темный режим по умолчанию
    isTransit: Boolean(isTransit),
    mapName: mapName || 'D-1',
    aspectsType: aspectType,
    mapType: MapTypeEnum.North,
    signAspects: {
      positiveAspects: [],
      negativeAspects: []
    },
    targetAspectIndex: undefined,
    targetMapValue: targetMapValue || 'D-1',
    selectedSector: undefined
  });

  useEffect(() => {
    setMapValue((value) => ({
      ...value,
      aspectType,
      mapType,
      targetMapValue: targetMapValue as string,
      isTransit: Boolean(isTransit)
    }));
  }, [aspectType, mapType, targetMapValue, isTransit]);

  useEffect(() => {
    if (!mapValue.targetAspectIndex) {
      return;
    }

    if (aspectType === AspectType.VarhaSignAspects) {
      setMapValue((mapValue) => ({
        ...mapValue,
        signAspects: getVarshaSignAspects(mapValue.targetAspectIndex || 0)
      }));
      return;
    }
    
    setMapValue((mapValue) => ({
      ...mapValue,
      signAspects: getSignAspects(mapValue.targetAspectIndex || 0)
    }));
  }, [mapValue.targetAspectIndex, aspectType]);

  const targetSections = useMemo<TargetMapSections>(() => {
    if (!formattedMapTransitSections?.length && !isTransit) {
      return TargetMapSections.Sections;
    } else if (!!formattedMapTransitSections?.length && isTransit) {
      return TargetMapSections.SectionsMergetTransitionSections;
    } else {
      return TargetMapSections.TransitionsSections;
    }
  }, [formattedMapTransitSections, isTransit]);

  const { ref, inView } = useInView({
    delay: 200
  });

  return (
    <MapContext.Provider value={{
      value: mapValue,
      setValue: setMapValue
    }}>
      <section
        ref={ref}
        className={classNames('map', {
          'deep-sky': mapValue.isDeepSkyActive,
          'transit-north': isTransit && mapValue.mapType === MapTypeEnum.North,
          'transit-south': isTransit && mapValue.mapType !== MapTypeEnum.North,
          'astro-processor-north-map': mapValue.mapType === MapTypeEnum.North,
          'astro-processor-south-map': mapValue.mapType !== MapTypeEnum.North
        })}
      >
        <div className={'blur'}/>
        <div>
          <AspectRatio ratio={1} sx={{ background: 'none' }} className={'aspect-ratio-map-image'}>
            { mapValue.mapType !== MapTypeEnum.North && (
              <img 
                src={southMap} 
                alt="South Map" 
                className={'image'}
              />
            ) }
            { mapValue.mapType === MapTypeEnum.North && (
              <img 
                src={northMap} 
                alt="North Map" 
                className={'image'}
              />
            ) }
          </AspectRatio>
        </div>
        {inView && <>
          {targetSections === TargetMapSections.Sections &&
            formattedMapSections?.map((mapSection, index) => (
              <MapSector
                key={index}
                mapSection={mapSection}
              />
            ))}
          {targetSections === TargetMapSections.SectionsMergetTransitionSections && <>
            {formattedMapSections?.map((mapSection, index) => (
              <MapSector
                key={index}
                mapSection={mapSection}
              />
            ))}
            {formattedMapTransitSections?.map((mapSection) => (
              <div
                key={mapSection.signId}
                className={`transited-sector transited-sector-${getTransitHouse(mapSection.signId)}`}
              >
                <MapSectorPlanets planets={formatTransitSection(mapSection)} type={'transition'} />
              </div>
            ))}
          </>}
          {targetSections === TargetMapSections.TransitionsSections &&
            formattedMapTransitSections?.map((mapSection, index) => (
              <MapSector
                key={index}
                mapSection={mapSection}
              />
            ))}
        </>}
      </section>
    </MapContext.Provider>
  );
};

export default Map;
