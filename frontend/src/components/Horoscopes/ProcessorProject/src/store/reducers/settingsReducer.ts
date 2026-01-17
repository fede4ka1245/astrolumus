import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MapType } from '../../models/types/MapType';
import { HoroscopeHelpersElements } from '../../models/enums/HoroscopeHelpersElements';
import { Language } from '../../models/enums/Language';
import { AddressLocation } from '../../models/types/HoroscopeAddress';

interface settingsState {
  mapType: MapType,
  helpersElements: HoroscopeHelpersElements [],
  language: Language,
  isEarthActive: boolean,
  arudha: number,
  defaultLocation: AddressLocation
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    mapType: 'NORTH',
    helpersElements: [HoroscopeHelpersElements.Arudhs, HoroscopeHelpersElements.MandyAndGulika, HoroscopeHelpersElements.Transsaturns, HoroscopeHelpersElements.SpecialLagna],
    language: Language.Eng,
    isEarthActive: true,
    arudha: 1,
    defaultLocation: {
      key: '2591,JMC,37e37,55n45',
      value: 'Москва, Московская обл., Россия, 37e37, 55n45'
    }
  } as settingsState,
  reducers: {
    setMapType: (state, action: PayloadAction<MapType>) => {
      state.mapType = action.payload;
    },
    setDefaultLocation: (state, action: PayloadAction<AddressLocation>) => {
      state.defaultLocation = action.payload;
    },
    setHelpersElements: (state, action: PayloadAction<HoroscopeHelpersElements []>) => {
      state.helpersElements = action.payload;
    },
    addHelpersElement: (state, action: PayloadAction<HoroscopeHelpersElements>) => {
      state.helpersElements = [...state.helpersElements, action.payload];
    },
    removeHelperElement: (state, action: PayloadAction<HoroscopeHelpersElements>) => {
      state.helpersElements = [...state.helpersElements].filter((element) => element !== action.payload);
    },
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
    },
    toggleEarth: (state) => {
      state.isEarthActive = !state.isEarthActive;
    },
    setIsEarthActive: (state, action: PayloadAction<boolean>) => {
      state.isEarthActive = action.payload;
    },
    setArudha: (state, action: PayloadAction<number>) => {
      state.arudha = action.payload;
    }
  }
});

export const { setMapType, setDefaultLocation, setLanguage, setHelpersElements, setIsEarthActive, setArudha } = settingsSlice.actions;

export default settingsSlice.reducer;
