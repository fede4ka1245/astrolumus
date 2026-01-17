import { useEffect } from 'react';
import { useGetIsAuthenticated } from '../store/selectors';
import { getSettings } from '../api/getSettings';
import { useAppDispatch } from '../store/store';
import { setArudha, setLanguage } from '../store/reducers/settingsReducer';

export const useLoadSettings = () => {
  const isAuthenticated = useGetIsAuthenticated();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    getSettings()
      .then((res) => {
        dispatch(setLanguage(res.language));
        dispatch(setArudha(res.arudha));
      });
  }, [isAuthenticated]);
};
