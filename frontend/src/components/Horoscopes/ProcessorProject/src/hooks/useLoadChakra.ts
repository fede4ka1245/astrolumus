/* eslint-disable */
// @ts-nocheck
import { useGetHoroscopeUserInfo } from '../store/selectors';
import { useAppDispatch } from '../store/store';
import { useCallback } from 'react';
import { setIsAppLoading } from '../store/reducers/preferencesReducer';
import { getChakra } from '../api/getChakra';
import { SavatobhadraTableRow } from '../models/types/SavatobhadraTableRow';
import { ChakraType } from '../models/enums/ChakraType';
import { Zone } from '../models/types/Zone';

export const useOnLoadChakra = (chakra: ChakraType, onLoad?: (chakra: SavatobhadraTableRow[] | Zone[]) => any) => {
  const horoscopeData = useGetHoroscopeUserInfo();
  const dispatch = useAppDispatch();

  return useCallback(({
    chakraDate,
    chakraTime,
    chakraHours,
    chakraMinutes,
    chakraGreenwich,
    nakshatraStartPoint,
    startPoint
  }: any) => {
    dispatch(setIsAppLoading(true));

    getChakra({
      horoscopeData,
      chakraDate,
      chakraTime,
      chakraHours,
      chakraMinutes,
      chakraGreenwich,
      chakra,
      nakshatraStartPoint,
      startPoint
    }).then((chakra) => {
      if (onLoad) {
        onLoad(chakra);
      }
    }).finally(() => {
      dispatch(setIsAppLoading(false));
    });
  }, [horoscopeData, chakra, onLoad]);
};
