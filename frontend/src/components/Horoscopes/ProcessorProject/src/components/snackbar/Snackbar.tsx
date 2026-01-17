import React, { useCallback } from 'react';
import { useGetIsSnackbarOpen, useGetSnackbarText } from '../../store/selectors';
import { Snackbar as MuiSnackbar } from '@mui/material';
import { useAppDispatch } from '../../store/store';
import { setIsSnackbarOpen } from '../../store/reducers/preferencesReducer';

const Snackbar = () => {
  const isSnackbarOpen = useGetIsSnackbarOpen();
  const text = useGetSnackbarText();
  const dispatch = useAppDispatch();
  
  const onClose = useCallback(() => {
    dispatch(setIsSnackbarOpen(false));
  }, []);

  return (
    <MuiSnackbar
      open={isSnackbarOpen}
      autoHideDuration={2500}
      onClose={onClose}
      message={text}
    />
  );
};

export default Snackbar;
