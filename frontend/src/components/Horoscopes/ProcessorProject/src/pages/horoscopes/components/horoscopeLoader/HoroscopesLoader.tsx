import React from 'react';
import { Grid } from '@mui/material';
import Loader from '../../../../components/loader/Loader';

const HoroscopesLoader = () => {
  return (
    <Grid width={'100%'} height={'100%'} minHeight={'300px'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
      <Loader/>
    </Grid>
  );
};

export default HoroscopesLoader;
