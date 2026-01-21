import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ButtonBase, Grid } from '@mui/material';
import IconButton from '../iconButton/IconButton';
import styles from './DashiTable.module.scss';
import { DashiTableRow as IDashiTableRow } from '../../models/types/DashiTableRow';
import classNames from 'classnames';
import { translatePlanetName } from '../../helpers/translatePlanetName';
import Collapse from '@mui/material/Collapse';
import { translateZodiacSign } from '../../helpers/translateZodiacSign';
import { useGetHoroscopeUserInfo, useGetLanguage } from '../../store/selectors';
import moment from 'moment';
import { RowContext } from './RowContext';

interface PlanetsTableRowProps {
  row: IDashiTableRow,
  type?: 'vim' | 'chara',
  isAgesDisabled?: boolean,
  maxPlanets?: number
}

const getIsCurrentDates = (dateStart: string, dateEnd: string) => {
  const [dayStart, monthStart, yearStart] = dateStart.split(' ')[0].split('.').map(Number);
  const [dayEnd, monthEnd, yearEnd] = dateEnd.split(' ')[0].split('.').map(Number);

  return new Date(yearStart, monthStart - 1, dayStart).getTime() < new Date().getTime() && new Date().getTime() < new Date(yearEnd, monthEnd - 1, dayEnd).getTime();
};

function removeItemOnce (arr: any [], value: any) {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

const DashiTableRow = ({ row, type, isAgesDisabled, maxPlanets }: PlanetsTableRowProps) => {
  const { planets, setMaxPlanets } = useContext(RowContext);
  const [isOpen, setIsOpen] = useState(false);
  const language = useGetLanguage();
  const userInfo = useGetHoroscopeUserInfo();

  const planetsRowItem = useMemo(() => {
    const planetsCount = row.planets?.length ?? 0;

    if (planetsCount + 1 >= 3) {
      return `... / ${type === 'chara'
        ? translateZodiacSign(row.planet, language)
        : translatePlanetName(row.planet, language)}`;
    }

    if (type === 'chara') {
      return row.planets?.length ? `${[...row.planets.map((planet) => translateZodiacSign(planet, language))].join(' / ')} / ${translateZodiacSign(row.planet, language)}` : translateZodiacSign(row.planet, language);
    }

    return row.planets?.length ? `${[...row.planets.map((planet) => translatePlanetName(planet, language))].join(' / ')} / ${translatePlanetName(row.planet, language)}` : translatePlanetName(row.planet, language);
  }, [row, type, language]);
  
  const isCurrentDates = useMemo(() => {
    return getIsCurrentDates(row.dateStart, row.dateEnd);
  }, [row]);

  const isMainRow = useMemo(() => {
    const max = Math.max(...planets);

    return !row.planets.length || max > row.planets.length;
  }, [row, planets]);

  const isSubTableAvailable = useMemo(() => {
    return !!row.subTable?.length && (maxPlanets || 4) > row.planets.length;
  }, [maxPlanets, row.planets.length, row.subTable?.length]);

  useEffect(() => {
    if (!setMaxPlanets || !planets) {
      return;
    }

    setMaxPlanets((currentPlanets: number []) => [...currentPlanets, row.planets.length]);
    
    return () => {
      setMaxPlanets((currentPlanets: number []) => {
        return removeItemOnce([...currentPlanets], row.planets.length);
      });
    };
  }, [row.planets.length, setMaxPlanets]);

  const isBirthRow = useMemo(() => {
    return row.planets.length >= 0 && row.planets.length <= 1 && !isAgesDisabled;
  }, [row.planets.length, isAgesDisabled]);

  const birthAge = useMemo(() => {
    if (!isBirthRow || !userInfo?.date) {
      return '';
    }

    const birthday = moment(userInfo.date, 'DD.MM.YYYY');
    const currentDate = moment(row.dateStart, 'DD.MM.YYYY');
    const monthsDiff = currentDate.diff(birthday, 'months');

    if (monthsDiff < 0) {
      return '';
    }

    const years = (monthsDiff / 12).toFixed(1);

    return `(${years} лет)`;
  }, [isBirthRow, userInfo?.date, row.dateStart]);

  const handleRowClick = useCallback(() => {
    if (isSubTableAvailable) {
      setIsOpen(!isOpen);
    }
  }, [isOpen, isSubTableAvailable]);

  return (
    <>
      <ButtonBase
        className={classNames(
          { [styles.birthRow]: isBirthRow, [styles.row]: !isBirthRow },
          { [styles.clickable]: isSubTableAvailable },
          { [styles.currentRow]: isCurrentDates }
        )}
        onClick={handleRowClick}
        disabled={!isSubTableAvailable}
        component="div"
      >
        <Grid container className={classNames(styles.rowItem, { [styles.isOpen]: isOpen, [styles.isMain]: isMainRow, [styles.isCurrent]: isCurrentDates })}>
          <Grid item display={'flex'} alignItems={'center'} justifyContent={'center'}>
            {isSubTableAvailable && <IconButton fillStyle={{ width: '25px', height: '25px' }}>
              {!isOpen && <svg width="14" height="14" viewBox="0 0 7 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1.5L5.24095 6.68338C5.39164 6.86756 5.39164 7.13244 5.24095 7.31662L1 12.5" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
              </svg>}
              {isOpen && <svg width="14" height="14" viewBox="0 0 13 8" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1.75L6.81662 5.99095C6.63244 6.14164 6.36756 6.14164 6.18338 5.99095L1 1.75" stroke="#37366B" strokeWidth="2" strokeLinecap="round"/>
              </svg>}
            </IconButton>}
          </Grid>
          <Grid item pl={'5px'}>
            { planetsRowItem }
          </Grid>
        </Grid>
        <Grid className={classNames(styles.rowItem, { [styles.isOpen]: isOpen, [styles.isMain]: isMainRow, [styles.isCurrent]: isCurrentDates })}>
          <Grid item>
            {row.dateStart} {birthAge && <span className={styles.age}>{birthAge}</span>}
          </Grid>
        </Grid>
        <Grid className={classNames(styles.rowItem, { [styles.isOpen]: isOpen, [styles.isMain]: isMainRow, [styles.isCurrent]: isCurrentDates })}>
          {row.dateEnd}
        </Grid>
      </ButtonBase>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <div className={classNames(styles.container, { [styles.outlined]: isMainRow })}>
          {row.subTable?.map((row, index) => (
            <DashiTableRow row={row} key={index} type={type} />
          ))}
        </div>
      </Collapse>
    </>
  );
};

export default DashiTableRow;
