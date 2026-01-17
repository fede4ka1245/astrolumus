import { ZodiacSign } from '../models/enums/ZodiacSign';

export const getZodiacSignById = (id: number) => {
  if (ZodiacSign.Sagittarius === id) {
    return 'Sagittarius';
  } else if (ZodiacSign.Leo === id) {
    return 'Leo';
  } else if (ZodiacSign.Cancer === id) {
    return 'Cancer';
  } else if (ZodiacSign.Gemini === id) {
    return 'Gemini';
  } else if (ZodiacSign.Libra === id) {
    return 'Libra';
  } else if (ZodiacSign.Aries === id) {
    return 'Aries';
  } else if (ZodiacSign.Capricorn === id) {
    return 'Capricorn';
  } else if (ZodiacSign.Pisces === id) {
    return 'Pisces';
  } else if (ZodiacSign.Scorpio === id) {
    return 'Scorpio';
  } else if (ZodiacSign.Taurus === id) {
    return 'Taurus';
  } else if (ZodiacSign.Virgo === id) {
    return 'Virgo';
  } else if (ZodiacSign.Aquarius === id) {
    return 'Aquarius';
  }
};
