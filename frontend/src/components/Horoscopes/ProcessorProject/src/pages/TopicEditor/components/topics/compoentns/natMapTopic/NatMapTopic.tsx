import React, { useState } from 'react';
import { Grid } from '@mui/material';
import Map from '../../../../../../components/map/Map';
import MapOptionsCard from '../../../../../../components/mapOptions/MapOptionsCard';
import { Option } from '../../../../../../models/types/Option';
import Table from '../../../../../../components/table/Table';

const mapOptions = [
  {
    value: 1,
    label: 'D1'
  },
  {
    value: 2,
    label: 'D2'
  },
  {
    value: 3,
    label: 'D3'
  },
  {
    value: 4,
    label: 'D4'
  },
  {
    value: 5,
    label: 'D5'
  },
  {
    value: 6,
    label: 'D5'
  },
  {
    value: 7,
    label: 'D5'
  },
  {
    value: 8,
    label: 'D5'
  },
  {
    value: 9,
    label: 'D5'
  },
  {
    value: 10,
    label: 'D5'
  },
  {
    value: 11,
    label: 'D5'
  }
];

const NatMapTopic = () => {
  const [mapTargetOptions, setMapTargetOptions] = useState<Option []>([]);

  return (
    <Grid pt={3} container direction={'column'}>
      <Grid item width={'100%'}>
        <MapOptionsCard
          options={mapOptions}
          title={'Натальная карта'}
          setTargetOptions={setMapTargetOptions}
          targetOptions={mapTargetOptions}
        />
      </Grid>
      <Grid item pt={2} width={'100%'}>
        <Map />
      </Grid>
      <Grid item pt={2} width={'calc(100% + 30px)'} ml={'-14px'} pl={'2px'} pr={'2px'}>
        <Table textColor={'black'} minimized={true} />
      </Grid>
    </Grid>
  );
};

export default NatMapTopic;
