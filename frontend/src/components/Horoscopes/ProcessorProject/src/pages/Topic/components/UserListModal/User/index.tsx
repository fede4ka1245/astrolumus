import { FC, useCallback, useState } from 'react';
import { Grid, Typography } from '@mui/material';

import Avatar from '../../../../../components/Avatar';

import { ITopicUser } from '../../../../../models/interfaces/topic';

import styles from './styles.module.scss';
import ButtonClose from '../../../../../components/buttonClose/ButtonClose';
import TextGradient from '../../../../../components/textGradient/TextGradient';
import { IOptionItem } from '../../../../../models/interfaces/options';
import authRequest from '../../../../../api/authRequest';
import { forumTopicMembersApi } from '../../../../../api/forum';
import { useAppDispatch } from '../../../../../store/store';
import { setIsAppLoading } from '../../../../../store/reducers/preferencesReducer';
import { usersListApi } from '../../../../../api/user';

interface IProps {
  user: ITopicUser;
  usersFilter: IOptionItem,
  topicId: number
}

const User: FC<IProps> = ({ user, usersFilter, topicId }) => {
  const dispatch = useAppDispatch();
  const [userData, setUserData] = useState<ITopicUser | null>(user);

  const getSubscriptions = useCallback(() => {
    if (userData) {
      dispatch(setIsAppLoading(true));
      authRequest.get(usersListApi(userData.id), {
        params: {
          subscribers_for: userData.id,
          membership__topic__not_joint: topicId,
          ...usersFilter.params
        }
      })
        .then(res => {
          setUserData(res.data);
        })
        .catch(() => {
          setUserData(null);
        })
        .finally(() => {
          dispatch(setIsAppLoading(false));
        });
    }
  }, [dispatch, topicId, userData, usersFilter.params]);

  const joinUser = useCallback(() => {
    if (userData) {
      dispatch(setIsAppLoading(true));
      authRequest.post(forumTopicMembersApi(), {
        topic: topicId,
        user_id: userData.id,
        status: 'accepted'
      })
        .then(res => {
          getSubscriptions();
        })
        .finally(() => {
          dispatch(setIsAppLoading(false));
        });
    }
  }, [dispatch, getSubscriptions, topicId, userData]);

  if (!userData) {
    return null;
  }

  return (
    <div className={styles.main}>
      <Grid container display={'flex'} alignItems={'center'}>
        <Grid item pr={2}>
          <Avatar
            width={45}
            height={45}
            fontSize={20}
            avatar={userData.avatar}
            abbreviation={`${userData.first_name?.slice(0, 1)}${userData.last_name?.slice(0, 1)}`}
          />
        </Grid>
        <Grid item flex={1}>
          <Typography color={'#292E30'} fontWeight={500} fontSize={'16px'}>
            {userData.first_name} {userData.last_name}
          </Typography>
          {
            userData.birth_date && (
              <Typography color={'#292E30'} fontWeight={400} fontSize={'12px'}>
                {userData.birth_date.toString().split('-').reverse().join('.')}
              </Typography>
            )
          }
        </Grid>
        <div onClick={joinUser} className={styles.member_button}>
          <TextGradient flex={1} fontFamily={'Gilroy'} fontWeight={700} fontSize={'14px'}>
            Пригласить
          </TextGradient>
        </div>
      </Grid>
    </div>
  );
};

export default User;
