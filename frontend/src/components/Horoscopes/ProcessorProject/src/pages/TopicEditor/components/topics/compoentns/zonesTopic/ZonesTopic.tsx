import React, { useState } from 'react';
import { Grid } from '@mui/material';
import MapOptionsCard from '../../../../../../components/mapOptions/MapOptionsCard';
import table from './table.svg';
import { Option } from '../../../../../../models/types/Option';

const mapOptions = [
  {
    value: 1,
    label: 'Сарватобхадра'
  },
  {
    value: 2,
    label: 'Чандра Каланала'
  },
  {
    value: 3,
    label: 'Шани'
  },
  {
    value: 4,
    label: 'Сурйа Каланала'
  },
  {
    value: 5,
    label: 'Сударшана'
  }
];

const ZonesTopic = () => {
  const [mapTargetOptions, setMapTargetOptions] = useState<Option []>([]);

  return (
    <Grid pt={3} container direction={'column'} overflow={'hidden'}>
      <Grid item width={'100%'}>
        <MapOptionsCard
          options={mapOptions}
          title={'Чакры'}
          setTargetOptions={setMapTargetOptions}
          targetOptions={mapTargetOptions}
          limit={3}
        />
      </Grid>
      <Grid item width={'calc(100% + 40px)'} ml={'-20px'}>
        <img src={table} width={'100%'}/>
      </Grid>
    </Grid>
  );
};

export default ZonesTopic;
