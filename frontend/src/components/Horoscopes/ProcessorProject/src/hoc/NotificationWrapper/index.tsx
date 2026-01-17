import { FC, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// styles 
import authRequest from '../../api/authRequest';
import { notificationsApi } from '../../api/notifications';
import 'react-toastify/dist/ReactToastify.css';
import './styles.scss';
import { routes } from '../../models/enums/routes';
import { useAppDispatch } from '../../store/store';
import { setHasNewMessages } from '../../store/reducers/notificationReducer';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';

interface IProps {
  children: any
}

const NotificationWrapper: FC<IProps> = ({ children }) => {
  const timer = useRef<any>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = () => {
    authRequest.get(notificationsApi(), {
      params: {
        unread: true
      }
    })
      .then(res => {
        const messages = res.data.results;
        if (messages.length > 0) {
          dispatch(setHasNewMessages(true));
        }
        clearInterval(timer.current);
        timer.current = setInterval(() => {
          getNotifications();
        }, 30000);
      });
  };

  const naviagteToTopic = (id: number) => {
    navigate(routes.topic + id);
  };
  // const notificationHandler = (notification: INotification) => {
  //   switch (notification.verb) {
  //   case NotificationVerb.inviteToTopic: 
  //     toast((
  //       <Grid onClick={() => naviagteToTopic(notification.target?.id)}>
  //         <UserNotification
  //           user={notification.actor}  
  //         />
  //         <Typography color={'#292E30'} fontWeight={500} fontSize={'16px'} fontFamily={'Gilroy'}> 
  //           Вас пригласили в тему:
  //         </Typography>
  //         <Typography color={'#292E30'} fontWeight={500} fontSize={'16px'} fontFamily={'Gilroy'}> 
  //           {notification.target?.title}
  //         </Typography>
  //       </Grid>
  //     ));
  //     break;
  //   case NotificationVerb.subscribedToUser: 
  //     toast((
  //       <Grid onClick={() => navigate(routes.user + notification.actor.id)}>
  //         <UserNotification
  //           user={notification.actor}  
  //         />
  //         <Typography color={'#292E30'} fontWeight={500} fontSize={'16px'} fontFamily={'Gilroy'}>
  //           Подписался на вас
  //         </Typography>
  //       </Grid>
  //     ));
  //     break;
  //   case NotificationVerb.joinToTopic: 
  //     toast((
  //       <Grid onClick={() => naviagteToTopic(notification.target?.id)}>
  //         <UserNotification
  //           user={notification.actor}  
  //         />
  //         <Typography color={'#292E30'} fontWeight={500} fontSize={'16px'} fontFamily={'Gilroy'}> 
  //           Хочет вступить в тему:
  //         </Typography>
  //         <Typography color={'#292E30'} fontWeight={700} fontSize={'16px'} fontFamily={'Gilroy'}> 
  //           {notification.target?.title}
  //         </Typography>
  //       </Grid>
  //     ));  
  //     break;  
  //   default:
  //   }
  // };

  return (
    <>
      <ToastContainer 
        className='notification'
        closeOnClick={false}
        autoClose={5000}
        hideProgressBar={true}
      />
      {children}
    </>
  );
};

export default NotificationWrapper;
