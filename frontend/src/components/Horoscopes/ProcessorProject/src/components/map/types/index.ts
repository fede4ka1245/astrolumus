import { MapSection } from '../../../models/types/MapSection';
import { MapType } from '../../../models/types/MapType';
import { SignAspects } from '../../../models/types/SignAspects';

export enum AspectType {
  VarhaSignAspects,
  SignApsects
}

export interface MapProps {
  mapSections?: Array<MapSection>,
  isTransit?: boolean,
  mapTransitSections?: Array<MapSection>,
  mapName?: string,
  aspectType?: AspectType,
  mapType?: MapType,
  targetMapValue?: string
}

export enum TargetMapSections {
  Sections,
  SectionsMergetTransitionSections,
  TransitionsSections
}

export interface MapContextValue {
  isDeepSkyActive: boolean,
  isTransit: boolean,
  mapName: string,
  aspectsType: AspectType,
  mapType: MapType,
  signAspects: SignAspects,
  targetAspectIndex: number | undefined,
  targetMapValue: string,
  selectedSector: number | undefined
}

type setValue = (value: MapContextValue) => any

export interface MapContextType {
  value: MapContextValue,
  setValue: (value: MapContextValue | setValue) => any
}
