export interface AddressLocation {
  key: string,
  value: string,
}

export interface TimeZone {
  hours: string,
  minutes: string,
  greenwich: string
}

export interface AddressCoordinates {
  latitude: number | string,
  longitude: number | string,
}

export interface HoroscopeAddress {
  timeZone: TimeZone,
  coordinates: AddressCoordinates,
  location: AddressLocation,
  isCustomCoordinates?: boolean
}
