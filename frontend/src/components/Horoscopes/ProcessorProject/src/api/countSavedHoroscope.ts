import { getHoroscope } from './savedHorsocopes';
import { formatHoroscopeData, FormattedHoroscopeData } from '../helpers/formatHorscopeData';

export const countSavedHoroscope = (id: number): Promise<FormattedHoroscopeData> => {
  return getHoroscope(id)
    .then((data) => {
      return {
        ...formatHoroscopeData(data.data)
      };
    });
};
