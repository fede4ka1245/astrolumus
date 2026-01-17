import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useNavigate, useParams } from 'react-router-dom';
import { Typography, Grid, CircularProgress } from '@mui/material';
import Background from '../../components/background/Background';
import UserHeader from '../../components/userHeader/UserHeader';
import Topics from './components/sections/Topics';
import Friends, { IFriendsRef } from '../../components/sections/Friends';
import Button from '../../components/button/Button';
import { IUserFile, IUserProfile } from '../../models/interfaces/user';
import { useAppDispatch } from '../../store/store';
import { routes } from '../../models/enums/routes';
import setting from './assets/settings.svg';
import { UserFileTypes } from '../../models/enums/user';
import authRequest from '../../api/authRequest';
import { userProfileApi, userSubscriptionsApi } from '../../api/user';
import { getUserShortInfo } from '../../store/reducers/userReducer';
import { setIsAppLoading } from '../../store/reducers/preferencesReducer';
import { getUserFiles } from '../../api/getUserFiles';
import ImageZoom from '../../hoc/ImageZoom';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { processorRoutes } from '../astrlogicalProcessor/processorRoutes';
import ButtonBack from '../../components/buttonBack/ButtonBack';
import IconButton from '../../components/iconButton/IconButton';
import { useNavigateBack } from '../../hooks/useNavigateBack';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { useIsPaymentsEnabled } from '../../hooks/useIsPaymentsEnabled';
import { getIsForumEnabled } from '../../helpers/getIsForumEnabled';

