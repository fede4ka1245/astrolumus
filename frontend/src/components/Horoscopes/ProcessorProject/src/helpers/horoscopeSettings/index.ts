import { HoroscopeSettings } from '../../store/reducers/horoscopeSettings';

export enum Aynamsa {
  lahiri = 'lahiri',
  trueLahiri = 'true-lahiri',
  rohiniPaksha = 'rohini-paksha',
  pushyaPaksha = 'pushya-paksha',
  bhasin = 'bhasin',
  raman = 'raman',
  sayana = 'sayana'
}

export enum DasaYearLength {
  meanSideral = 'mean-sideral',
  meanTropical = 'mean-tropical',
  savana = '360-days',
  lunarDays = '360-tithi'
}

export enum NodeScheme {
  true = 'true',
  mean = 'mean'
}

export enum KarakaScheme {
  knrao = 'knrao',
  srath = 'srath'
}

export enum ArudhaScheme {
  knrao = 'knrao',
  srath = 'srath'
}

export const getSettingsParams = (settings?: HoroscopeSettings) => {
  if (!settings) {
    return {};
  }

  return {
    'config[ayanamsa]': settings?.aynamsa,
    'config[nodes-scheme]': settings?.nodeScheme,
    'config[dasa][year-length]': settings?.yearLength,
    'config[karaka-scheme]': settings?.charaKarakCount,
    'config[arudha-scheme]': settings.arudhasCount,
    'config[varga][drekkana]': settings?.vargaDrekkana,
    'config[varga][hora]': settings?.vargaHora
  };
};
