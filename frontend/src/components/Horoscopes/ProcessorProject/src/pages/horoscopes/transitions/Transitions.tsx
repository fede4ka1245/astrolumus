import React, { useState } from 'react';
import { Grid } from '@mui/material';
import Options from '../../../components/options/Options';
import TransitionSearch from './transitionSearch/TransitionSearch';
import TransitionDate from './transitionDate/TransitionDate';

const transitionOptions = [
  {
    label: 'Дата транзита',
    value: 'date'
  },
  {
    label: 'Поиск транзита',
    value: 'search'
  }
];

const Transitions = () => {
  const [targetTransition, setTargetTransition] = useState(transitionOptions[0]);

  return (
    <Grid container direction={'column'} pt={2}>
      <Grid item pb={3} pl={2} pr={2}>
        <Options options={transitionOptions} value={targetTransition.value} setValue={setTargetTransition}/>
      </Grid>
      {targetTransition.value === 'date' && (
        <TransitionDate />
      )}
      {targetTransition.value === 'search' && (
        <TransitionSearch />
      )}
    </Grid>
  );
};

export default Transitions;