const CurrentUser = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const isForumEnabled = getIsForumEnabled();
  const isPaymentsEnabled = useIsPaymentsEnabled();
  const [userInfo, setUserInfo] = useState<IUserProfile>({
    id: 0,
    user: 0,
    first_name: '',
    last_name: '',
    birth_date: '',
    subscribers_count: 0,
    email: '',
    avatar: null,
    about: '',
    likes_count: 0
  });
  const [photos, setPhotos] = useState<IUserFile[]>([]);
  const [certificates, setCertificates] = useState<IUserFile[]>([]);
  const friendsRef = useRef<IFriendsRef>(null);

  useEffect(() => {
    getUserFullInfo();
    dispatch(getUserShortInfo());
  }, []);
  
  const getSubscribers = useCallback((userId: number) => {
    authRequest.get(userSubscriptionsApi(), {
      params: {
        user_dst: userId,
        page_size: 1
      }
    })
      .then(res => {
        setUserInfo(prevState => ({
          ...prevState, 
          subscribers_count: res.data.count
        }));
      });
  }, []);

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

  const onWalletClick = useCallback(() => {
    navigate(processorRoutes.rates);
  }, []);

  const onSettingsClick = useCallback(() => {
    navigate(routes.userEdit);
  }, []);

  const onButtonBackClick = useNavigateBack();

  const getUserFullInfo = useCallback(async () => {
    dispatch(setIsAppLoading(true));
    await authRequest.get(userProfileApi(1))
      .then(res => {
        setUserInfo(res.data);
        getSubscribers(res.data.user);
        getFiles(UserFileTypes.photo, res.data.user);
        getFiles(UserFileTypes.certificate, res.data.user);
      })
      .finally(() => {
        dispatch(setIsAppLoading(false));
      });
  }, [dispatch, getFiles, getSubscribers]);

  const refreshingContent = useCallback(async () => {
    await Haptics.impact({ style: ImpactStyle.Light });
    friendsRef.current?.getAllInfo();
    await getUserFullInfo();
  }, [getUserFullInfo]);

  return (
    <>
      <Background background={'#F0F0F3'} />
      <UserHeader />
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
          <Grid container pl={2} pr={2} alignItems={'center'}>
            <Grid item pr={2} mr={'auto'} alignItems={'center'} display={'flex'}>
              <ButtonBack label={'Назад'} onClick={onButtonBackClick} color={'#37366B'}/>
            </Grid>
            {isPaymentsEnabled && <Grid item mr={3}>
              <IconButton onClick={onWalletClick}> 
                <svg width="24" height="26" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg"> 
                  <path d="M22.3136 13.9474V10.593C22.3136 9.49145 21.4175 8.59527 20.3159 8.59527H12.357C12.4472 8.26001 12.4941 7.9116 12.4941 7.55583C12.4941 7.21798 12.4515 6.88999 12.372 6.57651C13.1034 7.42837 14.1869 7.96959 15.3951 7.96959C17.5923 7.96959 19.3799 6.18205 19.3799 3.9848C19.3799 1.78755 17.5923 0 15.395 0C13.1978 0 11.4102 1.78755 11.4102 3.9848C11.4102 4.32264 11.4528 4.65069 11.5323 4.96411C10.8009 4.11226 9.71742 3.57103 8.50923 3.57103C6.31203 3.57103 4.52448 5.35863 4.52448 7.55583C4.52448 7.91155 4.57135 8.25991 4.66154 8.59527H2.05139C0.949846 8.59527 0.0537109 9.4914 0.0537109 10.593V24.0023C0.0537109 25.1038 0.949846 26 2.05139 26H20.3159C21.4174 26 22.3136 25.1038 22.3136 24.0023V20.6478C23.2314 20.5406 23.9461 19.7586 23.9461 18.8125V15.7828C23.9462 14.8366 23.2314 14.0546 22.3136 13.9474ZM15.395 1.6803C16.6657 1.6803 17.6995 2.7141 17.6995 3.9848C17.6995 5.25549 16.6657 6.2893 15.395 6.2893C14.1243 6.2893 13.0905 5.25549 13.0905 3.9848C13.0905 2.7141 14.1243 1.6803 15.395 1.6803ZM8.50928 5.25128C9.77998 5.25128 10.8138 6.28508 10.8138 7.55578C10.8138 7.92222 10.7293 8.27545 10.567 8.59522H6.45153C6.28928 8.2754 6.20478 7.92222 6.20478 7.55578C6.20483 6.28513 7.23858 5.25128 8.50928 5.25128ZM20.6333 24.0022C20.6333 24.1773 20.4909 24.3196 20.3158 24.3196H2.05134C1.8763 24.3196 1.73396 24.1772 1.73396 24.0022V10.5929C1.73396 10.4179 1.87635 10.2755 2.05134 10.2755C2.41356 10.2755 19.8794 10.2755 20.3158 10.2755C20.4909 10.2755 20.6333 10.4179 20.6333 10.5929V13.9345C20.1106 13.9345 15.2286 13.9345 14.7045 13.9345C13.7183 13.9345 12.916 14.7368 12.916 15.723C12.916 16.4251 12.916 18.6126 12.916 18.8723C12.916 19.8584 13.7183 20.6608 14.7045 20.6608C15.2285 20.6608 20.1106 20.6608 20.6333 20.6608V24.0022ZM22.2659 18.8124C22.2659 18.9051 22.1906 18.9804 22.0979 18.9804C21.8327 18.9804 15.1316 18.9804 14.7643 18.9804C14.6717 18.9804 14.5963 18.9051 14.5963 18.8124V15.7827C14.5963 15.6901 14.6717 15.6147 14.7643 15.6147C15.1398 15.6147 21.8376 15.6147 22.0979 15.6147C22.1905 15.6147 22.2659 15.6901 22.2659 15.7827V18.8124Z" fill="#37366B"/> 
                </svg> 
              </IconButton> 
            </Grid>}
            <Grid item>
              <IconButton onClick={onSettingsClick}>
                <img alt='setting' width={'28px'} height={'28px'} src={setting} />
              </IconButton>
            </Grid>
          </Grid>
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
                id: {userInfo.user}
                </Typography>
              </Grid>
            </Grid>
            <Grid item width={'100%'} height={'240px'} px={2} mb={2}>
              {
                photos.length === 0 && (
                  <Grid borderRadius={'10px'} border={'1px solid #C3C9CD'} py={'43px'} px={'46px'}>
                    <Typography mb={'30px'} textAlign={'center'} fontFamily={'Gilroy'} fontSize={'20px'} lineHeight={'24px'} color={'#ABB0B2'}>
                    Изображения отсутсвуют
                    </Typography>
                    <Button text="Добавить изображение" onClick={onSettingsClick}/>
                  </Grid>
                )
              }
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
            </Grid>
            <Typography mb={'21px'}textAlign={'center'} fontFamily={'Playfair Display'} fontWeight={700} fontSize={'24px'} color={'#292E30'}>
              {userInfo.first_name} {userInfo.last_name}
            </Typography>
            <Grid px={2} mb={2}>
              {
                userInfo.about 
                  ? <Typography pr={2} pl={2} textAlign={'center'} fontFamily={'Gilroy'} fontWeight={500} fontSize={'16px'} color={'#292E30'}>
                    { userInfo.about }
                  </Typography>
                
                  : <Grid borderRadius={'10px'} border={'1px solid #C3C9CD'} py={'43px'} px={'46px'}>
                    <Typography mb={'30px'} textAlign={'center'} fontFamily={'Gilroy'} fontSize={'20px'} lineHeight={'24px'} color={'#ABB0B2'}>
                    Пользователи не видят профиль полностью.
                    </Typography>
                    <Button text="Заполните профиль" onClick={onSettingsClick}/>
                  </Grid>
              }
            </Grid>
            <Grid pt={2} container px={2} mb={3}>
              <Grid item flex={1}>
                <Grid container sx={{ background: '#ad3ef1', height: '32px' }} 
                  borderRadius={'10px'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                  <Grid item display={'flex'} justifyContent={'center'} alignItems={'center'} ml={2}>
                    <Grid>
                      <svg width="19" height="17" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path 
                          d="M9.24961 16.3374L8.94961 16.0749C2.12461 10.5249 0.287109 8.5749 0.287109 5.3874C0.287109 2.7624 2.42461 0.662399 5.01211 0.662399C7.18711 0.662399 8.42461 1.89989 9.24961 2.83739C10.0746 1.89989 11.3121 0.662399 13.4871 0.662399C16.1121 0.662399 18.2121 2.7999 18.2121 5.3874C18.2121 8.5749 16.3746 10.5249 9.54961 16.0749L9.24961 16.3374Z" 
                          fill="#FFF"/>
                      </svg>
                    </Grid>
                    <Typography pl={1} color={'white'} fontFamily={'Gilroy'} fontSize={'12px'} fontWeight={'bold'}>
                      {userInfo.likes_count} 
                    </Typography>
                  </Grid>
                  <Typography color={'white'} fontFamily={'Gilroy'} fontSize={'12px'} fontWeight={'bold'} pr={1}>
                  лайки
                  </Typography>
                </Grid>
              </Grid>
              <Grid item flex={1} pl={1}>
                <Grid 
                  container sx={{ background: '#F1643E', height: '32px' }} 
                  borderRadius={'10px'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                  <Grid item display={'flex'} justifyContent={'center'} alignItems={'center'} ml={2}>
                    <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path 
                        fillRule="evenodd" 
                        clipRule="evenodd" 
                        d="M7.74172 1.89442C6.38175 1.89133 4.52687 1.83065 3.83356 2.67199C3.18681 3.45675 3.35347 4.00908 3.2483 5.44182C3.14213 6.87558 -1.07249 11.0075 0.260604 13.3402C1.20696 14.5435 3.19079 14.633 7.74172 14.633C12.2926 14.633 14.2764 14.5435 15.2227 13.3402C16.5568 11.0075 12.3412 6.87558 12.2351 5.44182C12.1299 4.00908 12.2966 3.45675 11.6498 2.67199C10.9565 1.83065 9.10159 1.89133 7.74172 1.89442Z" 
                        fill={'#FFF'}/>
                      <path d="M10.7109 16.9123C9.28356 18.3625 6.1897 18.3625 4.77022 16.9123L10.7109 16.9123Z" fill={'#FFF'}/>
                      <path d="M8.82251 1.08765C8.96035 -0.362571 6.51315 -0.36257 6.65889 1.08765L8.82251 1.08765Z" fill={'#FFF'}/>
                    </svg>
  
                    <Typography pl={1} color={'white'} fontFamily={'Gilroy'} fontSize={'12px'} fontWeight={'bold'} pr={1}>
                      {userInfo.subscribers_count}
                    </Typography>
                  </Grid>
                  <Typography color={'white'} fontFamily={'Gilroy'} fontSize={'12px'} fontWeight={'bold'} pr={1}>
                  подписчики
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {certificates.length > 0 && (
            <Grid mb={3}>
              <Grid pt={3}>
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
          )}
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

export default CurrentUser;
