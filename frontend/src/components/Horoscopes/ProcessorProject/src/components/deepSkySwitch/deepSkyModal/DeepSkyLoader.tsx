import React from 'react';
import { Grid, Skeleton } from '@mui/material';

const DeepSkyLoader = () => {
  return (
    <Grid display={'flex'} flexDirection={'column'} height={'100%'} p={2}>
      <Skeleton sx={{ height: '160px', background: 'rgba(255, 255, 255, 0.6)', borderRadius: '20px' }} variant={'rectangular'} />
      <Skeleton sx={{ mt: 2, height: '100px', background: 'rgba(255, 255, 255, 0.6)', borderRadius: '20px' }} variant={'rectangular'} />
      <Skeleton sx={{ mt: 2, height: '80px', background: 'rgba(255, 255, 255, 0.6)', borderRadius: '20px' }} variant={'rectangular'} />
    </Grid>
  );
};

export default React.memo(DeepSkyLoader);
