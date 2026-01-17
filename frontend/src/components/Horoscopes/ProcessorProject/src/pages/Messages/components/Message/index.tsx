import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import Avatar from '../../../../components/Avatar';
import styles from './styles.module.scss';
import { insertZero } from '../../../../helpers/insertZero';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../../../models/enums/routes';
import { INotification } from '../../../../models/interfaces/notification';
import { NotificationVerb } from '../../../../models/enums/Notification';
import SwipeWrapper from '../../../../components/swipeWrapper/SwipeWrapper';
import authRequest from '../../../../api/authRequest';
import { notificationsApi } from '../../../../api/notifications';
import { useAppDispatch } from '../../../../store/store';
import { setIsAppLoading } from '../../../../store/reducers/preferencesReducer';
import { eventBus, EventBusEvents } from '../../../../helpers/eventBus';
import JoinTopicModal from '../../../../components/TopicPreview/JoinTopicModal';
import { IServerTopic } from '../../../../models/interfaces/topic';
import { getTopicById } from '../../../../api/getTopics';
import Modal from '../../../../components/modal/Modal';
import convertHtmlToText from '../../../../helpers/convertHtmlToText';
import Button from '../../../../components/button/Button';
import useLocalStorage from 'use-local-storage';
import { forumTopicJoinApi } from '../../../../api/forum';
import { FilterType } from '../../../Topic/components/UserListModal/models';

interface IProps {
  notification: INotification;
  getNotifications: () => void;
}

interface NewTopicMessageProps {
  notification: INotification;
}

const NewTopicMessage: React.FC<NewTopicMessageProps> = ({ notification }) => {
  const [topic, setTopic] = useState<IServerTopic>();
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isSent, setIsSent] = useLocalStorage('isSent' + notification.target?.id, false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getTopicById(notification.target?.id)
      .then(({ data }) => {
        setTopic(data);
      });
  }, []);
  
  const onNotificationOpen = useCallback(() => {
    if (notification.target?.access_level === 0) {
      if (!topic) {
        setIsRequestOpen(true);
        return;
      }

      navigate(routes.topic + notification.target?.id);
    } else {
      navigate(routes.topic + notification.target?.id);
    }
  }, [navigate, topic, notification]);

  const joinToTopic = () => {
    dispatch(setIsAppLoading(true));
    authRequest.post(forumTopicJoinApi(), {
      topic_id: notification.target?.id
    })
      .then(() => {
        setIsSent(true);
      })
      .finally(() => {
        dispatch(setIsAppLoading(false));
      });
  };
  
  return (
    <>
      <Grid onClick={onNotificationOpen}>
        <Typography color={'#292E30'} fontWeight={500} fontSize={'15px'} fontFamily={'Gilroy'}>
          Выпустил(-ла) новую тему
        </Typography>
        <Grid display={'flex'} alignItems={'center'}>
          {notification?.target?.access_level === 0 && (
            <Grid mr={1}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5 5.83333C12.942 5.83333 13.366 6.00893 13.6785 6.32149C13.9911 6.63405 14.1667 7.05797 14.1667 7.5M17.5 7.5C17.5002 8.28098 17.3175 9.05115 16.9665 9.74879C16.6155 10.4464 16.1059 11.0521 15.4786 11.5174C14.8514 11.9826 14.1238 12.2945 13.3543 12.4279C12.5848 12.5614 11.7948 12.5127 11.0475 12.2858L9.16667 14.1667H7.5V15.8333H5.83333V17.5H3.33333C3.11232 17.5 2.90036 17.4122 2.74408 17.2559C2.5878 17.0996 2.5 16.8877 2.5 16.6667V14.5117C2.50005 14.2907 2.58788 14.0787 2.74417 13.9225L7.71417 8.9525C7.50621 8.26501 7.4488 7.54079 7.54587 6.82912C7.64293 6.11746 7.89219 5.43506 8.27666 4.82837C8.66113 4.22169 9.1718 3.70495 9.77391 3.31335C10.376 2.92174 11.0554 2.66446 11.7659 2.559C12.4764 2.45355 13.2012 2.5024 13.8911 2.70224C14.581 2.90207 15.2198 3.2482 15.7639 3.71705C16.308 4.18591 16.7447 4.76649 17.0443 5.41928C17.3439 6.07207 17.4993 6.78175 17.5 7.5Z" stroke="#ABB0B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Grid>
          )}
          <Typography color={'#292E30'} fontWeight={700} fontSize={'15px'} fontFamily={'Gilroy'}>
            {notification?.target?.title}
          </Typography>
        </Grid>
      </Grid>
      <Modal isOpen={isRequestOpen} close={() => setIsRequestOpen(false)} height={'400px'}>
        <Grid display={'flex'} flexDirection={'column'} height={'100%'} bgcolor={'#FFF'} px={'30px'} pt={'30px'} position={'relative'}>
          <Grid flex={1}>
            {
              !isSent
                ? (
                  <Typography color="#37366B" fontWeight={500} fontSize={'20px'} lineHeight={'24px'} mb={'10px'}>
                    Это приватная тема,
                    вы можете запросить
                    доступ у автора темы
                  </Typography>
                )
                : (
                  <Typography color="#37366B" fontWeight={500} fontSize={'20px'} lineHeight={'24px'} mb={'10px'}>
                    Вы уже отправили запрос, ожидайте ответа!
                  </Typography>
                )
            }
            <Grid mb={'10px'}>
              <Typography color="#292E30" fontWeight={600} fontSize={'16px'} lineHeight={'36px'}>
                Информация о теме
              </Typography>
              <Typography color="#292E30" fontWeight={400} fontSize={'14px'} lineHeight={'14px'}>
                <div dangerouslySetInnerHTML={{ __html: notification?.target?.description }} />
              </Typography>
            </Grid>
          </Grid>
          {
            !isSent && (
              <Grid width="250px" mb={'45px'}>
                <Button text="Запросить доступ" onClick={joinToTopic}/>
              </Grid>
            )
          }
        </Grid>
      </Modal>
    </>
  );
};

