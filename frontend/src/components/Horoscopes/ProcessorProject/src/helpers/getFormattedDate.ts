const getFormattedMonth = (month: string) => {
  const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

  const formattedMonth = String(months.findIndex((_month) => month === _month) + 1);

  return formattedMonth.length === 2 ? formattedMonth : `0${formattedMonth}`;
};

export const getFormattedDate = (date: string) => {
  const [day, month, year] = date?.split('.');

  return [day, getFormattedMonth(month), year].join('/');
};
