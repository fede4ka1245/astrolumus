// @ts-nocheck
import { useAppDispatch } from '../store/store';
import { SavedHoroscope } from '../models/types/SavedHoroscopes';
import { saveHoroscope } from '../store/reducers/savedHoroscopesReducer';
import { useGetHoroscopeAddressInformation, useGetHoroscopeUserInfo, useGetSavedHoroscopes } from '../store/selectors';
import { useCallback } from 'react';
import lodash from 'lodash';

export const useSaveHoroscope = () => {
  const dispatch = useAppDispatch();
  const horoscopes = useGetSavedHoroscopes();
  const horoscopeInfo = useGetHoroscopeUserInfo();
  const addressInfo = useGetHoroscopeAddressInformation();

  return useCallback(() => {
    if (!horoscopeInfo || !addressInfo) {
      return;
    }

    const horoscope: SavedHoroscope = {
      horoscopeInfo,
      addressInfo
    };

    for (const _horoscope in horoscopes) {
      if (lodash.isEqual(_horoscope, horoscope)) {
        return;
      }
    }

    dispatch(saveHoroscope(horoscope));
  }, [dispatch, saveHoroscope, horoscopes, addressInfo, horoscopeInfo]);
};
