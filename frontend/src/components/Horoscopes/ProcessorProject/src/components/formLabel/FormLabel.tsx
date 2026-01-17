import React from 'react';
import { formLabelProps } from './FormLabelProps';
import { Grid, Typography } from '@mui/material';

const FormLabel = ({ label, subLabel } : formLabelProps) => {
  return (
    <>
      <Grid container direction={'column'} justifyContent={'flex-end'}>
        <Grid item>
          <Typography color={'white'} fontFamily={'Gilroy'} fontStyle={'normal'} fontWeight={'500'} fontSize={'14px'}>
            {label}
          </Typography>
        </Grid>
        {subLabel && <Grid item>
          <Typography color={'white'} fontFamily={'Gilroy'} fontStyle={'normal'} fontWeight={'500'} fontSize={'10px'}>
            {subLabel}
          </Typography>
        </Grid>}
      </Grid>
    </>
  );
};

export default FormLabel;
