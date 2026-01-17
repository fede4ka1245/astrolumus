import { useAppDispatch } from '../store/store';
import { setIsAppLoading } from '../store/reducers/preferencesReducer';
import { useGetCurrentHoroscopeId, useGetHoroscopeAddressInformation, useGetHoroscopeUserInfo } from '../store/selectors';
import { saveMyHoroscope } from '../api/savedHorsocopes';
import { useSnackbarAlert } from './useSnackbarAlert';
import { useCallback } from 'react';

export const useSaveCurrentHoroscope = () => {
  const dispatch = useAppDispatch();
  const id = useGetCurrentHoroscopeId();
  const user = useGetHoroscopeUserInfo();
  const address = useGetHoroscopeAddressInformation();
  const snackbarAlert = useSnackbarAlert();
  
  return useCallback(() => {
    if (!id) {
      snackbarAlert('Ошибка при сохранении гороскопа!');
      return;
    }

    dispatch(setIsAppLoading(true));

    return saveMyHoroscope({ id: Number(id), name: user.name, city: address.location.value })
      .then((data) => {
        snackbarAlert('Гороскоп сохранен!');
        return data;
      })
      .catch((error) => {
        console.log(error?.response);
        snackbarAlert('Ошибка при сохранении гороскопа!');
      })
      .finally(() => {
        dispatch(setIsAppLoading(false));
      });
  }, [address.location.value, dispatch, id, snackbarAlert, user.name]);
};
