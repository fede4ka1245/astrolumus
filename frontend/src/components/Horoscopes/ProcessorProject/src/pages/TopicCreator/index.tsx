import React, { useCallback, useRef, useState } from 'react';
import { Checkbox, Grid, Typography, Zoom } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DraftsModal from '../../components/modals/DraftsModal';
import UserHeader from '../../components/userHeader/UserHeader';
import ButtonBack from '../../components/buttonBack/ButtonBack';
import CategoryModal from '../../components/CategoryModal';
import ButtonAdd from '../../components/buttonAdd/ButtonAdd';
import Divider from '../../components/divider/Divider';
import Button from '../../components/button/Button';
import Background from '../../components/background/Background';
import Quill from '../../components/Quill';
import AvatarPicker from '../../components/avatarPicker/AvatarPicker';
import authRequest from '../../api/authRequest';
import { forumImage, forumTopicApi } from '../../api/forum';
import { setIsAppLoading } from '../../store/reducers/preferencesReducer';
import { AccessLevel } from '../../models/enums/topic';
import { ILocalTopic, ILocalTopicImage } from '../../models/interfaces/topic';
import { useAppDispatch } from '../../store/store';
import styles from './styles.module.scss';
import { useHideNavbar } from '../../hooks/useHideNavbar';
import dataURLtoFile from '../../helpers/dataURLtoFile';
import isQuillEmpty from '../../helpers/isQuillEmpty';
import Input from '../../components/input/Input';
import { IForumCategory } from '../../models/interfaces/forum';
import { routes } from '../../models/enums/routes';
import ImageZoom from '../../hoc/ImageZoom';
import webPathToFile from '../../helpers/webPathToFile';
import SaveDraftModal from './components/SaveDraftModal';
import { useSnackbarAlert } from '../../hooks/useSnackbarAlert';
import { pickImage } from '../../helpers/pickImage';
import { SavedHoroscope } from '../../models/types/SavedHoroscopes';
import Modal from '../../components/modal/Modal';
import DarkThemeBackground from '../../components/darkThemeBackground/DarkThemeBackground';
import HoroscopeSearch from '../../components/horoscopeSearch/HoroscopeSearch';
import { getSavedHoroscopeLabel } from '../../components/myHororscope/helpers/';
import { buildHoroscopeUrlFromSavedHoroscope } from '../../helpers/horoscopeUrl';
import { getShortLink } from '../../api/getShortLink';
import VideoBanners from '../../components/videoBanners/VideoBanners';
import { VideoBannerType } from '../../helpers/videoBannerType';
import { useNavigateBack } from '../../hooks/useNavigateBack';
import { useSearchParamsState } from '../../hooks/useSearchParamsState';
import { useGetVideoBanners } from '../../hooks/useGetVideoBanners';
import { FirebaseEvent } from '../../helpers/firebase/firebaseEvent';
import { logFirebaseEvent } from '../../helpers/firebase';

