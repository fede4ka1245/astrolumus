import { MapTypeEnum } from '../../../models/types/MapType';
import React from 'react';
import { AspectType, MapContextType } from '../types';

export const MapContext = React.createContext<MapContextType>({
  value: {
    isDeepSkyActive: false,
    isTransit: false,
    mapName: 'D-1',
    aspectsType: AspectType.SignApsects,
    mapType: MapTypeEnum.North,
    signAspects: {
      positiveAspects: [],
      negativeAspects: []
    },
    targetAspectIndex: undefined,
    targetMapValue: 'D-1',
    selectedSector: undefined
  },
  setValue: () => {}
});
