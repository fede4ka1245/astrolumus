import React from 'react';
import styles from './Table.module.scss';
import Row from './Row';
import { Typography } from '@mui/material';

const DashiTable = () => {
  return (
    <table className={styles.table} cellSpacing="0" cellPadding="0">
      <tr className={styles.dashiTableHead}>
        <th>
          Стрелец
        </th>
        <th>
          05/05/2011
        </th>
        <th>
          05/05/2027
        </th>
      </tr>
      <tr className={styles.dashiMenuRow}>
        <td>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <svg width="7" height="14" viewBox="0 0 7 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.5 1.5L1.25905 6.68338C1.10836 6.86756 1.10836 7.13244 1.25905 7.31662L5.5 12.5" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <Typography fontFamily={'Gilroy'} fontWeight={700} color={'#37366B'} fontSize={'18px'} pl={2}>
              Сатурн
            </Typography>
          </div>
        </td>
        <td>
          <Typography fontFamily={'Gilroy'} fontWeight={700} color={'#37366B'} fontSize={'18px'}>
            05/05/2011
          </Typography>
        </td>
        <td>
          <Typography fontFamily={'Gilroy'} fontWeight={700} color={'#37366B'} fontSize={'18px'}>
            05/05/2027
          </Typography>
        </td>
      </tr>
      <tr>
        <td>
          <Typography fontFamily={'Gilroy'} fontWeight={500} color={'white'} fontSize={'15px'}>
            Сатурн
          </Typography>
        </td>
        <td>
          <Typography fontFamily={'Gilroy'} fontWeight={500} color={'white'} fontSize={'15px'}>
            05/05/2011
          </Typography>
        </td>
        <td>
          <Typography fontFamily={'Gilroy'} fontWeight={500} color={'white'} fontSize={'15px'}>
            05/05/2027
          </Typography>
        </td>
      </tr>
      <tr>
        <td>
          <Typography fontFamily={'Gilroy'} fontWeight={500} color={'white'} fontSize={'15px'}>
            Сатурн
          </Typography>
        </td>
        <td>
          <Typography fontFamily={'Gilroy'} fontWeight={500} color={'white'} fontSize={'15px'}>
            05/05/2011
          </Typography>
        </td>
        <td>
          <Typography fontFamily={'Gilroy'} fontWeight={500} color={'white'} fontSize={'15px'}>
            05/05/2027
          </Typography>
        </td>
      </tr>
      <tr>
        <td>
          <Typography fontFamily={'Gilroy'} fontWeight={500} color={'white'} fontSize={'15px'}>
            Сатурн
          </Typography>
        </td>
        <td>
          <Typography fontFamily={'Gilroy'} fontWeight={500} color={'white'} fontSize={'15px'}>
            05/05/2011
          </Typography>
        </td>
        <td>
          <Typography fontFamily={'Gilroy'} fontWeight={500} color={'white'} fontSize={'15px'}>
            05/05/2027
          </Typography>
        </td>
      </tr>
      <tr>
        <td>
          <Typography fontFamily={'Gilroy'} fontWeight={500} color={'white'} fontSize={'15px'}>
            Сатурн
          </Typography>
        </td>
        <td>
          <Typography fontFamily={'Gilroy'} fontWeight={500} color={'white'} fontSize={'15px'}>
            05/05/2011
          </Typography>
        </td>
        <td>
          <Typography fontFamily={'Gilroy'} fontWeight={500} color={'white'} fontSize={'15px'}>
            05/05/2027
          </Typography>
        </td>
      </tr>
      <tr>
        <td>
          <Typography fontFamily={'Gilroy'} fontWeight={500} color={'white'} fontSize={'15px'}>
            Сатурн
          </Typography>
        </td>
        <td>
          <Typography fontFamily={'Gilroy'} fontWeight={500} color={'white'} fontSize={'15px'}>
            05/05/2011
          </Typography>
        </td>
        <td>
          <Typography fontFamily={'Gilroy'} fontWeight={500} color={'white'} fontSize={'15px'}>
            05/05/2027
          </Typography>
        </td>
      </tr>
    </table>
  );
};

export default DashiTable;
