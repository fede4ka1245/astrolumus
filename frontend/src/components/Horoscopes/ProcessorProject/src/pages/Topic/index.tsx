import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Grid, Typography, Skeleton, Icon } from '@mui/material';
import { useNavigate, useMatch, useLocation } from 'react-router-dom';
import parse from 'html-react-parser';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { forumCommentFavorite, forumTopicFavorite, forumTopicApi, forumTopicJoinApi, forumTopicLeaveApi, forumTopicAcceptApi, forumCommentApi } from '../../api/forum';
import authRequest from '../../api/authRequest';
import { useHideNavbar } from '../../hooks/useHideNavbar';
import { insertZero } from '../../helpers/insertZero';
import TextGradient from '../../components/textGradient/TextGradient';
import Comments from './components/Comments';
import ButtonBack from '../../components/buttonBack/ButtonBack';
import UserHeader from '../../components/userHeader/UserHeader';
import Background from '../../components/background/Background';
import Slider from './components/ForumSlider';
import Avatar from '../../components/Avatar';
import { routes } from '../../models/enums/routes';
import { IServerTopic } from '../../models/interfaces/topic';
import { setIsAppLoading } from '../../store/reducers/preferencesReducer';
import styles from './styles.module.scss';
import UserListModal from './components/UserListModal';
import { AccessLevel, TopicStatuses } from '../../models/enums/topic';
import Button from '../../components/button/Button';
import GradientButton from '../../components/gradientButton/GradientButton';
import AstrologyAppModal from './components/astrologyAppModal/AstrologyAppModal';
import { parseShortHoroscopeUrl } from '../../helpers/horoscopeUrl';
import { processorRoutes } from '../astrlogicalProcessor/processorRoutes';
import { useSearchParamsState } from '../../hooks/useSearchParamsState';
import IconButton from '../../components/iconButton/IconButton';
import { useNavigateBack } from '../../hooks/useNavigateBack';
import { IosShareRounded } from '@mui/icons-material';
import { Clipboard } from '@capacitor/clipboard';
import { useSnackbarAlert } from '../../hooks/useSnackbarAlert';

