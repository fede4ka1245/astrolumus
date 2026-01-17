import React, { useState } from 'react';
import { Grid } from '@mui/material';
import MapOptionsCard from '../../../../../../components/mapOptions/MapOptionsCard';
import { Option } from '../../../../../../models/types/Option';
import map from './map.svg';

const mapOptions = [
  {
    value: 1,
    label: 'САВ'
  },
  {
    value: 2,
    label: 'БАВ Ас'
  },
  {
    value: 3,
    label: 'БАВ Со'
  },
  {
    value: 4,
    label: 'БАВ Ма'
  },
  {
    value: 5,
    label: 'БАВ Ме'
  },
  {
    value: 6,
    label: 'БАВ Юп'
  },
  {
    value: 7,
    label: 'БАВ Ве'
  },
  {
    value: 8,
    label: 'БАВ Са'
  }
];

const AshtakvargaTopic = () => {
  const [mapTargetOptions, setMapTargetOptions] = useState<Option []>([]);

  return (
    <Grid pt={3} container direction={'column'}>
      <Grid item>
        <MapOptionsCard
          options={mapOptions}
          title={'Аштакаварга, до 3х карт'}
          setTargetOptions={setMapTargetOptions}
          targetOptions={mapTargetOptions}
          limit={3}
        />
      </Grid>
      <Grid item pt={2} width={'100%'}>
        <img src={map} width={'100%'}/>
      </Grid>
    </Grid>
  );
};

export default AshtakvargaTopic;
