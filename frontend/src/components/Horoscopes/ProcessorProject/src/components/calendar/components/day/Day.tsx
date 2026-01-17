import React from 'react';
import styles from './Day.module.scss';
import { Typography } from '@mui/material';
import classNames from 'classnames';

type DayType = 'Gold' | 'White' | 'Purple';

interface DayProps {
  day?: string | number,
  additionalInfo?: string | number,
  dayType?: DayType
}

const Day = ({ day, additionalInfo, dayType }: DayProps) => {
  return (
    <div className={classNames(styles.main, { [styles.gold]: dayType === 'Gold', [styles.purple]: dayType === 'Purple' })}>
      <Typography p={'4px'} fontWeight={500} fontFamily={'Gilroy'} fontSize={'16px'}>
        {day}
      </Typography>
      {!!additionalInfo && <span className={styles.additionalInfo}>
        {additionalInfo}
      </span>}
    </div>
  );
};

export default Day;
