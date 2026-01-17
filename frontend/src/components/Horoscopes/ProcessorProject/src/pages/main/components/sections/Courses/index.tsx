import { FC, useCallback } from 'react';
import { Grid, Button as MuiButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// routes 
import { routes } from '../../../../../models/enums/routes';

// components
import CourseAd from '../../../../../components/courseAd/CourseAd';
import Button from '../../../../../components/button/Button';

// styles
import styles from '../../../styles.module.scss';

const courses = [
  {
    id: 1,
    name: 'Мини курс',
    date: '12.02.2023',
    days_value: 66,
    days: '10 дней'
  },
  {
    id: 2,
    name: 'Доп. курсы',
    date: '2.05.2023',
    days_value: 90,
    days: '3 дня'
  },
  {
    id: 3,
    name: 'Мастер классы',
    date: '13.01.2023',
    days_value: 40,
    days: '20 дней'
  }
];

const Courses: FC = () => {
  const navigate = useNavigate();

  const navigateToCourse = useCallback(() => {
    navigate(routes.Courses);
  }, []);

  return (
    <Grid container direction={'column'}>
      <Grid item pl={2} pr={2} pt={3} display={'flex'} justifyContent={'space-between'}>
        <div className={styles.title}>
          Курсы
        </div>
        <MuiButton 
          onClick={navigateToCourse}
          endIcon={<>
            <svg width="6" height="12" viewBox="0 0 4 9" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.666016 8L2.81445 4.77735C2.92642 4.6094 2.92642 4.3906 2.81445 4.22265L0.666015 1" stroke="#ABB0B2" strokeLinecap="round"/>
            </svg>
          </>}>
          <Typography textTransform={'none'} color={'#ABB0B2'} fontWeight={400} fontSize={'14px'} fontFamily={'Gilroy'}>
            Все курсы
          </Typography>
        </MuiButton>
      </Grid>
      <Grid item container direction={'row'} wrap={'nowrap'} maxWidth={'100%'} pl={2} pr={2} pt={3} overflow={'scroll'}>
        {
          courses.map(item => (
            <Grid item minWidth={'180px'} pr={2} key={item.id}>
              <CourseAd isPriceShowed course={item}/>
            </Grid>
          ))
        }

      </Grid>
      <Grid item color={'#292E30'} fontWeight={700} fontSize={'24px'} fontFamily={'Playfair Display'} pl={2} pr={2} pt={2}>
        <Button text={'Все курсы'} onClick={navigateToCourse}/>
      </Grid>
    </Grid>
  );
};

export default Courses;
