import { useAppDispatch } from '../store/store';
import { useEffect, useRef } from 'react';
import authRequest from '../api/authRequest';
import { setAppAccess } from '../store/reducers/preferencesReducer';

export const useAccessUpdate = () => {
  const dispatch = useAppDispatch();
  const interval = useRef<any>();

  useEffect(() => {
    interval.current = setInterval(() => {
      authRequest.get(`${import.meta.env.VITE_APP_API_URL}/users/current-user-rights/`)
        .then(({ data }) => {
          dispatch(setAppAccess({
            isAstroprocessorRestricted: false,
            isForumRestricted: data.restriction_forum
          }));
        });
    }, 1000 * 60 * 3);
    
    return () => {
      clearInterval(interval.current);
    };
  }, []);
};
