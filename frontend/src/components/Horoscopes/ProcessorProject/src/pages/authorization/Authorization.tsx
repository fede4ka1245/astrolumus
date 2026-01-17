import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowBack } from '@mui/icons-material';
import { validate } from 'email-validator';
import { Grid, IconButton, Link, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import { useHideNavbar } from '../../hooks/useHideNavbar';
import { useAppDispatch } from '../../store/store';
import { setIsAppLoading, setIsAuthenticated, setIsNewUser } from '../../store/reducers/preferencesReducer';
import { getUserShortInfo } from '../../store/reducers/userReducer';
import { userRegistration } from '../../api/userRegistration';
import { userValidateLoginCode } from '../../api/userValidateLoginCode';
import { userGenerateLoginCode } from '../../api/userGenerateLoginCode';
import { LocalStorageKey } from '../../models/enums/LocalStorageKey';
import { routes } from '../../models/enums/routes';
import styles from './Authorization.module.scss';
import DarkThemeBackground from '../../components/darkThemeBackground/DarkThemeBackground';
import Modal from '../../components/modal/Modal';
import emailImage from '../../components/tabBar/images/email.svg';
import telegram from '../../components/tabBar/images/telegram.svg';
import close from '../../components/tabBar/images/close.svg';
import background from '../../components/tabBar/images/galaxyBackground.png';
import { infoApi } from '../../api/info';
import axios from 'axios';
import DocumentModal from '../menu/DocumentModal';
import {
  AppTrackingTransparency
} from 'capacitor-plugin-app-tracking-transparency';
import { Device } from '@capacitor/device';
import { useSearchParamsState } from '../../hooks/useSearchParamsState';
import { FirebaseEvent } from '../../helpers/firebase/firebaseEvent';
import { logFirebaseEvent } from '../../helpers/firebase';

const Authorization = () => {
  const [name, setName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [email, setEmail] = useState('');
  const [passcode, setPasscode] = useState('');
  const [activePanel, setActivePanel] = useState<string>('auth');
  const [document, setDocument] = useSearchParamsState('document', {
    isModalOpen: false,
    documentCode: ''
  }, false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isNewUser = useRef<boolean>();

  useHideNavbar();

  const onEmailChange = useCallback((email: string) => {
    try {
      setEmail(email.replaceAll(' ', ''));
    } catch {
      setEmail(email);
    }
  }, []);

  const onRegistrationClick = useCallback(async () => {
    const deviceInfo = await Device.getInfo();

    if (deviceInfo.platform === 'ios') {
      const { status } = await AppTrackingTransparency.getStatus();

      if (status !== 'authorized') {
        const permissionResponse = await AppTrackingTransparency.requestPermission();
      }
    }

    dispatch(setIsAppLoading(true));

    userRegistration({
      name,
      secondName,
      email
    })
      .then(() => {
        setActivePanel('login-code');
        isNewUser.current = true;
      })
      .catch((error) => {
        if (error?.response?.data?.email) {
          alert(error?.response?.data?.email[0] || 'Oшибка при регистрации');
          return;
        }

        if (error?.response?.data?.message) {
          alert(error?.response?.data?.message || 'Oшибка при регистрации');
          return;
        }

        alert('Oшибка при регистрации');
      })
      .finally(() => {
        dispatch(setIsAppLoading(false));
      });
  }, [dispatch, email, name, secondName]);

  const onGenerateLoginCode = useCallback(() => {
    dispatch(setIsAppLoading(true));

    userGenerateLoginCode({ email })
      .then(() => {
        isNewUser.current = false;
        setActivePanel('login-code');
      })
      .catch((error) => {
        alert(error?.response?.data?.message || 'Oшибка при входе в акканут');
      })
      .finally(() => {
        dispatch(setIsAppLoading(false));
      });
  }, [dispatch, email]);

  const onEnterClick = useCallback(() => {
    dispatch(setIsAppLoading(true));

    if (/[a-zA-Z]/g.test(passcode)) {
      axios.post(`${import.meta.env.VITE_APP_API_URL}/api/token/`, {
        email,
        password: passcode
      }).then(({ data }) => {
        if (!data.access || !data.refresh) {
          return;
        }

        localStorage.setItem(LocalStorageKey.access, data.access);
        localStorage.setItem(LocalStorageKey.refresh, data.refresh);
        dispatch(getUserShortInfo());
        dispatch(setIsAuthenticated(true));
        navigate(routes.main, {
          replace: true
        });
      }).catch((error) => {
        alert(error?.response?.data?.message || 'Oшибка при входе в акканут');
      }).finally(() => {
        dispatch(setIsAppLoading(false));
      });
      return;
    }

    userValidateLoginCode({ email, password: passcode })
      .then(({ data }) => {
        if (!data.access || !data.refresh) {
          return;
        }

        localStorage.setItem(LocalStorageKey.access, data.access);
        localStorage.setItem(LocalStorageKey.refresh, data.refresh);
        dispatch(getUserShortInfo());
        dispatch(setIsAuthenticated(true));
        navigate(routes.main, {
          replace: true
        });

        if (isNewUser.current) {
          logFirebaseEvent({
            name: FirebaseEvent.registration
          });
          dispatch(setIsNewUser(true));
        }
      })
      .catch((error) => {
        alert(error?.response?.data?.message || 'Oшибка при входе в акканут');
      })
      .finally(() => {
        dispatch(setIsAppLoading(false));
      });
  }, [dispatch, email, navigate, passcode]);

  const [isCodeInstructionOpen, setIsCodeInstructionOpen] = useState(false);

  const onCodeClick = useCallback(() => {
    setIsCodeInstructionOpen(true);
  }, []);
  
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  
  const toggleContacts = useCallback(() => {
    setIsContactsOpen((isOpen) => !isOpen);
  }, []);
  
  const [appInfo, setAppInfo] = useState({
    email: 'deepsky.astrology@gmail.com',
    telegram: 'https://t.me/DeepSkySchoolBot'
  });
  
  useEffect(() => {
    axios.get(infoApi())
      .then(({ data }) => {
        setAppInfo(data);
      });
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

  const closeDocument = useCallback(() => {
    navigate(-1);
  }, []);

  return (
    <DarkThemeBackground fillBody backgroundVariant={'galaxy'}>
      <DocumentModal
        isOpen={document.isModalOpen}
        close={closeDocument}
        code={document.documentCode}
      />
      <Grid p={2} width={'100%'} height={'100%'} display={'flex'} flexDirection={'column'}>
        {activePanel === 'login' && <>
          <Grid container pt={5} alignItems={'center'}>
            <Grid item>
              <IconButton onClick={() => setActivePanel('auth')}>
                <ArrowBack style={{ color: 'white' }} />
              </IconButton>
            </Grid>
            <Grid item height={'20px'}>
              <Typography
                pl={2}
                fontWeight={'bold'}
                color={'white'}
                fontFamily={'Gilroy'}
                fontSize={'20px'}
              >
                Войти в аккаунт
              </Typography>
            </Grid>
          </Grid>
          <Grid item container width={'100%'} pt={3}>
            <Grid item width={'100%'}>
              <Input
                isError={!validate(email)}
                textError={'*'}
                placeholder={'Email'}
                value={email}
                onChange={onEmailChange}
                inputProps={{
                  spellCheck: 'false',
                  autoCorrect: 'off',
                  autoComplete: 'off',
                  autoCapitalize: 'off'
                }}
              />
            </Grid>
            <Typography
              textAlign={'start'}
              className={styles.button}
              mt={'18px'}
              pl={'5px'}
              color={'#FFF'}
              fontWeight={700}
              fontSize={'16px'}
              fontFamily={'Gilroy'}
              onClick={toggleContacts}
            >
              Обратная связь
            </Typography>
          </Grid>
          <Grid item pb={3} mt={'auto'}>
            <Button
              text='Войти'
              isDisabled={!validate(email)}
              onClick={onGenerateLoginCode}
            />
          </Grid>
        </>}
        {activePanel === 'auth' && (
          <>
            <Grid container display={'flex'} height={'40px'} mt={5} alignItems={'center'}>
              <Typography
                height={'20px'}
                pl={'5px'}
                fontWeight={'bold'}
                color={'white'}
                fontFamily={'Gilroy'}
                fontSize={'20px'}
              >
                Регистрация
              </Typography>
            </Grid>
            <Grid item container width={'100%'} pt={3}>
              <Grid item width={'100%'}>
                <Input
                  isError={!validate(email)}
                  textError={'*'}
                  placeholder={'Email'}
                  value={email}
                  onChange={onEmailChange}
                  inputProps={{
                    spellCheck: 'false',
                    autoCorrect: 'off',
                    autoComplete: 'off',
                    autoCapitalize: 'off'
                  }}
                />
              </Grid>
              <Grid item width={'100%'} pt={4}>
                <Input
                  isError={!name}
                  textError={'*'}
                  placeholder={'Имя'}
                  value={name}
                  onChange={setName}
                />
              </Grid>
              <Grid item width={'100%'} pt={2}>
                <Input
                  isError={!secondName}
                  placeholder={'Фамилия'}
                  textError={'*'}
                  value={secondName}
                  onChange={setSecondName}
                />
              </Grid>
            </Grid>
            <Typography
              textAlign={'start'}
              className={styles.button}
              mt={'18px'}
              pl={'5px'}
              color={'#FFF'}
              fontWeight={700}
              fontSize={'16px'}
              fontFamily={'Gilroy'}
              onClick={() => setActivePanel('login')}
            >
              Уже есть аккаунт
            </Typography>
            <Typography
              textAlign={'start'}
              className={styles.button}
              mt={'10px'}
              pl={'5px'}
              color={'#FFF'}
              fontWeight={700}
              fontSize={'16px'}
              fontFamily={'Gilroy'}
              onClick={toggleContacts}
            >
              Обратная связь
            </Typography>
            <Grid mt={'auto'} mb={2}>
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
            <Grid item pb={3}>
              <Button
                text='Зарегистрироваться'
                isDisabled={!(validate(email) && secondName && name)}
                onClick={onRegistrationClick}
              />
            </Grid>
          </>
        )}
        {activePanel === 'login-code' && <>
          <Grid container pt={5} alignItems={'center'}>
            <Grid item>
              <IconButton onClick={() => setActivePanel('auth')}>
                <ArrowBack style={{ color: 'white' }} />
              </IconButton>
            </Grid>
            <Grid item height={'20px'}>
              <Typography pl={2} fontWeight={'bold'} color={'white'} fontFamily={'Gilroy'} fontSize={'20px'}>
                Ввести код из письма
              </Typography>
            </Grid>
          </Grid>
          <Grid item container width={'100%'} pt={3}>
            <Grid item width={'100%'}>
              <Input
                placeholder={'Введите код из письма'}
                value={passcode}
                onChange={setPasscode}
                type={'password'}
              />
            </Grid>
          </Grid>
          <Typography
            textAlign={'start'}
            className={styles.button}
            mt={'18px'}
            pl={'5px'}
            color={'#FFF'}
            fontWeight={700}
            fontSize={'16px'}
            fontFamily={'Gilroy'}
            onClick={onCodeClick}
          >
            Не приходит код?
          </Typography>
          <Typography
            textAlign={'start'}
            className={styles.button}
            mt={'10px'}
            pl={'5px'}
            color={'#FFF'}
            fontWeight={700}
            fontSize={'16px'}
            fontFamily={'Gilroy'}
            onClick={toggleContacts}
          >
            Обратная связь
          </Typography>
          <Modal isOpen={isCodeInstructionOpen} close={() => setIsCodeInstructionOpen(false)} height={'calc(100vh - 160px)'}>
            <Grid p={2}>
              <Typography
                textAlign={'start'}
                pt={1}
                color={'black'}
                fontWeight={400}
                fontSize={'16px'}
                lineHeight={'16px'}
                fontFamily={'Gilroy'}
              >
                Обычно письмо с кодом приходит сразу же, но в редких случаях это может занять 2-5 минут из-за задержки на стороне почтового сервиса. Подождите. Если письмо с кодом не пришло в течение 5 минут, запросите новый код.
              </Typography>
              <Typography
                textAlign={'start'}
                pt={1}
                color={'black'}
                fontWeight={400}
                fontSize={'16px'}
                fontFamily={'Gilroy'}
                lineHeight={'16px'}
              >
                Если вам так и не пришел код для входа на электронную почту:<br/>
              </Typography>
              <Typography
                textAlign={'start'}
                mt={'18px'}
                color={'black'}
                fontWeight={400}
                fontSize={'16px'}
                fontFamily={'Gilroy'}
                lineHeight={'16px'}
              >
                - Убедитесь, что адрес электронной почты, который Вы указали при регистрации, правильный. <br/><br/>
                - Попробуйте проверить код в спаме или других папках. Чтобы письма не попадали в спам и не отсекались фильтром, добавьте deepsky.astrology@gmail.com в список своих контактов. <br/><br/>
                - Проверьте не установлены ли фильтры, настроенные на удаление входящих писем. <br/><br/>
                - Проверьте, может ли Ваш почтовый ящик нормально отправлять и получать электронную почту. <br/><br/>
                - Проверьте достаточно ли свободного места в вашем почтовом ящике. <br/>
              </Typography>
            </Grid>
          </Modal>
          <Grid item mt={'auto'} pb={3}>
            <Button
              text='Войти'
              isDisabled={!(passcode && email)}
              onClick={onEnterClick}
            />
          </Grid>
        </>}
        <Modal isOpen={isContactsOpen} close={toggleContacts} height={'120px'}>
          <Grid display={'flex'} flexDirection={'column'} pl={2} pr={2} pt={3} position={'relative'}>
            <Grid display={'flex'} justifyContent={'space-between'} mb={2}>
              <Link
                href={`mailto:${appInfo.email}` ?? ''}
                width={'calc(50% - 10px)'} bgcolor={'#FFF'} height={'40px'} borderRadius={'10px'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                <img src={emailImage} width={40} height={35}/>
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
          <img onClick={toggleContacts} src={close} width={25} height={25} style={{ position: 'absolute', left: 'calc(50% - 12.5px)', bottom: '20px' }}/>
          <img src={background} width={'100%'} height={'100%'} style={{ margin: 0, padding: 0, overflow: 'hidden', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: -1 }}/>
        </Modal>
      </Grid>
    </DarkThemeBackground>
  );
};

export default Authorization;
