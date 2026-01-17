import { Language } from '../models/enums/Language';

const karkas = [
  {
    'ru': 'АК',
    'eng': 'AK',
    'value': 'AK'
  }, {
    'ru': 'АмК',
    'eng': 'AmK',
    'value': 'AmK'
  }, {
    'ru': 'БК',
    'eng': 'BK',
    'value': 'BK'
  }, {
    'ru': 'ПиК',
    'eng': 'PiK',
    'value': 'PiK'
  }, {
    'ru': 'ПК',
    'eng': 'PK',
    'value': 'PK'
  }, {
    'ru': 'ГК',
    'eng': 'GK',
    'value': 'GK'
  }, {
    'ru': 'ДК',
    'eng': 'DK',
    'value': 'DK'
  }
];

export const translateKaraka = (value: string, lang: Language) => {
  const target = karkas.find((karaka) => value === karaka.value);

  if (!target) {
    return value;
  }

  if (lang === Language.SunScriptRu) {
    return target.ru;
  }

  if (lang === Language.SunScriptEng) {
    return target.eng;
  }

  if (lang === Language.Eng) {
    return target.eng;
  }

  return target.ru;
};
