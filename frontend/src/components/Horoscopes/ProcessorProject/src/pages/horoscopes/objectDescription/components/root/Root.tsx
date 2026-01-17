import React, { useMemo, useState } from 'react';
import { RootProps } from '../../types/RootProps';
import { Grid } from '@mui/material';
import styles from './Root.module.scss';

const TabsSkeleton: React.FC<RootProps> = ({ object }) => {
  return (
    <>
      <Grid display={'flex'} flexDirection={'column'}>

      </Grid>
    </>
  );
};

const Root: React.FC<RootProps> = ({ object }) => {
  const html = useMemo(() => {
    return { __html: object?.description || '' };
  }, [object]);
  
  return (
    <>
      <Grid display={'flex'} flexDirection={'column'}>
        <Grid mb={2} className={styles.header}>
          {object?.name}
        </Grid>
        <Grid className={styles.desc}>
          <p
            dangerouslySetInnerHTML={html}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Root;
