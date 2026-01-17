export const getIsForumEnabled = (): boolean => {
  const value = import.meta.env.VITE_IS_FORUM_ENABLED;
  
  // Если переменная не установлена, по умолчанию форум включен
  if (value === undefined || value === null) {
    return true;
  }
  
  // Проверяем на false (строка или булево значение)
  if (value === 'false' || value === false) {
    return false;
  }
  
  return true;
};

