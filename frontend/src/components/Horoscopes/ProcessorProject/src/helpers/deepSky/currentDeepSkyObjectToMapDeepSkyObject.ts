import { CurrentDeepSkyObject } from '../../models/types/CurrentDeepSkyObject';
import { MapDeepSkyObject } from '../../models/types/MapDeepSkyObject';
import { ZodiacSign } from '../../models/enums/ZodiacSign';

export const currentDeepSkyObjectToMapDeepSkyObject = (object?: CurrentDeepSkyObject): MapDeepSkyObject | undefined => {
  if (!object || !object?.year?.tropicalSign) {
    return;
  }

  return {
    stellarObjectType: object?.stellarObjectType,
    signDegrees: {
      sign: object.year.siderealSign as ZodiacSign,
      minutes: object.year.siderealMinutes,
      degrees: object.year.siderealSigndegree
    },
    name: object.title
  };
};
