import { LocalStorageKey } from '../models/enums/LocalStorageKey';
import { clearUserInfo } from '../store/reducers/userReducer';
import { routes } from '../models/enums/routes';
import { useAppDispatch } from '../store/store';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  return useCallback(() => {
    localStorage.removeItem(LocalStorageKey.refresh);
    dispatch(clearUserInfo());
    navigate(routes.authorization);
  }, [dispatch, navigate]);
};
