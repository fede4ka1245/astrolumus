import { getMapsOptions } from '../../helpers/getMapsOptions';
import { MapOption } from '../../models/types/MapOption';
import { DegreeTable } from '../../models/types/DegreeTable';
import { HoroscopeAddress } from '../../models/types/HoroscopeAddress';
import { DashiReturnType } from '../../models/types/GetDashi';
import { HoroscopeUserInfo } from '../../models/types/HoroscopeUserInfo';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AshtakavargaTable } from '../../models/types/AshtakavargaTable';

interface RectificationState {
  maps: Array<MapOption>,
  horoscopeUserInfo: HoroscopeUserInfo,
  dashiVim?: DashiReturnType,
  dashiChr?: DashiReturnType,
  isDashiChrPeriodLoading: boolean,
  isDashiChrLoading: boolean,
  isDashiVimLoading: boolean,
  degreeTable: DegreeTable,
  addressInformation: HoroscopeAddress,
  isDegreeTableLoading: boolean,
  ashtakavarga: AshtakavargaTable[],
  isAshtakavargaLoading: boolean,
}

const initialState: RectificationState = {
  maps: getMapsOptions(),
  targetMapValue: getMapsOptions()[0].value,
  horoscopeUserInfo: {
    name: '',
    date: '',
    time: ''
  },
  dashiVim: undefined,
  dashiChr: undefined,
  isDegreeTableLoading: false,
  isDashiChrLoading: false,
  isDashiVimLoading: false,
  degreeTable: [],
  isDashiChrPeriodLoading: false,
  ashtakavarga: [],
  isAshtakavargaLoading: false,
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
  }
} as RectificationState;

export const horoscopesSlice = createSlice({
  name: 'horoscope',
  initialState,
  reducers: {
    setRectificationMaps: (state, action) => {
      state.maps = action.payload;
    },
    setRectificationUserInfo: (state, action: PayloadAction<HoroscopeUserInfo>) => {
      state.horoscopeUserInfo = action.payload;
    },
    setRectificationDashiVim: (state, action: PayloadAction<DashiReturnType>) => {
      state.dashiVim = action.payload;
    },
    setRectificationDashiChr: (state, action: PayloadAction<DashiReturnType>) => {
      state.dashiChr = action.payload;
    },
    setIsRectificationChrDashiLoading: (state, action: PayloadAction<boolean>) => {
      state.isDashiChrLoading = action.payload;
    },
    setIsRectificationVimDashiLoading: (state, action: PayloadAction<boolean>) => {
      state.isDashiVimLoading = action.payload;
    },
    setRectificationDegreeTable: (state, action: PayloadAction<DegreeTable>) => {
      state.degreeTable = action.payload;
    },
    setIsRectificationDashiChrPeriodLoading: (state, action: PayloadAction<boolean>) => {
      state.isDashiChrPeriodLoading = action.payload;
    },
    setRectificationAddressInformation: (state, action: PayloadAction<HoroscopeAddress>) => {
      state.addressInformation = action.payload;
    },
    setRectificationDegreeTableLoading: (state, action: PayloadAction<boolean>) => {
      state.isDegreeTableLoading = action.payload;
    },
    setAshtakavarga: (state, action: PayloadAction<AshtakavargaTable[]>) => {
      state.ashtakavarga = action.payload;
    },
    setIsAshtakavargaLoading: (state, action: PayloadAction<boolean>) => {
      state.isAshtakavargaLoading = action.payload;
    },
    resetRectification: () => initialState
  }
});

export const { setRectificationMaps, resetRectification, setAshtakavarga, setIsAshtakavargaLoading, setRectificationDegreeTableLoading, setRectificationAddressInformation, setIsRectificationDashiChrPeriodLoading, setRectificationDegreeTable, setRectificationUserInfo, setRectificationDashiVim, setRectificationDashiChr, setIsRectificationChrDashiLoading, setIsRectificationVimDashiLoading } = horoscopesSlice.actions;

export default horoscopesSlice.reducer;
