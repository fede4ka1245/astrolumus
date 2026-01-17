import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { getPaymentSettings } from '../api/getPaymentSettings';
import { useAppDispatch } from '../store/store';
import { setIsPaymentsEnabled } from '../store/reducers/preferencesReducer';

export const useLoadPaymentSettings = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const platform = Capacitor.getPlatform() as 'ios' | 'android' | 'web';

    getPaymentSettings(platform)
      .then((res) => {
        console.log('res', res);
        dispatch(setIsPaymentsEnabled(res.enabled));
      })
      .catch(() => {
        dispatch(setIsPaymentsEnabled(true));
      });
  }, []);
};

