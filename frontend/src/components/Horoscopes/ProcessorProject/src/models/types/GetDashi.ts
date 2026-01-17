import { HoroscopeData } from './HoroscopeData';
import { DashiTableRow } from './DashiTableRow';

export interface GetDashiProps {
  horoscopeData: HoroscopeData,
  dateStart?: string
}

export interface DashiReturnType {
  dateStart: string,
  dateEnd: string,
  table: DashiTableRow []
}
