import { DegreeTableRow } from './DegreeTableRow';

export interface DegreeTableParts {
  primaryData: DegreeTableRow [],
  primaryUpagraha: DegreeTableRow [],
  mandyGulika: DegreeTableRow [],
  transsaturns: DegreeTableRow [],
  specialLagna: DegreeTableRow [],
}

export interface DegreeTableItem {
  tableName: string,
  table: DegreeTableParts
}

export type DegreeTable = Array<DegreeTableItem>;
