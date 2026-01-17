import React from 'react';
import styles from './YearMasterTable.module.scss';
import { Grid } from '@mui/material';
import { YearMasterTableRow } from '../../../../models/types/YearMasterTableRow';
import { translatePlanetName } from '../../../../helpers/translatePlanetName';
import { useGetLanguage } from '../../../../store/selectors';
import ZodiacSign from '../../../../components/zodiacSign/ZodiacSign';
import { getFormattedZodiacSign } from '../../../../helpers/getFormattedZodiacSign';
import { ZodiacSignType } from '../../../../models/enums/ZodiacSign';
import { translateVarshaRole } from '../../../../helpers/translateVarshaRole';

const YearMasterTable = ({ rows }: { rows: YearMasterTableRow [] }) => {
  const language = useGetLanguage();

  return (
    <div className={styles.table}>
      <Grid>
        <Grid item pl={2}>
          Роль
        </Grid>
        <Grid item pl={2}>
          Знак
        </Grid>
        <Grid item pl={2}>
          Планета
        </Grid>
        <Grid item textAlign={'center'}>
          ПВБ
        </Grid>
      </Grid>
      {rows?.map((row: any, index: number) => (
        <Grid key={index} alignItems={'center'}>
          <Grid item fontWeight={700} fontSize={'16px'} lineHeight={'16px'} fontFamily={'Gilroy'} pl={2}>
            {translateVarshaRole(row.role, language)}
          </Grid>
          <Grid item ml={2} width={'28px'} height={'20px'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
            { getFormattedZodiacSign(row.sign) && <ZodiacSign zodiacSign={getFormattedZodiacSign(row.sign) as ZodiacSignType} /> }
          </Grid>
          <Grid item pl={2} color={'#37366B'} fontSize={'20px'} font-weight={500}>
            {translatePlanetName(row.planet, language) || '-'}
          </Grid>
          <Grid item textAlign={'center'} fontSize={'20px'} color={'#1EBA37'} fontWeight={700}>
            {row.pvb || '-'}
          </Grid>
        </Grid>
      ))}
    </div>
  );
};

export default YearMasterTable;
