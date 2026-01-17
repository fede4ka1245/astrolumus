import React, { useCallback, useState } from 'react';
import styles from './DegreeTable.module.scss';
import { Grid, Typography } from '@mui/material';
import { DegreeTableRow as IDegreeTableRow } from '../../models/types/DegreeTableRow';
import DegreeTableRow from './degreeTableRow/DegreeTableRow';
import { useGetIsHelpersElementsActive } from '../../hooks/useGetIsHelpersElementsActive';
import { DegreeTableParts } from '../../models/types/DegreeTable';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';

interface DegreeTableProps {
  table?: DegreeTableParts,
  isDeepSkyActive?: boolean,
}

const DegreeTable = ({ table, isDeepSkyActive }: DegreeTableProps) => {
  const [isTableExpanded, setIsTableExpanded] = useState(false);

  const toggleIsTableExpanded = useCallback(() => {
    setIsTableExpanded(!isTableExpanded);
  }, [isTableExpanded]);

  const {
    isTranssaturnsActive,
    isMandyAndGulikaActive,
    isSpecialLagnaActive,
    isUpagrahsActive
  } = useGetIsHelpersElementsActive();

  return (
    <div className={styles.table}>
      <section className={styles.row} style={{ height: '20px' }}>
        <Grid pl={1} className={styles.header}>
          Планета
        </Grid>
        <Grid className={styles.header}>

        </Grid>
        <Grid className={styles.header}>
          Знак
        </Grid>
        <Grid className={styles.header}>
          Градусы
        </Grid>
        <Grid className={styles.header}>
          Накшатра
        </Grid>
      </section>
      {table?.primaryData?.map((degreeItem: IDegreeTableRow, index) => (
        <DegreeTableRow degreeTableRow={degreeItem} key={index} isDeepSkyActive={isDeepSkyActive} />
      ))}
      {isTranssaturnsActive && table?.transsaturns?.map((degreeItem: IDegreeTableRow, index) => (
        <DegreeTableRow degreeTableRow={degreeItem} key={index} isDeepSkyActive={isDeepSkyActive} />
      ))}
      <Collapse in={isTableExpanded} timeout="auto" unmountOnExit>
        <>
          {isSpecialLagnaActive && table?.specialLagna?.map((degreeItem: IDegreeTableRow, index) => (
            <DegreeTableRow degreeTableRow={degreeItem} key={index} isDeepSkyActive={isDeepSkyActive} />
          ))}
          {isMandyAndGulikaActive && table?.mandyGulika?.map((degreeItem: IDegreeTableRow, index) => (
            <DegreeTableRow degreeTableRow={degreeItem} key={index} isDeepSkyActive={isDeepSkyActive} />
          ))}
          {isUpagrahsActive && table?.primaryUpagraha?.map((degreeItem: IDegreeTableRow, index) => (
            <DegreeTableRow degreeTableRow={degreeItem} key={index} isDeepSkyActive={isDeepSkyActive} />
          ))}
        </>
      </Collapse>
      {(isSpecialLagnaActive || isMandyAndGulikaActive || isUpagrahsActive) && <ListItemButton onClick={toggleIsTableExpanded}>
        <ListItemText primary={<Typography fontFamily={'Gilroy'} color={'white'} fontSize={'16px'} fontWeight={500}>
          {!isTableExpanded ? 'Развернуть таблицу' : 'Свернуть таблицу'}
        </Typography>} />
        {isTableExpanded ? <ExpandLess fill={'white'} style={{ color: '#fff' }} /> : <ExpandMore style={{ color: '#fff' }} />}
      </ListItemButton>}
    </div>
  );
};

export default DegreeTable;
