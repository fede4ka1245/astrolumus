import { AshtakavargaTableRow } from './AshtakavargaTableRow';
import { MapType } from './MapType';

export interface AshtakavargaTable {
  tableName: string,
  type?: string,
  table: AshtakavargaTableRow [],
  mapType: MapType,
  firstHouse?: number
}
