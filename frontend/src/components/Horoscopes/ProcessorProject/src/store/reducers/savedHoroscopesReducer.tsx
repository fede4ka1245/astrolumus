import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SavedHoroscope } from '../../models/types/SavedHoroscopes';

interface SavedHoroscopesState {
  savedHoroscopes: SavedHoroscope [],
  currentSavedHoroscope?: SavedHoroscope
}

const savedHoroscopesReducer = createSlice({
  name: 'savedHoroscopes',
  initialState: {
    savedHoroscopes: [],
    currentSavedHoroscope: undefined
  } as SavedHoroscopesState,
  reducers: {
    setSavedHoroscopes: (state, action: PayloadAction<SavedHoroscope []>) => {
      state.savedHoroscopes = action.payload;
    },
    saveHoroscope: (state, action: PayloadAction<SavedHoroscope>) => {
      state.savedHoroscopes = [...state.savedHoroscopes, action.payload];
    },
    setCurrentSavedHoroscope: (state, action: PayloadAction<SavedHoroscope | undefined>) => {
      state.currentSavedHoroscope = action.payload;
    }
  }
});

export const { setSavedHoroscopes, setCurrentSavedHoroscope, saveHoroscope } = savedHoroscopesReducer.actions;

export default savedHoroscopesReducer.reducer;
