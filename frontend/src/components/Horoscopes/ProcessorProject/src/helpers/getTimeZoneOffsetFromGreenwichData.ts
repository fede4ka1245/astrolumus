import { getFormattedGreenwich } from './getFormattedGreenwich';

export const getTimeZoneOffsetFromGreenwichData = (greenwich: string, hours: string, minutes: string) => {
  return `${getFormattedGreenwich(greenwich || '').replace('+', '')}${hours}:${minutes}`;
};
