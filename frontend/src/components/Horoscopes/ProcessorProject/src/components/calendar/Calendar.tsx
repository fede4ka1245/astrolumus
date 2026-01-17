import React, { useCallback, useMemo, useState } from 'react';
import styles from './Calendar.module.scss';
import { Grid, Typography } from '@mui/material';
import arrow from './assets/arrow.svg';
import Day from './components/day/Day';

export interface CalendarValue {
  month?: number,
  day?: number,
  year?: number,
}

const weekDays = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

function getDay (date: Date) {
  let day = date.getDay();
  if (day === 0) day = 7;
  return day - 1;
}

const months = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];

const Calendar = () => {
  const [date, setDate] = useState(new Date());

  const calendarDays = useMemo(() => {
    const _date = new Date(date.getFullYear(), date.getMonth());
    const days = [];
    const currentMonth = _date.getMonth();

    let week = [];
    for (let i = 0; i < getDay(_date); i++) {
      week.push('');
    }

    while (_date.getMonth() === currentMonth) {
      week.push(_date.getDate());

      if (getDay(_date) % 7 === 6) {
        days.push([...week]);
        week = [];
      }

      _date.setDate(_date.getDate() + 1);
    }

    if (getDay(_date) !== 0) {
      for (let i = getDay(_date); i < 7; i++) {
        week.push('');
      }
    }

    days.push(week);

    return days;
  }, [date]);

  const onButtonNextClick = useCallback(() => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1));
  }, [date]);

  const onButtonPrevClick = useCallback(() => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1));
  }, [date]);

  return (
    <Grid container direction={'column'}>
      <Grid container item justifyContent={'space-around'} alignItems={'center'} pb={3}>
        <Grid item>
          <div className={styles.arrow} onClick={onButtonPrevClick}>
            <img style={{ transform: 'rotate(180deg)' }} src={arrow}/>
          </div>
        </Grid>
        <Grid item display={'flex'} justifyContent={'center'} flexDirection={'column'} width={'150px'}>
          <Typography textTransform={'capitalize'} textAlign={'center'} fontFamily={'Playfair Display'} fontWeight={700} fontSize={'24px'} color={'#261C5C'}>
            {months[date.getMonth()]}
          </Typography>
          <Typography textAlign={'center'} fontFamily={'Gilroy'} fontWeight={400} fontSize={'14px'} color={'#979C9E'}>
            {date.getFullYear()}
          </Typography>
        </Grid>
        <Grid item>
          <div className={styles.arrow} onClick={onButtonNextClick}>
            <img src={arrow}/>
          </div>
        </Grid>
      </Grid>
      <Grid item>
        <table className={styles.main}>
          <tr>
            {weekDays.map((day) => (
              <th key={day} className={styles.weekday}>
                {day}
              </th>
            ))}
          </tr>
          {calendarDays.map((weekDays, index) => (
            <tr key={index}>
              {weekDays.map((day, index) => (
                <td key={`${day} ${index}`}>
                  <Day day={day} additionalInfo={index} dayType={index % 2 === 0 ? 'Gold' : index % 3 === 1 ? 'Purple' : 'White'}/>
                </td>
              ))}
            </tr>
          ))}
        </table>
      </Grid>
    </Grid>
  );
};

export default Calendar;
