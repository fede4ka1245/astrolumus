import { FC, useCallback, useState } from 'react';
import { Grid, Typography, Skeleton } from '@mui/material';
import Modal from '../../../../components/modal/Modal';
import background from './assets/background.png';
import cross from './assets/close.svg';
import question from './assets/question.svg';
import styles from './PropheciesModal.module.scss';

export interface PropheciesModalProps {
  isOpen: boolean,
  close: (props?: any) => any
}

const Forecast: FC = () => {
  const [liked, setLiked] = useState<boolean>(false);
  const [likesQuantity, setLikesQuantity] = useState<number>(112);

  const onLike = useCallback(() => {
    setLiked(prevState => !prevState);
    if (liked) {
      setLikesQuantity(prevState => prevState - 1);
    } else {
      setLikesQuantity(prevState => prevState + 1);
    }
  }, [liked]);

  return (
    <div className={styles.forecast}>
      <div className={styles.forecast_avatar}>
        <Skeleton sx={{ background: 'gray' }} variant={'circular'} width={'25px'} height={'25px'}/>
      </div>
      <Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
        <Grid display={'flex'} alignItems={'center'} mb={'14px'}>
          <Typography fontFamily={'Gilroy'} color={'#5B6062'} fontSize={'8px'} mr={'7px'}>
            Евгений Приходько
          </Typography>
          <Typography fontFamily={'Gilroy'} color={'#5B6062'} fontSize={'8px'}>
            Статус
          </Typography>
        </Grid>
        <Typography fontFamily={'Gilroy'} color={'#5B6062'} fontSize={'8px'}>
          15.12.2022 15:30
        </Typography>
      </Grid>
      <Typography fontFamily={'Gilroy'} color={'#292E30'} fontSize={'14px'} mb={'9px'}>
        Сергей совершенно прав, яполностью 
      </Typography>
      <Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
        <Grid display={'flex'} alignItems={'center'}>
          <Grid mr={'5px'} onClick={onLike}>
            <svg width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.5 10.3984L6.3125 10.2344C2.04687 6.76562 0.898438 5.54687 0.898438 3.55469C0.898438 1.91406 2.23437 0.601562 3.85156 0.601562C5.21094 0.601562 5.98437 1.375 6.5 1.96093C7.01562 1.375 7.78906 0.601562 9.14844 0.601562C10.7891 0.601562 12.1016 1.9375 12.1016 3.55469C12.1016 5.54687 10.9531 6.76562 6.6875 10.2344L6.5 10.3984Z" 
                fill={liked ? '#5C5B9F' : '#5B6062'}/>
            </svg>
          </Grid>
          <Typography fontFamily={'Gilroy'} color={'#292E30'} fontSize={'9px'}>
            {likesQuantity}
          </Typography>
        </Grid>
        <Grid display={'flex'} alignItems={'center'}>
          <Typography fontFamily={'Gilroy'} color={'#5B6062'} fontSize={'9px'} fontWeight={700} mr={'9px'}>
            Ожидает
          </Typography>
          <Grid>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="12" height="12" rx="6" stroke="#5B6062" strokeWidth="2"/>
              <path d="M6.7085 3.5V7L9.3335 9.625" stroke="#5B6062" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

const PropheciesModal: FC<PropheciesModalProps> = ({ isOpen, close }) => {
  return (
    <Modal isOpen={isOpen} close={close} height={'var(--modal-page-height)'}>
      <section className={styles.main} style={{ position: 'relative' }}>
        <img src={background} className={styles.background}/>
        <Grid zIndex={3} height={'100%'} sx={{ overflowY: 'auto' }} pt={3}>
          <Grid display={'flex'} justifyContent={'space-between'} mb={'17px'} pl={4} pr={4}>
            <Grid display={'flex'} alignItems={'center'}>
              <Skeleton sx={{ background: 'gray' }} variant={'circular'} width={'25px'} height={'25px'}/>
              <Grid ml={'9px'}>
                <Typography fontFamily={'Gilroy'} color={'#FFF'} fontSize={'10px'} fontWeight={700}>
                  Название темы в две строки далее  мы под ...
                </Typography>
                <Typography fontFamily={'Gilroy'} color={'#979C9E'} fontSize={'9px'}>
                  Автор темы Наталья Хвизюк
                </Typography>
              </Grid>
            </Grid>
            <Grid display={'flex'} alignItems={'center'} zIndex={1}>
              <img src={question} className={styles.icon}/>
              <img src={cross} className={styles.icon} onClick={close}/>
            </Grid>
          </Grid>
          <Grid mb={'15px'}>
            <div className={styles.date}>
              Предпологаемая дата свершения события - <strong>30.11.2022</strong>
            </div>
          </Grid>
          <Grid pl={4} pr={4}>
            <Typography fontFamily={'Gilroy'} fontWeight={700} color={'#FFFFFF'} fontSize={'16px'} mb={'15px'}>
              Прогнозы (25)
            </Typography>
            <Forecast/>
          </Grid>
        </Grid>
      </section>
    </Modal>
  );
};

export default PropheciesModal;
