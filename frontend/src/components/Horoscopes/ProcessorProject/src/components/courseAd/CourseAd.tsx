import React, { useMemo } from 'react';
import background from './assets/background.png';
import styles from './CourseAdd.module.scss';
import { Grid, Typography } from '@mui/material';
import Slider from './components/Slider';

interface CourseAdProps {
  isPriceShowed?: boolean,
  course: any
}

const CourseAd = ({ isPriceShowed, course }: CourseAdProps) => {
  const marks = useMemo(() => [{ value: 0 }, { value: 33 }, { value: 66 }, { value: 100 }], []);

  return (
    <div style={{ paddingRight: '1px' }}>
      <div className={styles.main}>
        <img width={'100%'} src={background} className={styles.image}/>
        <div className={styles.timeHint}>
          Скоро
        </div>
        <Grid container pl={2} pb={2} mt={'auto'} direction={'column'} zIndex={2}>
          <Grid item>
            <Typography fontFamily={'Playfair Display'} fontWeight={700} fontSize={'18px'} color={'white'}>
              {course.name}
            </Typography>
          </Grid>
          <Grid item>
            <Typography fontFamily={'Gilroy'} fontWeight={400} fontSize={'12px'} color={'white'}>
              Дата старта {course.date}
            </Typography>
          </Grid>
        </Grid>
      </div>
      <Slider
        marks={marks}
        valueLabelDisplay="on"
        value={course.days_value}
        valueLabelFormat={() => course.days}
      />
      {isPriceShowed &&
        <>
          <Grid container>
            <Grid pr={'5px'} item color={'#000000'} fontWeight={600} fontSize={'18px'} fontFamily={'Gilroy'}>
              19₽
            </Grid>
            <Grid item sx={{ textDecorationLine: 'line-through' }} color={'rgba(0, 0, 0, 0.3)'} fontWeight={600} fontSize={'18px'} fontFamily={'Gilroy'}>
              20₽
            </Grid>
          </Grid>
          <Grid pt={'5px'} item color={'#000000'} fontWeight={600} fontSize={'14px'} fontFamily={'Gilroy'}>
            до {course.date}
          </Grid>
          <Grid pt={'5px'} item color={'#59ABDA'} fontWeight={400} fontSize={'14px'} fontFamily={'Gilroy'}>
            Подробнее
          </Grid>
        </>
      }
    </div>
  );
};

export default CourseAd;
