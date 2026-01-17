import React from 'react';
import styles from './ExpertMessage.module.scss';
import { Grid, Skeleton, Typography } from '@mui/material';
import reply from './assets/reply.svg';

const ExpertMessage = () => {
  return (
    <div className={styles.main}>
      <img src={reply} className={styles.reply}/>
      <Grid container direction={'column'} p={3}>
        <Grid item fontFamily={'Gilroy'} fontSize={'10px'} color={'white'} fontWeight={400} pt={1}>
          Ответ эксперта
        </Grid>
        <Grid container item direction={'column'} width={'100%'} alignItems={'center'}>
          <Grid item>
            <Skeleton variant={'circular'} width={'90px'} height={'90px'}/>
          </Grid>
          <Grid item pt={1} fontFamily={'Gilroy'} fontSize={'14px'} color={'white'} fontWeight={500}>
            Наталья Хвизюк
          </Grid>
        </Grid>
        <Grid item>
          <Typography p={1} textAlign={'center'} fontFamily={'Gilroy'} fontSize={'14px'} color={'white'} fontWeight={400}>
            Меня волнует один вопрос - когда я пробую создать прогноз на политическое событие - у меня не рождается идей, как можно это провернуть, можете подсказать мне варианты решения проблемы, пожалуйста?
          </Typography>
        </Grid>
        <Grid item pt={3} textAlign={'center'} fontFamily={'Gilroy'} fontSize={'14px'} color={'white'} fontWeight={400}>
          Прочитало 21 человек
        </Grid>
      </Grid>
    </div>
  );
};

export default ExpertMessage;
