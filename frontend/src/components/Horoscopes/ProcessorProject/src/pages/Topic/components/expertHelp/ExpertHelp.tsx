import React from 'react';
import styles from './ExpertHelp.module.scss';
import background from './assets/img.png';
import { Grid, Skeleton } from '@mui/material';
import Button from '../../../../components/button/Button';

const ExpertHelp = () => {
  return (
    <div className={styles.main}>
      <img src={background} className={styles.photo}/>
      <Grid container direction={'column'} p={2} zIndex={2}>
        <Grid item display={'flex'} justifyContent={'center'} zIndex={2}>
          <Skeleton sx={{ background: 'gray', mr: '-20px' }} variant={'circular'} width={'90px'} height={'90px'}/>
          <Skeleton sx={{ background: 'gray', mr: '-20px' }} variant={'circular'} width={'90px'} height={'90px'}/>
          <Skeleton sx={{ background: 'gray' }} variant={'circular'} width={'90px'} height={'90px'}/>
        </Grid>
        <Grid zIndex={2} item p={2} textAlign={'center'} color={'white'} fontFamily={'Gilroy'} fontWeight={400} fontSize={'14px'}>
          Получите экспертный комментарий и помощь опытного астролога.
        </Grid>
        <Grid item pb={1} pt={1}>
          <Button text={'Задать вопрос эксперту'}/>
        </Grid>
      </Grid>
    </div>
  );
};

export default ExpertHelp;
