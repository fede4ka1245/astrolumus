import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { IUserFile, IUserMe, IUserProfile } from '../../models/interfaces/user';
import { userFilesApi, userInfoApi, userProfileApi } from '../../api/user';
import authRequest from '../../api/authRequest';
import { setIsAppLoading } from './preferencesReducer';
import { UserFileTypes } from '../../models/enums/user';
import { infoApi } from '../../api/info';
import { IInfo } from '../../models/interfaces/info';

interface IState {
  userInfo: IUserMe,
  appInfo: IInfo
}

const initialState: IState = {
  userInfo: {
    id: 0,
    first_name: '',
    last_name: '',
    birth_date: '',
    email: '',
    avatar: null,
    about: '',
    likes_count: 0
  },
  appInfo: {
    id: 0,
    whatsapp: '',
    telegram_direct: '',
    telegram: '',
    viber: '',
    youtube_alpha: '',
    youtube_deep_sky: '',
    email: ''
  }

};

export const getUserShortInfo = createAsyncThunk(
  'user/getUserShortInfo',
  async (params: object | undefined, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setIsAppLoading(true));
      const res = await authRequest.get(userInfoApi(), { params });
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    } finally {
      dispatch(setIsAppLoading(false));
    }
  }); 

export const getAppInfo = createAsyncThunk(
  'user/getAppInfo',
  async (params: object | undefined, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setIsAppLoading(true));
      const res = await authRequest.get(infoApi());
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    } finally {
      dispatch(setIsAppLoading(false));
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<IUserProfile>) => {
      state.userInfo = action.payload;
    },
    clearUserInfo: (state) => {
      state.userInfo = initialState.userInfo;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getUserShortInfo.fulfilled, (state, action: PayloadAction<IUserProfile>) => {
      state.userInfo = action.payload;
    });
    builder.addCase(getAppInfo.fulfilled, (state, action: PayloadAction<IInfo>) => {
      state.appInfo = action.payload;
    });
  }
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;

export default userSlice.reducer;
