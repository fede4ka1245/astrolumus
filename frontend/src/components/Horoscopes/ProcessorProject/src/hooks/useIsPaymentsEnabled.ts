import { useAppSelector } from '../store/store';

export const useIsPaymentsEnabled = () => {
  const isPaymentsEnabled = useAppSelector(state => state.preferences.isPaymentsEnabled);
  const userEmail = useAppSelector(state => state.user.userInfo.email);
  
  // Скрываем платежи для определенного пользователя
  if (userEmail === 'fedechka06@gmail.com') {
    return false;
  }
  
  return isPaymentsEnabled;
};