const ForumItem = () => {
  const navigate = useNavigate();
  const match = useMatch(routes.topicId);
  const location = useLocation();
  const topicId = Number(match?.params.id);
  const [isFavourite, setIsFavorite] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [isOpenModal, setIsOpenModal] = useSearchParamsState('isOpenModal', false, false);
  const [commentCount, setCommentCount] = useState<number>(0);
  const [isOpenCommentModal, setIsOpenCommentModal] = useSearchParamsState('isOpenCommentModal', false, false);
  const userId = useAppSelector(state => state.user.userInfo.id);
  const [topic, setTopic] = useState<IServerTopic | null>(null);
  const [is404, setIs404] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  useHideNavbar();

  useEffect(() => {
    if (topicId) {
      getTopicById(topicId);
      getComments(topicId);
    }
  }, [topicId]);

  const getComments = useCallback((topicId: number) => {
    authRequest.get(forumCommentApi(), {
      params: {
        topic: topicId,
        ordering: '-created_at',
        page_size: 1
      }
    })
      .then(res => {
        setCommentCount(res.data.count);
      });
  }, []);

  const getTopicById = useCallback((id: number) => {
    dispatch(setIsAppLoading(true));
    authRequest.get(forumTopicApi(id))
      .then(res => {
        const topic = res.data;
        setTopic(topic);
        setIsLiked(topic.current_user_liked);
        setIsFavorite(topic.current_user_favorite);
        setLikesCount(topic.likes_count);
      })
      .catch(error => {
        if (error.response.status === 404) {
          setIs404(true);
        }
      })
      .finally(() => {
        dispatch(setIsAppLoading(false));
      });
  }, [dispatch]);

  const onBookmark = useCallback(() => {
    if (topicId) {
      setIsFavorite(prevState => !prevState);
      authRequest.post(forumCommentFavorite(topicId));
    }
  }, [topicId]);

  const onLike = useCallback(() => {
    if (topicId) {
      setIsLiked(prevState => !prevState);
      if (!isLiked) {
        setLikesCount(prevState => prevState + 1);
      } else {
        setLikesCount(prevState => prevState - 1);
      }
      authRequest.post(forumTopicFavorite(topicId));
    }
  }, [isLiked, topicId]);

  const onButtonBackClick = useNavigateBack();

  const navigateToUser = useCallback(async () => {
    if (topic) {
      if (topic.user.id !== userId) {
        navigate(routes.user + topic.user.id);
      }
    }
  }, [navigate, topic, userId]);

  const editTopic = useCallback(() => {
    navigate(routes.topic + `${topicId}/edit`);
  }, [navigate, topicId]);

  const joinToTopic = useCallback(() => {
    dispatch(setIsAppLoading(true));
    authRequest.post(forumTopicJoinApi(), {
      topic_id: topicId
    })
      .then(res => {
        getTopicById(topicId);
      })
      .finally(() => {
        dispatch(setIsAppLoading(false));
      });
  }, [dispatch, getTopicById, topicId]);

  const acceptInvite = useCallback(() => {
    dispatch(setIsAppLoading(true));
    authRequest.post(forumTopicAcceptApi(topicId))
      .then(res => {
        getTopicById(topicId);
      })
      .finally(() => {
        dispatch(setIsAppLoading(false));
      });
  }, [dispatch, getTopicById, topicId]);

  const leaveFromTopic = useCallback(() => {
    dispatch(setIsAppLoading(true));
    authRequest.post(forumTopicLeaveApi(topicId))
      .then(res => {
        if (topic?.access_level === AccessLevel.private) {
          navigate(-1);
        } else {
          getTopicById(topicId);
        }
      })
      .finally(() => {
        dispatch(setIsAppLoading(false));
      });
  }, [dispatch, getTopicById, navigate, topic?.access_level, topicId]);

  const closeModal = useNavigateBack();
  
  const isAstrologyProcessorModalOpen = useMemo(() => {
    return location.pathname.includes(processorRoutes.index);
  }, [location]);

  const openHoroscopeModal = useCallback(async () => {
    if (!topic?.horoscope_link) {
      return;
    }

    dispatch(setIsAppLoading(true));

    try {
      const horoscope = await parseShortHoroscopeUrl(topic?.horoscope_link);

      if (!horoscope?.userInfo || !horoscope?.address) {
        return;
      }

      navigate(location.pathname + routes.astrologicalProcessor, {
        state: { ...horoscope, isExternal: true }
      });
    } finally {
      dispatch(setIsAppLoading(false));
    }
  }, [topic?.horoscope_link, dispatch, navigate, location.pathname]);
  
  const snackbarAlert = useSnackbarAlert();
  
  const onShareClick = useCallback(() => {
    Clipboard.write({
      string: `${import.meta.env.VITE_APP_PREVIEW_PAGE_URL}/topics/${topic?.id}`
    }).then(() => {
      snackbarAlert('Ссылка скопирована в буфер обмена');
    }).catch(() => {
      snackbarAlert('Ошибка создании ссылки');
    });
  }, [topic]);

  if (is404) {
    return (
      <Grid display="flex" flexDirection="column" height={'100vh'}>
        <Background background={'#f0f0f3'} />
        <UserHeader />
        <Grid container pl={2} pr={2} pb={2}>
          <Grid item mr={'auto'}>
            <ButtonBack label={'Назад'} onClick={onButtonBackClick} color={'#37366B'}/>
          </Grid>
        </Grid>
        <Grid item pl={2} pr={2} flex={1} display={'flex'} alignItems="center" mb={20}>
          <Typography fontSize={'17px'} fontFamily={'Gilroy'} fontWeight={700} textAlign={'center'}>
            К сожалению, у Вас больше нет доступа к этой теме
          </Typography>
        </Grid>
      </Grid>
    );
  }

  if (!topic) {
    return (
      <>
        <Background background={'#f0f0f3'} />
        <UserHeader />
        <Grid container pl={2} pr={2} pb={2}>
          <Grid item mr={'auto'}>
            <ButtonBack label={'Назад'} onClick={onButtonBackClick} color={'#37366B'}/>
          </Grid>
        </Grid>
        <Grid item pl={2} pr={2} display={'flex'} justifyContent={'space-between'} alignItems={'center'} mb={'10px'}>
          <Grid display={'flex'} width={'70%'} alignItems={'center'}>
            <Grid flexShrink={1} mr={'10px'}>
              <Skeleton sx={{ background: 'gray' }} variant={'circular'} width={'50px'} height={'50px'}/>
            </Grid>
            <Grid>
              <Typography fontSize={'15px'} color={'#979C9E'} fontFamily={'Gilroy'} fontWeight={700}>
                None None
              </Typography>
            </Grid>
          </Grid>
          <Grid bgcolor="#FFF" px={'9px'} py={'7px'} display={'flex'} alignItems={'center'} borderRadius={'10px'}>
            <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.9625 15.675L8.6625 15.4125C1.8375 9.8625 0 7.9125 0 4.725C0 2.1 2.1375 0 4.725 0C6.9 0 8.1375 1.2375 8.9625 2.175C9.7875 1.2375 11.025 0 13.2 0C15.825 0 17.925 2.1375 17.925 4.725C17.925 7.9125 16.0875 9.8625 9.2625 15.4125L8.9625 15.675Z" fill="#C3C9CD"/>
            </svg>
            <Typography color="#292E30" fontFamily={'Gilroy'} fontSize={'12px'} ml={'10px'}>
              0
            </Typography>
          </Grid>
        </Grid>
      </>
    );
  }

  return (
    <Grid minHeight={'100vh'} container direction="column">
      <Background background={'#f0f0f3'} />
      <UserHeader />
      <AstrologyAppModal isOpen={isAstrologyProcessorModalOpen} close={closeModal} />
      <UserListModal
        topic={topic}
        isOpen={isOpenModal}
        close={() => navigate(-1)}
      />
      <Grid container alignItems={'center'} item pl={2} pr={2} pb={2}>
        <Grid item mr={'auto'}>
          <ButtonBack label={'Назад'} onClick={onButtonBackClick} color={'#37366B'}/>
        </Grid>
        <Grid display={'flex'} alignItems={'center'}>
          <Grid mr={2}>
            <IconButton onClick={onShareClick}>
              <IosShareRounded sx={{ color: '#37366B' }} />
            </IconButton>
          </Grid>
          {
            topic.user.id === userId
              ? (
                <>
                  <Grid bgcolor="#FFF" px={'9px'} mr={2} py={'7px'} display={'flex'} alignItems={'center'} borderRadius={'10px'} onClick={onLike}>
                    <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.9625 15.675L8.6625 15.4125C1.8375 9.8625 0 7.9125 0 4.725C0 2.1 2.1375 0 4.725 0C6.9 0 8.1375 1.2375 8.9625 2.175C9.7875 1.2375 11.025 0 13.2 0C15.825 0 17.925 2.1375 17.925 4.725C17.925 7.9125 16.0875 9.8625 9.2625 15.4125L8.9625 15.675Z"
                        fill={isLiked ? '#E72222' : '#C3C9CD'}/>
                    </svg>
                    <Typography color="#292E30" fontFamily={'Gilroy'} fontSize={'14px'} ml={'10px'}>
                      {likesCount}
                    </Typography>
                  </Grid>
                  <Grid onClick={onBookmark} mr={2}>
                    <svg width="25" height="25" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.6549 2.98816C4.34234 3.30072 4.16675 3.72464 4.16675 4.16667V17.5L10.0001 14.5833L15.8334 17.5V4.16667C15.8334 3.72464 15.6578 3.30072 15.3453 2.98816C15.0327 2.67559 14.6088 2.5 14.1667 2.5H5.83341C5.39139 2.5 4.96746 2.67559 4.6549 2.98816Z" 
                        stroke={isFavourite ? '#FFB800' : '#C3C9CD'} 
                        fill={isFavourite ? '#FFB800' : '#C3C9CD'} 
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Grid>
                </>
              )
              : (
                <Grid mr={2}>
                  {
                    topic.current_user_is_member 
                      ? (
                        <div onClick={leaveFromTopic} className={styles.member_button}>
                          <Typography fontFamily={'Gilroy'} fontWeight={700} fontSize={'14px'} color="#F15024">
                            Выйти
                          </Typography>
                        </div>
                      )
                      : (
                        <div onClick={topic.access_level === 0 ? acceptInvite : joinToTopic} className={styles.member_button}>
                          <TextGradient fontFamily={'Gilroy'} fontWeight={700} fontSize={'14px'}>
                            Вступить
                          </TextGradient>
                        </div>
                      )
                  }
                </Grid>
              )}
          <Grid display={'flex'} alignItems={'center'} onClick={() => topic.user.id === userId && setIsOpenModal(true)}>
            <div>
              <svg width="26" height="23" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.3333 12.3333H14.6666V11C14.6666 10.5843 14.5371 10.179 14.2961 9.84038C14.0551 9.50175 13.7145 9.24662 13.3218 9.11046C12.9291 8.9743 12.5037 8.96388 12.1048 9.08064C11.7059 9.1974 11.3533 9.43554 11.096 9.76196M11.3333 12.3333H4.66665M11.3333 12.3333V11C11.3333 10.5626 11.2493 10.1446 11.096 9.76196M11.096 9.76196C10.8484 9.14326 10.4211 8.61294 9.86931 8.23937C9.31747 7.86581 8.66637 7.66616 7.99998 7.66616C7.33359 7.66616 6.68249 7.86581 6.13065 8.23937C5.57881 8.61294 5.15155 9.14326 4.90398 9.76196M4.66665 12.3333H1.33331V11C1.33334 10.5843 1.46287 10.179 1.70389 9.84038C1.9449 9.50175 2.28544 9.24662 2.67815 9.11046C3.07086 8.9743 3.49623 8.96388 3.89514 9.08064C4.29405 9.1974 4.64667 9.43554 4.90398 9.76196M4.66665 12.3333V11C4.66665 10.5626 4.75065 10.1446 4.90398 9.76196M9.99998 3.66663C9.99998 4.19706 9.78927 4.70577 9.41419 5.08084C9.03912 5.45591 8.53041 5.66663 7.99998 5.66663C7.46955 5.66663 6.96084 5.45591 6.58577 5.08084C6.21069 4.70577 5.99998 4.19706 5.99998 3.66663C5.99998 3.13619 6.21069 2.62749 6.58577 2.25241C6.96084 1.87734 7.46955 1.66663 7.99998 1.66663C8.53041 1.66663 9.03912 1.87734 9.41419 2.25241C9.78927 2.62749 9.99998 3.13619 9.99998 3.66663ZM14 5.66663C14 6.02025 13.8595 6.35939 13.6095 6.60943C13.3594 6.85948 13.0203 6.99996 12.6666 6.99996C12.313 6.99996 11.9739 6.85948 11.7238 6.60943C11.4738 6.35939 11.3333 6.02025 11.3333 5.66663C11.3333 5.313 11.4738 4.97387 11.7238 4.72382C11.9739 4.47377 12.313 4.33329 12.6666 4.33329C13.0203 4.33329 13.3594 4.47377 13.6095 4.72382C13.8595 4.97387 14 5.313 14 5.66663ZM4.66665 5.66663C4.66665 6.02025 4.52617 6.35939 4.27612 6.60943C4.02607 6.85948 3.68694 6.99996 3.33331 6.99996C2.97969 6.99996 2.64055 6.85948 2.3905 6.60943C2.14046 6.35939 1.99998 6.02025 1.99998 5.66663C1.99998 5.313 2.14046 4.97387 2.3905 4.72382C2.64055 4.47377 2.97969 4.33329 3.33331 4.33329C3.68694 4.33329 4.02607 4.47377 4.27612 4.72382C4.52617 4.97387 4.66665 5.313 4.66665 5.66663Z" 
                  stroke={topic.user.id === userId ? '#37366B' : '#C3C9CD'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div 
              style={topic.user.id !== userId ? { background: '#C3C9CD' } : {}}
              className={styles.quantity}>
              {
                topic.count_of_members
              }
            </div>
          </Grid>
        </Grid> 
      </Grid>
      {
        topic.user.id !== userId && 
          (<Grid display={'flex'} alignItems={'center'} mb={2} px={2}>
            <Grid display={'flex'} alignItems={'center'} onClick={navigateToUser} flex={1} mr={2}>
              <Grid flexShrink={1} mr={'10px'}>
                <Avatar
                  width={50}
                  height={50}
                  fontSize={17}
                  avatar={topic.user.avatar }
                  abbreviation={`${topic.user.first_name?.slice(0, 1)}${topic.user.last_name?.slice(0, 1)}`}
                />
              </Grid>
              <Grid className={styles.user_name}>
                {topic.user.first_name} {topic.user.last_name}
              </Grid>
            </Grid>
            <Grid display={'flex'} alignItems={'center'}>
              <Grid bgcolor="#FFF" px={'9px'} mr={2} py={'7px'} display={'flex'} alignItems={'center'} borderRadius={'10px'} onClick={onLike}>
                <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.9625 15.675L8.6625 15.4125C1.8375 9.8625 0 7.9125 0 4.725C0 2.1 2.1375 0 4.725 0C6.9 0 8.1375 1.2375 8.9625 2.175C9.7875 1.2375 11.025 0 13.2 0C15.825 0 17.925 2.1375 17.925 4.725C17.925 7.9125 16.0875 9.8625 9.2625 15.4125L8.9625 15.675Z"
                    fill={isLiked ? '#E72222' : '#C3C9CD'}/>
                </svg>
                <Typography color="#292E30" fontFamily={'Gilroy'} fontSize={'14px'} ml={'10px'}>
                  {likesCount}
                </Typography>
              </Grid>
              <IconButton onClick={onBookmark}>
                <svg width="25" height="25" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.6549 2.98816C4.34234 3.30072 4.16675 3.72464 4.16675 4.16667V17.5L10.0001 14.5833L15.8334 17.5V4.16667C15.8334 3.72464 15.6578 3.30072 15.3453 2.98816C15.0327 2.67559 14.6088 2.5 14.1667 2.5H5.83341C5.39139 2.5 4.96746 2.67559 4.6549 2.98816Z" 
                    stroke={isFavourite ? '#FFB800' : '#C3C9CD'} 
                    fill={isFavourite ? '#FFB800' : '#C3C9CD'} 
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </IconButton>
            </Grid>
          </Grid>
          )
      }
      <Grid display={'flex'} justifyContent={'space-between'} px={2} alignItems={'flex-start'}>
        <Grid display={'flex'} alignItems={'center'} flex={1}>
          {topic.access_level === 0 && (
            <Grid mr={1}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5 5.83333C12.942 5.83333 13.366 6.00893 13.6785 6.32149C13.9911 6.63405 14.1667 7.05797 14.1667 7.5M17.5 7.5C17.5002 8.28098 17.3175 9.05115 16.9665 9.74879C16.6155 10.4464 16.1059 11.0521 15.4786 11.5174C14.8514 11.9826 14.1238 12.2945 13.3543 12.4279C12.5848 12.5614 11.7948 12.5127 11.0475 12.2858L9.16667 14.1667H7.5V15.8333H5.83333V17.5H3.33333C3.11232 17.5 2.90036 17.4122 2.74408 17.2559C2.5878 17.0996 2.5 16.8877 2.5 16.6667V14.5117C2.50005 14.2907 2.58788 14.0787 2.74417 13.9225L7.71417 8.9525C7.50621 8.26501 7.4488 7.54079 7.54587 6.82912C7.64293 6.11746 7.89219 5.43506 8.27666 4.82837C8.66113 4.22169 9.1718 3.70495 9.77391 3.31335C10.376 2.92174 11.0554 2.66446 11.7659 2.559C12.4764 2.45355 13.2012 2.5024 13.8911 2.70224C14.581 2.90207 15.2198 3.2482 15.7639 3.71705C16.308 4.18591 16.7447 4.76649 17.0443 5.41928C17.3439 6.07207 17.4993 6.78175 17.5 7.5Z" stroke="#ABB0B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Grid>
          )}
          <Grid item className={styles.title} mr={1}>
            <Typography color={'#292E30'} fontWeight={700} fontSize={'20px'} fontFamily={'Gilroy'}>
              {topic.title}
            </Typography>
          </Grid>
        </Grid>
        {
          topic.user.id === userId && 
            (
              <Grid display={'flex'} justifyContent={'flex-end'}>
                <Grid onClick={editTopic} ml={2}>
                  <svg width="18" height="23" viewBox="0 0 14 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M8.22995 1.92283C8.82793 0.889719 10.014 0.771146 11.0481 1.36898L12.0652 1.95753C13.0993 2.55537 13.5893 3.64034 12.9917 4.67543L6.26818 16.3087C6.04358 16.6981 5.65409 16.9644 5.20924 17.0324L2.21335 17.6161L1.40787 14.8346C1.24557 14.4162 1.28202 13.9465 1.50648 13.5561L8.22995 1.92283Z" 
                      stroke="#37366B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Grid>
              </Grid>
            )
        }
      </Grid>
      {
        (topic.status === TopicStatuses.temporary_blocked || topic.status === TopicStatuses.blocked) && (
          <Grid px={2} my={1}>
            <Typography color={'#FF0000'} fontWeight={400} fontSize={'15px'} fontFamily={'Gilroy'}>
              Ваша тема не прошла модерацию и не может отражаться на форуме. Тема добавлена в ваши Черновики. С вами свяжется модератор по email, объяснит причину блокировки и даст рекомендации по исправлению. Если письмо от модератора вы не получили, обратитесь к нам с этим вопросом.            
            </Typography>
          </Grid>
        ) 
      }
      {
        topic.published_at && (
          <Grid item px={2}>
            <Typography color={'#292E30'} fontWeight={400} fontSize={'14px'} fontFamily={'Gilroy'}>
              {insertZero(new Date(topic.published_at).getHours())}:
              {insertZero(new Date(topic.published_at).getMinutes())} {insertZero(new Date(topic.published_at).getDate())}.
              {insertZero(new Date(topic.published_at).getMonth() + 1)}.
              {insertZero(new Date(topic.published_at).getFullYear())}
            </Typography>
          </Grid>
        )
      }
      <Grid item pl={2} pr={2} mb={3} flex={1} width={'100%'}>
        <Typography color={'#292E30'} fontWeight={400} fontSize={'18px'} fontFamily={'Gilroy'} className={styles.description}>
          {parse(topic.description)}
        </Typography>
        {/* <Typography color={'#292E30'} fontWeight={400} fontSize={'16px'} fontFamily={'Gilroy'} className={styles.description}>
          {(!openMore && selectedTopic?.description.length > 50) ? parse(selectedTopic?.description.slice(0, 50)) : parse(selectedTopic?.description)}
          {selectedTopic?.description.length > 50 
            ? (!openMore) 
              ? <strong color={'#5C5B9F'} onClick={() => setOpenMore(true)}> Подробнее</strong> 
              : <strong color={'#5C5B9F'} onClick={() => setOpenMore(false)}>Скрыть</strong>
            : null}
        </Typography> */}
      </Grid>
      <Grid mb={3} width={'100%'} overflow={'hidden'}>
        <Slider images={topic.images}/>
      </Grid>
      {topic?.horoscope_link && <Grid px={2} mb={2}>
        <GradientButton onClick={openHoroscopeModal}>
          <Grid display={'flex'} flexDirection={'row'} alignItems={'center'}>
            <svg width="33" height="34" viewBox="0 0 33 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.29492 1.39349V3.34431L10.0326 8.08201V10.5902" stroke="#9C9EA8"/>
              <path d="M12.2624 10.5902V6.40988L10.3116 4.45906V2.22955M14.4919 3.34431V10.5902M16.7214 10.5902V3.90168L18.3935 2.22955M18.9509 6.13119V10.5902M20.6231 10.5902V6.68857L23.1312 4.18037V2.50824M22.8526 10.5902V7.80332L25.9181 4.73775H27.0329M23.4099 11.1476H25.6394L30.6558 6.13119M23.4099 13.0984H26.1968M23.4099 15.0492H28.9837L31.4919 12.541M23.4099 17.2787H30.0985M23.4099 19.5082H27.869L30.6558 22.2951M23.4099 21.4591H25.6394L30.0985 25.9181H31.2132M23.4099 23.4099H25.0821L30.9345 29.2623V30.6558M22.5739 23.9672V26.4754L25.0821 28.9836V31.2131M20.6231 24.5246V28.4263M18.3935 24.5246V26.1968M16.4427 24.2459V29.2623L19.5083 32.3279M14.4919 23.9672V31.7705M12.2624 23.9672V28.4263L9.47552 31.2131M10.0329 23.9672V25.6394L5.0165 30.6558V31.7705M9.47552 23.4099H7.5247L3.06569 27.8689H1.95093M9.47552 21.1804H6.13126L4.45913 22.8525H2.787M9.47552 19.2295H2.787L1.39355 17.8361M9.47552 17.2787H6.68863M9.47552 15.0492H5.0165L3.62306 13.6558M9.47552 12.8197H6.96732L3.90175 9.75414H1.95093M9.47552 11.1476H8.36076L3.34437 6.13119" stroke="#9C9EA8"/>
              <rect x="11.002" y="12.0901" width="10.9081" height="10.9081" rx="3.5" fill="#9C9EA8" stroke="#9C9EA8" strokeWidth="3"/>
              <rect x="3.90137" width="2.22951" height="2.22951" rx="1.11475" fill="#9C9EA8"/>
              <rect x="8.91797" y="0.557373" width="2.22951" height="2.22951" rx="1.11475" fill="#9C9EA8"/>
              <rect x="12.8193" y="1.11475" width="2.22951" height="2.22951" rx="1.11475" fill="#9C9EA8"/>
              <rect x="17.8359" width="2.22951" height="2.22951" rx="1.11475" fill="#9C9EA8"/>
              <rect x="17.8359" y="4.45898" width="2.22951" height="2.22951" rx="1.11475" fill="#9C9EA8"/>
              <rect x="22.2949" y="0.557373" width="2.22951" height="2.22951" rx="1.11475" fill="#9C9EA8"/>
              <rect x="26.7539" y="3.34424" width="2.22951" height="2.22951" rx="1.11475" fill="#9C9EA8"/>
              <rect x="30.0986" y="4.45898" width="2.22951" height="2.22951" rx="1.11475" fill="#9C9EA8"/>
              <rect x="25.6396" y="11.705" width="2.22951" height="2.22951" rx="1.11475" fill="#9C9EA8"/>
              <rect x="30.6553" y="11.1476" width="2.22951" height="2.22951" rx="1.11475" fill="#9C9EA8"/>
              <rect x="29.541" y="16.1639" width="2.22951" height="2.22951" rx="1.11475" fill="#9C9EA8"/>
              <rect x="29.541" y="21.1804" width="2.22951" height="2.22951" rx="1.11475" fill="#9C9EA8"/>
              <rect x="30.6553" y="25.0819" width="2.22951" height="2.22951" rx="1.11475" fill="#9C9EA8"/>
              <rect x="30.0986" y="30.0984" width="2.22951" height="2.22951" rx="1.11475" fill="#9C9EA8"/>
              <rect x="23.9668" y="30.0984" width="2.22951" height="2.22951" rx="1.11475" fill="#9C9EA8"/>
              <rect x="19.5078" y="27.8688" width="2.22951" height="2.22951" rx="1.11475" fill="#9C9EA8"/>
              <rect x="13.377" y="31.2131" width="2.22951" height="2.22951" rx="1.11475" fill="#9C9EA8"/>
              <rect x="7.80371" y="30.6558" width="2.22951" height="2.22951" rx="1.11475" fill="#9C9EA8"/>
              <rect x="3.90137" y="31.2131" width="2.22951" height="2.22951" rx="1.11475" fill="#9C9EA8"/>
              <rect x="0.557617" y="26.7541" width="2.22951" height="2.22951" rx="1.11475" fill="#9C9EA8"/>
              <rect x="1.11426" y="21.7377" width="2.22951" height="2.22951" rx="1.11475" fill="#9C9EA8"/>
              <rect y="16.1639" width="2.22951" height="2.22951" rx="1.11475" fill="#9C9EA8"/>
              <rect x="5.0166" y="16.1639" width="2.22951" height="2.22951" rx="1.11475" fill="#9C9EA8"/>
              <rect x="2.22949" y="12.2623" width="2.22951" height="2.22951" rx="1.11475" fill="#9C9EA8"/>
              <rect y="8.91803" width="2.22951" height="2.22951" rx="1.11475" fill="#9C9EA8"/>
              <rect x="1.67188" y="4.45898" width="2.22951" height="2.22951" rx="1.11475" fill="#9C9EA8"/>
              <rect x="17.2783" y="25.0819" width="2.22951" height="2.22951" rx="1.11475" fill="#9C9EA8"/>
              <rect x="18.9512" y="31.7705" width="2.22951" height="2.22951" rx="1.11475" fill="#9C9EA8"/>
              <path d="M21.2905 22.0938H19.1905L18.6025 20.3297H14.6965L14.1085 22.0938H12.0225L15.4525 12.2937H17.8465L21.2905 22.0938ZM16.6565 14.5197L15.3125 18.5237H18.0005L16.6565 14.5197Z" fill="#E9E9EE"/>
            </svg>
            <Grid ml={2} mt={'3px'} fontWeight={'18px'} lineHeight={'16px'}>
              Открыть гороскоп
            </Grid>
          </Grid>
        </GradientButton>
      </Grid>}
      <Grid px={2} mb={3}>
        <Button text={`Комментарии (${commentCount})`} onClick={() => setIsOpenCommentModal(true)}/>
      </Grid>
      <Comments
        isOpen={isOpenCommentModal}
        close={() => setIsOpenCommentModal(false, true)}
        joinToTopic={topic.access_level === 0 ? acceptInvite : joinToTopic}
        topic={topic}
      />
    </Grid>
  );
};

export default ForumItem;
