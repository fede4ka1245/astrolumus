import React, { useMemo } from 'react';
import { useGetDegreeTable } from '../../../../../store/selectors';
import DegreeTable from '../../../../../components/degreeTable/DegreeTable';
import { DegreeTableParts } from '../../../../../models/types/DegreeTable';

const Bhava = () => {
  const degreeTable = useGetDegreeTable();

  const table = useMemo(() => {
    return degreeTable.find((degreeTableItem) => degreeTableItem.tableName === 'D-1')?.table as DegreeTableParts;
  }, [degreeTable]);

  return (
    <DegreeTable table={table} />
  );
};

export default Bhava;
