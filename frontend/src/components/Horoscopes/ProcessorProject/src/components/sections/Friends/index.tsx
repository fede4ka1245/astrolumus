import { useState, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react';
import { Grid, Button as MuiButton, Typography } from '@mui/material';
import { userFriendsApi, userSubscriptionsApi } from '../../../api/user';
import authRequest from '../../../api/authRequest';
import styles from './styles.module.scss';
import UserPreview from '../../userPreview/UserPreview';
import { ITopicUser } from '../../../models/interfaces/topic';
import UsersModal, { typeOfModal } from './components/UsersModal';
import QuestionButton from '../../QuestionButton';
import { useSearchParamsState } from '../../../hooks/useSearchParamsState';
import { useNavigate } from 'react-router-dom';

interface IProps {
  id: number;
}

export interface IFriendsRef {
  getFriends: () => void;
  getAllInfo: () => void;
  getSubscribers: () => void;
  getSubscriptions: () => void;
}

const Friends = forwardRef<IFriendsRef, IProps>((props, ref) => {
  const [countUsers, setCountUsers] = useState({
    friends_count: 0,
    subscriptions_count: 0,
    subscribers_count: 0
  });
  const [friends, setFriends] = useState<ITopicUser[]>([]);
  const [subscribers, setSubscribers] = useState<ITopicUser[]>([]);
  const [subscriptions, setSubscriptions] = useState<ITopicUser[]>([]);
  const [modalData, setModalData] = useSearchParamsState('friendsModalData', {
    isUsersModalOpen: false,
    modalType: typeOfModal.friends
  }, false);

  useEffect(() => {
    getAllInfo();
  }, [props.id]);
  
  useImperativeHandle(ref, () => ({
    getAllInfo,
    getFriends,
    getSubscribers,
    getSubscriptions
  }));

  const getFriends = useCallback(() => {
    authRequest.get(userFriendsApi(), {
      params: {
        user_src: props.id,
        page_size: 10
      }
    })
      .then(res => {
        setCountUsers(prevState => ({
          ...prevState, 
          friends_count: res.data.count
        }));
        setFriends(res.data.results);
      });
  }, [props.id]);

  const getSubscribers = useCallback(() => {
    authRequest.get(userSubscriptionsApi(), {
      params: {
        user_dst: props.id,
        page_size: 10
      }
    })
      .then(res => {
        setCountUsers(prevState => ({
          ...prevState, 
          subscribers_count: res.data.count
        }));
        setSubscribers(res.data.results.map((item:any) => item.user_src));
      });
  }, [props.id]);

  const getSubscriptions = useCallback(() => {
    authRequest.get(userSubscriptionsApi(), {
      params: {
        user_src: props.id,
        page_size: 10
      }
    })
      .then(res => {
        setCountUsers(prevState => ({
          ...prevState, 
          subscriptions_count: res.data.count
        }));
        setSubscriptions(res.data.results.map((item:any) => item.user_dst));
      });
  }, [props.id]);

  const getAllInfo = useCallback(() => {
    getFriends();
    getSubscribers();
    getSubscriptions();
  }, [getFriends, getSubscribers, getSubscriptions]);

  const openFriendsModal = useCallback(() => {
    setModalData({
      modalType: typeOfModal.friends,
      isUsersModalOpen: true
    });
  }, [setModalData]);

  const openSubscriptionsModal = useCallback(() => {
    setModalData({
      modalType: typeOfModal.subscriptions,
      isUsersModalOpen: true
    });
  }, [setModalData]);

  const openUsersModal = useCallback(() => {
    setModalData({
      modalType: typeOfModal.users,
      isUsersModalOpen: true
    });
  }, [setModalData]);
  
  const openSubscribersModal = useCallback(() => {
    setModalData({
      modalType: typeOfModal.subscribers,
      isUsersModalOpen: true
    });
  }, [setModalData]);
  
  const navigate = useNavigate();

  const close = useCallback(() => {
    navigate(-1);
  }, []);

  return (
    <Grid mt={3}>
      <Grid px={2} mb={2}>
        <Grid mb={3}>
          <div className={styles.title}>
            Поиск пользователей в приложении
          </div>
        </Grid>
        <Grid item className={styles.search} onClick={openUsersModal}>
          <Grid pl={1} display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8.63636" cy="8.63636" r="7.63636" stroke="#C3C9CD" strokeWidth="2"/>
              <path d="M14.0908 14.0909L19.0908 19.0909" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </Grid>
          <div className={styles.input}>
            Введите имя пользователя или id
          </div>  
        </Grid>
      </Grid>
      <Grid item pl={2} pr={2} display={'flex'} justifyContent={'space-between'}>
        <Grid display={'flex'} alignItems={'center'}>
          <Grid display={'flex'} alignItems={'center'} mr={'13px'}>
            <Grid mr={'14px'}>
              <QuestionButton
                title="Если между вами и пользователем взаимная подписка,
                такой пользователь станет вашим другом. Вы можете приглашать подписчиков и друзей в свои темы"
              />
            </Grid>
            <div className={styles.title}>
              Друзья
            </div>
          </Grid>
          <div className={styles.quantity}>
            {countUsers.friends_count}
          </div>
        </Grid>
        <MuiButton onClick={openFriendsModal} endIcon={<>
          <svg width="6" height="12" viewBox="0 0 4 9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.666016 8L2.81445 4.77735C2.92642 4.6094 2.92642 4.3906 2.81445 4.22265L0.666015 1" stroke="#ABB0B2" strokeLinecap="round"/>
          </svg>
        </>}>
          <Typography textTransform={'none'} color={'#ABB0B2'} fontWeight={400} fontSize={'14px'} fontFamily={'Gilroy'} mr={'13px'}>
            Все Друзья
          </Typography>
        </MuiButton>
      </Grid>
      <Grid item container direction={'row'} wrap={'nowrap'} maxWidth={'100%'} pl={2} pr={2} pt={3} overflow={'scroll'}>
        {
          friends.map(item => (
            <Grid item pr={2} key={item.id}>
              <UserPreview user={item}/>
            </Grid>
          ))
        }
      </Grid>
      <Grid item pl={2} pr={2} pt={3} display={'flex'} justifyContent={'space-between'}>
        <Grid display={'flex'} alignItems={'center'}>
          <Grid display={'flex'} alignItems={'center'} mr={'13px'}>
            <Grid mr={'14px'}>
              <QuestionButton
                title="Пользователи, на которых вы подписались. Вы можете воспользоваться поиском выше, найти пользователей в приложении и подписаться на них."
              />
            </Grid>
            <div className={styles.title}>
              Подписки
            </div>
          </Grid>
          <div className={styles.quantity}>
            {
              countUsers.subscriptions_count
            }
          </div>
        </Grid>
        <MuiButton onClick={openSubscriptionsModal} endIcon={<>
          <svg width="6" height="12" viewBox="0 0 4 9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.666016 8L2.81445 4.77735C2.92642 4.6094 2.92642 4.3906 2.81445 4.22265L0.666015 1" stroke="#ABB0B2" strokeLinecap="round"/>
          </svg>
        </>}>
          <Typography textTransform={'none'} color={'#ABB0B2'} fontWeight={400} fontSize={'14px'} fontFamily={'Gilroy'}>
            Все Подписки
          </Typography>
        </MuiButton>
      </Grid>
      <Grid item container direction={'row'} wrap={'nowrap'} maxWidth={'100%'} pl={2} pr={2} pt={3} overflow={'scroll'}>

        {
          subscriptions.map(item => (
            <Grid item pr={2} key={item.id}>
              <UserPreview user={item}/>
            </Grid>
          ))
        }
      </Grid>
      <Grid item pl={2} pr={2} pt={3} display={'flex'} justifyContent={'space-between'}>
        <Grid display={'flex'} alignItems={'center'}>
          <Grid display={'flex'} alignItems={'center'} mr={'13px'}>
            <Grid mr={'14px'}>
              <QuestionButton
                title="Пользователи, которые подписались на вас. Вы можете приглашать подписчиков в свои темы"
              />
            </Grid>
            <div className={styles.title}>
              Подписчики
            </div>
          </Grid>
          <div className={styles.quantity}>
            {
              countUsers.subscribers_count
            }
          </div>
        </Grid>
        <MuiButton onClick={openSubscribersModal} endIcon={<>
          <svg width="6" height="12" viewBox="0 0 4 9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.666016 8L2.81445 4.77735C2.92642 4.6094 2.92642 4.3906 2.81445 4.22265L0.666015 1" stroke="#ABB0B2" strokeLinecap="round"/>
          </svg>
        </>}>
          <Typography textTransform={'none'} color={'#ABB0B2'} fontWeight={400} fontSize={'14px'} fontFamily={'Gilroy'}>
            Все Подписчики
          </Typography>
        </MuiButton>
      </Grid>
      <Grid item container direction={'row'} wrap={'nowrap'} maxWidth={'100%'} pl={2} pr={2} pt={3} overflow={'scroll'}>

        {
          subscribers.map(item => (
            <Grid item pr={2} key={item.id}>
              <UserPreview user={item}/>
            </Grid>
          ))
        }
      </Grid>
      <UsersModal
        userId={props.id}
        isOpen={modalData.isUsersModalOpen}
        close={close}
        modalType={modalData.modalType}
      />
    </Grid>
  );
});

Friends.displayName = 'Friends';

export default Friends;
