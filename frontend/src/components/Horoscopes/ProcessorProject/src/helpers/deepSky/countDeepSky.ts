import { DegreeTable, DegreeTableItem } from '../../models/types/DegreeTable';
import { CurrentDeepSkyObject } from '../../models/types/CurrentDeepSkyObject';
import { DeepSkyObject } from '../../models/types/DeepSkyObject';
import { DeepSkyYear } from '../../models/types/DeepSkyYear';
import { getFormattedZodiacSign } from '../getFormattedZodiacSign';
import { DegreeTableRow } from '../../models/types/DegreeTableRow';
import { signDegreesToMinutes } from './signDegreesToMinutes';
import { getOrbis } from './getOrbis';
import { isOrbis } from './isOrbis';

export interface CountDeepskyResult {
  degreeTable: DegreeTableItem [],
  targetDeepSkyObjects: CurrentDeepSkyObject []
}

export const countDeepSky = (deepSkyObjects: DeepSkyObject[], degreeTable: DegreeTable, date: string | number, tableName: string = 'D-1'): CountDeepskyResult => {
  const degreeMapIndex = degreeTable.findIndex((degreeTableItem) => degreeTableItem.tableName === tableName);
  const primaryData = degreeTable[degreeMapIndex].table.primaryData || [];
  
  // Извлекаем год из разных форматов даты
  // Формат может быть: number (год), "DD.MM.YYYY" (натальный), "DD.MM.YYYY HH:MM" (Varshapkhala)
  const year = typeof date === 'number' 
    ? date 
    : Number(date.split('.')[2].split(' ')[0]);

  const currentDeepSkyObjects: CurrentDeepSkyObject [] = deepSkyObjects.map((deepSkyObject: DeepSkyObject) => {
    const _year = deepSkyObject.years.find((deepSkyYear) => {
      return Number(deepSkyYear.value) === Number(Math.round(year / 10) * 10);
    }) as DeepSkyYear;

    if (!_year) {
      return deepSkyObject;
    }

    return {
      ...deepSkyObject,
      imageUrl: deepSkyObject.img,
      year: {
        ..._year,
        siderealSign: getFormattedZodiacSign(_year?.siderealSign),
        tropicalSign: getFormattedZodiacSign(_year?.tropicalSign)
      }
    };
  });

  const targetDeepSkyObjects: CurrentDeepSkyObject [] = [];

  const _primaryData = primaryData.map((degreeTableRow: DegreeTableRow) => {
    const deepSkyObjects = currentDeepSkyObjects.filter((deepSkyObject) => {
      if (!deepSkyObject?.year?.siderealSign) {
        return false;
      }

      const sign = deepSkyObject.year.siderealSign;
      const minutes = deepSkyObject.year.siderealMinutes;
      const degrees = deepSkyObject.year.siderealSigndegree;

      const deepSkyObjectMinutes = signDegreesToMinutes({ sign, degrees, minutes });
      const planetMinutes = signDegreesToMinutes({ sign: degreeTableRow.sign, degrees: degreeTableRow.degrees, minutes: degreeTableRow.minutes });

      const orbis = getOrbis(deepSkyObject.stellarObjectType, degreeTableRow.planet.name);

      if (isOrbis(planetMinutes, deepSkyObjectMinutes, orbis)) {
        targetDeepSkyObjects.push(deepSkyObject);
      }

      return isOrbis(planetMinutes, deepSkyObjectMinutes, orbis);
    });

    return {
      ...degreeTableRow,
      deepSkyObjects
    };
  });

  const _degreeTable = Array.from(degreeTable);

  _degreeTable[degreeMapIndex] = {
    ..._degreeTable[degreeMapIndex],
    table: {
      ..._degreeTable[degreeMapIndex].table,
      primaryData: _primaryData
    }
  };

  return {
    targetDeepSkyObjects,
    degreeTable: _degreeTable
  };
};
