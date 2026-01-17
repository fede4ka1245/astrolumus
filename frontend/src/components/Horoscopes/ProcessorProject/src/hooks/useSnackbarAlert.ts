import { useAppDispatch } from '../store/store';
import { setIsSnackbarOpen, setSnackbarText } from '../store/reducers/preferencesReducer';
import { useCallback } from 'react';

export const useSnackbarAlert = () => {
  const dispatch = useAppDispatch();
  
  return useCallback((text: string) => {
    dispatch(setSnackbarText(text));
    dispatch(setIsSnackbarOpen(true));
  }, [dispatch]);
};
