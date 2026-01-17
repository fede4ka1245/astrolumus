import React from 'react';
import styles from './Message.module.scss';
import { Grid, Typography } from '@mui/material';
import photo from './photo.png';

const Message = () => {
  return (
    <section className={styles.main}>
      <Grid container alignItems={'center'} height={'100%'} direction={'row'} p={1} display={'flex'}>
        <Grid item>
          <img width={40} height={40} src={photo}/>
        </Grid>
        <Grid item container direction={'column'} flex={1} pl={2}>
          <Grid item>
            <Typography fontFamily={'Gilroy'} fontSize={'8px'} color={'#292E30'} fontWeight={400}>
              Екатерина Зуева
            </Typography>
          </Grid>
          <Grid item>
            <Typography fontFamily={'Gilroy'} fontSize={'12px'} color={'#292E30'} fontWeight={500}>
              Привет! Хотела с тобой обсудить ...
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </section>
  );
};

export default Message;
