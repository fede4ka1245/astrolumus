import { Language } from '../models/enums/Language';

export const naksatras = [
  {
    'ru': 'Ашвини',
    'eng': 'Asvini',
    'shortRu': 'Ашви',
    'shortEng': 'Aswi',
    'value': 'Asvini'
  }, {
    'ru': 'Бхарани',
    'eng': 'Bharani',
    'shortRu': 'Бхар',
    'shortEng': 'Bhar',
    'value': 'Bharani'
  }, {
    'ru': 'Криттика',
    'eng': 'Krittika',
    'shortRu': 'Крит',
    'shortEng': 'Krit',
    'value': 'Krittika'
  }, {
    'ru': 'Рохини',
    'eng': 'Rohini',
    'shortRu': 'Рохи',
    'shortEng': 'Rohi',
    'value': 'Rohini'
  }, {
    'ru': 'Мригашира',
    'eng': 'Mrigasira',
    'shortRu': 'Мриг',
    'shortEng': 'Mrig',
    'value': 'Mrigasira'
  }, {
    'ru': 'Ардра',
    'eng': 'Ardra',
    'shortRu': 'Ардр',
    'shortEng': 'Ardr',
    'value': 'Ardra'
  }, {
    'ru': 'Пунарвасу',
    'eng': 'Punarvasu',
    'shortRu': 'Пуна',
    'shortEng': 'Puna',
    'value': 'Punarvasu'
  }, {
    'ru': 'Пушйа',
    'eng': 'Pushya',
    'shortRu': 'Пуш',
    'shortEng': 'Push',
    'value': 'Pushya'
  }, {
    'ru': 'Ашлеша',
    'eng': 'Aslesha',
    'shortRu': 'Ашле',
    'shortEng': 'Asre',
    'value': 'Aslesha'
  }, {
    'ru': 'Магха',
    'eng': 'Magha',
    'shortRu': 'Магх',
    'shortEng': 'Magh',
    'value': 'Magha'
  }, {
    'ru': 'Пурвапхалгуни',
    'eng': 'Purva Phalguni',
    'shortRu': 'ППха',
    'shortEng': 'PPha',
    'value': 'Purva Phalguni'
  }, {
    'ru': 'Уттарапхалгуни',
    'eng': 'Uttara Phalguni',
    'shortRu': 'УПха',
    'shortEng': 'UPha',
    'value': 'Uttara Phalguni'
  }, {
    'ru': 'Хаста',
    'eng': 'Hasta',
    'shortRu': 'Хаст',
    'shortEng': 'Hast',
    'value': 'Hasta'
  }, {
    'ru': 'Читра',
    'eng': 'Chitra',
    'shortRu': 'Чит',
    'shortEng': 'Chit',
    'value': 'Chitra'
  }, {
    'ru': 'Свати',
    'eng': 'Svati',
    'shortRu': 'Сват',
    'shortEng': 'Swat',
    'value': 'Svati'
  }, {
    'ru': 'Вишакха',
    'eng': 'Visakha',
    'shortRu': 'Виша',
    'shortEng': 'Visa',
    'value': 'Visakha'
  }, {
    'ru': 'Анурадха',
    'eng': 'Anuradha',
    'shortRu': 'Ану',
    'shortEng': 'Anu',
    'value': 'Anuradha'
  }, {
    'ru': 'Джйештха',
    'eng': 'Jyeshtha',
    'shortRu': 'Джй',
    'shortEng': 'Jye',
    'value': 'Jyeshtha'
  }, {
    'ru': 'Мула',
    'eng': 'Mula',
    'shortRu': 'Мул',
    'shortEng': 'Mool',
    'value': 'Mula'
  }, {
    'ru': 'Пурвашадха',
    'eng': 'Purva Shadha',
    'shortRu': 'ПШа',
    'shortEng': 'PSha',
    'value': 'Purva Shadha'
  }, {
    'ru': 'Уттарашадха',
    'eng': 'Uttara Shadha',
    'shortRu': 'УШа',
    'shortEng': 'USha',
    'value': 'Uttara Shadha'
  }, {
    'ru': 'Шравана',
    'eng': 'Sravana',
    'shortRu': 'Шрав',
    'shortEng': 'Srav',
    'value': 'Sravana'
  }, {
    'ru': 'Дхаништха',
    'eng': 'Dhanishtha',
    'shortRu': 'Дхан',
    'shortEng': 'Dhan',
    'value': 'Dhanishtha'
  }, {
    'ru': 'Шатабхиша',
    'eng': 'Satabhisha',
    'shortRu': 'Шата',
    'shortEng': 'Sata',
    'value': 'Satabhisha'
  }, {
    'ru': 'Пурвабхадрапада',
    'eng': 'Purva Bhadra',
    'shortRu': 'ПБха',
    'shortEng': 'PBha',
    'value': 'Purva Bhadra'
  }, {
    'ru': 'Уттарабхадрапада',
    'eng': 'Uttara Bhadra',
    'shortRu': 'УБха',
    'shortEng': 'UBha',
    'value': 'Uttara Bhadra'
  }, {
    'ru': 'Ревати',
    'eng': 'Revati',
    'shortRu': 'Рева',
    'shortEng': 'Reva',
    'value': 'Revati'
  }
];

export const getNaksatraName = (value: string, lang: Language) => {
  const target = naksatras.find(({ value: targetValue }) => value === targetValue);

  if (!target) {
    return value;
  }

  if (lang === Language.Eng) {
    return target.shortEng;
  }

  if (lang === Language.Ru) {
    return target.shortRu;
  }

  if (lang === Language.SunScriptRu) {
    return target.shortRu;
  }

  if (lang === Language.SunScriptEng) {
    return target.shortEng;
  }

  return target?.shortRu;
};
