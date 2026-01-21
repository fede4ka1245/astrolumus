import { processorRoutes } from '../../astrlogicalProcessor/processorRoutes';

export const getProcessorRoutes = (route: string = '') => {
  return [
    {
      label: 'Натальная к.',
      value: route + processorRoutes.horoscopes
    },
    {
      label: 'Даши',
      value: route + processorRoutes.dashi
    },
    {
      label: 'Транзиты',
      value: route + processorRoutes.transitions
    },
    {
      label: 'Аштакаварга',
      value: route + processorRoutes.ashtakavarga
    },
    {
      label: 'Варшапхала',
      value: route + processorRoutes.varshapkhala
    },
    {
      label: 'Ректификация',
      value: route + processorRoutes.rectification
    },
    {
      label: 'Настройки',
      value: route + processorRoutes.settings
    }
  ];
};
