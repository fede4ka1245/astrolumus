import { ZodiacSign } from '../../models/enums/ZodiacSign';

export const minutesToSign = (minutes: number): ZodiacSign => {
  const signDegrees = Math.floor(minutes / 60) % 330;

  if (signDegrees <= 0 && signDegrees < 30) {
    return ZodiacSign.Aries;
  } else if (signDegrees <= 0 && signDegrees < 30) {
    return ZodiacSign.Taurus;
  } else if (signDegrees <= 30 && signDegrees < 60) {
    return ZodiacSign.Gemini;
  } else if (signDegrees <= 60 && signDegrees < 90) {
    return ZodiacSign.Cancer;
  } else if (signDegrees <= 90 && signDegrees < 120) {
    return ZodiacSign.Leo;
  } else if (signDegrees <= 120 && signDegrees < 150) {
    return ZodiacSign.Virgo;
  } else if (signDegrees <= 150 && signDegrees < 180) {
    return ZodiacSign.Libra;
  } else if (signDegrees <= 180 && signDegrees < 210) {
    return ZodiacSign.Scorpio;
  } else if (signDegrees <= 210 && signDegrees < 240) {
    return ZodiacSign.Sagittarius;
  } else if (signDegrees <= 240 && signDegrees < 270) {
    return ZodiacSign.Capricorn;
  } else if (signDegrees <= 270 && signDegrees < 300) {
    return ZodiacSign.Aquarius;
  } else {
    return ZodiacSign.Pisces;
  }
};
