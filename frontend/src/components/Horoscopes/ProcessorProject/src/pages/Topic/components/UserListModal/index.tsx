import { FC, useState, useEffect, useCallback } from 'react';
import { Grid, Typography } from '@mui/material';
import debounce from 'lodash.debounce';
import Modal from '../../../../components/modal/Modal';
import User from './User';
import Member from './Member';
import ButtonClose from '../../../../components/buttonClose/ButtonClose';
import UserPreviewSkeleton from '../../../../components/skeletons/UserPreviewSkeleton';
import { ModalProps } from '../../../../components/modal/ModalProps';
import Options from '../../../../components/options/Options';
import authRequest from '../../../../api/authRequest';
import { usersListApi } from '../../../../api/user';
import { forumTopicMembersApi } from '../../../../api/forum';
import { IMember, IServerTopic, ITopicUser } from '../../../../models/interfaces/topic';
import { AccessLevel } from '../../../../models/enums/topic';
import { IOptionItem } from '../../../../models/interfaces/options';
import { FilterType } from './models';
import { useAppSelector } from '../../../../store/store';
import convertHtmlToText from '../../../../helpers/convertHtmlToText';
import { privateTopicUsersFiltersSettings, publicTopicUsersFiltersSettings } from './settings';
import styles from './styles.module.scss';
import TextGradient from '../../../../components/textGradient/TextGradient';
import useInfiniteScroll from '../../../../hooks/useInfiniteScroll';
import { useSearchParamsState } from '../../../../hooks/useSearchParamsState';

interface IProps extends ModalProps{
  topic: IServerTopic
}

const initialOffset = 10;

