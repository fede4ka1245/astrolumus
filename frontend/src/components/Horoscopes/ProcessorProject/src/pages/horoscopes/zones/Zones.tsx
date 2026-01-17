import React, { useState } from 'react';
import Options from '../../../components/options/Options';
import styles from './Zones.module.scss';
import { useGetIsZonesLoading } from '../../../store/selectors';
import HoroscopesLoader from '../components/horoscopeLoader/HoroscopesLoader';
import { Grid } from '@mui/material';
import CompasPage from './components/compasPage/CompasPage';
import Shani from './components/shani/Shani';
import Sudarshana from './components/sudarshana/Sudarshana';
import Bhava from './components/bhava/Bhava';
import SavatobhadraPage from './components/savatobhadraPage/SavatobhadraPage';
import CalanalaPage from './components/calanalaPage/CalanalaPage';

const options = [
  {
    label: 'Бхава чалит',
    value: 1
  },
  {
    label: 'Сарватобхадра',
    value: 2
  },
  {
    label: 'Чандра Каланала',
    value: 3
  },
  {
    label: 'Сурйа Каланала',
    value: 4
  },
  {
    label: 'Шани',
    value: 5
  },
  {
    label: 'Сударшана',
    value: 6
  }
];

const Zones = () => {
  const [targetOption, setTargetOption] = useState(options[0]);
  const isZonesLoading = useGetIsZonesLoading();

  return (
    <>
      {!isZonesLoading && <>
        <section className={styles.items}>
          <div style={{ width: '600px' }}>
            <Options options={options} setValue={setTargetOption} value={targetOption.value} />
          </div>
        </section>
        <Grid width={'100%'} container display={'flex'} justifyContent={'center'} alignItems={'center'} pt={3} pb={3}>
          {targetOption.value === 6 && <Grid item pl={2} pr={2} width={'100%'}>
            <Sudarshana />
          </Grid>}
          {targetOption.value === 5 && <Grid item pl={2} pr={2} width={'100%'}>
            <Shani />
          </Grid>}
          {targetOption.value === 4 && <Grid item pl={2} pr={2} width={'100%'}>
            <CalanalaPage />
          </Grid>}
          {targetOption.value === 3 && <Grid item pl={2} pr={2} width={'100%'}>
            <CompasPage />
          </Grid>}
          {targetOption.value === 2 && (
            <SavatobhadraPage />
          )}
          {targetOption.value === 1 && <Bhava />}
        </Grid>
      </>}
      {isZonesLoading && <HoroscopesLoader />}
    </>
  );
};

export default Zones;
