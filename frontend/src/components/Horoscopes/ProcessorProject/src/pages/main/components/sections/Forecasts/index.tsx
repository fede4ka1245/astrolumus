import { FC, useState } from 'react';
import { Grid } from '@mui/material';
import Options from '../../../../../components/options/Options';
import ShowMoreButton from '../../../components/showMoreButton/ShowMoreButton';
import SectionPreview from '../../../../../components/sectionPreview';
import styles from '../../../styles.module.scss';

const groups = [
  {
    label: 'Мои прогнозы',
    value: 'my'
  },
  {
    label: 'Открытые прогнозы',
    value: 'all'
  }
];

const Forecasts:FC = () => {
  const [targetGroups, setTargetGroups] = useState(groups[0]);

  return (
    <Grid container direction={'column'}>
      <Grid item pl={2} pr={2} pt={3} width={'100%'}>
        <div className={styles.title}>
          Открытые прогнозы
        </div>
      </Grid>
      <Grid item pl={2} pr={2} width={'100%'} pt={2}>
        <Options options={groups} value={targetGroups.value} setValue={setTargetGroups} isOutlined isScrollable/>
      </Grid>
      <Grid item pl={2} pr={2} width={'100%'} pt={2}>
        <SectionPreview isPinned variant={'prophecy'} header={'Карта Д - 10, что она означает...'} body={'Мощный инструмент для профессионального астролога, лёгкий в изучении и удобный в применении для начинающего астролога.'}/>
      </Grid>
      <Grid item pl={2} pr={2} width={'100%'} pt={2}>
        <SectionPreview isGray variant={'prophecy'} header={'Карта Д - 10, что она означает...'} body={'Мощный инструмент для профессионального астролога, лёгкий в изучении и удобный в применении для начинающего астролога.'}/>
      </Grid>
      <Grid item pl={2} pr={2} width={'100%'} pt={2}>
        <SectionPreview isGray variant={'prophecy'} header={'Карта Д - 10, что она означает...'} body={'Мощный инструмент для профессионального астролога, лёгкий в изучении и удобный в применении для начинающего астролога.'}/>
      </Grid>
      <Grid item pl={2} pr={2} width={'100%'} pt={2}>
        <ShowMoreButton />
      </Grid>
    </Grid>
  );
};

export default Forecasts;
