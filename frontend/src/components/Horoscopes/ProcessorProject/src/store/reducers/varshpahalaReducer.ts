import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DashiTableRow } from '../../models/types/DashiTableRow';
import { YogaTableRow } from '../../models/types/YogaTable';
import { YearMasterTableRow } from '../../models/types/YearMasterTableRow';
import { MapOption } from '../../models/types/MapOption';
import { DegreeTable } from '../../models/types/DegreeTable';
import { Muntha } from '../../models/types/Muntha';
import { CurrentDeepSkyObject } from '../../models/types/CurrentDeepSkyObject';

interface VarshpahalaState {
  isVarshpahalaLoading: boolean,
  dashiTable: DashiTableRow[],
  yogasTable: YogaTableRow[],
  yearMasterTable: YearMasterTableRow [],
  yearMaster: string,
  varshpahalaDegreeTable: DegreeTable,
  isYearPickerActive: boolean,
  varshpahalaMaps: MapOption [],
  varshpahalaDate: string,
  muntkha: Muntha,
  isDeepSkyActive: boolean,
  deepSkyObjects: CurrentDeepSkyObject [],
}

const initialState = {
  isVarshpahalaLoading: false,
  dashiTable: [],
  yogasTable: [],
  yearMasterTable: [],
  yearMaster: '',
  varshpahalaDegreeTable: [],
  isYearPickerActive: true,
  varshpahalaMaps: [],
  varshpahalaDate: '',
  muntkha: [],
  isDeepSkyActive: false,
  deepSkyObjects: []
} as VarshpahalaState;

const varshpahalaReducer = createSlice({
  name: 'horoscope',
  initialState,
  reducers: {
    setDashiTable: (state, action: PayloadAction<DashiTableRow []>) => {
      state.dashiTable = action.payload;
    },
    setYogasTable: (state, action: PayloadAction<YogaTableRow []>) => {
      state.yogasTable = action.payload;
    },
    setYearMasterTable: (state, action: PayloadAction<YearMasterTableRow []>) => {
      state.yearMasterTable = action.payload;
    },
    setIsVarshpahalaLoading: (state, action: PayloadAction<boolean>) => {
      state.isVarshpahalaLoading = action.payload;
    },
    setYearMaster: (state, action: PayloadAction<string>) => {
      state.yearMaster = action.payload;
    },
    setVarshpahalaDegreeTable: (state, action: PayloadAction<DegreeTable>) => {
      state.varshpahalaDegreeTable = action.payload;
    },
    setIsYearPickerActive: (state, action: PayloadAction<boolean>) => {
      state.isYearPickerActive = action.payload;
    },
    setVarshpahalaMaps: (state, action: PayloadAction<MapOption []>) => {
      state.varshpahalaMaps = action.payload;
    },
    setVarshpahalaDate: (state, action: PayloadAction<string>) => {
      state.varshpahalaDate = action.payload;
    },
    setMuntkha: (state, action: PayloadAction<Muntha>) => {
      state.muntkha = action.payload;
    },
    toggleDeepSky: (state) => {
      state.isDeepSkyActive = !state.isDeepSkyActive;
    },
    setDeepSkyObjects: (state, action: PayloadAction<CurrentDeepSkyObject []>) => {
      state.deepSkyObjects = action.payload;
    },
    resetVarshpahala: () => initialState
  }
});

export const { setDashiTable, toggleDeepSky, setDeepSkyObjects, resetVarshpahala, setYogasTable, setYearMasterTable, setMuntkha, setVarshpahalaDate, setIsVarshpahalaLoading, setVarshpahalaMaps, setYearMaster, setVarshpahalaDegreeTable, setIsYearPickerActive } = varshpahalaReducer.actions;

export default varshpahalaReducer.reducer;
