import { ZodiacSign } from '../models/enums/ZodiacSign';

export const getFormattedZodiacSign = (sign: string): ZodiacSign | undefined => {
  const formattedZodiacSign = sign.toLowerCase().substring(0, 2);
  const lowerCaseSign = sign.toLowerCase();

  if (lowerCaseSign === 'lion') {
    return ZodiacSign.Leo;
  } else if (lowerCaseSign === 'fish') {
    return ZodiacSign.Pisces;
  } else if (lowerCaseSign === 'aquarius') {
    return ZodiacSign.Aquarius;
  } else if (lowerCaseSign === 'crayfish') {
    return ZodiacSign.Cancer;
  } else if (lowerCaseSign === 'scorpion') {
    return ZodiacSign.Scorpio;
  } else if (lowerCaseSign === 'virgo') {
    return ZodiacSign.Virgo;
  } else if (lowerCaseSign === 'sagittarius') {
    return ZodiacSign.Sagittarius;
  } else if (lowerCaseSign === 'twins') {
    return ZodiacSign.Gemini;
  } else if (lowerCaseSign === 'aries') {
    return ZodiacSign.Aries;
  } else if (lowerCaseSign === 'capricorn') {
    return ZodiacSign.Capricorn;
  } else if (lowerCaseSign === 'scales') {
    return ZodiacSign.Libra;
  } else if (lowerCaseSign === 'taurus') {
    return ZodiacSign.Taurus;
  } else if (formattedZodiacSign === 'ле') {
    return ZodiacSign.Leo;
  } else if (formattedZodiacSign === 'ры') {
    return ZodiacSign.Pisces;
  } else if (formattedZodiacSign === 'во') {
    return ZodiacSign.Aquarius;
  } else if (formattedZodiacSign === 'ра') {
    return ZodiacSign.Cancer;
  } else if (formattedZodiacSign === 'ск') {
    return ZodiacSign.Scorpio;
  } else if (formattedZodiacSign === 'де') {
    return ZodiacSign.Virgo;
  } else if (formattedZodiacSign === 'ст') {
    return ZodiacSign.Sagittarius;
  } else if (formattedZodiacSign === 'бл') {
    return ZodiacSign.Gemini;
  } else if (formattedZodiacSign === 'ов') {
    return ZodiacSign.Aries;
  } else if (formattedZodiacSign === 'ко') {
    return ZodiacSign.Capricorn;
  } else if (formattedZodiacSign === 'ве') {
    return ZodiacSign.Libra;
  } else if (formattedZodiacSign === 'те') {
    return ZodiacSign.Taurus;
  } else if (formattedZodiacSign === 'le') {
    return ZodiacSign.Leo;
  } else if (formattedZodiacSign === 'pi' || formattedZodiacSign === 'fi') {
    return ZodiacSign.Pisces;
  } else if (formattedZodiacSign === 'aq') {
    return ZodiacSign.Aquarius;
  } else if (sign.toLowerCase() === 'cancer') {
    return ZodiacSign.Cancer;
  } else if (formattedZodiacSign === 'sc') {
    return ZodiacSign.Scorpio;
  } else if (formattedZodiacSign === 'vi') {
    return ZodiacSign.Virgo;
  } else if (formattedZodiacSign === 'sa') {
    return ZodiacSign.Sagittarius;
  } else if (formattedZodiacSign === 'ge') {
    return ZodiacSign.Gemini;
  } else if (formattedZodiacSign === 'ar') {
    return ZodiacSign.Aries;
  } else if (sign.toLowerCase() === 'capricorn') {
    return ZodiacSign.Capricorn;
  } else if (formattedZodiacSign === 'li') {
    return ZodiacSign.Libra;
  } else if (formattedZodiacSign === 'ta') {
    return ZodiacSign.Taurus;
  }
};
