import { HoroscopeData } from './HoroscopeData';
import { TimeZoneData } from './TimeZoneData';
import { HoroscopeAddress } from './HoroscopeAddress';

export interface LoadHoroscope extends Omit<HoroscopeData, 'latitude' | 'longitude'> {
  addressInformation: HoroscopeAddress
  timeZoneData: TimeZoneData
}
