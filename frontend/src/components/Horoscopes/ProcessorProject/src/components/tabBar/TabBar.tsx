import { useCallback } from 'react';
import styles from './TabBar.module.scss';
import { Grid, Link } from '@mui/material';
import add from './images/add.png';
import Modal from '../modal/Modal';
import background from './images/galaxyBackground.png';
import TransparentButton from '../transparentButton/TransparentButton';
import forum from '../../pages/menu/images/forum.svg';
import close from './images/close.svg';
import Chats from './Chats';
import Courses from './Courses';
import Forum from './Forum';
import Processor from './Processor';
import { useLocation, useNavigate } from '../../contexts/NavigationContext';
import { matchPath } from 'react-router-dom';
import { routes } from '../../models/enums/routes';
import classNames from 'classnames';
import telegram from './images/telegram.svg';
import email from './images/email.svg';
import { useAppSelector } from '../../store/store';
import { useGetAppAccess } from '../../store/selectors';
import { triggerForumRestrictionBanner } from '../../helpers/triggerForumResrictionBanner';
import IconButton from '../iconButton/IconButton';
import { useSearchParamsState } from '../../hooks/useSearchParamsState';
import { logFirebaseEvent } from '../../helpers/firebase';
import { FirebaseEvent } from '../../helpers/firebase/firebaseEvent';
import { getIsForumEnabled } from '../../helpers/getIsForumEnabled';

