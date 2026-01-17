import { FC, useState, useEffect } from 'react';
import { CircularProgress, Grid } from '@mui/material';
import { Keyboard } from '@capacitor/keyboard';
import Modal from '../../../../modal/Modal';
import TextGradient from '../../../../textGradient/TextGradient';
import UserLink from '../../../../userLink/UserLink';
import ButtonClose from '../../../../buttonClose/ButtonClose';
import UserPreviewSkeleton from '../../../../skeletons/UserPreviewSkeleton';
import styles from './styles.module.scss';
import authRequest from '../../../../../api/authRequest';
import { userFriendsApi, userSubscriptionsApi, usersListApi } from '../../../../../api/user';
import { ITopicUser } from '../../../../../models/interfaces/topic';
import { ModalProps } from '../../../../modal/ModalProps';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../../../../models/enums/routes';
import useInfiniteScroll from '../../../../../hooks/useInfiniteScroll';

export enum typeOfModal {
  friends,
  subscriptions,
  subscribers,
  users
}

interface IProps extends ModalProps{
  modalType: typeOfModal;
  userId: number;
}

const UsersModal: FC<IProps> = ({ isOpen, close, modalType, userId }) => {
  const [users, setUsers] = useState<ITopicUser[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [infiniteLoading, setInfiniteLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [hasNext, setHasNext] = useState<boolean>(true);
  const [offset, setOffset] = useState<number>(0);
  const limit = 20;
  const lastItemRef = useInfiniteScroll(() => {
    if (hasNext && !infiniteLoading) {
      setOffset(prev => prev + limit);
      getUsersByType({
        offset: offset + limit,
        query: searchText
      }, true);
    }
  });

  useEffect(() => {
    if (isOpen) {
      searchUser('');
    } else {
      setUsers([]);
    }
  }, [isOpen]);

  const getUsersByType = (params: object, InfiniteScroll?:boolean) => {
    if (!infiniteLoading) {
      switch (modalType) {
      case typeOfModal.friends:
        getFriends(params, InfiniteScroll);
        break;
      case typeOfModal.subscribers:
        getSubscribers(params, InfiniteScroll);
        break;
      case typeOfModal.subscriptions:
        getSubscriptions(params, InfiniteScroll);
        break; 
      case typeOfModal.users:
        getUsers(params, InfiniteScroll);
        break;    
      default:  
      }
    }
  };

  const searchUser = (text: string) => {
    setSearchText(text);
    getUsersByType({ query: text });
  };

  const getFriends = (params: object, InfiniteScroll?: boolean) => {
    if (InfiniteScroll) {
      setInfiniteLoading(true);
    } else {
      setLoading(true);
    }
    authRequest.get(userFriendsApi(), {
      params: {
        user_src: userId,
        limit,
        ...params
      }
    })
      .then(res => {
        if (InfiniteScroll) {
          setUsers(prev => [...prev, ...res.data.results]);
        } else {
          setUsers(res.data.results);
          setOffset(0);
        }
        setHasNext(!!res.data.next);
      })
      .finally(() => {
        if (InfiniteScroll) {
          setInfiniteLoading(false);
        } else {
          setLoading(false);
        }
      });
  };

  const getSubscribers = (params: object, InfiniteScroll?: boolean) => {
    if (InfiniteScroll) {
      setInfiniteLoading(true);
    } else {
      setLoading(true);
    }
    authRequest.get(userSubscriptionsApi(), {
      params: {
        user_dst: userId,
        limit,
        ...params
      }
    })
      .then(res => {
        if (InfiniteScroll) {
          setUsers(prev => [...prev, ...res.data.results.map((item:any) => item.user_src)]);
        } else {
          setUsers(res.data.results.map((item:any) => item.user_src));
          setOffset(0);
        }
        setHasNext(!!res.data.next);
      })
      .finally(() => {
        if (InfiniteScroll) {
          setInfiniteLoading(false);
        } else {
          setLoading(false);
        }
      });
  };

  const getSubscriptions = (params: object, InfiniteScroll?: boolean) => {
    if (InfiniteScroll) {
      setInfiniteLoading(true);
    } else {
      setLoading(true);
    }
    authRequest.get(userSubscriptionsApi(), {
      params: {
        user_src: userId,
        limit,
        ...params
      }
    })
      .then(res => {
        if (InfiniteScroll) {
          setUsers(prev => [...prev, ...res.data.results.map((item:any) => item.user_dst)]);
        } else {
          setUsers(res.data.results.map((item:any) => item.user_dst));
          setOffset(0);
        }
        setHasNext(!!res.data.next);
      })
      .finally(() => {
        if (InfiniteScroll) {
          setInfiniteLoading(false);
        } else {
          setLoading(false);
        }
      });
  };

  const getUsers = (params: object, InfiniteScroll?: boolean) => {
    if (InfiniteScroll) {
      setInfiniteLoading(true);
    } else {
      setLoading(true);
    }
    authRequest.get(usersListApi(), { 
      params: {
        limit,
        ...params
      }
    })
      .then(res => {
        if (InfiniteScroll) {
          setUsers(prev => [...prev, ...res.data.results]);
        } else {
          setOffset(0);
          setUsers(res.data.results);
        };
        setHasNext(!!res.data.next);
      })
      .finally(() => {
        if (InfiniteScroll) {
          setInfiniteLoading(false);
        } else {
          setLoading(false);
        }
      });
  };

  const getTitle = () => {
    switch (modalType) {
    case typeOfModal.friends:
      return 'Друзья';
    case typeOfModal.subscribers:
      return 'Подписчики';
    case typeOfModal.subscriptions:   
      return 'Подписки';
    case typeOfModal.users:   
      return 'Пользователи';  
    default:  
    }
  };

  const getSubtitle = () => {
    switch (modalType) {
    case typeOfModal.friends:
      return 'Поиск по вашим друзьям ';
    case typeOfModal.subscribers:
      return 'Поиск по вашим подписчикам';
    case typeOfModal.subscriptions:   
      return 'Поиск по вашим подпискам';
    case typeOfModal.users:   
      return 'Поиск по пользователям';  
    default:  
    }
  };

  const navigateToUser = (userId: number) => {
    navigate(routes.user + userId);
    window.scrollTo(0, 0);
  };

  const handleScroll = () => {
    Keyboard.hide();
  };

  return (
    <Modal isOpen={isOpen} close={close} height={'var(--modal-page-height)'} onScroll={handleScroll}>
      <Grid container direction={'column'} pt={3} px={2} flex={1} position={'relative'}>
        <Grid container item justifyContent={'space-between'} alignItems={'center'} mb={1}>
          <Grid item>
            <TextGradient
              textAlign={'center'}
              textTransform={'uppercase'}
              fontWeight={'bold'}
            >
              {getTitle()}
            </TextGradient>
          </Grid>
          <ButtonClose onClick={close}/>
        </Grid>
        <Grid mb={2}>
          <TextGradient
            fontSize={'14px'}
            textTransform={'uppercase'}
            fontWeight={'bold'}
          >
            {getSubtitle()}
          </TextGradient>
        </Grid>
        <Grid position={'sticky'}>
          <Grid item className={styles.search} mb={4}>
            <Grid pl={1} display={'flex'} justifyContent={'center'} alignItems={'center'}>
              <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8.63636" cy="8.63636" r="7.63636" stroke="#C3C9CD" strokeWidth="2"/>
                <path d="M14.0908 14.0909L19.0908 19.0909" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </Grid>
            <input placeholder={'Введите имя пользователя или id'} value={searchText} onChange={(e) => searchUser(e.target.value)}/>
            <Grid pr={1} display={'flex'} justifyContent={'center'} alignItems={'center'} onClick={() => searchUser('')}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 1.5L12.5 12.5" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12.5 1.5L1.5 12.5" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </Grid>
          </Grid>
        </Grid>
        <Grid flex={1} item>
          {!loading 
            ? users.map(item => (
              <Grid key={item.id} mb={2} onClick={() => navigateToUser(item.id)} ref={lastItemRef}>
                <UserLink 
                  user={item}/>
              </Grid>

            )) 
            : (
              Array(8).fill(0).map((item, index) => (
                <Grid key={index} mb={2}>
                  <UserPreviewSkeleton/>
                </Grid>
              ))
            )}
          {
            infiniteLoading && (
              <Grid display="flex" justifyContent="center">
                <CircularProgress 
                  style={{
                    color: '#37366B'
                  }}
                  size={30}/>
              </Grid>
            )
          }
        </Grid>
      </Grid>
    </Modal>
  );
};

export default UsersModal;
