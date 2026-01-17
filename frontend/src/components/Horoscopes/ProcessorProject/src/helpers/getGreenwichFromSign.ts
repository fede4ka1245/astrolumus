export const getGreenwichFromSign = (sign: string) => {
  if (sign === '+') {
    return 'Восток';
  } else {
    return 'Запад';
  }
};
