import styles from './MasterClassForm.module.scss';
import { Grid, Typography } from '@mui/material';
import Video from '../video/Video';

const MasterClass = () => {
  return (
    <div className={styles.main}>
      <Grid container columnSpacing={2} p={1} direction={'row'}>
        <Grid item>
          <div
            style={{
              background: 'gray',
              width: '145px',
              height: '100%',
              borderRadius: '10px'
            }}
          >
            <Video />
          </div>
        </Grid>
        <Grid flex={1} item direction={'column'} paddingTop={2} paddingBottom={2} container rowSpacing={1}>
          <Grid item>
            <Typography fontFamily={'Gilroy'} fontWeight={700} fontSize={'18px'}>
              Прогнозы на политику
            </Typography>
          </Grid>
          <Grid item>
            <section className={styles.date}>
              19 сентября
            </section>
          </Grid>
          <Grid item>
            <Typography fontFamily={'Gilroy'} fontWeight={400} fontSize={'10px'}>
              В рамках мастер-класса вы получите новые знания по теме прогнозов на политические события.
            </Typography>
          </Grid>
          <Grid item>
            <Typography fontFamily={'Gilroy'} fontWeight={400} fontSize={'10px'}>
              Ведущий
            </Typography>
            <div className={styles.header}>
              Aнна приходько
            </div>
          </Grid>
          <Grid item>
            <section className={styles.join}>
              Участвовать
            </section>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default MasterClass;
