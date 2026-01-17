export interface SavedHoroscopeData {
  dt: string,
  id: number,
  settings: string,
  latitude: string,
  longitude: string,
  tzHour: string,
  tzMinutes: string
}

export interface SavedHoroscope {
  name?: string,
  city?: string,
  date?: string,
  time?: string,
  id?: number,
  horoscope: SavedHoroscopeData
}
