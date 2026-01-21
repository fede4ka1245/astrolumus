import React, { useMemo } from 'react';
import { Grid } from '@mui/material';
import DegreeTable from '../../../../components/degreeTable/DegreeTable';
import {
  useGetIsDeepSkyActive,
  useGetIsDegreeTableLoading,
  useGetDegreeTable,
  useGetTargetMapValue
} from '../../../../store/selectors';
import HoroscopesLoader from '../horoscopeLoader/HoroscopesLoader';
import { DegreeTableParts } from '../../../../models/types/DegreeTable';
import Header from '../../../../components/header/Header';

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
      {!isLoading && (
        <>
          <Grid pl={2} pt={2} pb={2}>
            <Header header={'Дробная таблица'} isIconActive={false} isPlain />
          </Grid>
          <DegreeTable table={table} isDeepSkyActive={isDeepSkyActive}/>
        </>
      )}
      {isLoading && <HoroscopesLoader />}
    </>
  );
};

export default MainDegreeTable;
