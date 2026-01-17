import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ArudhaScheme, Aynamsa, DasaYearLength, KarakaScheme, NodeScheme } from '../../helpers/horoscopeSettings';

export interface HoroscopeSettings {
  aynamsa: Aynamsa,
  yearLength: DasaYearLength,
  charaKarakCount: KarakaScheme,
  arudhasCount: ArudhaScheme,
  nodeScheme: NodeScheme,
  vargaHora: string,
  vargaDrekkana: string,
}

const initialState: HoroscopeSettings = {
  aynamsa: Aynamsa.lahiri,
  yearLength: DasaYearLength.meanSideral,
  charaKarakCount: KarakaScheme.knrao,
  arudhasCount: ArudhaScheme.knrao,
  nodeScheme: NodeScheme.true,
  vargaHora: 'samasaptaka',
  vargaDrekkana: 'jagannatha'
};

const horoscopeSettingsReducer = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setAynamsa: (state, action: PayloadAction<Aynamsa>) => {
      state.aynamsa = action.payload;
    },
    setYearLength: (state, action: PayloadAction<DasaYearLength>) => {
      state.yearLength = action.payload;
    },
    setCharaKarakCount: (state, action: PayloadAction<KarakaScheme>) => {
      state.charaKarakCount = action.payload;
    },
    setArudhasCount: (state, action: PayloadAction<ArudhaScheme>) => {
      state.arudhasCount = action.payload;
    },
    setNodeScheme: (state, action: PayloadAction<NodeScheme>) => {
      state.nodeScheme = action.payload;
    },
    updateMainSettings: (state, action: PayloadAction<HoroscopeSettings>) => {
      return action.payload;
    }
  }
});

export const { updateMainSettings, setAynamsa, setYearLength, setCharaKarakCount, setArudhasCount, setNodeScheme } = horoscopeSettingsReducer.actions;

export default horoscopeSettingsReducer.reducer;
