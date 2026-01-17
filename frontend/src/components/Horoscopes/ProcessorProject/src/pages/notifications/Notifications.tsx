import React from 'react';
import UserHeader from '../../components/userHeader/UserHeader';
import PageHeader from '../../components/pageHeader/PageHeader';
import { Grid } from '@mui/material';
import Notification from './components/notitfication/Notification';
import Background from '../../components/background/Background';
import { getIsForumEnabled } from '../../helpers/getIsForumEnabled';

const Notifications = () => {
  const isForumEnabled = getIsForumEnabled();
  
  return (
    <>
      <Background background={'#F0F0F3'} />
      <UserHeader />
      <PageHeader page={'Уведомления'} content={!isForumEnabled ? <></> : undefined}/>
      <Grid container direction={'column'} pt={2}>
        <Grid item pl={2} pr={2} pb={1}>
          <Notification notificationVariant={'DARK'} />
        </Grid>
        <Grid item pl={2} pr={2} pb={1}>
          <Notification isMoreButtonShowed={true}/>
        </Grid>
        <Grid item pl={2} pr={2} pb={1}>
          <Notification notificationVariant={'GRADIENT'} isImageCircled={true}/>
        </Grid>
        <Grid item pl={2} pr={2} pb={1}>
          <Notification isMoreButtonShowed={true} isImageCircled={true}/>
        </Grid>
        <Grid item pl={2} pr={2} pb={1}>
          <Notification text={'Данные профиля сохранены Сообщение в две строки'} notificationType={'ERROR'} notificationVariant={'DARK'} />
        </Grid>
        <Grid item pl={2} pr={2} pb={1}>
          <Notification text={'Первая тема создана и опуликована вы достигли такого то прогеррса'} notificationType={'ACCEPT'} notificationVariant={'DARK'} />
        </Grid>
        <Grid item pl={2} pr={2} pb={1}>
          <Notification text={'Тема НАЗВАНИЕ ТЕМЫ отправлена на модерацию'} notificationType={'TIME'} notificationVariant={'DARK'} />
        </Grid>
      </Grid>
    </>
  );
};

export default Notifications;
