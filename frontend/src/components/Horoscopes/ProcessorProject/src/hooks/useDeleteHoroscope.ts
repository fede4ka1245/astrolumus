import { useAppDispatch } from '../store/store';
import { setSavedHoroscopes } from '../store/reducers/savedHoroscopesReducer';
import { removeMyHoroscope } from '../api/savedHorsocopes';
import { setIsAppLoading } from '../store/reducers/preferencesReducer';
import { useGetSavedHoroscopes } from '../store/selectors';
import { useCallback } from 'react';

export const useDeleteHoroscope = () => {
  const dispatch = useAppDispatch();
  const horoscopes = useGetSavedHoroscopes();

  return useCallback((id: number) => {
    dispatch(setIsAppLoading(true));
    removeMyHoroscope(id)
      .then(() => {
        dispatch(setSavedHoroscopes(horoscopes.filter((horoscope) => horoscope.id !== id)));
      })
      .finally(() => {
        dispatch(setIsAppLoading(false));
      });
  }, [dispatch, horoscopes]);
};
