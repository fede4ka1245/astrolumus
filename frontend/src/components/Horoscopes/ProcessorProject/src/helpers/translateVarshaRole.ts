import { Language } from '../models/enums/Language';

const roles = [
  {
    value: 'Muntha Pati',
    engLabel: 'Muntha Pati',
    rusLabel: 'Мунтха-пати'
  },
  {
    value: 'Varsha Lagna Pati',
    engLabel: 'Varsha Lagna Pati',
    rusLabel: 'Варша-лагна-пати'
  },
  {
    value: 'Janma Lagna Pati',
    engLabel: 'Janma Lagna Pati',
    rusLabel: 'Джанма-лагна-пати'
  },
  {
    value: 'Dina Ratri Pati',
    engLabel: 'Dina Ratri Pati',
    rusLabel: 'Дина-ратри-пати'
  },
  {
    value: 'Tri Rasi Pati',
    engLabel: 'Tri Rasi Pati',
    rusLabel: 'Три-раши-пати'
  }
];

export const translateVarshaRole = (value: string, language: Language) => {
  if (language === Language.Ru || language === Language.SunScriptRu) {
    return roles.find((item) => item.value === value)?.rusLabel || value;
  }

  return value;
};
