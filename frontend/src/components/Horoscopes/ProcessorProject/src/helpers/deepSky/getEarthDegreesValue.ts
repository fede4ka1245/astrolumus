import { signDegreesToMinutes } from './signDegreesToMinutes';
import { minutesToSignValue } from './minutesToSignValue';
import { SignDegreesValue } from '../../models/types/SignDegreesValue';

interface SunDegreesValue extends SignDegreesValue {}

export const getEarthDegreesValue = ({ sign, degrees, minutes }: SunDegreesValue) => {
  const sunMinutes = signDegreesToMinutes({ sign, degrees, minutes });

  const earthMinutes = sunMinutes + 180 * 60;

  return minutesToSignValue(earthMinutes);
};
