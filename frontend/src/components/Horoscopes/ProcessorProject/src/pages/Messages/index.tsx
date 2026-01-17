import React, { FC, useState, useEffect, useCallback } from 'react';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { Grid, CircularProgress, Fade, Typography } from '@mui/material';
import Background from '../../components/background/Background';
import UserHeader from '../../components/userHeader/UserHeader';
import PageHeader from '../../components/pageHeader/PageHeader';
import authRequest from '../../api/authRequest';
import { useAppDispatch } from '../../store/store';
import Message from './components/Message';
import { notificationsApi, notificationsMarkAllAsReadApi } from '../../api/notifications';
import { INotification } from '../../models/interfaces/notification';
import { setHasNewMessages } from '../../store/reducers/notificationReducer';
import UserPreviewSkeleton from '../../components/skeletons/UserPreviewSkeleton';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import WarnInfo from '../../components/warnInfo/WarnInfo';

const Messages: FC = () => {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    markAllAsRead();
    getNotifications();
  }, []);

  const markAllAsRead = useCallback(() => {
    authRequest.post(notificationsMarkAllAsReadApi())
      .then(() => {
        dispatch(setHasNewMessages(false));
      });
  }, [dispatch]);

  const getNotifications = useCallback(async () => {
    setLoading(true);
    await authRequest.get(notificationsApi())
      .then((res) => {
        setNotifications(res.data.results);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  
  const onRefresh = useCallback(async () => {
    await Haptics.impact({ style: ImpactStyle.Light });
    await getNotifications();
  }, [getNotifications]);

  return (
    <>
      <Background background={'#f0f0f3'} />
      <UserHeader />
      <PageHeader
        content={(
          <>
          </>
        )}
        page={'Уведомления'}
      />
      <Grid ml={2} mr={2}>
        <WarnInfo />
      </Grid>
      <PullToRefresh
        onRefresh={onRefresh}
        pullingContent={<></>}
        refreshingContent={(
          <Grid display="flex" justifyContent="center" mt={3}>
            <CircularProgress
              style={{
                color: '#37366B'
              }}
              size={30}/>
          </Grid>
        )}
      >
        <Grid minHeight={'500px'}>
          <Grid px={2} pt={2} height={'100%'}>
            {loading && Array(8).fill(8).map((item, index) => (
              <Grid key={index} mb={2}>
                <UserPreviewSkeleton/>
              </Grid>
            ))}
            <Fade in={!loading} timeout={300} mountOnEnter>
              <div>
                {notifications.map((item) => (
                  <Grid key={item?.id} mb={2}>
                    <Message
                      getNotifications={getNotifications}
                      notification={item}
                    />
                  </Grid>
                ))}
                {!loading && !notifications.length && (
                  <Grid 
                    item 
                    container 
                    py={5} 
                    mb={'15px'} 
                    justifyItems={'center'} 
                    flexDirection={'column'} 
                    alignItems={'center'} 
                    border={'1px solid rgba(55, 54, 107, 0.3)'} 
                    borderRadius={'20px'}
                  >
                    <Grid item>
                      <Typography 
                        fontFamily={'Gilroy'} 
                        textAlign={'center'} 
                        lineHeight={'15px'} 
                        color={'rgba(55, 54, 107, 0.7)'} 
                        fontSize={'15px'}
                      >
                        Нет уведомлений!
                      </Typography>
                    </Grid>
                  </Grid>
                )}
              </div>
            </Fade>
          </Grid>
        </Grid>
      </PullToRefresh>
    </>
  );
};

export default Messages;
