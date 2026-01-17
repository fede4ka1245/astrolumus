import { Language } from '../../../../models/enums/Language';

export const translateAshtakavargaType = (value: string, lang: Language) => {
  if (value === 'BAV' && (lang === Language.Ru || lang === Language.SunScriptRu)) {
    return 'БАВ';
  }

  if (value === 'BAV' && (lang === Language.Eng || lang === Language.SunScriptEng)) {
    return 'BAV';
  }

  if (value === 'SAV' && (lang === Language.Ru || lang === Language.SunScriptRu)) {
    return 'САВ';
  }

  if (value === 'SAV' && (lang === Language.Eng || lang === Language.SunScriptEng)) {
    return 'SAV';
  }
  
  return value;
};
