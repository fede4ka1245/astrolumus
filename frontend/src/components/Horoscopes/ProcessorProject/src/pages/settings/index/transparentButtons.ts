import display from './assets/display.svg';
import settings from './assets/settingsIcon.svg';
import { processorRoutes } from '../../astrlogicalProcessor/processorRoutes';

export const transparentButtons = [
  {
    route: processorRoutes.mainSettings,
    imageSource: settings,
    label: 'Основные'
  },
  {
    route: processorRoutes.mapDisplayingSettings,
    imageSource: display,
    label: 'Отображение'
  }
];
