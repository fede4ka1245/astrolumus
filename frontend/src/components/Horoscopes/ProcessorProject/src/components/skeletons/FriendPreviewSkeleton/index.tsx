import React from 'react';
import { Grid, Skeleton } from '@mui/material';

const FriendPreviewSkeleton = () => {
  return (
    <Grid container direction={'column'} justifyContent={'center'}>
      <Grid item display={'flex'} justifyContent={'center'} pb={1}>
        <Skeleton sx={{ borderRadius: '50%' }} variant={'rectangular'} height={'60px'} width={'60px'}/>
      </Grid>
      <Grid item color={'#292E30'} textAlign={'center'} fontSize={'12px'} fontWeight={400} fontFamily={'Gilroy'}>
        <Skeleton variant={'rectangular'} height={'20px'} width={'60px'}/>
      </Grid>
    </Grid>
  );
};

export default FriendPreviewSkeleton;
