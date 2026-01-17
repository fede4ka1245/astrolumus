import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface preferencesState {
  isNavbarActive: boolean,
  isAppLoading: boolean,
  contentRef?: HTMLElement,
  isAuthenticated: boolean,
  isSnackbarOpen: boolean,
  snackbarText: string,
  appAccess: {
    isForumRestricted: boolean,
    isAstroprocessorRestricted: boolean
  },
  warnInfo: {
    title: string,
    text: string,
    isActive: boolean
  },
  isNewUser: boolean,
  isPaymentsEnabled: boolean
}

export const preferencesSlice = createSlice({
  name: 'app',
  initialState: {
    isNavbarActive: true,
    isAppLoading: false,
    isAuthenticated: false,
    contentRef: undefined,
    snackbarText: '',
    isSnackbarOpen: false,
    appAccess: {
      isForumRestricted: false,
      isAstroprocessorRestricted: false
    },
    warnInfo: {
      title: '',
      text: '',
      isActive: false
    },
    isNewUser: false,
    isPaymentsEnabled: true
  } as preferencesState,
  reducers: {
    setIsNavbarActive: (state, action: PayloadAction<boolean>) => {
      state.isNavbarActive = action.payload;
    },
    setIsNewUser: (state, action: PayloadAction<boolean>) => {
      state.isNewUser = action.payload;
    },
    setWarnInfo: (state, action: PayloadAction<{
      title: '',
      text: '',
      isActive: false
    }>) => {
      state.warnInfo = action.payload;
    },
    setAppAccess: (state, action: PayloadAction<{
      isForumRestricted: boolean,
      isAstroprocessorRestricted: boolean
    }>) => {
      state.appAccess = action.payload;
    },
    setIsAppLoading: (state, action: PayloadAction<boolean>) => {
      state.isAppLoading = action.payload;
    },
    setContentRef: (state, action: PayloadAction<any>) => {
      state.contentRef = action.payload;
    },
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setSnackbarText: (state, action: PayloadAction<string>) => {
      state.snackbarText = action.payload;
    },
    setIsSnackbarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSnackbarOpen = action.payload;
    },
    setIsPaymentsEnabled: (state, action: PayloadAction<boolean>) => {
      state.isPaymentsEnabled = action.payload;
    }
  }
});

export const { setIsNavbarActive, setIsNewUser, setWarnInfo, setAppAccess, setSnackbarText, setIsSnackbarOpen, setIsAppLoading, setContentRef, setIsAuthenticated, setIsPaymentsEnabled } = preferencesSlice.actions;

export default preferencesSlice.reducer;
