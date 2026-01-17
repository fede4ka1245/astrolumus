import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Grid, Button as MuiButton, CircularProgress } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import Background from '../../components/background/Background';
import UserHeader from '../../components/userHeader/UserHeader';
import PageHeader from '../../components/pageHeader/PageHeader';
import Topics from './components/sections/Topics';
import Friends, { IFriendsRef } from '../../components/sections/Friends';
import CurrentUser from './CurrentUser';
import ReportUserModal from './components/ReportUserModal';
import authRequest from '../../api/authRequest';
import { userLikesApi, userProfileOpenInfo, userSubscriptionsApi, userUnsubscribeApi } from '../../api/user';
import { getUserFiles } from '../../api/getUserFiles';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { setIsAppLoading } from '../../store/reducers/preferencesReducer';
import { IUserFile, IUserOpenInfo } from '../../models/interfaces/user';
import { UserFileTypes } from '../../models/enums/user';
import ImageZoom from '../../hoc/ImageZoom';
import PullToRefresh from 'react-simple-pull-to-refresh';
import ButtonBack from '../../components/buttonBack/ButtonBack';
import { useNavigateBack } from '../../hooks/useNavigateBack';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { getIsForumEnabled } from '../../helpers/getIsForumEnabled';

const User = () => {
  const [user, setUser] = useState<IUserOpenInfo>({
    id: 0,
    user_id: 0,
    first_name: '',
    last_name: '',
    birth_date: '',
    avatar: null,
    about: '',
    likes_count: 0,
    subscribers_count: 0,
    current_user_liked: false,
    current_user_subscribed: false
  });
  const dispatch = useAppDispatch();
  const [photos, setPhotos] = useState<IUserFile[]>([]);
  const [reportSended, setReportSended] = useState<boolean>(false);
  const [certificates, setCertificates] = useState<IUserFile[]>([]);
  const [reportModalIsOpen, setReportModalIsOpen] = useState(false);
  const { id } = useParams();
  const { userInfo } = useAppSelector(state => state.user);
  const friendsRef = useRef<IFriendsRef>(null);
  
  useEffect(() => {
    if (id) {
      getUserById(Number(id));
    }
  }, [id]);

  const getFiles = useCallback((fileType: UserFileTypes, user: number) => {
    getUserFiles({ fileType, user })
      .then(result => {
        if (fileType === UserFileTypes.photo) {
          setPhotos(result);
        } else {
          setCertificates(result);
        }
      });
  }, []);

  const getUserById = useCallback(async (id: number) => {
    dispatch(setIsAppLoading(true));
    await authRequest.get(userProfileOpenInfo(id))
      .then(res => {
        setUser(res.data);
        getFiles(UserFileTypes.certificate, res.data.user_id);
        getFiles(UserFileTypes.photo, res.data.user_id);
      })
      .finally(() => {
        dispatch(setIsAppLoading(false));
      });
  }, [dispatch, getFiles]);

  const onLike = useCallback((user: number) => {
    dispatch(setIsAppLoading(true));
    authRequest.post(userLikesApi(user))
      .then(res => {
        getUserById(user);
      })
      .finally(() => {
        dispatch(setIsAppLoading(false));
      });
  }, [dispatch, getUserById]);

  const deleteSubscribe = useCallback((user: number) => {
    dispatch(setIsAppLoading(true));
    authRequest.delete(userUnsubscribeApi(), {
      data: {
        user_dst_id: user,
        user_src_id: userInfo?.id
      }
    })
      .then(res => {
        getUserById(user);
        friendsRef.current?.getAllInfo();
      })
      .finally(() => {
        dispatch(setIsAppLoading(false));
      });
  }, [dispatch, getUserById, userInfo?.id]);

  const onSubscribe = useCallback((user: number) => {
    dispatch(setIsAppLoading(true));
    authRequest.post(userSubscriptionsApi(), { user_dst_id: user }) 
      .then(res => {
        getUserById(user);
        friendsRef.current?.getAllInfo();
      })
      .catch(error => {
        if (error?.response?.data?.non_field_errors?.find((error: string) => error === 'Duplication object')) {
          deleteSubscribe(user);
        }
      })
      .finally(() => {
        dispatch(setIsAppLoading(false));
      });
  }, [deleteSubscribe, dispatch, getUserById]);

  const onButtonBackClick = useNavigateBack();

  const getLikeDeclension = useCallback((number: number) => {
    if (number > 1 && number < 5) {
      return 'лайка';
    }
    if (number === 1) {
      return 'лайк';
    }
    if (number >= 5 || number === 0) {
      return 'лайков';
    }
  }, []);

  const refreshingContent = useCallback(async () => {
    await Haptics.impact({ style: ImpactStyle.Light });
    friendsRef.current?.getAllInfo();
    await getUserById(Number(id));
  }, [getUserById, id]);

  const isForumEnabled = getIsForumEnabled();

  if (!user) {
    return (
      <Grid>
        <Background background={'#F0F0F3'} />
        <UserHeader />
        <PageHeader page={'Профиль'} content={!isForumEnabled ? <></> : undefined}/>
      </Grid>
    );
  }

  if (userInfo.id === Number(id)) {
    return <CurrentUser/>;
  }

  return (
    <>
      <Background background={'#F0F0F3'} />
      <UserHeader selectedUser={user}/>
      <PullToRefresh
        onRefresh={refreshingContent}
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
        <Grid>
          <Grid item display={'flex'} ml={2}>
            <ButtonBack label={'Назад'} onClick={onButtonBackClick} color={'#37366B'}/>
          </Grid>
          <ReportUserModal
            isOpen={reportModalIsOpen}
            setReportSended={setReportSended}
            close={() => setReportModalIsOpen(false)}
            user={user}
          />
          <Grid mt={2} width={'100%'} borderRadius={'20px'} container direction={'column'}>
            <Grid display="flex" justifyContent="space-between" alignItems="center" p={2}>
              <Grid item display={'flex'} alignItems={'center'}>
                <Grid borderRadius={'50%'} height={'15px'} width={'15px'} sx={{ background: '#37366b' }} />
                <Typography color={'#37366b'} letterSpacing={'0.1em'} textTransform={'uppercase'} fontFamily={'Gilroy'} fontWeight={700} pl={1}>
                Обо мне
                </Typography>
              </Grid>
              <Grid>
                <Typography color={'#37366b'} letterSpacing={'0.1em'} textTransform={'uppercase'} fontFamily={'Gilroy'} fontWeight={700} pl={1}>
                id: {user.user_id}
                </Typography>
              </Grid>
            </Grid>
            <Grid item width={'100%'} height={'240px'} px={2} mb={2}>
              {
                photos.length === 0 && (
                  <Grid width={'165px'} height={'230px'} borderRadius={'10px'} bgcolor={'#C3C9CD'} mx={'auto'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                    <Typography fontFamily={'Playfair Display'} color={'#FFF'} fontSize={'50px'}>
                      {user.first_name.slice(0, 1)}{user.last_name.slice(0, 1)}
                    </Typography>
                  </Grid>
                )
              }
              {
                photos.length > 0 && (
                  <Swiper
                    slidesPerView={'auto'}
                    spaceBetween={10}
                    freeMode={true}
                    centeredSlides={true}
                    style={{
                      height: '100%'
                    }}
                  >
                    {photos.map((item, index) => (
                      <SwiperSlide key={item.id} style={{ height: '230px', width: '165px' }}>
                        <Grid width={'165px'} height={'230px'} borderRadius={'10px'}>
                          <ImageZoom slide={index} images={photos.map(item => item.image_original)}>
                            <img src={item.image} width={'100%'} height={'100%'} style={{ objectFit: 'contain' }}/>
                          </ImageZoom>
                        </Grid>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )
              }

            </Grid>
            <Grid textAlign={'center'} fontFamily={'Playfair Display'} mb={2} fontWeight={700} fontSize={'24px'} color={'#292E30'}>
              {user.first_name} {user.last_name}
            </Grid>
            <Grid pr={2} pl={2} textAlign={'center'} fontFamily={'Gilroy'} fontWeight={500} fontSize={'16px'} color={'#292E30'} mb={2}>
              {user.about}
            </Grid>
            <Grid pt={2} container px={2} mb={3}>
              {user.current_user_liked 
                ? (
                  <Grid item flex={1}>
                    <Grid container sx={{ background: 'rgba(205, 136, 248, 0.3);', height: '32px' }} 
                      borderRadius={'10px'} display={'flex'} alignItems={'center'} 
                      onClick={() => onLike(user.user_id)}>
                      <Grid item display={'flex'} justifyContent={'center'} alignItems={'center'} ml={2} mr={0.5}>
                        <Grid>
                          <svg width="19" height="17" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path 
                              d="M9.24961 16.3374L8.94961 16.0749C2.12461 10.5249 0.287109 8.5749 0.287109 5.3874C0.287109 2.7624 2.42461 0.662399 5.01211 0.662399C7.18711 0.662399 8.42461 1.89989 9.24961 2.83739C10.0746 1.89989 11.3121 0.662399 13.4871 0.662399C16.1121 0.662399 18.2121 2.7999 18.2121 5.3874C18.2121 8.5749 16.3746 10.5249 9.54961 16.0749L9.24961 16.3374Z" 
                              fill="#AD3EF1"/>
                          </svg>
                        </Grid>
                        <Typography pl={1} color={'#292E30'} fontFamily={'Gilroy'} fontSize={'12px'} fontWeight={500}>
                          {user.likes_count}
                        </Typography>
                      </Grid>
                      <Typography color={'#292E30'} fontFamily={'Gilroy'} fontSize={'12px'} fontWeight={500} pr={1}>
                        {getLikeDeclension(user.likes_count)}
                      </Typography>
                    </Grid>
                  </Grid>
                )
                : (
                  <Grid item flex={1}>
                    <Grid container sx={{ background: '#ad3ef1', height: '32px' }} 
                      borderRadius={'10px'} display={'flex'} justifyContent={'space-between'} alignItems={'center'} 
                      onClick={() => onLike(user.user_id)}>
                      <Grid item display={'flex'} justifyContent={'center'} alignItems={'center'} ml={2}>
                        <Grid>
                          <svg width="19" height="17" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path 
                              d="M9.24961 16.3374L8.94961 16.0749C2.12461 10.5249 0.287109 8.5749 0.287109 5.3874C0.287109 2.7624 2.42461 0.662399 5.01211 0.662399C7.18711 0.662399 8.42461 1.89989 9.24961 2.83739C10.0746 1.89989 11.3121 0.662399 13.4871 0.662399C16.1121 0.662399 18.2121 2.7999 18.2121 5.3874C18.2121 8.5749 16.3746 10.5249 9.54961 16.0749L9.24961 16.3374Z" 
                              fill="#FFF"/>
                          </svg>
                        </Grid>
                        <Typography pl={1} color={'white'} fontFamily={'Gilroy'} fontSize={'12px'} fontWeight={'bold'}>
                          {user.likes_count} 
                        </Typography>
                      </Grid>
                      <Typography color={'white'} fontFamily={'Gilroy'} fontSize={'12px'} fontWeight={'bold'} pr={1}>
                      Лайкнуть
                      </Typography>
                    </Grid>
                  </Grid>
                )}
              {
                user.current_user_subscribed 
                  ? (
                    <Grid item flex={1} pl={1}>
                      <Grid 
                        container sx={{ background: 'rgba(255, 187, 169, 0.3)', height: '32px' }} 
                        borderRadius={'10px'} display={'flex'} alignItems={'center'} justifyContent={'space-between'} onClick={() => onSubscribe(user.user_id)}>
                        <Grid item display={'flex'} justifyContent={'center'} alignItems={'center'} ml={2}>
                          <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M8.74172 2.89438C7.38175 2.8913 5.52687 2.83062 4.83356 3.67196C4.18681 4.45672 4.35347 5.00905 4.2483 6.44179C4.14212 7.87555 -0.0724954 12.0074 1.2606 14.3401C2.20695 15.5435 4.19079 15.633 8.74172 15.633C13.2926 15.633 15.2764 15.5435 16.2227 14.3401C17.5568 12.0074 13.3412 7.87555 13.2351 6.44179C13.1299 5.00905 13.2966 4.45672 12.6498 3.67196C11.9565 2.83062 10.1016 2.8913 8.74172 2.89438Z" stroke="#F1643E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M11.7109 17.9123C10.2836 19.3625 7.1897 19.3625 5.77022 17.9123" stroke="#F1643E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M9.82251 2.08765C9.96035 0.637429 7.51315 0.63743 7.65889 2.08765" stroke="#F1643E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <Typography pl={1} color={'#292E30'} fontFamily={'Gilroy'} fontSize={'12px'} fontWeight={500}>
                            {user.subscribers_count} 
                          </Typography>
                        </Grid>
                        <Typography color={'#F1643E'} fontFamily={'Gilroy'} fontSize={'12px'} fontWeight={500} pr={1}>
                          {user.current_user_subscribed ? 'Отписаться' : 'Подписаться'}
                        </Typography>
                      </Grid>
                    </Grid>
                  )
                  : (
                    <Grid item flex={1} pl={1}>
                      <Grid 
                        container sx={{ background: '#F1643E', height: '32px' }} 
                        borderRadius={'10px'} display={'flex'} justifyContent={'space-between'} alignItems={'center'} onClick={() => onSubscribe(user.user_id)}>
                        <Grid item display={'flex'} justifyContent={'center'} alignItems={'center'} ml={2}>
                          <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path 
                              fillRule="evenodd" 
                              clipRule="evenodd" 
                              d="M7.74172 1.89442C6.38175 1.89133 4.52687 1.83065 3.83356 2.67199C3.18681 3.45675 3.35347 4.00908 3.2483 5.44182C3.14213 6.87558 -1.07249 11.0075 0.260604 13.3402C1.20696 14.5435 3.19079 14.633 7.74172 14.633C12.2926 14.633 14.2764 14.5435 15.2227 13.3402C16.5568 11.0075 12.3412 6.87558 12.2351 5.44182C12.1299 4.00908 12.2966 3.45675 11.6498 2.67199C10.9565 1.83065 9.10159 1.89133 7.74172 1.89442Z" 
                              fill={user.current_user_subscribed ? '#FFB800' : '#FFF'}/>
                            <path d="M10.7109 16.9123C9.28356 18.3625 6.1897 18.3625 4.77022 16.9123L10.7109 16.9123Z" fill={user.current_user_subscribed ? '#FFB800' : '#FFF'}/>
                            <path d="M8.82251 1.08765C8.96035 -0.362571 6.51315 -0.36257 6.65889 1.08765L8.82251 1.08765Z" fill={user.current_user_subscribed ? '#FFB800' : '#FFF'}/>
                          </svg>
        
                          <Typography pl={1} color={'white'} fontFamily={'Gilroy'} fontSize={'12px'} fontWeight={'bold'} pr={1}>
                            {user.subscribers_count}
                          </Typography>
                        </Grid>
                        <Typography color={'white'} fontFamily={'Gilroy'} fontSize={'12px'} fontWeight={'bold'} pr={1}>
                          {user.current_user_subscribed ? 'Отписаться' : 'Подписаться'}
                        </Typography>
                      </Grid>
                    </Grid>
                  )
              }
            </Grid>
            <Grid pr={2} pl={2} textAlign={'center'} fontFamily={'Gilroy'} fontWeight={500} fontSize={'16px'} color={'#292E30'}>
              <Grid pb={2} container>
                <Grid item flex={1} pl={1} sx={{ display: 'flex', justifyContent: 'flex-end' }} >
                  {
                    !reportSended 
                      ? (
                        <MuiButton onClick={() => setReportModalIsOpen(true)}>
                          <Typography color={'#ABB0B2'} fontFamily={'Gilroy'} fontSize={'16px'} fontWeight={500} textTransform={'none'}>
                          Пожаловаться
                          </Typography>
                        </MuiButton>
                      )
                      : (
                        <MuiButton>
                          <Typography color={'#ABB0B2'} fontFamily={'Gilroy'} fontSize={'16px'} fontWeight={500} textTransform={'none'}>
                          Жалоба отправлена
                          </Typography>
                        </MuiButton>
                      )
                  }
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {
            certificates.length > 0 && (
              <Grid mb={3}>
                <Grid>
                  <Grid item display={'flex'} alignItems={'center'} p={2}>
                    <Grid borderRadius={'50%'} height={'15px'} width={'15px'} sx={{ background: '#37366b' }} />
                    <Typography color={'#37366b'} letterSpacing={'0.1em'} textTransform={'uppercase'} fontFamily={'Gilroy'} fontWeight={700} pl={1}>
                    Сертификаты
                    </Typography>
                  </Grid>
                </Grid>
                <Grid>
                  <Grid item width={'100%'} height={'110px'} px={2}>
                    <Swiper
                      slidesPerView={'auto'}
                      spaceBetween={5}
                      freeMode={true}
                    >
                      {certificates.map((item, index) => (
                        <SwiperSlide key={item.id} style={{ height: '105px', width: '165px' }}>
                          <Grid width={'165px'} height={'105px'} borderRadius={'10px'}>
                            <ImageZoom slide={index} images={certificates.map(item => item.image_original)}>
                              <img src={item.image} width={'100%'} height={'100%'} style={{ objectFit: 'contain' }}/>
                            </ImageZoom>
                          </Grid>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </Grid>
                </Grid>
              </Grid>
            )
          }
          {isForumEnabled && (
            <>
              <Grid mb={6}>
                <Topics userId={Number(id)}/>
              </Grid>
              <Grid mb={3}>
                <Friends
                  ref={friendsRef}
                  id={Number(id)}
                />
              </Grid>
            </>
          )}
        </Grid>
      </PullToRefresh>
    </>
  );
};

export default User;
