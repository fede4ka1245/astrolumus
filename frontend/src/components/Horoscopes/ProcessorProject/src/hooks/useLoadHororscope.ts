import { setIsAppLoading } from '../store/reducers/preferencesReducer';
import {
  setAddressInformation as setGlobalStateAddress,
  setAshtakavarga,
  setDashiVim, setHoroscopeUserInfo, setMaps, setDegreeTable, setCurrentHoroscopeId, setProcessorObjects
} from '../store/reducers/horoscopesReducer';
import { useAppDispatch, useAppSelector } from '../store/store';
import { useCallback } from 'react';
import { CountHoroscopeProps } from '../models/types/CountHoroscopeProps';
import { countHoroscope } from '../api/countHoroscope';
import { cacheHoroscope } from '../api/savedHorsocopes';
import { useClearHoroscope } from './useClearHoroscope';
import { getProcessorObjects } from '../pages/horoscopes/api/getProcessorObjects';

export const useLoadHoroscopes = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state?.horoscopeSettings);
  const clearHoroscope = useClearHoroscope();

  return useCallback(({ address, userInfo, activateLoader = true, isCaching = true, resetHoroscopeData = true }: CountHoroscopeProps) => {
    if (activateLoader) {
      dispatch(setIsAppLoading(true));
    }

    return countHoroscope({ address, userInfo, settings })
      .then(({ maps, degreeTable, dashiVim, ashtakavarga, data }) => {
        if (resetHoroscopeData) {
          clearHoroscope();
        }
        dispatch(setGlobalStateAddress(address));
        dispatch(setHoroscopeUserInfo(userInfo));
        dispatch(setDegreeTable(degreeTable));
        dispatch(setMaps(maps));
        dispatch(setDashiVim(dashiVim));
        dispatch(setAshtakavarga(ashtakavarga));

        const settingsStr = [...Object.values(settings)];

        if (address.isCustomCoordinates) {
          settingsStr.push('customCoordinates');
        }

        if (isCaching) {
          cacheHoroscope({ address, userInfo, horoscope: data, settings: settingsStr.join(',') })
            .then(({ id }) => {
              dispatch(setCurrentHoroscopeId(id));
            });
        }

        return getProcessorObjects();
      })
      .then((objects) => {
        dispatch(setProcessorObjects(objects));
      })
      .finally(() => {
        if (activateLoader) {
          dispatch(setIsAppLoading(false));
        }
      });
  }, [settings, clearHoroscope, dispatch]);
};
