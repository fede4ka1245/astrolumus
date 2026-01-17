import { FC } from 'react';
import { Grid, Typography, Skeleton } from '@mui/material';

const DraftSkeleton = () => {
  return (
    <Grid container display={'flex'}>
      <Grid item container direction={'column'} flex={1} mr={2}>
        <Grid item>
          <Skeleton width={'100%'} style={{ borderRadius: '6px' }} height={'30px'}/>
        </Grid>
        <Grid item>
          <Skeleton width={'200px'} style={{ borderRadius: '6px' }} height={'26px'}/>
        </Grid>
        <Grid item>
          <Skeleton width={'90px'} style={{ borderRadius: '6px' }} height={'26px'}/>
        </Grid>
      </Grid>
      <Grid>
        <Skeleton style={{ borderRadius: '6px' }} width={'25px'} height={'40px'}/>
      </Grid>
    </Grid>
  );
};

export default DraftSkeleton;
