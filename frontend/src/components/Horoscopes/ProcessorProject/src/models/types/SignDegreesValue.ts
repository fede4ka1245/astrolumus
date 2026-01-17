import { ZodiacSign } from '../enums/ZodiacSign';

export interface SignDegreesValue {
  sign: ZodiacSign,
  minutes?: number,
  degrees?: number
}
