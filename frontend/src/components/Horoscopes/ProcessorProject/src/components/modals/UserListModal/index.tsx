import { FC, useState, useEffect, useCallback } from 'react';
import { Grid, Typography } from '@mui/material';
import Modal from '../../../components/modal/Modal';
import TextGradient from '../../../components/textGradient/TextGradient';
import UserLink from '../../../components/userLink/UserLink';
import ButtonClose from '../../buttonClose/ButtonClose';
import UserPreviewSkeleton from '../../skeletons/UserPreviewSkeleton';
import search from '../assets/search.svg';
import closeSrc from '../assets/close.svg';
import styles from './styles.module.scss';
import authRequest from '../../../api/authRequest';
import { userSubscriptionsApi } from '../../../api/user';
import { ITopicUser } from '../../../models/interfaces/topic';
import { ModalProps } from '../../modal/ModalProps';
import Avatar from '../../Avatar';
import { useAppSelector } from '../../../store/store';

interface IProps extends ModalProps{
  setSelectedUsers: (value: any) => void;
  isEdit?: boolean;
  selectedUsers: ITopicUser[];
}

const UserListModal: FC<IProps> = ({ isOpen, close, selectedUsers, setSelectedUsers, isEdit }) => {
  const [friends, setFriends] = useState<ITopicUser[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const { userInfo } = useAppSelector(state => state.user);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      searchUser('');
    } else {
      setFriends([]);
    }
  }, [isOpen]);

  const getFriends = useCallback((params: object) => {
    setLoading(true);
    authRequest.get(userSubscriptionsApi(), {
      params: {
        user_dst: userInfo.id,
        ...params
      }
    })
      .then(res => {
        setFriends(res.data.results.map((item:any) => item.user_src));
      })
      .finally(() => setLoading(false));
  }, [userInfo.id]);

  const searchUser = useCallback((text: string) => {
    setSearchText(text);
    setLoading(true);
    getFriends({ query: text });
  }, [getFriends]);

  // const getSubscribers = () => {
  //   authRequest.get(userSubscriptionsApi(), {
  //     params: {
  //       user_dst: props.id
  //     }
  //   })
  //     .then(res => {
  //       setSubscribers(res.data.results.map((item:any) => item.user_src));
  //     });
  // };

  // const getSubscriptions = () => {
  //   authRequest.get(userSubscriptionsApi(), {
  //     params: {
  //       user_src: props.id
  //     }
  //   })
  //     .then(res => {
  //       setSubscriptions(res.data.results.map((item:any) => item.user_dst));
  //     });
  // };

  return (
    <Modal isOpen={isOpen} close={close} height={'var(--modal-page-height)'}>
      <Grid container direction={'column'} pt={3} px={2} flex={1} position={'relative'}>
        <Grid container item justifyContent={'space-between'} alignItems={'center'} mb={2}>
          <Grid item>
            <TextGradient
              textAlign={'center'}
              textTransform={'uppercase'}
              fontWeight={'bold'}
            >
              Раздать приглашения
            </TextGradient>
          </Grid>
          <ButtonClose onClick={close}/>
        </Grid>
        <Grid position={'sticky'}>
          <Grid className={styles.selected_users}>
            {selectedUsers.length > 0 
              ? selectedUsers.map((item, index) => (
                <Grid key={item.id} display={'flex'} flexDirection={'column'} alignItems={'center'} mr={2} mb={2}>
                  <Grid position={'relative'}>
                    <Avatar
                      width={35}
                      height={35}
                      fontSize={10}
                      avatar={item.avatar}
                      abbreviation={`${item.first_name?.slice(0, 1)}${item.last_name?.slice(0, 1)}`}
                    />
                    <Grid 
                      top={'-7px'}
                      right={'-7px'}
                      width={'15px'}
                      height={'15px'}
                      display={'flex'}
                      alignItems={'center'}
                      justifyContent={'center'}
                      borderRadius={'50%'}
                      bgcolor={'#C3C9CD'}
                      position={'absolute'}
                      onClick={() => setSelectedUsers((prevState: ITopicUser[]) => prevState.filter(prevItem => prevItem.id !== item.id))}>
                      <svg width="7" height="7" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.5 1.5L12.5 12.5" stroke="#FFF" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M12.5 1.5L1.5 12.5" stroke="#FFF" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </Grid>
                  </Grid>

                  <Grid>
                    <Typography fontFamily={'Gilroy'} color={'#5B6062'} fontSize={'11px'} fontWeight={700}>
                      {item.first_name} {item.last_name}
                    </Typography>
                  </Grid>
                </Grid>
              ))
              : <Typography fontFamily={'Gilroy'} color={'#5B6062'} fontSize={'13px'}>
                Кого Вы бы хотели пригласить?
              </Typography>
            }
          </Grid>
          <Grid item className={styles.search} mb={4}>
            <Grid pl={1} display={'flex'} justifyContent={'center'} alignItems={'center'}>
              <img width={20} height={20} src={search} />
            </Grid>
            <input placeholder={'Введите имя пользователя или id'} value={searchText} onChange={(e) => searchUser(e.target.value)}/>
            <Grid pr={1} display={'flex'} justifyContent={'center'} alignItems={'center'}>
              <img width={15} height={15} src={closeSrc} onClick={() => searchUser('')}/>
            </Grid>
          </Grid>
        </Grid>
        <Grid flex={1} item>
          {!loading 
            ? friends.map(item => (
              <Grid key={item.id} mb={2}>
                <UserLink 
                  withCheck
                  selectedUsers={selectedUsers}
                  user={item} 
                  onChecked={(value) => value 
                    ? setSelectedUsers((prevState: ITopicUser[]) => [...prevState, item]) 
                    : setSelectedUsers((prevState: ITopicUser[]) => prevState.filter(prevItem => prevItem.id !== item.id))}/>
              </Grid>

            )) 
            : (
              Array(8).fill(0).map((item, index) => (
                <Grid key={index} mb={2}>
                  <UserPreviewSkeleton/>
                </Grid>
              ))
            )}
        </Grid>
        {/* <Grid pt={1} pb={1} item onClick={close}>
          <GradientButton>
          Готово
          </GradientButton>
        </Grid> */}
      </Grid>
    </Modal>
  );
};

export default UserListModal;
