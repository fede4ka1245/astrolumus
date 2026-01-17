
export interface TransitionPosition {
  value: string,
  type: string,
  id: string | number
}

export interface TransitionsPlanet {
  planet: string | number,
  position: TransitionPosition,
  direction: string,
  min: number,
  max: number
}

interface Planet {
  name: string,
  id: number
}

interface TransitedObject extends Planet {
  objectType: 'planet' | 'sign' | 'nakshatra',
  movement: 'd' | 'r' | 's',
}

interface Transit {
  planet: Planet,
  transitedObject: TransitedObject,
  type: 'success' | 'warning' | 'danger',
}

interface ResponseItem {
  startDate: string,
  endDate: string,
  transits: Array<Transit>
}

interface Response {
  apiVersion: string,
  data: Array<ResponseItem>
}
