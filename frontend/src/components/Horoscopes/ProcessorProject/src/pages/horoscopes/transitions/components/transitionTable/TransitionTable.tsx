import React, { useCallback } from 'react';
import { TransitionsTableRow } from '../../../../../models/types/TransitionsTableRow';
import styles from './TransitionTable.module.scss';
import { ButtonBase, Grid, IconButton } from '@mui/material';
import { translatePlanetName } from '../../../../../helpers/translatePlanetName';
import { useGetLanguage } from '../../../../../store/selectors';
import { translateZodiacSign } from '../../../../../helpers/translateZodiacSign';

interface TransitionTableProps {
  rows: TransitionsTableRow [],
  planetsNames?: string []
}

const TransitionTable = ({ rows, planetsNames }: TransitionTableProps) => {
  const language = useGetLanguage();

  const onLastDateClick = useCallback(() => {
    alert('Чтобы увидеть действительную дату окончания транзита расширьте интервал дат');
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.row}>
        <Grid container>
          {planetsNames?.map((name: string, index) => (
            <Grid className={styles.header} key={index} width={'50%'} textAlign={'center'}>
              {translatePlanetName(name, language)}
            </Grid>
          ))}
        </Grid>
        <div className={styles.header}>
          Дата начала
        </div>
        <div className={styles.header}>
          Дата окончания
        </div>
      </div>
      {
        rows.map((row, index) => (
          <div key={index} className={styles.row}>
            <Grid container alignItems={'center'} height={'90%'}>
              {row.signs.map((sign, index) => (
                <Grid ml={'5px'} key={index} className={styles.planet}>
                  <div>
                    {translateZodiacSign(sign.sign, language)} {sign.motionType}
                  </div>
                </Grid>
              ))}
            </Grid>
            <div>
              {row.dateStart}
            </div>
            {row.endDateLessThanActual
              ? (
                <ButtonBase onClick={onLastDateClick}>
                  <Grid display={'flex'} alignItems={'center'}>
                    <Grid color={'red'}>
                      {row.dateEnd}
                    </Grid>
                    <Grid ml={'3px'}>
                      <IconButton>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="1" y="1" width="18" height="18" rx="9" fill="#C4C4C4" stroke="#C3C9CD" strokeWidth="2"/>
                          <path d="M7.5 6.66667C7.5 6.66667 8.33333 5 10 5C11.6667 5 12.2594 5.91974 12.5 6.66667C13.0634 8.41562 11.25 9.58333 11.25 9.58333C11.25 9.58333 10 10.6607 10 11.25C10 11.6667 10 12.0833 10 12.0833" stroke="#282363" strokeWidth="2" strokeLinecap="round"/>
                          <circle cx="10.0007" cy="14.7917" r="1.04167" fill="#282363"/>
                        </svg>
                      </IconButton>
                    </Grid>
                  </Grid>
                </ButtonBase>
              )
              : <div>
                {row.dateEnd}
              </div>
            }
          </div>
        ))
      }
    </div>
  );
};

export default TransitionTable;
