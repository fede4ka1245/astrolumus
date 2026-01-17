import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getMapsOptions } from '../../helpers/getMapsOptions';
import { MapOption } from '../../models/types/MapOption';
import { AshtakavargaTable } from '../../models/types/AshtakavargaTable';
import { DegreeTable } from '../../models/types/DegreeTable';
import { HoroscopeAddress } from '../../models/types/HoroscopeAddress';
import { DashiReturnType } from '../../models/types/GetDashi';
import { HoroscopeUserInfo } from '../../models/types/HoroscopeUserInfo';
import { Option } from '../../models/types/Option';
import { getProcessorRoutes } from '../../pages/horoscopes/logic/getProcessorRoutes';
import { ProcessorObject, ProcessorObjectMap, ProcessorObjectType } from '../../pages/horoscopes/types';
import { ObjectDescriptionEvent, objectDescriptionEventBus } from '../../pages/horoscopes/objectDescription/store';

interface HoroscopeState {
  maps: Array<MapOption>,
  targetRoute: Option,
  targetMapValue: string,
  horoscopeUserInfo: HoroscopeUserInfo,
  dashiVim?: DashiReturnType,
  dashiChr?: DashiReturnType,
  isDashiChrPeriodLoading: boolean,
  isDashiChrLoading: boolean,
  isDashiVimLoading: boolean,
  ashtakavarga: AshtakavargaTable[],
  isAshtakavargaLoading: boolean,
  degreeTable: DegreeTable,
  addressInformation: HoroscopeAddress,
  isDegreeTableLoading: boolean,
  currentHoroscopeId: string | number,
  savedHoroscopeId: string | number,
  processorObjects: ProcessorObjectMap,
  targetProcessorObject?: ProcessorObject
}

const initialState: HoroscopeState = {
  maps: getMapsOptions(),
  targetMapValue: 'D-1',
  targetRoute: getProcessorRoutes()[0],
  horoscopeUserInfo: {
    name: '',
    date: '',
    time: ''
  },
  targetProcessorObject: undefined,
  processorObjects: {
    [ProcessorObjectType.Nakshatra]: {},
    [ProcessorObjectType.Sign]: {},
    [ProcessorObjectType.Planet]: {},
    [ProcessorObjectType.Karaka]: {},
    [ProcessorObjectType.Arudhs]: {},
    [ProcessorObjectType.House]: {}
  },
  dashiVim: undefined,
  dashiChr: undefined,
  isDegreeTableLoading: false,
  isDashiChrLoading: false,
  isDashiVimLoading: false,
  ashtakavarga: [],
  isAshtakavargaLoading: false,
  degreeTable: [],
  isDashiChrPeriodLoading: false,
  addressInformation: {
    timeZone: {
      hours: '',
      minutes: '',
      greenwich: ''
    },
    coordinates: {
      longitude: '',
      latitude: ''
    },
    location: {
      value: '',
      key: ''
    }
  },
  currentHoroscopeId: '',
  savedHoroscopeId: ''
} as HoroscopeState;

export const horoscopesSlice = createSlice({
  name: 'horoscope-v1',
  initialState,
  reducers: {
    setMaps: (state, action) => {
      state.maps = action.payload;
    },
    setTargetMapValue: (state, action) => {
      state.targetMapValue = action.payload;
    },
    setHoroscopeUserInfo: (state, action: PayloadAction<HoroscopeUserInfo>) => {
      state.horoscopeUserInfo = action.payload;
    },
    setSavedHoroscopeId: (state, action: PayloadAction<number>) => {
      state.savedHoroscopeId = action.payload;
    },
    setDashiVim: (state, action: PayloadAction<DashiReturnType | undefined>) => {
      state.dashiVim = action.payload;
    },
    setProcessorObjects: (state, action: PayloadAction<ProcessorObjectMap>) => {
      state.processorObjects = action.payload;
    },
    setDashiChr: (state, action: PayloadAction<DashiReturnType | undefined>) => {
      state.dashiChr = action.payload;
    },
    setIsChrDashiLoading: (state, action: PayloadAction<boolean>) => {
      state.isDashiChrLoading = action.payload;
    },
    setIsVimDashiLoading: (state, action: PayloadAction<boolean>) => {
      state.isDashiVimLoading = action.payload;
    },
    setAshtakavarga: (state, action: PayloadAction<AshtakavargaTable[]>) => {
      state.ashtakavarga = action.payload;
    },
    setIsAshtakavargaLoading: (state, action: PayloadAction<boolean>) => {
      state.isAshtakavargaLoading = action.payload;
    },
    setDegreeTable: (state, action: PayloadAction<DegreeTable>) => {
      state.degreeTable = action.payload;
    },
    setIsDashiChrPeriodLoading: (state, action: PayloadAction<boolean>) => {
      state.isDashiChrPeriodLoading = action.payload;
    },
    setAddressInformation: (state, action: PayloadAction<HoroscopeAddress>) => {
      state.addressInformation = action.payload;
    },
    setIsDegreeTableLoading: (state, action: PayloadAction<boolean>) => {
      state.isDegreeTableLoading = action.payload;
    },
    setTargetProcessorObject: (state, action: PayloadAction<ProcessorObject | undefined>) => {
      setTimeout(() => {
        objectDescriptionEventBus.emit(ObjectDescriptionEvent.openDescription, null, { object: action.payload });
      }, 0);
    },
    setCurrentHoroscopeId: (state, action: PayloadAction<string | number>) => {
      state.currentHoroscopeId = action.payload;
    },
    setProcessorTargetRoute: (state, action: PayloadAction<Option>) => {
      state.targetRoute = action.payload;
    },
    resetHoroscopes: () => {
      return { ...initialState, targetMapValue: 'D-1' };
    }
  }
});

export const { setMaps, setTargetProcessorObject, setProcessorObjects, setProcessorTargetRoute, setSavedHoroscopeId, setCurrentHoroscopeId, resetHoroscopes, setTargetMapValue, setAddressInformation, setIsDashiChrPeriodLoading, setDegreeTable, setHoroscopeUserInfo, setDashiVim, setDashiChr, setIsChrDashiLoading, setIsVimDashiLoading, setAshtakavarga, setIsAshtakavargaLoading } = horoscopesSlice.actions;

export default horoscopesSlice.reducer;
