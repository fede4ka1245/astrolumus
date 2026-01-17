import React from 'react';
import { Grid, Skeleton } from '@mui/material';

const MyHoroscopeLoader = () => {
  return (
    <Grid display={'flex'}>
      <Skeleton sx={{ width: '60px', height: '60px', background: 'rgba(255, 255, 255, 0.6)', borderRadius: '10px' }} variant={'rectangular'} />
      <Skeleton sx={{ flex: '1', ml: '7px', height: '60px', background: 'rgba(255, 255, 255, 0.6)', borderRadius: '10px' }} variant={'rectangular'} />
    </Grid>
  );
};

export default React.memo(MyHoroscopeLoader);
