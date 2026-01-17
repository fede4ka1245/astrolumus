import React, { useState } from 'react';
import DashiTableRow from './DashiTableRow';
import { DashiTableRow as IDashiTableRow } from '../../models/types/DashiTableRow';
import { RowContext } from './RowContext';

interface PlanetsTableRowProps {
  row: IDashiTableRow,
  type?: 'vim' | 'chara',
  isAgesDisabled?: boolean,
  maxPlanets?: number
}

const Row = ({ row, type, isAgesDisabled, maxPlanets }: PlanetsTableRowProps) => {
  const [planets, setPlanets] = useState<number []>([]);
  
  return (
    <RowContext.Provider value={{ setMaxPlanets: setPlanets, planets }}>
      <DashiTableRow row={row} type={type} isAgesDisabled={isAgesDisabled} maxPlanets={maxPlanets} />
    </RowContext.Provider>
  );
};

export default Row;
