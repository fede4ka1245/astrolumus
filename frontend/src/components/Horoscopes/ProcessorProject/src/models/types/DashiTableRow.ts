export interface DashiTableRow {
  planet: string,
  planets: string [],
  dateStart: string,
  dateEnd: string,
  timeStart: string,
  timeEnd: string,
  subTable: DashiTableRow[]
}
