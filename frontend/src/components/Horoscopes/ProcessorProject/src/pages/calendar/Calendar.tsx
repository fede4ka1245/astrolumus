import React, { useEffect, useState } from 'react';
import UserHeader from '../../components/userHeader/UserHeader';
import PageHeader from '../../components/pageHeader/PageHeader';
import { Grid, Typography } from '@mui/material';
import CalendarComponent from '../../components/calendar/Calendar';
import Options from '../../components/options/Options';
import Notification from '../notifications/components/notitfication/Notification';
import Background from '../../components/background/Background';
import { getIsForumEnabled } from '../../helpers/getIsForumEnabled';

const options = [
  {
    value: 'option1',
    label: 'Событие 1'
  },
  {
    value: 'option2',
    label: 'Событие 2'
  },
  {
    value: 'option3',
    label: 'Событие 3'
  }
];

const Calendar = () => {
  const [targetOption, setTargetOption] = useState(options[0]);
  const isForumEnabled = getIsForumEnabled();

  return (
    <Grid container direction={'column'}>
      <Background background={'#F0F0F3'} />
      <UserHeader/>
      <PageHeader page={'Календарь'} content={!isForumEnabled ? <></> : undefined}/>
      <Grid item pt={2}>
        <CalendarComponent />
      </Grid>
      <Grid item pt={2} pl={2} pr={2}>
        <Typography textTransform={'uppercase'} fontWeight={'bold'} color={'#37366B'} fontFamily={'Gilroy'}>
          16 сентября
        </Typography>
      </Grid>
      <Grid item pl={2} pr={2}>
        <Options options={options} isOutlined={true} setValue={setTargetOption} value={targetOption.value}/>
      </Grid>
      <Grid item pl={2} pr={2} pb={1} pt={2}>
        <Notification isMoreButtonShowed={true}/>
      </Grid>
      <Grid item pl={2} pr={2} pb={1}>
        <Notification isMoreButtonShowed={true}/>
      </Grid>
      <Grid item pl={2} pr={2} pb={1}>
        <Notification isMoreButtonShowed={true}/>
      </Grid>
    </Grid>
  );
};

export default Calendar;
