import React, { useCallback } from 'react';
import { ButtonBase, Grid, Fade, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../models/enums/routes';
import TransparentButton from '../../components/transparentButton/TransparentButton';
import cross from './images/cross.svg';
import forum from './images/forum.svg';
import youtube from './images/youTube.png';
import telegram from './images/telegram.png';
import profile from './images/profile.svg';
import { useAppSelector } from '../../store/store';
import { useHideNavbar } from '../../hooks/useHideNavbar';
import Avatar from '../../components/Avatar';
import DarkThemeBackground from '../../components/darkThemeBackground/DarkThemeBackground';
import AstrologicalProcessorButton from './AstrologicalProcessorButton';
import DocumentModal from './DocumentModal';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import styles from './Menu.module.scss';
import Button from '../../components/button/Button';
import { useGetAppAccess } from '../../store/selectors';
import { triggerForumRestrictionBanner } from '../../helpers/triggerForumResrictionBanner';
import IconButton from '../../components/iconButton/IconButton';
import { useSearchParamsState } from '../../hooks/useSearchParamsState';
import { getIsForumEnabled } from '../../helpers/getIsForumEnabled';

const Menu = () => {
  const navigate = useNavigate();
  const { userInfo } = useAppSelector(state => state.user);
  const { hasNewMessages } = useAppSelector(state => state.notification);
  const [document, setDocument] = useSearchParamsState('document', {
    isModalOpen: false,
    documentCode: ''
  }, false);
  const { appInfo } = useAppSelector(state => state.user);

  useHideNavbar();

  const appAccess = useGetAppAccess();
  const isForumEnabled = getIsForumEnabled();

  const onChangeButtonClick = useCallback(async () => {
    if (appAccess.isForumRestricted) {
      triggerForumRestrictionBanner();
      return;
    }

    navigate(routes.userEdit);
  }, [appAccess.isForumRestricted, navigate, triggerForumRestrictionBanner]);

  const onForumClick = useCallback(() => {
    if (appAccess.isForumRestricted) {
      triggerForumRestrictionBanner();
      return;
    }

    navigate(routes.forum);
  }, [appAccess.isForumRestricted, navigate]);

  const onExit = useCallback(() => {
    if (appAccess.isForumRestricted) {
      triggerForumRestrictionBanner();
      return;
    }

    navigate(routes.main);
  }, [appAccess.isForumRestricted, navigate]);

  const onNavigateToProfile = useCallback(() => {
    if (appAccess.isForumRestricted) {
      triggerForumRestrictionBanner();
      return;
    }

    navigate(routes.user + userInfo.id);
  }, [appAccess.isForumRestricted, navigate, userInfo.id]);

  const onNavigateToNotifications = useCallback(() => {
    navigate(routes.messages);
  }, []);
  
  const onNavigateToScholar = useCallback(() => {
    navigate(routes.scholar);
  }, []);

  const openPrivacyDocument = useCallback(() => {
    setDocument({
      documentCode: 'privacy',
      isModalOpen: true
    });
  }, [setDocument]);

  const openContractDocument = useCallback(() => {
    setDocument({
      documentCode: 'contract',
      isModalOpen: true
    });
  }, [setDocument]);
  
  const close = useCallback(() => {
    navigate(-1);
  }, [setDocument]);

  return (
    <DarkThemeBackground fillBody backgroundVariant={'galaxy'}>
      <Fade in={true} timeout={400}>
        <Grid display={'flex'} pl={3} pr={3} pt={'calc(16px + var(--status-bar-offset))'} rowSpacing={4} flexDirection={'column'} height={'100vh'} overflow={'scroll'}>
          <DocumentModal
            isOpen={document.isModalOpen}
            close={close}
            code={document.documentCode}
          />
          <Grid item container justifyContent={'space-between'}>
            <Grid item>
              <IconButton onClick={onExit}>
                <img width={25} height={25} src={cross} />
              </IconButton>
            </Grid>
            <IconButton onClick={onNavigateToNotifications}>
              <Grid position={'relative'}>
                {
                  hasNewMessages && (
                    <Grid width={10} height={10} bgcolor="#DC1616" borderRadius={'50%'} position={'absolute'} right={-5} top={-5}/>
                  )
                }
                <svg width="24" height="27" viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g opacity="0.5">
                    <path fillRule="evenodd" clipRule="evenodd" d="M11.8911 4.42047C10.1533 4.41652 7.78321 4.33899 6.89731 5.41403C6.0709 6.41678 6.28386 7.12254 6.14947 8.95326C6.01381 10.7853 0.628468 16.0649 2.33187 19.0456C3.5411 20.5832 6.07599 20.6975 11.8911 20.6975C17.7061 20.6975 20.241 20.5832 21.4501 19.0456C23.1548 16.0649 17.7682 10.7853 17.6326 8.95326C17.4982 7.12254 17.7111 6.41679 16.8848 5.41403C15.9988 4.33899 13.6287 4.41652 11.8911 4.42047Z" stroke="#9C9EA8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15.6875 23.6102C13.8636 25.4633 9.91036 25.4633 8.0966 23.6102" stroke="#9C9EA8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M13.2741 3.38977C13.4502 1.53672 10.3232 1.53672 10.5095 3.38977" stroke="#9C9EA8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                </svg>
              </Grid>
            </IconButton>
          </Grid>
          <Grid pt={2} item container direction={'row'} maxWidth={'580px'} ml={'auto'} mr={'auto'}>
            <Grid item mr={2} onClick={onNavigateToProfile}>
              <Avatar
                width={97}
                height={97}
                fontSize={40}
                avatar={userInfo.avatar}
                abbreviation={`${userInfo.first_name?.slice(0, 1)}${userInfo.last_name?.slice(0, 1)}`}
              />
            </Grid>
            <Grid item container direction={'column'} flex={1} justifyContent={'center'}>
              <Grid item>
                <Typography onClick={onNavigateToProfile} fontFamily={'Playfair Display'} fontWeight={'bold'} lineHeight={'24px'} fontSize={'24px'} color={'white'}>
                  {userInfo.first_name} {userInfo.last_name}
                </Typography>
              </Grid>
              <Grid item mt={1}>
                <ButtonBase onClick={onChangeButtonClick}>
                  <Typography fontFamily={'Gilroy'} fontSize={16} color={'#77C9F8'} fontWeight={300}>
                    изменить
                  </Typography>
                </ButtonBase>
              </Grid>
            </Grid>
          </Grid>
          <Grid pt={2} item container justifyContent={'space-between'} maxWidth={'580px'} ml={'auto'} mr={'auto'}>
            {isForumEnabled && !appAccess.isForumRestricted && <>
              <Grid item width={'calc(50% - 5px)'} pb={2}>
                <TransparentButton image={<img src={forum}/>} label={'Форум'} onClick={onForumClick} isSquare={true}/>
              </Grid>
              <Grid item width={'calc(50% - 5px)'} pb={2}>
                <TransparentButton image={<img src={profile}/>} label={'Мой профиль'} onClick={onNavigateToProfile} isSquare={true}/>
              </Grid>
            </>}
            <Grid item width={'calc(50% - 5px)'}>
              <AstrologicalProcessorButton />
            </Grid>
            <Grid item width={'calc(50% - 5px)'}>
              <section onClick={onNavigateToScholar} className={styles.processorButton}>
                <Grid display={'flex'} alignItems={'center'} flexDirection={'column'} zIndex={10}>
                  <Grid alignItems={'center'} justifyContent={'center'} height={'62px'}>
                    <Typography textAlign={'center'} color={'#39396F'} fontSize={'18px'} lineHeight={1.1} fontFamily={'Gilroy'} fontWeight={'bold'}>
                      Техническая поддержка
                    </Typography>
                  </Grid>
                  {/* <SchoolRoundedIcon sx={{ color: '#39396F', width: '50px', height: '50px', zIndex: 10 }} /> */}
                  <Grid item mt={'16px'} zIndex={10}>
                    <Button text={'Помощь'} height={'10px'} width={'130px'} />
                  </Grid>
                </Grid>
              </section>
            </Grid>
          </Grid>
          {/* <Grid item> */}
          {/*  <TransparentButton */}
          {/*    height="250px" */}
          {/*    onClick={onAstrologicalProcessorClick} */}
          {/*    image={<img alt={'processor'} src={astrologicalProcessor} width={100} height={100}/>} */}
          {/*    label={'Астропроцессор'} */}
          {/*  /> */}
          {/* </Grid> */}
          {/* <Grid item> */}
          {/*  <Video /> */}
          {/* </Grid> */}
          <Grid item container justifyContent={'space-between'} spacing={1} mb={2} mt={'auto'} maxWidth={'580px'} ml={'auto'} mr={'auto'}>
            <Grid item xs={6} md={6} sx={{ opacity: '0.8' }}>
              <a href={appInfo.youtube_alpha ?? ''} target="_blank" rel="noreferrer">
                <img alt={'youTube'} src={youtube} width={'100%'}/>
              </a>
            </Grid>
            <Grid item xs={6} md={6} sx={{ opacity: '0.8' }}>
              <a href={'https://t.me/DeepSkySchoolBot'} target="_blank" rel="noreferrer">
                <img alt={'telegram'} src={telegram} width={'100%'}/>
              </a>
            </Grid>
          </Grid>
          <Grid mb={4}>
            <Typography color={'#77C9F8'} fontSize={'14px'} fontWeight={500} fontFamily={'Gilroy'} mb={1}>
              ИП Тикарева Татьяна Михайловна<br/>
              УНП 192605086
            </Typography>
            <Typography color={'#77C9F8'} fontSize={'14px'} fontWeight={500} fontFamily={'Gilroy'} mb={1} onClick={openPrivacyDocument}>
              Политика конфидециальности
            </Typography>
            <Typography color={'#77C9F8'} fontSize={'14px'} fontWeight={500} fontFamily={'Gilroy'} onClick={openContractDocument}>
              Пользовательское соглашение
            </Typography>
          </Grid>
        </Grid>
      </Fade>
    </DarkThemeBackground>
  );
};

export default Menu;
