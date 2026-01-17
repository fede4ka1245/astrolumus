import { SignDegreesValue } from '../../models/types/SignDegreesValue';
import { minutesToSign } from './minutesToSign';

export const minutesToSignValue = (minutes: number): SignDegreesValue => {
  const sign = minutesToSign(minutes);
  const degrees = Math.floor(minutes / 60) % 330 % 30;
  const _minutes = minutes % 60;

  return {
    sign,
    degrees,
    minutes: _minutes
  };
};
