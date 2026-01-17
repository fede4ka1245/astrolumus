import React from 'react';
import styles from './Info.module.scss';
import background from './img.png';
import galaxy from './img_2.png';
import { Grid, Typography } from '@mui/material';
import sign from './sign.svg';
import Divider from '../../divider/Divider';

const Info = () => {
  return (
    <div className={styles.main}>
      <img width={'100%'} height={'100%'} src={background} className={styles.image}/>
      <Grid container p={3} direction={'column'}>
        <Grid item pb={2}>
          <Typography fontFamily={'Gilroy'} fontWeight={700} color={'white'} fontSize={'18px'}>
            Меркурий соединяеться с Deep Sky объектом
          </Typography>
        </Grid>
        <Grid item container direction={'row'} display={'flex'}>
          <Grid item>
            <img src={galaxy} width={'100px'} height={'100px'} />
          </Grid>
          <Grid container item direction={'column'} flex={1} pl={3}>
            <Grid item>
              <Typography fontFamily={'Gilroy'} fontWeight={700} color={'white'} fontSize={'16px'}>
                Туманность Ориона
              </Typography>
            </Grid>
            <Grid item container pt={2}>
              <Grid container item direction={'column'} width={'50%'}>
                <Grid item>
                  <Typography fontFamily={'Gilroy'} fontWeight={700} color={'white'} fontSize={'10px'}>
                    Сидерический
                  </Typography>
                </Grid>
                <Grid item display={'flex'} pt={1}>
                  <img src={sign}/>
                  <Typography fontFamily={'Gilroy'} fontWeight={700} color={'white'} fontSize={'18px'} pl={1}>
                    23° 06’
                  </Typography>
                </Grid>
              </Grid>
              <Grid container item direction={'column'} width={'50%'}>
                <Grid item>
                  <Typography fontFamily={'Gilroy'} fontWeight={700} color={'white'} fontSize={'10px'}>
                    Тропический
                  </Typography>
                </Grid>
                <Grid item display={'flex'} pt={1}>
                  <img src={sign}/>
                  <Typography fontFamily={'Gilroy'} fontWeight={700} color={'white'} fontSize={'18px'} pl={1}>
                    23° 06’
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item pt={2}>
          <Typography fontFamily={'Gilroy'} fontWeight={400} color={'white'} fontSize={'11px'}>
            Имеются все необходимые инструменты как для новичков, так и для профессионалов. Имеются все необходимые инструменты как для новичков, так и для профессионалов.
          </Typography>
        </Grid>
        <Grid item pt={2} pb={2}>
          <div style={{ width: '100%', height: '1px', background: '#FFFFFF', opacity: 0.3 }}/>
        </Grid>
        <Grid item pb={2}>
          <Typography fontFamily={'Gilroy'} fontWeight={700} color={'white'} fontSize={'18px'}>
            Меркурий соединяеться с Deep Sky объектом
          </Typography>
        </Grid>
        <Grid item container direction={'row'} display={'flex'}>
          <Grid item>
            <img src={galaxy} width={'100px'} height={'100px'} />
          </Grid>
          <Grid container item direction={'column'} flex={1} pl={3}>
            <Grid item>
              <Typography fontFamily={'Gilroy'} fontWeight={700} color={'white'} fontSize={'16px'}>
                Туманность Ориона
              </Typography>
            </Grid>
            <Grid item container pt={2}>
              <Grid container item direction={'column'} width={'50%'}>
                <Grid item>
                  <Typography fontFamily={'Gilroy'} fontWeight={700} color={'white'} fontSize={'10px'}>
                    Сидерический
                  </Typography>
                </Grid>
                <Grid item display={'flex'} pt={1}>
                  <img src={sign}/>
                  <Typography fontFamily={'Gilroy'} fontWeight={700} color={'white'} fontSize={'18px'} pl={1}>
                    23° 06’
                  </Typography>
                </Grid>
              </Grid>
              <Grid container item direction={'column'} width={'50%'}>
                <Grid item>
                  <Typography fontFamily={'Gilroy'} fontWeight={700} color={'white'} fontSize={'10px'}>
                    Тропический
                  </Typography>
                </Grid>
                <Grid item display={'flex'} pt={1}>
                  <img src={sign}/>
                  <Typography fontFamily={'Gilroy'} fontWeight={700} color={'white'} fontSize={'18px'} pl={1}>
                    23° 06’
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item pt={2} pb={2}>
          <Typography fontFamily={'Gilroy'} fontWeight={400} color={'white'} fontSize={'11px'}>
            Имеются все необходимые инструменты как для новичков, так и для профессионалов. Имеются все необходимые инструменты как для новичков, так и для профессионалов.
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default Info;
