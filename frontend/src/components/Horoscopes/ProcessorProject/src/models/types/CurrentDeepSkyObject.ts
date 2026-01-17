import { DeepSkyObject } from './DeepSkyObject';
import { DeepSkyYear } from './DeepSkyYear';
import { ZodiacSignType } from '../enums/ZodiacSign';

export interface CurrentDeepSkyYear extends Omit<Omit<DeepSkyYear, 'tropicalSign'>, 'siderealSign'> {
  tropicalSign?: ZodiacSignType,
  siderealSign?: ZodiacSignType,
}

export interface CurrentDeepSkyObject extends Omit<DeepSkyObject, 'years'> {
  year?: CurrentDeepSkyYear,
}