const Message: FC<IProps> = ({ notification, getNotifications }) => {
  const createdAt = new Date(notification.timestamp);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const naviagteToTopic = useCallback((id: number | string) => {
    navigate(routes.topic + id);
  }, []);

  const deleteMessage = useCallback(() => {
    dispatch(setIsAppLoading(true));
    authRequest.delete(notificationsApi(notification.id))
      .then(() => getNotifications())
      .finally(() => {
        dispatch(setIsAppLoading(false));
      });
  }, [dispatch, getNotifications, notification.id]);

  const message = useMemo(() => {
    switch (notification.verb) {
    case NotificationVerb.newTopic:
      return (
        <NewTopicMessage
          notification={notification}
        />
      );
    case NotificationVerb.inviteToTopic: 
      return (
        <Grid onClick={() => naviagteToTopic(notification.target?.id)}>
          <Typography color={'#292E30'} fontWeight={500} fontSize={'15px'} fontFamily={'Gilroy'}> 
            Вас пригласили в тему:
          </Typography>
          <Grid display={'flex'} alignItems={'center'}>
            {notification?.target?.access_level === 0 && (
              <Grid mr={1}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.5 5.83333C12.942 5.83333 13.366 6.00893 13.6785 6.32149C13.9911 6.63405 14.1667 7.05797 14.1667 7.5M17.5 7.5C17.5002 8.28098 17.3175 9.05115 16.9665 9.74879C16.6155 10.4464 16.1059 11.0521 15.4786 11.5174C14.8514 11.9826 14.1238 12.2945 13.3543 12.4279C12.5848 12.5614 11.7948 12.5127 11.0475 12.2858L9.16667 14.1667H7.5V15.8333H5.83333V17.5H3.33333C3.11232 17.5 2.90036 17.4122 2.74408 17.2559C2.5878 17.0996 2.5 16.8877 2.5 16.6667V14.5117C2.50005 14.2907 2.58788 14.0787 2.74417 13.9225L7.71417 8.9525C7.50621 8.26501 7.4488 7.54079 7.54587 6.82912C7.64293 6.11746 7.89219 5.43506 8.27666 4.82837C8.66113 4.22169 9.1718 3.70495 9.77391 3.31335C10.376 2.92174 11.0554 2.66446 11.7659 2.559C12.4764 2.45355 13.2012 2.5024 13.8911 2.70224C14.581 2.90207 15.2198 3.2482 15.7639 3.71705C16.308 4.18591 16.7447 4.76649 17.0443 5.41928C17.3439 6.07207 17.4993 6.78175 17.5 7.5Z" stroke="#ABB0B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Grid>
            )}
            <Typography color={'#292E30'} fontWeight={700} fontSize={'15px'} fontFamily={'Gilroy'}> 
              {notification?.target?.title}
            </Typography>
          </Grid>
        </Grid>
      );
    case NotificationVerb.replyToСomment:
      return (
        <Grid onClick={() => naviagteToTopic((notification.action_object as any)?.topic + `?isOpenCommentModal=true&selectedId=${(notification.action_object as any)?.id}`)}>
          <Typography color={'#292E30'} fontWeight={500} fontSize={'15px'} fontFamily={'Gilroy'}>
            На ваш комментарий ответили:
          </Typography>
          <Grid display={'flex'} alignItems={'center'}>
            <Grid
              sx={{
                background: 'rgb(234, 228, 219)',
                borderRadius: '8px'
              }}
              p={1}
            >
              <Grid
                color={'#292E30'}
                fontWeight={400}
                sx={{
                  background: 'rgb(234, 228, 219)',
                  borderRadius: '8px',
                  'text-overflow': 'ellipsis',
                  lineHeight: '16px',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  '-webkit-line-clamp': '2',
                  '-webkit-box-orient': 'vertical',
                  'white-space': 'normal',
                  maxHeight: '32px'
                }}
                fontSize={'15px'}
                fontFamily={'Gilroy'}
                dangerouslySetInnerHTML={{ __html: notification?.description as string }}
              />
            </Grid>
          </Grid>
        </Grid>
      );
    case NotificationVerb.commentInTopic:
      return (
        <Grid onClick={() => naviagteToTopic((notification.action_object as any)?.topic + `?isOpenCommentModal=true&selectedId=${(notification.action_object as any)?.id}`)}>
          <Typography color={'#292E30'} fontWeight={500} fontSize={'15px'} fontFamily={'Gilroy'}>
              В вашей теме <b>{notification?.target?.title}</b> ответили:
          </Typography>
          <Grid display={'flex'} alignItems={'center'}>
            <Grid
              sx={{
                background: 'rgb(234, 228, 219)',
                borderRadius: '8px'
              }}
              p={1}
            >
              <Grid
                color={'#292E30'}
                fontWeight={400}
                sx={{
                  background: 'rgb(234, 228, 219)',
                  borderRadius: '8px',
                  'text-overflow': 'ellipsis',
                  lineHeight: '16px',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  '-webkit-line-clamp': '2',
                  '-webkit-box-orient': 'vertical',
                  'white-space': 'normal',
                  maxHeight: '32px'
                }}
                fontSize={'15px'}
                fontFamily={'Gilroy'}
                dangerouslySetInnerHTML={{ __html: notification?.description as string }}
              />
            </Grid>
          </Grid>
        </Grid>
      );
    case NotificationVerb.subscribedToUser: 
      return (
        <Grid onClick={() => navigate(routes.user + notification.actor?.id)}>
          <Typography color={'#292E30'} fontWeight={500} fontSize={'15px'} fontFamily={'Gilroy'}> 
            Подписался(ась) на Вас!
          </Typography>
          <Grid display={'flex'} alignItems={'center'}>
            {notification?.target?.access_level === 0 && (
              <Grid mr={1}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.5 5.83333C12.942 5.83333 13.366 6.00893 13.6785 6.32149C13.9911 6.63405 14.1667 7.05797 14.1667 7.5M17.5 7.5C17.5002 8.28098 17.3175 9.05115 16.9665 9.74879C16.6155 10.4464 16.1059 11.0521 15.4786 11.5174C14.8514 11.9826 14.1238 12.2945 13.3543 12.4279C12.5848 12.5614 11.7948 12.5127 11.0475 12.2858L9.16667 14.1667H7.5V15.8333H5.83333V17.5H3.33333C3.11232 17.5 2.90036 17.4122 2.74408 17.2559C2.5878 17.0996 2.5 16.8877 2.5 16.6667V14.5117C2.50005 14.2907 2.58788 14.0787 2.74417 13.9225L7.71417 8.9525C7.50621 8.26501 7.4488 7.54079 7.54587 6.82912C7.64293 6.11746 7.89219 5.43506 8.27666 4.82837C8.66113 4.22169 9.1718 3.70495 9.77391 3.31335C10.376 2.92174 11.0554 2.66446 11.7659 2.559C12.4764 2.45355 13.2012 2.5024 13.8911 2.70224C14.581 2.90207 15.2198 3.2482 15.7639 3.71705C16.308 4.18591 16.7447 4.76649 17.0443 5.41928C17.3439 6.07207 17.4993 6.78175 17.5 7.5Z" stroke="#ABB0B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Grid>
            )}
            <Typography>
              {notification?.target?.title}
            </Typography>
          </Grid>
        </Grid>
      );
    case NotificationVerb.joinToTopic: 
      return (
        <Grid onClick={() => naviagteToTopic(notification.target?.id + `?isOpenModal=true&usf=${FilterType.requests}`)}>
          <Typography color={'#292E30'} fontWeight={500} fontSize={'15px'} fontFamily={'Gilroy'}> 
            Хочет вступить в тему:
          </Typography>
          <Grid display={'flex'} alignItems={'center'}>
            {notification?.target?.access_level === 0 && (
              <Grid mr={1}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.5 5.83333C12.942 5.83333 13.366 6.00893 13.6785 6.32149C13.9911 6.63405 14.1667 7.05797 14.1667 7.5M17.5 7.5C17.5002 8.28098 17.3175 9.05115 16.9665 9.74879C16.6155 10.4464 16.1059 11.0521 15.4786 11.5174C14.8514 11.9826 14.1238 12.2945 13.3543 12.4279C12.5848 12.5614 11.7948 12.5127 11.0475 12.2858L9.16667 14.1667H7.5V15.8333H5.83333V17.5H3.33333C3.11232 17.5 2.90036 17.4122 2.74408 17.2559C2.5878 17.0996 2.5 16.8877 2.5 16.6667V14.5117C2.50005 14.2907 2.58788 14.0787 2.74417 13.9225L7.71417 8.9525C7.50621 8.26501 7.4488 7.54079 7.54587 6.82912C7.64293 6.11746 7.89219 5.43506 8.27666 4.82837C8.66113 4.22169 9.1718 3.70495 9.77391 3.31335C10.376 2.92174 11.0554 2.66446 11.7659 2.559C12.4764 2.45355 13.2012 2.5024 13.8911 2.70224C14.581 2.90207 15.2198 3.2482 15.7639 3.71705C16.308 4.18591 16.7447 4.76649 17.0443 5.41928C17.3439 6.07207 17.4993 6.78175 17.5 7.5Z" stroke="#ABB0B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Grid>
            )}
            <Typography color={'#292E30'} fontWeight={700} fontSize={'15px'} fontFamily={'Gilroy'}> 
              {notification.target?.title}
            </Typography>
          </Grid>
        </Grid>
      );
    case NotificationVerb.acceptToTopic: 
      return (
        <Grid onClick={() => naviagteToTopic(notification.target?.id)}>
          <Typography color={'#292E30'} fontWeight={500} fontSize={'15px'} fontFamily={'Gilroy'}> 
            Автор темы одобрил запрос на вступление. Теперь вы участник темы:
          </Typography>
          <Grid display={'flex'} alignItems={'center'}>
            {notification?.target?.access_level === 0 && (
              <Grid mr={1}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.5 5.83333C12.942 5.83333 13.366 6.00893 13.6785 6.32149C13.9911 6.63405 14.1667 7.05797 14.1667 7.5M17.5 7.5C17.5002 8.28098 17.3175 9.05115 16.9665 9.74879C16.6155 10.4464 16.1059 11.0521 15.4786 11.5174C14.8514 11.9826 14.1238 12.2945 13.3543 12.4279C12.5848 12.5614 11.7948 12.5127 11.0475 12.2858L9.16667 14.1667H7.5V15.8333H5.83333V17.5H3.33333C3.11232 17.5 2.90036 17.4122 2.74408 17.2559C2.5878 17.0996 2.5 16.8877 2.5 16.6667V14.5117C2.50005 14.2907 2.58788 14.0787 2.74417 13.9225L7.71417 8.9525C7.50621 8.26501 7.4488 7.54079 7.54587 6.82912C7.64293 6.11746 7.89219 5.43506 8.27666 4.82837C8.66113 4.22169 9.1718 3.70495 9.77391 3.31335C10.376 2.92174 11.0554 2.66446 11.7659 2.559C12.4764 2.45355 13.2012 2.5024 13.8911 2.70224C14.581 2.90207 15.2198 3.2482 15.7639 3.71705C16.308 4.18591 16.7447 4.76649 17.0443 5.41928C17.3439 6.07207 17.4993 6.78175 17.5 7.5Z" stroke="#ABB0B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Grid>
            )}
            <Typography color={'#292E30'} fontWeight={700} fontSize={'15px'} fontFamily={'Gilroy'}> 
              {notification.target?.title}
            </Typography>
          </Grid>
        </Grid>
      );  
    default:
      return (
        <Grid>
          <Grid display={'flex'} alignItems={'center'}>
            <Typography color={'#292E30'} fontWeight={700} fontSize={'15px'} fontFamily={'Gilroy'}>
              {notification.description}
            </Typography>
          </Grid>
        </Grid>
      );
    }
  }, [naviagteToTopic, navigate, notification.actor?.id, notification.target?.access_level, notification.target?.id, notification.target?.title, notification.verb]);
  
  return (
    <SwipeWrapper
      backgroundComponent={(
        <Grid display={'flex'} height={'100%'} px={2} justifyContent={'flex-end'} alignItems={'center'}>
          <Grid mr={3} onClick={deleteMessage}>
            <svg width="20" height="23" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.33398 8.16667V13.1667M9.66732 8.16667V13.1667M1.33398 4.83333H14.6673M13.834 4.83333L13.1115 14.9517C13.0816 15.3722 12.8934 15.7657 12.5849 16.053C12.2764 16.3403 11.8705 16.5 11.449 16.5H4.55232C4.13077 16.5 3.72487 16.3403 3.41639 16.053C3.1079 15.7657 2.91975 15.3722 2.88982 14.9517L2.16732 4.83333H13.834ZM10.5007 4.83333V2.33333C10.5007 2.11232 10.4129 1.90036 10.2566 1.74408C10.1003 1.5878 9.88833 1.5 9.66732 1.5H6.33398C6.11297 1.5 5.90101 1.5878 5.74473 1.74408C5.58845 1.90036 5.50065 2.11232 5.50065 2.33333V4.83333H10.5007Z" stroke="#F15024" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Grid>
        </Grid>
      )}
      maxMove={100}>
      <div className={styles.main} onClick={() => {
        if (!notification.data) {
          return;
        }

        const res = JSON.parse(((notification.data as any).replaceAll("'", '"') as any));

        if ((res as any)?.notificationPageId) {
          eventBus.emit(EventBusEvents.triggerNotificationPageOpen, null, res?.notificationPageId);
        }
      }}>
        <Grid display={'flex'} alignItems={'center'} mb={1.5}>
          <Grid pr={2}>
            <Avatar
              width={40}
              height={40}
              fontSize={20}
              avatar={notification?.actor ? notification?.actor?.avatar : '/assets/alpha-school.png'}
              abbreviation={`${notification?.actor?.first_name?.slice(0, 1)}${notification?.actor?.last_name?.slice(0, 1)}`}
            />
          </Grid>
          <div className={styles.contant}>
            <Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
              <Typography color={'#292E30'} fontWeight={500} fontSize={'13px'} fontFamily={'Gilroy'}>
                {notification?.actor ? `${notification?.actor?.first_name} ${notification?.actor?.last_name}` : 'Школа Альфа'}
              </Typography>
              <Typography color={'#292E30'} fontWeight={400} fontSize={'10px'} fontFamily={'Gilroy'}>
                {insertZero(createdAt.getHours())}:{insertZero(createdAt.getMinutes())} {insertZero(createdAt.getDate())}.{insertZero(createdAt.getMonth() + 1)}.{insertZero(createdAt.getFullYear())}
              </Typography>
            </Grid>
            {message}
          </div>
        </Grid>
      </div>
    </SwipeWrapper>

  );
};

export default Message;
