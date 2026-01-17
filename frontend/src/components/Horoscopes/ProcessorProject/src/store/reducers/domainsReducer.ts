import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DomainConfig } from '../../api/getDomains';

interface DomainsState {
  currentDomain: DomainConfig | null;
  availableDomains: DomainConfig[];
  isLoading: boolean;
  isInitialized: boolean;
}

const initialState: DomainsState = {
  currentDomain: null,
  availableDomains: [],
  isLoading: false,
  isInitialized: false
};

const domainsSlice = createSlice({
  name: 'domains',
  initialState,
  reducers: {
    setCurrentDomain: (state, action: PayloadAction<DomainConfig>) => {
      state.currentDomain = action.payload;
      state.isInitialized = true;
    },
    setAvailableDomains: (state, action: PayloadAction<DomainConfig[]>) => {
      state.availableDomains = action.payload;
    },
    setDomainsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    resetDomains: () => initialState
  }
});

export const { 
  setCurrentDomain, 
  setAvailableDomains, 
  setDomainsLoading,
  resetDomains
} = domainsSlice.actions;

export default domainsSlice.reducer;
