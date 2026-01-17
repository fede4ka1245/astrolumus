import styles from './Processor.module.scss';
import { CardActionArea, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import planet from './assets/planet.png';
import chevron from './assets/chevron.svg';
import { routes } from '../../../../models/enums/routes';
import { useCallback } from 'react';
import { logFirebaseEvent } from '../../../../helpers/firebase';
import { FirebaseEvent } from '../../../../helpers/firebase/firebaseEvent';

const Processor = () => {
  const navigate = useNavigate();
  const navigateToProcessor = useCallback(() => {
    logFirebaseEvent({
      name: FirebaseEvent.openProcessorMainPage
    });
    navigate(routes.astrologicalProcessor);
  }, [navigate]);

  return (
    <CardActionArea sx={{ borderRadius: '20px' }}>
      <div className={styles.main} onClick={navigateToProcessor}>
        <Grid p={2}>
          <Typography color={'#292E30'} fontFamily={'Playfair Display'} fontWeight={'bold'} fontSize={'24px'} pb={4}>
            Астропроцессор
          </Typography>
          <Typography color={'#292E30'} fontFamily={'Gilroy'} fontWeight={'bold'}>
            Запустить расчет
          </Typography>
          <Typography color={'#37366B'} fontFamily={'Gilroy'} fontWeight={400} fontSize={'14px'} pt={1}>
            Имеются все необходимые инструменты
            как для новичков, так и для профессионалов.
          </Typography>
        </Grid>
        <Grid width={'210px'}>
          <img src={planet} className={styles.planet}/>
          <img src={chevron} className={styles.chevron}/>
        </Grid>
      </div>
    </CardActionArea>
  );
};

export default Processor;
