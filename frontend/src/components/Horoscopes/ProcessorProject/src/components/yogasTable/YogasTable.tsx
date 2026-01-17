import React from 'react';
import styles from './YogasTable.module.scss';
import YogasTableRow from './YogasTableRow';
import { YogaTableRow } from '../../models/types/YogaTable';

interface YogasTableProps {
  rows: YogaTableRow []
}

const YogasTable = ({ rows }: YogasTableProps) => {
  return (
    <div className={styles.main}>
      {rows.map((row: any) => (
        <YogasTableRow row={row} key={row?.planets?.join(' - ')}/>
      ))}
    </div>
  );
};

export default YogasTable;