const CreateTopic = () => {
  const dispatch = useAppDispatch();
  const [isDraftsOpen, setIsDraftsOpen] = useSearchParamsState('isDraftsOpen', false, false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useSearchParamsState('isCategoryModalOpen', false, false);
  const [isCropImage, setIsCropImage] = useState<boolean>(false);
  const [isOpenDraftModal, setIsOpenDraftModal] = useSearchParamsState('isOpenDraftModal', false, false);
  const [topicImage, setTopicImage] = useState<ILocalTopicImage>({
    image: '',
    image_original: ''
  });
  const windowWidth = useRef(window.innerWidth);
  const [topic, setTopic] = useState<ILocalTopic>({
    title: '',
    description: '',
    images_ids: [],
    members_ids: [],
    published_at: new Date(),
    category_name: '',
    access_level: AccessLevel.public,
    category: null,
    horoscope: null,
    dim_sky: false
  });
  const navigate = useNavigate();
  const [images, setImages] = useState<ILocalTopicImage[]>([]);
  const snackbarAlert = useSnackbarAlert();

  useHideNavbar();

  const clearTopic = () => {
    setTopic({
      title: '',
      description: '',
      images_ids: [],
      members_ids: [],
      published_at: new Date(),
      category_name: '',
      access_level: AccessLevel.public,
      category: 0,
      horoscope: null,
      dim_sky: false
    });
    setImages([]);
    setTopicImage({
      image: '',
      image_original: ''
    });
  };

  const toggleIsDraftsOpen = useCallback(() => {
    if (isDraftsOpen) {
      navigate(-1);
    } else {
      setIsDraftsOpen(true);
    }
  }, [isDraftsOpen, setIsDraftsOpen]);

  const back = useNavigateBack();

  const onButtonBackClick = useCallback(() => {
    if (topic.category || topic.title || topic.description) {
      setIsOpenDraftModal(true);
    } else {
      back();
    }
  }, [back, setIsOpenDraftModal, topic.category, topic.description, topic.title]);

  const sendTopic = useCallback((topic: ILocalTopic, isDraft?: boolean) => {
    dispatch(setIsAppLoading(true));
    authRequest.post(forumTopicApi(), topic)
      .then(res => {
        clearTopic();
        if (!isDraft) {
          logFirebaseEvent({
            name: FirebaseEvent.createTopic
          });
          snackbarAlert('Ваша тема опубликована на форуме. Теперь вы можете пригласить в тему своих друзей и подписчиков');
          navigate(routes.topic + res.data.id, { replace: true });
        } else {
          navigate(-1);
        }
      })
      .catch(() => {
        alert('Заполните все поля!');
      })
      .finally(() => {
        dispatch(setIsAppLoading(false));
      });
  }, [dispatch, navigate, snackbarAlert]);
  
  const deleteImage = useCallback((id: number) => {
    setImages((prev: any) => prev.filter((item: any) => item.id !== id));
    authRequest.delete(forumImage(id));
  }, []);

  const closeModal = useCallback(() => {
    navigate(-1);
    setTopicImage({
      image: '',
      image_original: ''
    });
    setIsCropImage(false);
  }, [setIsCategoryModalOpen]);

  const handleNewImage = useCallback(async () => {
    const image = await pickImage();

    if (!image) {
      return;
    }

    setIsCropImage(true);
    setTopicImage({
      image: '',
      image_original: image
    });
  }, []);

  const sendImage = useCallback(async (image: string) => {
    const file = { 
      image: dataURLtoFile(image, 'image'),
      image_original: await webPathToFile(topicImage.image_original, 'image_original')
    };

    dispatch(setIsAppLoading(true));
    authRequest.post(forumImage(), file, {
      headers: { 
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((res) => {
        setImages((prevState: any) => [...prevState, res.data]);
        close();
      })
      .finally(() => {
        setIsCropImage(false);
        dispatch(setIsAppLoading(false));
      });
  }, [dispatch, topicImage.image_original]);

  const saveImage = useCallback((value: any) => {
    sendImage(value);
    setTopicImage({
      image: '',
      image_original: ''
    });
  }, [sendImage]);

  const setCategory = useCallback((category: IForumCategory) => {
    if (category.id === topic.category) {
      setTopic(prevState => ({
        ...prevState, 
        category: 0,
        category_name: ''
      }));
    } else {
      setTopic(prevState => ({
        ...prevState, 
        category: category.id,
        category_name: category.title
      }));
    }
  }, [topic.category]);

  const saveToDraft = useCallback(() => {
    sendTopic({ 
      ...topic,
      images_ids: images.map((item: any) => item.id), 
      members_ids: [],
      published_at: null 
    }, true);
  }, [images, sendTopic, topic]);

  const [isHoroscopesModalOpen, setIsHoroscopesModalOpen] = useSearchParamsState('isHoroscopesModalOpen', false, false);
  const [targetHoroscope, setTargetHoroscope] = useState<SavedHoroscope>();
  const toggleHoroscopeModal = useCallback(() => {
    setIsHoroscopesModalOpen(!isHoroscopesModalOpen);
  }, [isHoroscopesModalOpen, setIsHoroscopesModalOpen]);

  const onHoroscopeSet = useCallback(async (horoscope: SavedHoroscope) => {
    setTargetHoroscope(horoscope);
    toggleHoroscopeModal();
    const link = await getShortLink(buildHoroscopeUrlFromSavedHoroscope(horoscope));
    setTopic((topic) => ({
      ...topic,
      horoscope_link: link
    }));
  }, [toggleHoroscopeModal]);

  const onDeleteHoroscopeClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setTargetHoroscope(undefined);
    setTopic((topic) => ({
      ...topic,
      horoscope: null,
      horoscope_link: null
    }));
  }, []);

  const { banners } = useGetVideoBanners(VideoBannerType.themeCreating);

  return (
    <>
      <Modal isOpen={isHoroscopesModalOpen} close={toggleHoroscopeModal} isDark height={'calc(100vh - 100px)'}>
        <DarkThemeBackground>
          <Grid container width={'100%'}>
            <HoroscopeSearch close={toggleHoroscopeModal} onHoroscopeSet={onHoroscopeSet} />
          </Grid>
        </DarkThemeBackground>
      </Modal>
      <Background background={'#F0F0F3'} />
      <UserHeader />
      <CategoryModal
        category={topic.category}
        onChange={setCategory} 
        isOpen={isCategoryModalOpen}
        close={closeModal}
      />
      {isCropImage &&
        <AvatarPicker
          minCropBoxWidth={windowWidth.current / 1.18}
          minCropBoxHeight={windowWidth.current / 1.18}
          imagePath={topicImage.image_original}
          cancel={() => setIsCropImage(false)}
          save={saveImage}
        />
      }
      <SaveDraftModal
        isOpen={isOpenDraftModal}
        close={() => navigate(-1)}
        saveToDraft={saveToDraft}
      />
      <Grid container direction={'column'} pl={2} pr={2} mb={3}>
        <Grid item>
          <ButtonBack color={'#37366B'} label={'Назад'} onClick={onButtonBackClick} />
        </Grid>
        <Grid item container justifyContent={'space-between'} pt={2} mb={'27px'}>
          <Grid item>
            <Typography fontFamily={'Gilroy'} fontWeight={700} fontSize={'18px'} color={'#37366B'}>
              Новая тема
            </Typography>
          </Grid>
          <Grid item>
            <Typography onClick={toggleIsDraftsOpen} fontFamily={'Gilroy'} fontWeight={700} fontSize={'18px'} color={'#37366B'}>
              Черновики
            </Typography>
            <DraftsModal isOpen={isDraftsOpen} close={toggleIsDraftsOpen}/>
          </Grid>
        </Grid>
        <Grid item mb={'10px'}>
          <Grid 
            position={'relative'}
            onClick={() => setIsCategoryModalOpen(true)}>
            <Grid flex={1}> 
              <Input
                isError={!topic.category}
                textError={'*'}
                value={topic.category_name}
                placeholder={'Выберите категорию/подкатегорию'}
              />
            </Grid>
            <Grid position={'absolute'} right={'15px'} top={'calc(50% - 7px)'}>
              <svg width="13" height="7" viewBox="0 0 13 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L6.18338 5.24095C6.36756 5.39164 6.63244 5.39164 6.81662 5.24095L12 1" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </Grid>
          </Grid>
        </Grid>
        <Grid item mb={'10px'}>
          <Input
            isError={!topic.title}
            textError={'*'}
            value={topic.title}
            placeholder={'Название темы'}
            onChange={(value) => setTopic((prevState: any) => ({
              ...prevState,
              title: value
            }))}/>
        </Grid>
        <Grid mb={'16px'}>
          <Quill
            isError={isQuillEmpty(topic.description)}
            textError="*"
            placeholder="Содержание"
            value={topic.description}
            onChange={(value) => setTopic((prevState: any) => ({
              ...prevState,
              description: value
            }))}
          />
        </Grid>
        <Grid item mb={'16px'}>
          <Grid
            position={'relative'}
            onClick={toggleHoroscopeModal}>
            <Grid flex={1} sx={{ pointerEvents: 'none' }}>
              <Input
                value={targetHoroscope ? getSavedHoroscopeLabel(targetHoroscope) : ''}
                placeholder={'Добавить гороскоп'}
              />
            </Grid>
            {!targetHoroscope && (
              <Grid position={'absolute'} right={'15px'} top={'calc(50% - 7px)'}>
                <svg width="13" height="7" viewBox="0 0 13 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L6.18338 5.24095C6.36756 5.39164 6.63244 5.39164 6.81662 5.24095L12 1" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </Grid>
            )}
            {!!targetHoroscope && (
              <Grid onClick={onDeleteHoroscopeClick} sx={{ background: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }} height={'18px'} pl={'8px'} position={'absolute'} pr={'15px'} right={0} top={'calc(50% - 9px)'}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.58398 1.58331L14.4173 14.4166" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M14.416 1.58331L1.58268 14.4166" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid px={2} mb={3}>
        <Typography fontFamily={'Gilroy'} color={'#5B6062'} fontSize={'15px'} textAlign={'center'}>
          Вы можете загрузить 9 изображений. Загрузка идёт по одному изображению за раз 
        </Typography>
      </Grid>
      <Grid px={2} mb={3}>
        <Typography fontFamily={'Gilroy'} color={'#5B6062'} fontSize={'15px'} textAlign={'center'}>
          Рекомендуем добавить скриншоты гороскопа при рассмотрении вашего вопроса. Это повышает шансы на ответ другими участниками.
        </Typography>
      </Grid>
      <Grid container direction={'column'} px={2}>
        <Grid item container py={5} mb={'15px'} justifyItems={'center'} flexDirection={'column'} alignItems={'center'} border={'1px solid #C3C9CD'} borderRadius={'20px'}>
          {images.length > 0 
            ? images.map((item: any, index: number) => (
              <div key={index} className={styles.image_container}>
                <div className={styles.image_delete} onClick={() => deleteImage(item.id)}>
                  <svg width="10" height="10" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 1.5L12.5 12.5" stroke="#FFF" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M12.5 1.5L1.5 12.5" stroke="#FFF" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <ImageZoom
                  slide={index}
                  images={images.map(item => item.image_original)}
                >
                  <Zoom
                    in={true}
                    style={{ transitionDelay: '100ms' }}
                  >
                    <img src={item.image} className={styles.image}/>
                  </Zoom>
                </ImageZoom>
              </div>
            ))
            : <Grid item>
              <Typography fontFamily={'Gilroy'} color={'#5B6062'} fontSize={'13px'}>
                Изображения отсутствуют
              </Typography>
            </Grid>}
        </Grid>
        <Grid item pt={4}>
          <Divider color={'#D9D9D9'} />
        </Grid>
        <Grid item pt={2} mb={'15px'}>
          <ButtonAdd onClick={handleNewImage}>
            Добавить изображение
          </ButtonAdd>
        </Grid>
        <Grid item mb={'27px'}>
          <Grid display={'flex'} alignItems={'center'}>
            <Checkbox 
              checked={ !topic.access_level }
              onChange={(e) => setTopic((prevState: any) => ({
                ...prevState,
                access_level: e.target.checked ? 0 : 1
              }))}
              sx={{
                '& .MuiSvgIcon-root': {
                  fontSize: '25px',
                  fill: !topic.access_level ? '#37366B' : '#C3C9CD'
                },
                '& .MuiTouchRipple-root': {
                  color: '#979C9E'
                }
              }}
            />
            <Typography fontFamily={'Gilroy'} fontWeight={500} fontSize={'15px'} color={!topic.access_level ? '#37366B' : '#C3C9CD' }>
              Приватная тема
            </Typography>
          </Grid>
        </Grid>
        <Grid item py={3} px={2} display={'flex'} mb={4} alignItems={'flex-start'} border={'1px solid #C3C9CD'} borderRadius={'20px'}>
          <Grid mr={3}>
            <svg width="26" height="23" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.3333 12.3333H14.6666V11C14.6666 10.5843 14.5371 10.179 14.2961 9.84038C14.0551 9.50175 13.7145 9.24662 13.3218 9.11046C12.9291 8.9743 12.5037 8.96388 12.1048 9.08064C11.7059 9.1974 11.3533 9.43554 11.096 9.76196M11.3333 12.3333H4.66665M11.3333 12.3333V11C11.3333 10.5626 11.2493 10.1446 11.096 9.76196M11.096 9.76196C10.8484 9.14326 10.4211 8.61294 9.86931 8.23937C9.31747 7.86581 8.66637 7.66616 7.99998 7.66616C7.33359 7.66616 6.68249 7.86581 6.13065 8.23937C5.57881 8.61294 5.15155 9.14326 4.90398 9.76196M4.66665 12.3333H1.33331V11C1.33334 10.5843 1.46287 10.179 1.70389 9.84038C1.9449 9.50175 2.28544 9.24662 2.67815 9.11046C3.07086 8.9743 3.49623 8.96388 3.89514 9.08064C4.29405 9.1974 4.64667 9.43554 4.90398 9.76196M4.66665 12.3333V11C4.66665 10.5626 4.75065 10.1446 4.90398 9.76196M9.99998 3.66663C9.99998 4.19706 9.78927 4.70577 9.41419 5.08084C9.03912 5.45591 8.53041 5.66663 7.99998 5.66663C7.46955 5.66663 6.96084 5.45591 6.58577 5.08084C6.21069 4.70577 5.99998 4.19706 5.99998 3.66663C5.99998 3.13619 6.21069 2.62749 6.58577 2.25241C6.96084 1.87734 7.46955 1.66663 7.99998 1.66663C8.53041 1.66663 9.03912 1.87734 9.41419 2.25241C9.78927 2.62749 9.99998 3.13619 9.99998 3.66663ZM14 5.66663C14 6.02025 13.8595 6.35939 13.6095 6.60943C13.3594 6.85948 13.0203 6.99996 12.6666 6.99996C12.313 6.99996 11.9739 6.85948 11.7238 6.60943C11.4738 6.35939 11.3333 6.02025 11.3333 5.66663C11.3333 5.313 11.4738 4.97387 11.7238 4.72382C11.9739 4.47377 12.313 4.33329 12.6666 4.33329C13.0203 4.33329 13.3594 4.47377 13.6095 4.72382C13.8595 4.97387 14 5.313 14 5.66663ZM4.66665 5.66663C4.66665 6.02025 4.52617 6.35939 4.27612 6.60943C4.02607 6.85948 3.68694 6.99996 3.33331 6.99996C2.97969 6.99996 2.64055 6.85948 2.3905 6.60943C2.14046 6.35939 1.99998 6.02025 1.99998 5.66663C1.99998 5.313 2.14046 4.97387 2.3905 4.72382C2.64055 4.47377 2.97969 4.33329 3.33331 4.33329C3.68694 4.33329 4.02607 4.47377 4.27612 4.72382C4.52617 4.97387 4.66665 5.313 4.66665 5.66663Z" 
                stroke="#37366B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Grid>
          <Typography fontFamily={'Gilroy'} color={'#5B6062'} fontSize={'15px'}>
            При клике на эту иконку в самой теме, вы можете пригласить своих друзей и подписчиков, а также видеть всех участников темы.
          </Typography>
        </Grid>
        <Grid item pl={6} pr={6}>
          <Button text={'Выпустить тему'} onClick={() => sendTopic({ 
            ...topic, 
            images_ids: images.map((item: any) => item.id)
          })}/>
        </Grid>
        <Grid item pt={3} pl={6} pr={6} pb={3} onClick={saveToDraft}>
          <Typography fontFamily={'Gilroy'} fontWeight={500} fontSize={'14px'} color={'black'} textAlign={'center'}>
            Сохранить в черновик
          </Typography>
        </Grid>
        <VideoBanners banners={banners} color={'#37366B'}/>
      </Grid>
    </>
  );
};

export default CreateTopic;
