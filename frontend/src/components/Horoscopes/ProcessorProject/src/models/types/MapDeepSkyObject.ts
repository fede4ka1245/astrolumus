import { SignDegreesValue } from './SignDegreesValue';
import { StellarObjectType } from '../enums/StellarObjectType';

export interface MapDeepSkyObject {
  signDegrees: SignDegreesValue,
  stellarObjectType: StellarObjectType,
  name: string,
}
