import React from 'react';
import styles from './DashiTable.module.scss';
import { DashiTableRow as IDashiTableRow } from '../../models/types/DashiTableRow';
import Row from './Row';

interface DashiTableProps {
  rows?: IDashiTableRow[],
  type?: 'vim' | 'chara',
  isAgesDisabled?: boolean,
  maxPlanets?: number
}

const DashiTable = ({ rows, type, isAgesDisabled, maxPlanets }: DashiTableProps) => {
  return (
    <div className={styles.main}>
      {rows?.map((row, index) => (
        <Row row={row} type={type} maxPlanets={maxPlanets} isAgesDisabled={isAgesDisabled} key={index} />
      ))}
    </div>
  );
};

export default DashiTable;