const UserListModal: FC<IProps> = ({ isOpen, close, topic }) => {
  const [users, setUsers] = useState<ITopicUser[]>([]);
  const [members, setMembers] = useState<IMember[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const { userInfo } = useAppSelector(state => state.user);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [infiniteLoading, setInfiniteLoading] = useState(false);
  const [hasNext, setHasNext] = useState(true);
  const usersFiltersSettings = topic.access_level === AccessLevel.private ? privateTopicUsersFiltersSettings : publicTopicUsersFiltersSettings;
  const [usersFilter, setUsersFilter] = useState<IOptionItem>(usersFiltersSettings[0]);
  const [userFilterValue] = useSearchParamsState<string>('usf', '');
  const lastCommentRef = useInfiniteScroll(() => {
    if (hasNext) {
      const filter = { ...usersFilter, params: { ...usersFilter.params, offset } };
      getUsers(filter, true);
    }
  });
  
  useEffect(() => {
    if (isOpen) {
      const filter = { ...usersFiltersSettings[0], params: { ...usersFiltersSettings[0].params, offset } };
      getUsers(filter, true);
      if (userFilterValue) {
        const filter = usersFiltersSettings?.find((item) => {
          return item?.value as string === userFilterValue;
        });

        if (filter) {
          setFilter(filter);
        }
      } else {
        setFilter(usersFiltersSettings[0]);
      }
    } else {
      setUsers([]);
      setOffset(0);
      setMembers([]);
    }
  }, [isOpen]);

  const getSubscriptions = useCallback((params: object, isInfinityScroll?: boolean) => {
    if (!isInfinityScroll) {
      setLoading(true);
    } else {
      setInfiniteLoading(true);
    }
    authRequest.get(usersListApi(), {
      params: {
        subscribers_for: userInfo.id,
        membership__topic__not_joint: topic.id,
        limit: initialOffset,
        ...params
      }
    })
      .then(res => {
        if (isInfinityScroll) {
          setUsers(prevState => [...prevState, ...res.data.results]);
          setOffset(prev => prev + initialOffset);
        } else {
          setUsers(res.data.results);
          setOffset(initialOffset);
        }
        setHasNext(res.data.next);
        setMembers([]);
      })
      .finally(() => {
        if (!isInfinityScroll) {
          setLoading(false);
        } else {
          setInfiniteLoading(false);
        }
      });
  }, [topic.id, userInfo.id]);

  const getTopicMembers = useCallback((params: object, isInfinityScroll?: boolean) => {
    if (!isInfinityScroll) {
      setLoading(true);
    } else {
      setInfiniteLoading(true);
    }
    authRequest.get(forumTopicMembersApi(), {
      params: {
        topic: topic.id,
        limit: initialOffset,
        ...params
      }
    })
      .then(res => {
        if (isInfinityScroll) {
          setMembers(prevState => [...prevState, ...res.data.results]);
          setOffset(prev => prev + initialOffset);
        } else {
          setMembers(res.data.results);
          setOffset(initialOffset);
        }
        setHasNext(res.data.next);
        setUsers([]);
      })
      .finally(() => {
        if (!isInfinityScroll) {
          setLoading(false);
        } else {
          setInfiniteLoading(false);
        }
      });
  }, [topic.id]);

  const truncateText = useCallback((text: string): string => {
    if (text.length > 150) {
      return text.substring(0, 150) + '...';
    } else {
      return text;
    }
  }, []);

  const setFilter = useCallback((filter: IOptionItem) => {
    if (!loading && filter.value !== usersFilter.value) {
      setUsersFilter(filter);
      getUsers(filter);
    }
  }, [usersFilter, loading]);

  const getUsers = (filter: IOptionItem, isInfinityScroll?: boolean) => {
    if (!infiniteLoading) {
      if (filter.value === 'users') {
        getSubscriptions({ query: searchText, ...filter.params }, isInfinityScroll);
      } else {
        getTopicMembers(filter.params, isInfinityScroll);
      }
    }
  };

  const searchUser = useCallback((text: string) => {
    setSearchText(text);
    if (usersFilter.value === FilterType.users) {
      getSubscriptions({ query: text });
    } else {
      getTopicMembers({ ...usersFilter.params, user_query: text });
    }
  }, [getSubscriptions, getTopicMembers, usersFilter.params, usersFilter.value]);

  const warnIfListEmpty = useCallback((type: FilterType) => {
    switch (type) {
    case FilterType.users: 
      return (
        <Grid py={3} px={2} display={'flex'} mb={4} alignItems={'flex-start'} border={'1px solid #C3C9CD'} borderRadius={'20px'}>
          <Typography fontFamily={'Gilroy'} color={'#5B6062'} fontSize={'15px'} textAlign={'center'}>
            У вас пока нет друзей или подписчиков, которых можно пригласить в тему
          </Typography>
        </Grid>
      );
    case FilterType.members: 
      return (
        <Grid py={3} px={2} display={'flex'} mb={4} alignItems={'flex-start'} border={'1px solid #C3C9CD'} borderRadius={'20px'}>
          <Typography fontFamily={'Gilroy'} color={'#5B6062'} fontSize={'15px'} textAlign={'center'}>
            Пока никто не является участником вашей темы. Пригласите друзей или подписчиков.
          </Typography >
        </Grid>
      );
    case FilterType.invited: 
      return (
        <Grid py={3} px={2} display={'flex'} mb={4} alignItems={'flex-start'} border={'1px solid #C3C9CD'} borderRadius={'20px'}>
          <Typography fontFamily={'Gilroy'} color={'#5B6062'} fontSize={'15px'} textAlign={'center'}>
            Вы пока никого не пригласили в тему. Пригласите своих друзей или подписчиков
          </Typography>
        </Grid>
      ); 
    case FilterType.requests: 
      return (
        <Grid py={3} px={2} display={'flex'} mb={4} alignItems={'flex-start'} border={'1px solid #C3C9CD'} borderRadius={'20px'}>
          <Typography fontFamily={'Gilroy'} color={'#5B6062'} fontSize={'15px'} textAlign={'center'}>
            Пока никто не запросил доступ в эту тему
          </Typography>
        </Grid>
      );  
    case FilterType.rejected: 
      return (
        <Grid py={3} px={2} display={'flex'} mb={4} alignItems={'flex-start'} border={'1px solid #C3C9CD'} borderRadius={'20px'}>
          <Typography fontFamily={'Gilroy'} color={'#5B6062'} fontSize={'15px'} textAlign={'center'}>
            Здесь появятся пользователи, заявку которых вы отклонили и не предоставили доступ к теме
          </Typography>
        </Grid>
      );      
    default:
      return null;
    }
  }, []);

  const getListByType = useCallback((type: FilterType) => {
    if (type === FilterType.users) {
      return users.length > 0
        ? users.map(item => (
          <Grid key={item.id} ref={lastCommentRef}>
            <User
              topicId={topic.id}
              usersFilter={usersFilter}
              user={item}/>
          </Grid>))
        : warnIfListEmpty(type);
    }
    return members.length > 0
      ? members.map(item => (
        <Grid key={item.id} ref={lastCommentRef}>
          <Member
            topicId={topic.id}
            usersFilter={usersFilter}
            member={item}/>
        </Grid>))
      : warnIfListEmpty(type);
  }, [lastCommentRef, members, topic.id, users, usersFilter, warnIfListEmpty]);

  const getSubtitle = useCallback((type: FilterType) => {
    switch (type) {
    case FilterType.users: 
      return 'Вы можете пригласить своих друзей и подписчиков в вашу тему';
    case FilterType.members: 
      return 'Эти пользователи вступили в вашей тему';
    case FilterType.invited: 
      return 'Вы пригласили этих пользователей в тему, но они пока не ответили на приглашение '; 
    case FilterType.requests: 
      return 'Эти пользователи хотят вступить в вашу приватную тему';  
    case FilterType.rejected: 
      return 'Для этих пользователей вы отклонили заявку на участие в теме ';      
    default:
      return null;
    }
  }, []);

  return (
    <Modal isOpen={isOpen} close={close} height={'var(--modal-page-height)'}>
      <Grid container direction={'column'} pt={3} px={2} height={'100%'} bgcolor={'#FFF'}>
        <Grid item display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
          <Typography
            fontSize={'16px'}
            lineHeight={'35px'}
            fontWeight={600}
            color="#292E30"
          >
            Информация о теме
          </Typography>
          <ButtonClose onClick={close}/>
        </Grid>
        <Typography
          fontSize={'14px'}
          lineHeight={'16px'}
          color="#292E30"
          mb={'10px'}
        >
          {truncateText(convertHtmlToText(topic.description))}
        </Typography>
        <Grid width="100%" overflow={'hidden'} mb={2}>
          <Options options={usersFiltersSettings} value={usersFilter.value} setValue={setFilter} isOutlined isScrollable/>
        </Grid>
        <Grid mb={2}>
          <TextGradient
            fontSize={'14px'}
            textTransform={'uppercase'}
            fontWeight={'bold'}
          >
            {getSubtitle(usersFilter.value)}
          </TextGradient>
        </Grid>
        <Grid item className={styles.search} mb={2}>
          <Grid pl={1} display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8.63636" cy="8.63636" r="7.63636" stroke="#C3C9CD" strokeWidth="2"/>
              <path d="M14.0908 14.0909L19.0908 19.0909" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </Grid>
          <input placeholder={'Введите имя пользователя или id'} value={searchText} onChange={(e) => searchUser(e.target.value)}/>
          <Grid pr={1} display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <svg width="15" height="15" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.5 1.5L12.5 12.5" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12.5 1.5L1.5 12.5" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </Grid>
        </Grid>
        <Grid flex={1} item overflow={'scroll'}>
          {!loading 
            ? getListByType(usersFilter.value)
            : (
              Array(8).fill(0).map((item, index) => (
                <Grid key={index} mb={2}>
                  <UserPreviewSkeleton/>
                </Grid>
              ))
            )}
        </Grid>
      </Grid>
    </Modal>
  );
};

export default UserListModal;
