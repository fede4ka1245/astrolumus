import { SectorPosition } from '../ObjectsRenderer';

export const getSectorPosition = (house: number) => {
  if ([1, 4, 7, 10].includes(house)) {
    return SectorPosition.Center;
  }

  if ([2, 12].includes(house)) {
    return SectorPosition.Top;
  }

  if ([3, 5].includes(house)) {
    return SectorPosition.Left;
  }

  if ([11, 9].includes(house)) {
    return SectorPosition.Right;
  }

  return SectorPosition.Bottom;
};