const TabBar = () => {
  const [isModalOpen, setIsModalOpen] = useSearchParamsState('isTabBarModalOpen', false, false);
  const [isOpenContacts, setIsOpenContacts] = useSearchParamsState('isTabBarOpenContacts', false, false);
  const { appInfo } = useAppSelector(state => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const appAccess = useGetAppAccess();
  const isForumEnabled = getIsForumEnabled();

  const toggleModal = useCallback(() => {
    if (isModalOpen) {
      navigate(-1);
    } else {
      setIsModalOpen(true);
    }
  }, [isModalOpen, setIsModalOpen]);

  const onNewTopicClick = useCallback(() => {
    if (appAccess.isForumRestricted) {
      triggerForumRestrictionBanner();
      return;
    }

    navigate(routes.topicCreator);
  }, [appAccess.isForumRestricted, navigate]);

  const onChatsClick = useCallback(() => {
    if (matchPath(routes.messages, location.pathname)) {
      return;
    }

    navigate(routes.messages);
  }, [location.pathname, navigate]);

  const onProcessorClick = useCallback(() => {
    if (matchPath(routes.astrologicalProcessor, location.pathname)) {
      return;
    }

    logFirebaseEvent({ name: FirebaseEvent.openProcessorBottomMenu });

    navigate(routes.astrologicalProcessor);
  }, [location.pathname, navigate]);

  const onForumClick = useCallback(() => {
    if (appAccess.isForumRestricted) {
      triggerForumRestrictionBanner();
      return;
    }

    if (matchPath(routes.forum, location.pathname)) {
      return;
    }

    navigate(routes.forum);
  }, [appAccess.isForumRestricted, location.pathname, navigate]);

  const onMenuClick = useCallback(() => {
    if (appAccess.isForumRestricted) {
      triggerForumRestrictionBanner();
      return;
    }

    if (matchPath(routes.main, location.pathname)) {
      return;
    }

    navigate(routes.main);
  }, [appAccess.isForumRestricted, location.pathname, navigate]);

  // const onGroupClick = () => {
  //   navigate(chatsRoutes.CreateChatGroup);
  //   toggleModal();
  // };

  const openMessangers = useCallback(() => {
    setIsOpenContacts(true);
    setIsModalOpen(false, true);
  }, [setIsModalOpen]);

  const closeMessangers = useCallback(() => {
    navigate(-1);
  }, []);

  return (
    <div className={styles.tabBar}>
      <Grid
        container
        direction={'row'}
        height={'100%'}
        width={'100%'}
        justifyContent={'space-around'}
        alignItems={'center'}
      >
        <Grid item>
          <IconButton onClick={onMenuClick} fillStyle={{ width: '58px', height: '58px' }}>
            <div className={classNames({ [styles.active]: location.pathname === routes.main })}>
              <Courses />
            </div>
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton onClick={onProcessorClick} fillStyle={{ width: '58px', height: '58px' }}>
            <div className={classNames({ [styles.active]: location.pathname.includes(routes.astrologicalProcessor) })}>
              <Processor />
            </div>
          </IconButton>
        </Grid>
        {isForumEnabled && (
          <>
            <Grid item>
              <img src={add} alt='add' width={50} height={50} onClick={toggleModal}/>
            </Grid>
            <Grid item>
              <IconButton onClick={onForumClick} fillStyle={{ width: '58px', height: '58px' }}>
                <div className={classNames({ [styles.active]: location.pathname.includes(routes.forum) })}>
                  <Forum />
                </div>
              </IconButton>
            </Grid>
          </>
        )}
        <Grid item>
          <IconButton onClick={onChatsClick} fillStyle={{ width: '58px', height: '58px' }}>
            <div className={classNames({ [styles.active]: location.pathname.includes(routes.messages) })}>
              <Chats />
            </div>
          </IconButton>
        </Grid>
      </Grid>
      <Modal isOpen={isOpenContacts} close={closeMessangers} height={'120px'}>
        <Grid display={'flex'} flexDirection={'column'} pl={2} pr={2} pt={3} position={'relative'}>
          <Grid display={'flex'} justifyContent={'space-between'} mb={2}>
            <Link 
              href={appInfo.email ? `mailto:${appInfo.email}` : ''}
              width={'calc(50% - 10px)'} bgcolor={'#FFF'} height={'40px'} borderRadius={'10px'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
              <img src={email} width={40} height={35}/>
            </Link> 

            <Link 
              href={appInfo.telegram ?? ''}
              width={'calc(50% - 10px)'} bgcolor={'#26A5E5'} height={'40px'} borderRadius={'10px'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
              <img src={telegram} width={24} height={20}/>
            </Link> 
          </Grid>
          {/* <Grid display={'flex'} justifyContent={'space-between'} mb={2}>
            <Link
              href="https://www.youtube.com/@astrology-forecasts"
              width={'calc(50% - 10px)'} bgcolor={'#59267c'} height={'40px'} borderRadius={'10px'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
              <img src={youtube}/>
            </Link>
            <Link
              href="https://www.youtube.com/@astrology-forecasts"
              width={'calc(50% - 10px)'} bgcolor={'#FFF'} height={'40px'} borderRadius={'10px'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
              <img src={youtube}/>
            </Link>
          </Grid> */}
        </Grid>
        <img onClick={closeMessangers} src={close} width={25} height={25} style={{ position: 'absolute', left: 'calc(50% - 12.5px)', bottom: '20px' }}/>
        <img src={background} width={'100%'} height={'100%'} style={{ margin: 0, padding: 0, overflow: 'hidden', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: -1 }}/>
      </Modal>
      <Modal isOpen={isModalOpen} close={toggleModal} height={'255px'}>
        <Grid display={'flex'} flexDirection={'column'} pl={2} pr={2} pt={3} position={'relative'}>
          <Grid display={'flex'} justifyContent={'space-between'}>
            {isForumEnabled && (
              <Grid width={'calc(50% - 10px)'} pb={2}>
                <TransparentButton image={<svg width="75" height="75" viewBox="0 0 532 532" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M21.5 449C21.5 411.721 51.7208 381.5 89 381.5C126.279 381.5 156.5 411.721 156.5 449C156.5 486.279 126.279 516.5 89 516.5C51.7208 516.5 21.5 486.279 21.5 449ZM89 396.5C60.0051 396.5 36.5 420.005 36.5 449C36.5 477.995 60.0051 501.5 89 501.5C117.995 501.5 141.5 477.995 141.5 449C141.5 420.005 117.995 396.5 89 396.5Z" fill="white"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M20 266C20 130.138 130.138 20 266 20C401.862 20 512 130.138 512 266C512 401.862 401.862 512 266 512C220.547 512 177.973 499.673 141.439 478.179C138.126 484.12 133.833 489.44 128.778 493.92C168.842 518.092 215.797 532 266 532C412.908 532 532 412.908 532 266C532 119.092 412.908 0 266 0C119.092 0 0 119.092 0 266C0 319.375 15.7209 369.079 42.7849 410.733C47.0996 405.528 52.2767 401.064 58.0973 397.56C33.9702 359.512 20 314.387 20 266Z" fill="white"/>
                </svg>} label={'Новая тема'} onClick={onNewTopicClick} isSquare={true}/>
              </Grid>
            )}
            <Grid width={isForumEnabled ? 'calc(50% - 10px)' : '100%'} pb={2}>
              <TransparentButton image={<img src={forum}/>} label={'Написать в школу'} onClick={openMessangers} isSquare={true}/>
            </Grid>
          </Grid>
        </Grid>
        <img onClick={toggleModal} src={close} width={25} height={25} style={{ position: 'absolute', left: 'calc(50% - 12.5px)', bottom: '20px' }}/>
        <img src={background} width={'100%'} height={'100%'} style={{ margin: 0, padding: 0, overflow: 'hidden', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: -1 }}/>
      </Modal>
    </div>
  );
};

export default TabBar;
