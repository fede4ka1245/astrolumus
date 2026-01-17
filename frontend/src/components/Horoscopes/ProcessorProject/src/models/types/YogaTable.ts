export interface YogaTableRow {
  planets: string [],
  connection: {
    connection: string,
    type: string,
  },
  yoga: {
    number?: string,
    name: string,
    type?: string,
    resize?: string
    fullName?: string,
  }
}
