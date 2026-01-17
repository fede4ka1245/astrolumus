import { useGetDegreeTable, useGetTargetMapValue, useGetVarshpahalaDegreeTable } from '../store/selectors';
import { useMemo } from 'react';
import { MapDeepSkyObject } from '../models/types/MapDeepSkyObject';
import { StellarObjectType } from '../models/enums/StellarObjectType';
import { useAppSelector } from '../store/store';

export const useGetEarth = () => {
  const degreeTable = useGetDegreeTable();
  const varshaDegreeTable = useGetVarshpahalaDegreeTable();
  const mapValue = useGetTargetMapValue();
  const targetRoute = useAppSelector((state) => state.horoscopes.targetRoute);

  const degreeTableCurrentRows = useMemo(() => {
    if (targetRoute.label === 'Варшапхала') {
      return varshaDegreeTable.find((degreeTableItem) => degreeTableItem.tableName === mapValue)?.table.primaryData || [];
    }

    return degreeTable.find((degreeTableItem) => degreeTableItem.tableName === mapValue)?.table.primaryData || [];
  }, [degreeTable, varshaDegreeTable, targetRoute.label, mapValue]);

  return useMemo((): MapDeepSkyObject | undefined => {
    const sun = degreeTableCurrentRows.find((row) => row.planet.name.toLowerCase() === 'sun');

    if (!sun) {
      return;
    }

    return {
      signDegrees: { sign: (sun.sign + 6) > 12 ? (sun.sign + 6) - 12 : (sun.sign + 6), degrees: sun.degrees, minutes: sun.minutes },
      stellarObjectType: StellarObjectType.Earth,
      name: 'Земля'
    };
  }, [degreeTableCurrentRows]);
};
