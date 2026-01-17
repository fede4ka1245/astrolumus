import { SavedHoroscope } from '../../models/types/SavedHoroscopes';

export type myHoroscopeProps = {
  horoscope: SavedHoroscope,
  onHoroscopeSet?: (horoscope: SavedHoroscope) => any
}
