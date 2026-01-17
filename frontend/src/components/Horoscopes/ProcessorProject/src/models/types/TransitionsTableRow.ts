export interface TransitionsTableRow {
  signs: Array<{ sign: string, motionType: string }>,
  dateStart: string,
  dateEnd: string,
  endDateLessThanActual?: boolean
}
