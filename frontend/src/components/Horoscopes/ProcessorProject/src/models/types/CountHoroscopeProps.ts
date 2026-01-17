import { HoroscopeAddress } from './HoroscopeAddress';
import { HoroscopeUserInfo } from './HoroscopeUserInfo';
import { HoroscopeSettings } from '../../store/reducers/horoscopeSettings';

export interface CountHoroscopeProps {
  address: HoroscopeAddress,
  userInfo: HoroscopeUserInfo,
  settings?: HoroscopeSettings,
  activateLoader?: boolean
  isCaching?: boolean
  resetHoroscopeData?: boolean,
  clearHoroscope?: boolean
}
