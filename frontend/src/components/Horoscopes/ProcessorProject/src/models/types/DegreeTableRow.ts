import { CurrentDeepSkyObject } from './CurrentDeepSkyObject';
import { ZodiacSign } from '../enums/ZodiacSign';

interface DegreePlanet {
  id: number,
  name: string,
  additionalInfo?: string,
  isRetragraded: boolean
}

export interface DegreeTableRow {
  house: number,
  planet: DegreePlanet,
  sign: ZodiacSign,
  degrees: number,
  minutes: number,
  naksantra: {
    id: number,
    mainInfo: string,
    additionalInfo: string,
    pada: string
  },
  karaka: {
    id: number,
    name: string
  }
  deepSkyObjects?: CurrentDeepSkyObject []
}
