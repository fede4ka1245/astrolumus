import { useState, FC, useRef, useEffect, useCallback } from 'react';
import { Grid } from '@mui/material';
import Background from '../../../../../components/background/Background';
import UserHeader from '../../../../../components/userHeader/UserHeader';
import { useAppSelector } from '../../../../../store/store';
import { ITopicUser } from '../../../../../models/interfaces/topic';
import authRequest from '../../../../../api/authRequest';
import { userFriendsApi, usersListApi } from '../../../../../api/user';
import styles from './styles.module.scss';
import UserLink from '../../../../../components/userLink/UserLink';
import UserPreviewSkeleton from '../../../../../components/skeletons/UserPreviewSkeleton';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../../../../models/enums/routes';

interface IProps {
  closeSearch: () => void;
}

const Search: FC <IProps> = ({ closeSearch }) => {
  const userId = useAppSelector(state => state.user.userInfo.id);
  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<ITopicUser[]>([]);
  const timer = useRef<any>();
  const navigate = useNavigate();

  useEffect(() => {
    getFriends();
  }, []);

  const getFriends = useCallback(() => {
    authRequest.get(userFriendsApi(), {
      params: {
        user_src: userId
      }
    })
      .then(res => {
        console.log(res.data);
      });
  }, [userId]);

  const getUsers = useCallback((params: object) => {
    authRequest.get(usersListApi(), { 
      params: {
        ...params,
        page_size: 30
      }
    })
      .then(res => {
        setUsers(res.data.results);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const onSearch = useCallback((params: any) => {
    setText(params?.query ?? '');
    setLoading(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (params?.query) {
        getUsers(params);
      }
    }, 1000);
  }, [getUsers]);

  const selectUser = useCallback((user: ITopicUser) => {
    navigate(routes.user + user.id);
  }, [navigate]);

  return (
    <div className={styles.main}>
      <Background background={'#f0f0f3'} />
      <UserHeader/>
      <div className={styles.container}>
        <Grid className={styles.wrapper}>
          <Grid>
            <svg width="23" height="23" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8.63636" cy="8.63636" r="7.63636" stroke="#C3C9CD" strokeWidth="2"/>
              <path d="M14.0908 14.0909L19.0908 19.0909" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </Grid>
          <input className={styles.input} value={text} autoFocus placeholder="Введите фразу для поиска" onChange={(e) => onSearch({ query: e.target.value })}/>
          <Grid onClick={closeSearch}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.5 1.5L12.5 12.5" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12.5 1.5L1.5 12.5" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </Grid>
        </Grid>
      </div>
      <Grid pl={2} pr={2}>
        {!loading 
          ? users.map(item => (
            <Grid key={item.id} mb={2} onClick={() => selectUser(item)}>
              <UserLink 
                isAdded={true}
                selectedUsers={[]}
                withCheck={false}
                user={item} 
              />
            </Grid>
          ))
          : Array(8).fill(0).map((item, index) => (
            <Grid key={index} mb={2}>
              <UserPreviewSkeleton/>
            </Grid>
          ))}
      </Grid>
    </div>
  );
};

export default Search;
