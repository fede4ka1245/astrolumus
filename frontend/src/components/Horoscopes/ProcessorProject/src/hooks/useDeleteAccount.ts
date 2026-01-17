import { useAppDispatch, useAppSelector } from '../store/store';
import { useCallback } from 'react';
import { deleteAccount } from '../api/deleteAccount';
import { useLogout } from './useLogout';
import { setIsAppLoading } from '../store/reducers/preferencesReducer';

export const useDeleteAccount = () => {
  const { userInfo } = useAppSelector(state => state.user);
  const logout = useLogout();
  const dispatch = useAppDispatch();

  return useCallback(async () => {
    const isConfirmed = confirm('Вы уверены, что хотите удалить аккаунт? При удалении аккаунта ваши данные будут утеряны.');

    if (!isConfirmed) {
      return;
    }

    dispatch(setIsAppLoading(true));
    
    try {
      await deleteAccount(userInfo.id);
      logout();
    } catch {
      alert('Ошибка при удалении аккаунта. Попробуйте позже');
    } finally {
      dispatch(setIsAppLoading(false));
    }
  }, [userInfo, logout, dispatch]);
};
