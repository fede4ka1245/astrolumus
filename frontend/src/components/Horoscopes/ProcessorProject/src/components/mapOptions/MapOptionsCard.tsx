import React from 'react';
import { Option } from '../../models/types/Option';
import styles from './MapOptionsCard.module.scss';
import { Grid, Typography } from '@mui/material';
import Switch from '../switch/Switch';
import Input from '../input/Input';
import { InputType } from '../input/InputType';
import Options from '../options/Options';
import background from './assets/background.png';

export interface MapOptionsCardType {
  title?: string,
  options?: Option [],
  targetOptions?: Option [],
  isActive?: boolean,
  setTargetOptions?: (props: any) => any,
  limit?: number,
}

const MapOptionsCard = ({ options, targetOptions, setTargetOptions, title, limit }: MapOptionsCardType) => {
  return (
    <section className={styles.card}>
      <img src={background} className={styles.image}/>
      <Grid container alignItems={'center'} pt={1} pl={2} pr={2} justifyContent={'space-between'}>
        <Grid item>
          <Typography fontFamily={'Gilroy'} fontWeight={400} fontSize={'18px'} color={'white'} lineHeight={'40px'}>
            {title}
          </Typography>
        </Grid>
        <Grid item>
          <Switch />
        </Grid>
      </Grid>
      <Grid item pl={2} pr={2} pb={2} display={'flex'} flexWrap={'wrap'}>
        <Grid item pr={1} pb={1}>
          <Input inputType={InputType.date} height={'30px'} width={'130px'}/>
        </Grid>
        <Grid item>
          <Input inputType={InputType.time} height={'30px'} width={'130px'}/>
        </Grid>
        <Grid item>
          <Options limit={limit} options={options} value={targetOptions} setValue={setTargetOptions} />
        </Grid>
      </Grid>
    </section>
  );
};

export default MapOptionsCard;
