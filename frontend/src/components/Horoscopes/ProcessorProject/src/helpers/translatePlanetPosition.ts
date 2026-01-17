import { Language } from '../models/enums/Language';

const positions = [
  {
    'ru': 'Любой знак',
    'eng': 'Любой знак',
    'sunEng': 'Любой Раши',
    'sunRu': 'Любой Раши',
    'value': 'any'
  }, {
    'ru': 'в Овне',
    'eng': 'Aries',
    'sunEng': 'Mesha',
    'sunRu': 'Меша',
    'value': 'Aries'
  }, {
    'ru': 'в Тельце',
    'eng': 'Taurus',
    'sunEng': 'Vrishabha',
    'sunRu': 'Вришабха',
    'value': 'Taurus'
  }, {
    'ru': 'в Близнецах',
    'eng': 'Gemini',
    'sunEng': 'Mithuna',
    'sunRu': 'Митхуна',
    'value': 'Gemini'
  }, {
    'ru': 'в Раке',
    'eng': 'Cancer',
    'sunEng': 'Karka',
    'sunRu': 'Карка',
    'value': 'Cancer'
  }, {
    'ru': 'во Льве',
    'eng': 'Leo',
    'sunEng': 'Simha',
    'sunRu': 'Симха',
    'value': 'Leo'
  }, {
    'ru': 'в Деве',
    'eng': 'Virgo',
    'sunEng': 'Kanya',
    'sunRu': 'Канйа',
    'value': 'Virgo'
  }, {
    'ru': 'в Весах',
    'eng': 'Libra',
    'sunEng': 'Tula',
    'sunRu': 'Тула',
    'value': 'Libra'
  }, {
    'ru': 'в Скорпионе',
    'eng': 'Scorpio',
    'sunEng': 'Vrichshiha',
    'sunRu': 'Врисчика',
    'value': 'Scorpio'
  }, {
    'ru': 'в Стрельце',
    'eng': 'Sagittarius',
    'sunEng': 'Dhanu',
    'sunRu': 'Дхану',
    'value': 'Sagittarius'
  }, {
    'ru': 'в Козероге',
    'eng': 'Capricorn',
    'sunEng': 'Makara',
    'sunRu': 'Макара',
    'value': 'Capricorn'
  }, {
    'ru': 'в Водолее',
    'eng': 'Aquarius',
    'sunEng': 'Kumbha',
    'sunRu': 'Кумбха',
    'value': 'Aquarius'
  }, {
    'ru': 'в Рыбах',
    'eng': 'Pisces',
    'sunEng': 'Mina',
    'sunRu': 'Мина',
    'value': 'Pisces'
  }, {
    'ru': 'в накшатре Ашвини',
    'eng': 'nakshatra Asvini',
    'sunEng': 'nakshatra Asvini',
    'sunRu': 'в накшатре Ашвини',
    'value': 'nakshatra Asvini'
  }, {
    'ru': 'в накшатре Бхарани',
    'eng': 'nakshatra Bharani',
    'sunEng': 'nakshatra Bharani',
    'sunRu': 'в накшатре Бхарани',
    'value': 'nakshatra Bharani'
  }, {
    'ru': 'в накшатре Криттика',
    'eng': 'nakshatra Krittika',
    'sunEng': 'nakshatra Krittika',
    'sunRu': 'в накшатре Криттика',
    'value': 'nakshatra Krittika'
  }, {
    'ru': 'в накшатре Рохини',
    'eng': 'nakshatra Rohini',
    'sunEng': 'nakshatra Rohini',
    'sunRu': 'в накшатре Рохини',
    'value': 'nakshatra Rohini'
  }, {
    'ru': 'в накшатре Мригашира',
    'eng': 'nakshatra Mrigasira',
    'sunEng': 'nakshatra Mrigasira',
    'sunRu': 'в накшатре Мригашира',
    'value': 'nakshatra Mrigasira'
  }, {
    'ru': 'в накшатре Ардра',
    'eng': 'nakshatra Ardra',
    'sunEng': 'nakshatra Ardra',
    'sunRu': 'в накшатре Ардра',
    'value': 'nakshatra Ardra'
  }, {
    'ru': 'в накшатре Пунарвасу',
    'eng': 'nakshatra Punarvasu',
    'sunEng': 'nakshatra Punarvasu',
    'sunRu': 'в накшатре Пунарвасу',
    'value': 'nakshatra Punarvasu'
  }, {
    'ru': 'в накшатре Пушйа',
    'eng': 'nakshatra Pushya',
    'sunEng': 'nakshatra Pushya',
    'sunRu': 'в накшатре Пушйа',
    'value': 'nakshatra Pushya'
  }, {
    'ru': 'в накшатре Ашлеша',
    'eng': 'nakshatra Aslesha',
    'sunEng': 'nakshatra Aslesha',
    'sunRu': 'в накшатре Ашлеша',
    'value': 'nakshatra Aslesha'
  }, {
    'ru': 'в накшатре Магха',
    'eng': 'nakshatra Magha',
    'sunEng': 'nakshatra Magha',
    'sunRu': 'в накшатре Магха',
    'value': 'nakshatra Magha'
  }, {
    'ru': 'в накшатре Пурвапхалгуни',
    'eng': 'nakshatra Purva Phalguni',
    'sunEng': 'nakshatra Purva Phalguni',
    'sunRu': 'в накшатре Пурвапхалгуни',
    'value': 'nakshatra Purva Phalguni'
  }, {
    'ru': 'в накшатре Уттарапхалгуни',
    'eng': 'nakshatra Uttara Phalguni',
    'sunEng': 'nakshatra Uttara Phalguni',
    'sunRu': 'в накшатре Уттарапхалгуни',
    'value': 'nakshatra Uttara Phalguni'
  }, {
    'ru': 'в накшатре Хаста',
    'eng': 'nakshatra Hasta',
    'sunEng': 'nakshatra Hasta',
    'sunRu': 'в накшатре Хаста',
    'value': 'nakshatra Hasta'
  }, {
    'ru': 'в накшатре Читра',
    'eng': 'nakshatra Chitra',
    'sunEng': 'nakshatra Chitra',
    'sunRu': 'в накшатре Читра',
    'value': 'nakshatra Chitra'
  }, {
    'ru': 'в накшатре Свати',
    'eng': 'nakshatra Svati',
    'sunEng': 'nakshatra Svati',
    'sunRu': 'в накшатре Свати',
    'value': 'nakshatra Svati'
  }, {
    'ru': 'в накшатре Вишакха',
    'eng': 'nakshatra Visakha',
    'sunEng': 'nakshatra Visakha',
    'sunRu': 'в накшатре Вишакха',
    'value': 'nakshatra Visakha'
  }, {
    'ru': 'в накшатре Анурадха',
    'eng': 'nakshatra Anuradha',
    'sunEng': 'nakshatra Anuradha',
    'sunRu': 'в накшатре Анурадха',
    'value': 'nakshatra Anuradha'
  }, {
    'ru': 'в накшатре Джйештха',
    'eng': 'nakshatra Jyeshtha',
    'sunEng': 'nakshatra Jyeshtha',
    'sunRu': 'в накшатре Джйештха',
    'value': 'nakshatra Jyeshtha'
  }, {
    'ru': 'в накшатре Мула',
    'eng': 'nakshatra Mula',
    'sunEng': 'nakshatra Mula',
    'sunRu': 'в накшатре Мула',
    'value': 'nakshatra Mula'
  }, {
    'ru': 'в накшатре Пурвашадха',
    'eng': 'nakshatra Purva Shadha',
    'sunEng': 'nakshatra Purva Shadha',
    'sunRu': 'в накшатре Пурвашадха',
    'value': 'nakshatra Purva Shadha'
  }, {
    'ru': 'в накшатре Уттарашадха',
    'eng': 'nakshatra Uttara Shadha',
    'sunEng': 'nakshatra Uttara Shadha',
    'sunRu': 'в накшатре Уттарашадха',
    'value': 'nakshatra Uttara Shadha'
  }, {
    'ru': 'в накшатре Шравана',
    'eng': 'nakshatra Sravana',
    'sunEng': 'nakshatra Sravana',
    'sunRu': 'в накшатре Шравана',
    'value': 'nakshatra Sravana'
  }, {
    'ru': 'в накшатре Дхаништха',
    'eng': 'nakshatra Dhanishtha',
    'sunEng': 'nakshatra Dhanishtha',
    'sunRu': 'в накшатре Дхаништха',
    'value': 'nakshatra Dhanishtha'
  }, {
    'ru': 'в накшатре Шатабхиша',
    'eng': 'nakshatra Satabhisha',
    'sunEng': 'nakshatra Satabhisha',
    'sunRu': 'в накшатре Шатабхиша',
    'value': 'nakshatra Satabhisha'
  }, {
    'ru': 'в накшатре Пурвабхадрапада',
    'eng': 'nakshatra Purva Bhadra',
    'sunEng': 'nakshatra Purva Bhadra',
    'sunRu': 'в накшатре Пурвабхадрапада',
    'value': 'nakshatra Purva Bhadra'
  }, {
    'ru': 'в накшатре Уттарабхадрапада',
    'eng': 'nakshatra Uttara Bhadra',
    'sunEng': 'nakshatra Uttara Bhadra',
    'sunRu': 'в накшатре Уттарабхадрапада',
    'value': 'nakshatra Uttara Bhadra'
  }, {
    'ru': 'в накшатре Ревати',
    'eng': 'nakshatra Revati',
    'sunEng': 'nakshatra Revati',
    'sunRu': 'в накшатре Ревати',
    'value': 'nakshatra Revati'
  }, {
    'ru': 'с Солнцем',
    'eng': '* Sun',
    'sunEng': '* Surya',
    'sunRu': 'с Сурйя',
    'value': '* Sun'
  }, {
    'ru': 'с Луной',
    'eng': '* Moon',
    'sunEng': '* Chandra',
    'sunRu': 'с Чандра',
    'value': '* Moon'
  }, {
    'ru': 'с Марсом',
    'eng': '* Mars',
    'sunEng': '* Mangal',
    'sunRu': 'с Мангала',
    'value': '* Mars'
  }, {
    'ru': 'с Меркурием',
    'eng': '* Mercury',
    'sunEng': '* Budha',
    'sunRu': 'с Буддха',
    'value': '* Mercury'
  }, {
    'ru': 'с Юпитером',
    'eng': '* Jupiter',
    'sunEng': '* Guru',
    'sunRu': 'с Гуру',
    'value': '* Jupiter'
  }, {
    'ru': 'с Венерой',
    'eng': '* Venus',
    'sunEng': '* Sukra',
    'sunRu': 'с Шукра',
    'value': '* Venus'
  }, {
    'ru': 'с Сатурном',
    'eng': '* Saturn',
    'sunEng': '* Sani',
    'sunRu': 'с Шани',
    'value': '* Saturn'
  }, {
    'ru': 'с Раху',
    'eng': '* Rahu',
    'sunEng': '* Rahu',
    'sunRu': 'с Раху',
    'value': '* Rahu'
  }, {
    'ru': 'с Кету',
    'eng': '* Ketu',
    'sunEng': '* Ketu',
    'sunRu': 'с Кету',
    'value': '* Ketu'
  }, {
    'ru': 'с Ураном',
    'eng': '* Uranus',
    'sunEng': '* Uranus',
    'sunRu': 'с Ураном',
    'value': '* Uranus'
  }, {
    'ru': 'с Нептуном',
    'eng': '* Neptune',
    'sunEng': '* Neptune',
    'sunRu': 'с Нептуном',
    'value': '* Neptune'
  }, {
    'ru': 'с Плутоном',
    'eng': '* Pluto',
    'sunEng': '* Pluto',
    'sunRu': 'с Плутоном',
    'value': '* Pluto'
  }
];

export const translatePlanetPosition = (value: string, lang: Language) => {
  const target = positions.find((position) => value === position.value);

  if (!target) {
    return value;
  }

  if (lang === Language.SunScriptRu) {
    return target.sunRu;
  }

  if (lang === Language.SunScriptEng) {
    return target.sunEng;
  }

  if (lang === Language.Eng) {
    return target.eng;
  }

  return target.ru;
};
