import React, { useMemo } from 'react';
import northMap from './northMap.svg';
import southMap from './southMap.svg';
import { AshtakavargaTable as AshtakavargaTableProps } from '../../../../models/types/AshtakavargaTable';
import { Grid, Typography } from '@mui/material';
import '../../../../components/map/NorthMap.scss';
import '../../../../components/map/SouthMap.scss';
import { MapTypeEnum } from '../../../../models/types/MapType';
import classNames from 'classnames';
import southMapMark from './southMapMark.svg';
import { translatePlanetName } from '../../../../helpers/translatePlanetName';
import { useGetLanguage } from '../../../../store/selectors';
import { translateAshtakavargaType } from '../helpers/translateAshtakavargaType';

const AshtakavargaTable = ({ table, tableName, mapType, firstHouse = 0, type }: AshtakavargaTableProps) => {
  const ashtakavarga = useMemo(() => {
    if (mapType === MapTypeEnum.South) {
      const sorted = [...table];

      sorted.sort((a, b) => a.signId - b.signId);

      return sorted;
    }

    return table;
  }, [mapType, table]);
  const lang = useGetLanguage();

  return (
    <>
      <Typography fontFamily={'Playfair Display'} fontSize={'18px'} fontWeight={700} color={'white'} pb={2}>
        {type ? `${translateAshtakavargaType(type, lang)} ${translatePlanetName(tableName, lang)}` : translateAshtakavargaType(tableName, lang)}
      </Typography>
      <section className={classNames({ 'astro-processor-north-map': mapType === MapTypeEnum.North, 'astro-processor-south-map': mapType === MapTypeEnum.South })}>
        <div style={{ aspectRatio: '1 / 1', zIndex: 1 }}>
          {mapType === MapTypeEnum.North && <img src={northMap} className={'image'}/>}
          {mapType === MapTypeEnum.South && <img src={southMap} className={'image'}/>}
        </div>
        {ashtakavarga?.map(({ mainInfo, isHighlighted, signId }, index) => (
          <div key={index} className={`sector sector-${index + 1}`}>
            <div className={'info'}>
              <Typography color={'#292E30'} fontWeight={'bold'} fontFamily={'Gilroy'}>
                {mainInfo}
              </Typography>
              {index === 0 && mapType === MapTypeEnum.North && <Typography pt={2} color={'#17BB6D'} fontWeight={'bold'} fontFamily={'Gilroy'}>
                {firstHouse}
              </Typography>}
            </div>
            {isHighlighted && mapType === MapTypeEnum.North && <div className={'highlighted'} style={{ background: 'rgba(255, 197, 197, 0.6)' }}/>}
            {isHighlighted && mapType === MapTypeEnum.South && (
              <Grid position={'absolute'} left={0} bottom={0} width={'30%'} height={'30%'}>
                <img src={southMapMark} width={'100%'} height={'100%'}/>
              </Grid>
            )}
          </div>
        ))}
      </section>
    </>
  );
};

export default AshtakavargaTable;
