import { Language } from '../models/enums/Language';

const zodiacSigns = [
  {
    'rusLabelFull': 'Овен',
    'engLabelFull': 'Aries',
    'sunEngLabelFull': 'Mesha',
    'sunRusLabelFull': 'Меша',
    'engLabel': 'Ar',
    'ruLabel': 'Ов',
    'sunEngLabel': 'Mesh',
    'sunRusLabel': 'Меш',
    'value': 'Aries'
  }, {
    'rusLabelFull': 'Телец',
    'engLabelFull': 'Taurus',
    'sunEngLabelFull': 'Vrishabha',
    'sunRusLabelFull': 'Вришабха',
    'engLabel': 'Ta',
    'ruLabel': 'Те',
    'sunEngLabel': 'Vrisha',
    'sunRusLabel': 'Вришa',
    'value': 'Taurus'
  }, {
    'rusLabelFull': 'Близнецы',
    'engLabelFull': 'Gemini',
    'sunEngLabelFull': 'Mithuna',
    'sunRusLabelFull': 'Митхуна',
    'engLabel': 'Ge',
    'ruLabel': 'Бл',
    'sunEngLabel': 'Mith',
    'sunRusLabel': 'Митх',
    'value': 'Gemini'
  }, {
    'rusLabelFull': 'Рак',
    'engLabelFull': 'Cancer',
    'sunEngLabelFull': 'Karka',
    'sunRusLabelFull': 'Карка',
    'engLabel': 'Cn',
    'ruLabel': 'Ра',
    'sunEngLabel': 'Kark',
    'sunRusLabel': 'Карк',
    'value': 'Cancer'
  }, {
    'rusLabelFull': 'Лев',
    'engLabelFull': 'Leo',
    'sunEngLabelFull': 'Simha',
    'sunRusLabelFull': 'Симха',
    'engLabel': 'Le',
    'ruLabel': 'Ле',
    'sunEngLabel': 'Simh',
    'sunRusLabel': 'Симх',
    'value': 'Leo'
  }, {
    'rusLabelFull': 'Дева',
    'engLabelFull': 'Virgo',
    'sunEngLabelFull': 'Kanya',
    'sunRusLabelFull': 'Канйа',
    'engLabel': 'Vi',
    'ruLabel': 'Де',
    'sunEngLabel': 'Kan',
    'sunRusLabel': 'Кан',
    'value': 'Virgo'
  }, {
    'rusLabelFull': 'Весы',
    'engLabelFull': 'Libra',
    'sunEngLabelFull': 'Tula',
    'sunRusLabelFull': 'Тула',
    'engLabel': 'Li',
    'ruLabel': 'Ве',
    'sunEngLabel': 'Tul',
    'sunRusLabel': 'Тул',
    'value': 'Libra'
  }, {
    'rusLabelFull': 'Скорпион',
    'engLabelFull': 'Scorpio',
    'sunEngLabelFull': 'Vrichshiha',
    'sunRusLabelFull': 'Врисчика',
    'engLabel': 'Sc',
    'ruLabel': 'Ск',
    'sunEngLabel': 'Vrich',
    'sunRusLabel': 'Врисч',
    'value': 'Scorpio'
  }, {
    'rusLabelFull': 'Стрелец',
    'engLabelFull': 'Sagittarius',
    'sunEngLabelFull': 'Dhanu',
    'sunRusLabelFull': 'Дхану',
    'engLabel': 'Sg',
    'ruLabel': 'Ст',
    'sunEngLabel': 'Dhan',
    'sunRusLabel': 'Дхану',
    'value': 'Sagittarius'
  }, {
    'rusLabelFull': 'Козерог',
    'engLabelFull': 'Capricorn',
    'sunEngLabelFull': 'Makara',
    'sunRusLabelFull': 'Макара',
    'engLabel': 'Cp',
    'ruLabel': 'Ко',
    'sunEngLabel': 'Mak',
    'sunRusLabel': 'Макар',
    'value': 'Capricorn'
  }, {
    'rusLabelFull': 'Водолей',
    'engLabelFull': 'Aquarius',
    'sunEngLabelFull': 'Kumbha',
    'sunRusLabelFull': 'Кумбха',
    'engLabel': 'Aq',
    'ruLabel': 'Во',
    'sunEngLabel': 'Kumb',
    'sunRusLabel': 'Кумбх',
    'value': 'Aquarius'
  }, {
    'rusLabelFull': 'Рыбы',
    'engLabelFull': 'Pisces',
    'sunEngLabelFull': 'Mina',
    'sunRusLabelFull': 'Мина',
    'engLabel': 'Pi',
    'ruLabel': 'Рыб',
    'sunEngLabel': 'Pi',
    'sunRusLabel': 'Рыб',
    'value': 'Pisces'
  }
];

export const translateZodiacSign = (name: string, lang?: Language, isShort?: boolean) => {
  const targetPlanet = zodiacSigns.find((planet) => planet.value.toLowerCase() === name.toLowerCase());

  if (!targetPlanet || !lang) {
    return name;
  }

  if (lang === Language.Eng && isShort) {
    return targetPlanet.engLabel;
  }

  if (lang === Language.Ru && isShort) {
    return targetPlanet.ruLabel;
  }

  if (lang === Language.SunScriptRu && isShort) {
    return targetPlanet.sunRusLabel;
  }

  if (lang === Language.SunScriptEng && isShort) {
    return targetPlanet.sunEngLabel;
  }

  if (lang === Language.Eng) {
    return targetPlanet.engLabelFull;
  }

  if (lang === Language.Ru) {
    return targetPlanet.rusLabelFull;
  }

  if (lang === Language.SunScriptRu) {
    return targetPlanet.sunRusLabelFull;
  }

  if (lang === Language.SunScriptEng) {
    return targetPlanet.sunEngLabelFull;
  }

  return targetPlanet?.engLabel;
};
