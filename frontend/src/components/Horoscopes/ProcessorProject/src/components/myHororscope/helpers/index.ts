import { SavedHoroscope } from '../../../models/types/SavedHoroscopes';

export const getSavedHoroscopeLocationLabel = (horoscope: SavedHoroscope) => {
  if (horoscope.city) {
    return horoscope.city;
  }

  return `Выбор на карте: ${horoscope?.horoscope?.latitude} (Широта), ${horoscope?.horoscope?.longitude} (Долгота)`;
};

export const getSavedHoroscopeLabel = (horoscope: SavedHoroscope) => {
  return `${horoscope.name}, ${getSavedHoroscopeLocationLabel(horoscope)}`;
};
