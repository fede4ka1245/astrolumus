import React, { useMemo, useState } from 'react';
import { Option } from '../../../../models/types/Option';
import { Grid, Typography } from '@mui/material';
import Options from '../../../../components/options/Options';
import AshtakvargaTopic from './compoentns/AshtakvargaTopic/AshtakvargaTopic';
import NatMapTopic from './compoentns/natMapTopic/NatMapTopic';
import ZonesTopic from './compoentns/zonesTopic/ZonesTopic';
import VarshpahalaTopic from './compoentns/VarshpahalaTopic/VarshpahalaTopic';
import TransitionsTopic from './compoentns/transitionsTopic/TransitionsTopic';

const options = [
  {
    value: 1,
    label: 'Натальная карта'
  },
  {
    value: 2,
    label: 'Варшапхала'
  },
  {
    value: 3,
    label: 'Транзиты'
  },
  {
    value: 4,
    label: 'Аштакаварга'
  },
  {
    value: 5,
    label: 'Чакры'
  }
];

const Topics = () => {
  const [targetTopics, setTargetTopics] = useState<Option []>([]);

  const label = useMemo(() => {
    if (targetTopics.length === 0) {
      return 'Выберите до 3-х разделов';
    } else if (targetTopics.length === 1) {
      return 'Вы можете выбрать еще 2 раздела';
    } else if (targetTopics.length === 2) {
      return 'Вы можете выбрать еще 1 раздел';
    } else {
      return 'Выбрано 3 раздела';
    }
  }, [targetTopics]);

  return (
    <>
      <Grid container pl={2} pr={2}>
        <Grid item pt={2}>
          <Typography fontFamily={'Gilroy'} fontWeight={500} fontSize={'18px'} color={'black'}>
            {label}
          </Typography>
        </Grid>
        <Grid item pt={1}>
          <Options options={options} setValue={setTargetTopics} value={targetTopics} limit={3}/>
        </Grid>
        {targetTopics.map((topic) => (
          <>
            {topic.value === 1 && <NatMapTopic />}
            {topic.value === 2 && <VarshpahalaTopic />}
            {topic.value === 3 && <TransitionsTopic />}
            {topic.value === 4 && <AshtakvargaTopic />}
            {topic.value === 5 && <ZonesTopic />}
          </>
        ))}
      </Grid>
    </>
  );
};

export default Topics;
