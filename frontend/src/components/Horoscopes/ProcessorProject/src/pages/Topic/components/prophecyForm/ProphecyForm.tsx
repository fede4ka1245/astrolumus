import { FC, useCallback, useState } from 'react';
import { Grid, Skeleton, Typography } from '@mui/material';

// images 
import background from './assets/background.png';

// styles 
import styles from './ProphecyForm.module.scss';

import Button from '../../../../components/button/Button';
import PropheciesModal from '../propheciesModal/PropheciesModal';

const ProphecyForm: FC = () => {
  const [isProphesyModalOpen, setIsProphesyModalOpen] = useState(false);

  const toggleIsProphesyModalOpen = useCallback(() => {
    setIsProphesyModalOpen(!isProphesyModalOpen);
  }, [isProphesyModalOpen]);

  return (
    <div className={styles.main}>
      <div className={styles.date}>
        Предпологаемая дата свершения события - <strong>30.11.2022</strong>
      </div>
      <img src={background} className={styles.image}/>
      <PropheciesModal isOpen={isProphesyModalOpen} close={toggleIsProphesyModalOpen}/>
      <Grid container p={2} zIndex={1}>
        <Grid item container alignItems={'center'} zIndex={1} display={'flex'}>
          <Grid item pr={1}>
            <Skeleton sx={{ background: 'gray' }} variant={'circular'} height={'40px'} width={'40px'}/>
          </Grid>
          <Grid item>
            <Typography color={'#FFFFFF'} fontWeight={700} fontFamily={'Playfair Display'} fontSize={'10px'}>
              Название темы в две строки
            </Typography>
            <Typography color={'#C2BDCF'} fontFamily={'Gilroy'} fontSize={'10px'}>
              Автор темы Наталья Хвизюк
            </Typography>
          </Grid>
        </Grid>
        <Grid item width={'100%'} pt={3}>
          <Button text={'Сделать собсвенный прогноз'} onClick={toggleIsProphesyModalOpen}/>
        </Grid>
        <Grid onClick={toggleIsProphesyModalOpen} item width={'100%'} pl={4} pr={4} pt={2} textAlign={'center'} color={'#FFFFFF'} fontSize={'12px'} fontFamily={'Gilroy'} sx={{ opacity: 0.7 }}>
          Показать все 25 прогнозов
        </Grid>
      </Grid>
    </div>
  );
};

export default ProphecyForm;
