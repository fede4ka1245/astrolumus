import React, { useCallback, useMemo, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import styles from './YogasTable.module.scss';
import { YogaTableRow } from '../../models/types/YogaTable';
import Modal from '../modal/Modal';
import { getYoga } from './yogasDescrirptions';
import { translatePlanetName } from '../../helpers/translatePlanetName';
import { useGetLanguage } from '../../store/selectors';

interface YogasTableRowProps {
  row: YogaTableRow
}

const YogasTableRow = ({ row }: YogasTableRowProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleIsModalOpen = useCallback(() => {
    setIsModalOpen(!isModalOpen);
  }, [isModalOpen]);

  const badgeBackground = useMemo(() => {
    return row.yoga?.type === 'important' ? '#ff7474' : row.yoga?.type === 'success' ? '#1eba37' : '#625b89';
  }, [row]);

  const connectionColor = useMemo(() => {
    return row.connection?.type === 'red' ? '#ff7474' : row.connection?.type === 'green' ? '#1eba37' : 'white';
  }, [row]);

  const language = useGetLanguage();

  const planets = useMemo(() => {
    return [...row.planets.map((name) => translatePlanetName(name, language))];
  }, [row.planets, language]);

  return (
    <Grid container display={'flex'} className={styles.row} alignItems={'center'} onClick={toggleIsModalOpen}>
      <Modal height={'var(--modal-page-height)'} isOpen={isModalOpen} close={toggleIsModalOpen}>
        <Grid p={2} sx={{ background: 'white', overflow: 'scroll' }} minHeight={'100%'}>
          <Typography fontWeight={'bold'} fontFamily={'Gilroy'} fontSize={'20px'}>
            {getYoga(row.yoga?.fullName || '')?.name}
          </Typography>
          {row.yoga?.fullName && <Typography whiteSpace={'pre-wrap'} pt={1} fontFamily={'Gilroy'} fontSize={'16px'} color={'#5B6062'}>
            {getYoga(row.yoga?.fullName || '')?.description}
          </Typography>}
        </Grid>
      </Modal>
      <Grid item flex={1} pl={2} fontFamily={'Gilroy'} fontSize={'18px'} fontWeight={'700'} color={'white'}>
        {planets?.join(' - ')}
      </Grid>
      <Grid item pr={2} fontFamily={'Gilroy'} fontSize={'18px'} fontWeight={'700'} color={connectionColor}>
        {row?.connection?.connection}
      </Grid>
      <Grid item pr={2} fontFamily={'Gilroy'} fontSize={'18px'} fontWeight={'700'} color={'white'}>
        <Grid container className={styles.badge} sx={{ backgroundColor: badgeBackground }}>
          <Grid item>
            {row?.yoga?.number}
          </Grid>
          <Grid item pl={'4px'} pr={'4px'} display={'flex'} alignItems={'center'}>
            {row.yoga?.resize === 'connecting'
              ? (
                <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.88986 2.61093L3.22285 9.27793M9.88986 2.61093L9.88986 6.50001M9.88986 2.61093L6.00077 2.61093" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2.11251 10.3891L8.77952 3.72206M2.11251 10.3891L6.0016 10.3891M2.11251 10.3891L2.11251 6.49998" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )
              : row.yoga?.resize === 'connecting'
                ? (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g opacity="0.3">
                      <path d="M8 10L1 17M8 10V14.0833M8 10L3.91667 10" stroke="#292E30" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10 8L17 1M10 8H14.0833M10 8V3.91665" stroke="#292E30" strokeWidth="2" strokeLinecap="round"
                        strokeLinejoin="round"/>
                    </g>
                  </svg>
                )
                : (
                  <svg width="4" height="5" viewBox="0 0 4 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect opacity="0.3" y="0.5" width="4" height="4" rx="2" fill="#292E30"/>
                  </svg>
                )}
          </Grid>
          <Grid item>
            {getYoga(row.yoga?.fullName || '')?.shortName || row.yoga.name}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default YogasTableRow;
