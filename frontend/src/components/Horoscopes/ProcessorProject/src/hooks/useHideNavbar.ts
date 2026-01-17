import { useEffect } from 'react';
import { useAppDispatch } from '../store/store';
import { setIsNavbarActive } from '../store/reducers/preferencesReducer';
import { useGetIsNavbarActive } from '../store/selectors';

export const useHideNavbar = () => {
  const dispatch = useAppDispatch();
  const isNavbarActive = useGetIsNavbarActive();
  
  useEffect(() => {
    if (isNavbarActive) {
      dispatch(setIsNavbarActive(false));
    }
  }, [isNavbarActive]);
  
  useEffect(() => {
    dispatch(setIsNavbarActive(false));
    
    return () => {
      dispatch(setIsNavbarActive(true));
    };
  }, []);
};
