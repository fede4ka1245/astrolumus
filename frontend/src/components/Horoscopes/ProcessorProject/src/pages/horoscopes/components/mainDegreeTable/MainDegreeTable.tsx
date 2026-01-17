import React, { useMemo } from 'react';
import DegreeTable from '../../../../components/degreeTable/DegreeTable';
import {
  useGetIsDeepSkyActive,
  useGetIsDegreeTableLoading,
  useGetDegreeTable,
  useGetTargetMapValue
} from '../../../../store/selectors';
import HoroscopesLoader from '../horoscopeLoader/HoroscopesLoader';
import { DegreeTableParts } from '../../../../models/types/DegreeTable';

const MainDegreeTable = () => {
  const degreeTable = useGetDegreeTable();
  const targetMapValue = useGetTargetMapValue();
  const isLoading = useGetIsDegreeTableLoading();

  const table = useMemo<DegreeTableParts>(() => {
    return degreeTable.find((degreeTableItem) => degreeTableItem.tableName === targetMapValue)?.table as DegreeTableParts;
  }, [degreeTable, targetMapValue]);

  const isDeepSkyActive = useGetIsDeepSkyActive();

  return (
    <>
      {!isLoading && <DegreeTable table={table} isDeepSkyActive={isDeepSkyActive}/>}
      {isLoading && <HoroscopesLoader />}
    </>
  );
};

export default MainDegreeTable;
