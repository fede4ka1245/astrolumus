import React from 'react';
import { SignProps } from './SignProps';
import Leo from './signs/Leo';
import Pisce from './signs/Pisce';
import Aquarius from './signs/Aquarius';
import Cancer from './signs/Cancer';
import Scorpio from './signs/Scorpio';
import Virgo from './signs/Virgo';
import Sagittarius from './signs/Sagittarius';
import Gemini from './signs/Gemini';
import Aries from './signs/Aries';
import Capricorn from './signs/Capricorn';
import Libra from './signs/Libra';
import Taurus from './signs/Taurus';
import { ZodiacSign as Sign, ZodiacSignType } from '../../models/enums/ZodiacSign';

interface ZodiacSignProps extends SignProps {
  zodiacSign: ZodiacSignType
}

const ZodiacSign = ({ width, height, zodiacSign }: ZodiacSignProps) => {
  if (zodiacSign === Sign.Leo) {
    return <Leo />;
  } else if (zodiacSign === Sign.Pisces) {
    return <Pisce />;
  } else if (zodiacSign === Sign.Aquarius) {
    return <Aquarius/>;
  } else if (zodiacSign === Sign.Cancer) {
    return <Cancer />;
  } else if (zodiacSign === Sign.Scorpio) {
    return <Scorpio />;
  } else if (zodiacSign === Sign.Virgo) {
    return <Virgo />;
  } else if (zodiacSign === Sign.Sagittarius) {
    return <Sagittarius />;
  } else if (zodiacSign === Sign.Gemini) {
    return <Gemini />;
  } else if (zodiacSign === Sign.Aries) {
    return <Aries />;
  } else if (zodiacSign === Sign.Capricorn) {
    return <Capricorn />;
  } else if (zodiacSign === Sign.Libra) {
    return <Libra />;
  } else if (zodiacSign === Sign.Taurus) {
    return <Taurus />;
  } else {
    return <></>;
  }
};

export default ZodiacSign;
