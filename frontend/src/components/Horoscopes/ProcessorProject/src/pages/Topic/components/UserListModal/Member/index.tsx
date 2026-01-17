
import { FC, useCallback, useState } from 'react';
import { Checkbox, Grid, Skeleton, Typography } from '@mui/material';

import Avatar from '../../../../../components/Avatar';

import { IMember, ITopicUser } from '../../../../../models/interfaces/topic';

import styles from './styles.module.scss';
import ButtonClose from '../../../../../components/buttonClose/ButtonClose';
import TextGradient from '../../../../../components/textGradient/TextGradient';
import { IOptionItem } from '../../../../../models/interfaces/options';
import authRequest from '../../../../../api/authRequest';
import { forumTopicMembersApi } from '../../../../../api/forum';
import { useAppDispatch } from '../../../../../store/store';
import { setIsAppLoading } from '../../../../../store/reducers/preferencesReducer';
import { MemberStatus } from '../../../../../models/enums/topic';

interface IProps {
  member: IMember;
  usersFilter: IOptionItem,
  topicId: number
}

const Member: FC<IProps> = ({ member, usersFilter, topicId }) => {
  const dispatch = useAppDispatch();
  const [memberData, setMemberData] = useState<IMember | null>(member);

  const getTopicMembers = useCallback(() => {
    if (memberData) {
      dispatch(setIsAppLoading(true));
      authRequest.get(forumTopicMembersApi(memberData.id), {
        params: {
          topic: topicId,
          ...usersFilter.params
        }
      })
        .then(res => {
          setMemberData(res.data);
        })
        .catch(() => {
          setMemberData(null);
        })
        .finally(() => dispatch(setIsAppLoading(false)));
    }
  }, [dispatch, memberData, topicId, usersFilter.params]);

  const joinUser = useCallback(() => {
    if (memberData) {
      dispatch(setIsAppLoading(true));
      authRequest.patch(forumTopicMembersApi(memberData.id), {
        status: 'accepted'
      })
        .then(res => {
          getTopicMembers();
        })
        .finally(() => {
          dispatch(setIsAppLoading(false));
        });
    }
  }, [dispatch, getTopicMembers, memberData]);

  const rejectUser = useCallback(() => {
    if (memberData) {
      dispatch(setIsAppLoading(true));
      authRequest.patch(forumTopicMembersApi(memberData.id), {
        status: 'rejected'
      })
        .then(res => {
          getTopicMembers();
        })
        .finally(() => {
          dispatch(setIsAppLoading(false));
        });
    }
  }, [dispatch, getTopicMembers, memberData]);

  if (!memberData) {
    return null;
  }

  return (
    <Grid>
      <div className={styles.main}>
        <Grid container display={'flex'} alignItems={'center'}>
          <Grid item pr={2}>
            <Avatar
              width={45}
              height={45}
              fontSize={20}
              avatar={memberData.user.avatar}
              abbreviation={`${memberData.user.first_name?.slice(0, 1)}${memberData.user.last_name?.slice(0, 1)}`}
            />
          </Grid>
          <Grid item flex={1}>
            <Typography color={'#292E30'} fontWeight={500} fontSize={'16px'}>
              {memberData.user.first_name} {memberData.user.last_name}
            </Typography>
            {
              memberData.user.birth_date && (
                <Typography color={'#292E30'} fontWeight={400} fontSize={'12px'}>
                  {memberData.user.birth_date.toString().split('-').reverse().join('.')}
                </Typography>
              )
            }
          </Grid>
          {
            memberData.status !== MemberStatus.invited 
              ? memberData.status === MemberStatus.rejected
                ? (
                  <div onClick={joinUser} className={styles.member_button}>
                    <TextGradient flex={1} fontFamily={'Gilroy'} fontWeight={700} fontSize={'14px'}>
                      Восстановить
                    </TextGradient>
                  </div>
                )
                : (
                  <ButtonClose onClick={rejectUser}/>
                )
              : null  
          }

        </Grid>
      </div>
      {
        memberData.status === MemberStatus.invited && (
          <Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
            <div className={styles.button} onClick={rejectUser}>
              <svg width="17" height="17" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.66667 8.79601L7 7.46268M7 7.46268L8.33333 6.12934M7 7.46268L5.66667 6.12934M7 7.46268L8.33333 8.79601M13 7.46268C13 8.25061 12.8448 9.03082 12.5433 9.75878C12.2417 10.4867 11.7998 11.1482 11.2426 11.7053C10.6855 12.2625 10.0241 12.7044 9.2961 13.006C8.56815 13.3075 7.78793 13.4627 7 13.4627C6.21207 13.4627 5.43185 13.3075 4.7039 13.006C3.97595 12.7044 3.31451 12.2625 2.75736 11.7053C2.20021 11.1482 1.75825 10.4867 1.45672 9.75878C1.15519 9.03082 1 8.25061 1 7.46268C1 5.87138 1.63214 4.34525 2.75736 3.22004C3.88258 2.09482 5.4087 1.46268 7 1.46268C8.5913 1.46268 10.1174 2.09482 11.2426 3.22004C12.3679 4.34525 13 5.87138 13 7.46268Z" stroke="#F32828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Отклонить 
            </div>
            <div className={styles.button} onClick={joinUser}>
              <svg width="17" height="17" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="12" height="12" rx="6" stroke="#49BC5B" strokeWidth="2"/>
                <path d="M4.66699 7L6.06344 8.39645C6.2587 8.59171 6.57528 8.59171 6.77055 8.39645L9.91699 5.25" stroke="#49BC5B" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Принять 
            </div>
          </Grid>
        )
      }
    </Grid>
  );
};

export default Member;
