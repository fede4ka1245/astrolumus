import React, { useCallback, useState } from 'react';
import styles from './Table.module.scss';
import Row from './Row';
import { Typography } from '@mui/material';

export interface TableProps {
  textColor?: string,
  minimized?: boolean,
}

const Table = ({ textColor, minimized }: TableProps) => {
  const [isMinimized, setIsMinimized] = useState<boolean>(!!minimized);

  const toggleIsMinimized = useCallback(() => {
    setIsMinimized(!isMinimized);
  }, [isMinimized]);

  return (
    <>
      <table style={{ color: textColor || 'white' }} className={styles.table} cellSpacing="0" cellPadding="0">
        <th>
          Асцендент
        </th>
        <th>
        </th>
        <th>
          Знак
        </th>
        <th>
          Градусы
        </th>
        <th>
          Накшатра
        </th>
        <>
          { isMinimized
            ? (
              <>
                {
                  Array.from({ length: 3 }).map((_, index) => (
                    <Row key={index} textColor={textColor}/>
                  ))
                }
              </>
            )
            : (
              <>
                {
                  Array.from({ length: 10 }).map((_, index) => (
                    <Row key={index} textColor={textColor}/>
                  ))
                }
              </>
            )}
        </>
      </table>
      {isMinimized && <Typography pt={1} onClick={toggleIsMinimized} fontFamily={'Gilroy'} fontWeight={500} fontSize={'16px'} color={'#5c5b9f'} textAlign={'center'}>
        Развернуть таблицу
      </Typography>}
    </>
  );
};

export default Table;
