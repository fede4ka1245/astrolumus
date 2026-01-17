import { ZodiacSign } from '../../models/enums/ZodiacSign';
import { SignDegreesValue } from '../../models/types/SignDegreesValue';

export interface SignValueToMinutesProps extends SignDegreesValue {}

export const signDegreesToMinutes = ({ sign, degrees, minutes }: SignValueToMinutesProps) => {
  let signDegrees = 0;

  if (sign === ZodiacSign.Aries) {
    signDegrees = 0;
  } else if (sign === ZodiacSign.Taurus) {
    signDegrees = 30;
  } else if (sign === ZodiacSign.Gemini) {
    signDegrees = 60;
  } else if (sign === ZodiacSign.Cancer) {
    signDegrees = 90;
  } else if (sign === ZodiacSign.Leo) {
    signDegrees = 120;
  } else if (sign === ZodiacSign.Virgo) {
    signDegrees = 150;
  } else if (sign === ZodiacSign.Libra) {
    signDegrees = 180;
  } else if (sign === ZodiacSign.Scorpio) {
    signDegrees = 210;
  } else if (sign === ZodiacSign.Sagittarius) {
    signDegrees = 240;
  } else if (sign === ZodiacSign.Capricorn) {
    signDegrees = 270;
  } else if (sign === ZodiacSign.Aquarius) {
    signDegrees = 300;
  } else if (sign === ZodiacSign.Pisces) {
    signDegrees = 330;
  }

  if (degrees && minutes) {
    signDegrees = (degrees + signDegrees) * 60 + minutes;
  } else if (minutes) {
    signDegrees = signDegrees * 60 + minutes;
  } else if (degrees) {
    signDegrees = (degrees + signDegrees) * 60;
  } else {
    signDegrees = signDegrees * 60;
  }

  return signDegrees;
};
