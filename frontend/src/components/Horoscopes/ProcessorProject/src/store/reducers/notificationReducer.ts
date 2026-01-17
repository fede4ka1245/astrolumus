import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IInitialState {
  hasNewMessages: boolean
}

const notificationReducer = createSlice({
  name: 'settings',
  initialState: {
    hasNewMessages: false
  } as IInitialState,
  reducers: {
    setHasNewMessages: (state, action: PayloadAction<boolean>) => {
      state.hasNewMessages = action.payload;
    }
  }
});

export const { setHasNewMessages } = notificationReducer.actions;

export default notificationReducer.reducer;
