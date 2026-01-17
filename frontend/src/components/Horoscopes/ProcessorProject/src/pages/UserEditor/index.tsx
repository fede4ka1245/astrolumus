import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button as MuiButton, Grid, Typography } from '@mui/material';
import { getUserShortInfo } from '../../store/reducers/userReducer';
import { useAppDispatch } from '../../store/store';
import { setIsAppLoading } from '../../store/reducers/preferencesReducer';
import dataURLtoFile from '../../helpers/dataURLtoFile';
import Background from '../../components/background/Background';
import ProfilePhoto from '../../components/profilePhoto/ProfilePhoto';
import Input from '../../components/input/Input';
import { InputStyle } from '../../components/input/InputStyle';
import { InputType } from '../../components/input/InputType';
import UserHeader from '../../components/userHeader/UserHeader';
import ButtonBack from '../../components/buttonBack/ButtonBack';
import Button from '../../components/button/Button';
import { ButtonType } from '../../components/button/ButtonProps';
import UserPhoto from './components/UserPhoto';
import UserCertificate from './components/UserCertificate';
import { ILocalUserFile, IUserFile, IUserProfile } from '../../models/interfaces/user';
import { UserFileTypes } from '../../models/enums/user';
import authRequest from '../../api/authRequest';
import { userFilesApi, userProfileApi } from '../../api/user';
import { routes } from '../../models/enums/routes';
import { getUserFiles } from '../../api/getUserFiles';
import { useLogout } from '../../hooks/useLogout';
import { useDeleteAccount } from '../../hooks/useDeleteAccount';
import { useNavigateBack } from '../../hooks/useNavigateBack';

const UserEdit = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [userInfo, setUserInfo] = useState<IUserProfile>({
    id: 0,
    user: 0,
    first_name: '',
    last_name: '',
    birth_date: '',
    email: '',
    avatar: null,
    about: '',
    likes_count: 0,
    subscribers_count: 0
  });
  const [photos, setPhotos] = useState<IUserFile[]>([]);
  const [certificates, setCertificates] = useState<IUserFile[]>([]);
  const back = useNavigateBack();

  useEffect(() => {
    getUserFullInfo();
    dispatch(getUserShortInfo());
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

  const getUserFullInfo = useCallback(() => {
    dispatch(setIsAppLoading(true));
    authRequest.get(userProfileApi(1))
      .then(res => {
        setUserInfo(res.data);
        getFiles(UserFileTypes.certificate, res.data.user);
        getFiles(UserFileTypes.photo, res.data.user);
      })
      .finally(() => {
        dispatch(setIsAppLoading(false));
      });
  }, [dispatch, getFiles]);

  const addToFormData = useCallback(() => {
    const formData = new FormData();
    if (userInfo) {
      const info: any = { ...userInfo, avatar: dataURLtoFile(userInfo.avatar, 'image') };
      for (const key in info) {
        if (info[key]) {
          formData.append(key, info[key]);
        }
      }
    }
    return formData;
  }, [userInfo]);

  const saveChanges = useCallback(() => {
    dispatch(setIsAppLoading(true));
    const data = addToFormData();
    authRequest.post(userProfileApi(), data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(res => {
        navigate(routes.user + userInfo.user);
        dispatch(getUserShortInfo());
      })
      .finally(() => dispatch(setIsAppLoading(false)));
  }, [addToFormData, dispatch, navigate, userInfo.user]);

  const addFile = useCallback((file: ILocalUserFile) => {
    dispatch(setIsAppLoading(true));
    authRequest.post(userFilesApi(), file, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(res => {
        getFiles(file.file_type, userInfo.user);
      })
      .finally(() => dispatch(setIsAppLoading(false)));
  }, [dispatch, getFiles, userInfo.user]);

  const deleteFile = useCallback((id: number, fileType: UserFileTypes) => {
    dispatch(setIsAppLoading(true));
    authRequest.delete(userFilesApi(id))
      .then(() => getFiles(fileType, userInfo.user))
      .finally(() => dispatch(setIsAppLoading(false)));
  }, [dispatch, getFiles, userInfo.user]);
  
  const selectUserAvatar = useCallback((value: string) => {
    setUserInfo((prevState) => ({ ...prevState, avatar: value }));
  }, []);

  const logout = useLogout();

  const logoutHandler = useCallback(() => {
    const isConfirmed = confirm('Вы уверены, что хотите выйти?');
    
    if (isConfirmed) {
      logout();
    }
  }, [logout]);

  const deleteAccount = useDeleteAccount();

  if (!userInfo) {
    return (
      <>
        <Background background={'#f0f0f3'} />
        <UserHeader />
      </>
    );
  }

  return (
    <>
      <Background background={'#f0f0f3'} />
      <UserHeader />
      <Grid container direction={'column'} pl={2} pr={2}>
        <Grid container justifyContent={'space-between'}>
          <Grid item>
            <ButtonBack color={'#37366b'} label={'Назад'} onClick={back} />
          </Grid>
        </Grid>
        <Grid item pt={2}>
          <ProfilePhoto
            avatar={userInfo.avatar}
            onSelectAvatar={selectUserAvatar}
          />
        </Grid>
        <Grid pt={2} item container width={'100%'} rowSpacing={2}>
          <Grid item width={'100%'}>
            <Input
              value={userInfo.first_name}
              onChange={(value) => setUserInfo(prevState => ({
                ...prevState,
                first_name: value
              }))}
              placeholder={'Имя'}
              inputStyle={InputStyle.outlined}
            />
          </Grid>
          <Grid item width={'100%'}>
            <Input
              value={userInfo.last_name}
              onChange={(value) => setUserInfo(prevState => ({
                ...prevState,
                last_name: value
              }))}
              placeholder={'Фамилия'}
              inputStyle={InputStyle.outlined}
            />
          </Grid>
          <Grid item width={'100%'}>
            <Input
              value={userInfo.birth_date ? userInfo.birth_date.split('-').reverse().join('.') : ''}
              onChange={(value) => setUserInfo(prevState => ({
                ...prevState,
                birth_date: value.split('.').reverse().join('-')
              }))}
              placeholder={'Дата Рождения'}
              inputStyle={InputStyle.outlined}
              inputType={InputType.date}
            />
          </Grid>
        </Grid>
        <Grid item display={'flex'} alignItems={'center'} pt={2} pb={2}>
          <Grid borderRadius={'50%'} height={'15px'} width={'15px'} sx={{ background: '#37366b' }} />
          <Typography color={'#37366b'} letterSpacing={'0.1em'} textTransform={'uppercase'} fontFamily={'Gilroy'} fontWeight={700} pl={1}>
            Контакты
          </Typography>
        </Grid>
        <Grid item container width={'100%'} rowSpacing={2}>
          <Grid item width={'100%'}>
            <Input
              value={userInfo.email}
              onChange={(value) => setUserInfo(prevState => ({
                ...prevState,
                email: value
              }))}
              placeholder={'Email'}
              disabled
              inputStyle={InputStyle.outlined}
            />
          </Grid>
        </Grid>
        <Grid item display={'flex'} alignItems={'center'} pt={2} pb={2}>
          <Grid borderRadius={'50%'} height={'15px'} width={'15px'} sx={{ background: '#37366b' }} />
          <Typography color={'#37366b'} letterSpacing={'0.1em'} textTransform={'uppercase'} fontFamily={'Gilroy'} fontWeight={700} pl={1}>
            Расскажите о себе
          </Typography>
        </Grid>
        <Grid>
          <Input 
            minHeight={100}
            value={userInfo.about}
            onChange={(value) => setUserInfo(prevState => ({
              ...prevState,
              about: value
            }))}
            inputStyle={InputStyle.outlined}
            inputType={InputType.textareaAutosize} 
            placeholder={'Расскажите о себе пару предложений, \n' +
            'соблюдайте этику общения'}/>
        </Grid>
        <Grid item display={'flex'} alignItems={'center'} pt={2} pb={2}>
          <Grid borderRadius={'50%'} height={'15px'} width={'15px'} sx={{ background: '#37366b' }} />
          <Typography color={'#37366b'} letterSpacing={'0.1em'} textTransform={'uppercase'} fontFamily={'Gilroy'} fontWeight={700} pl={1}>
            Добавить фото
          </Typography>
        </Grid>
        <UserPhoto 
          photos={photos} 
          addFile={addFile}
          deleteFile={deleteFile}/>
        <Grid item display={'flex'} alignItems={'center'} pt={2} pb={2}>
          <Grid borderRadius={'50%'} height={'15px'} width={'15px'} sx={{ background: '#37366b' }} />
          <Typography color={'#37366b'} letterSpacing={'0.1em'} textTransform={'uppercase'} fontFamily={'Gilroy'} fontWeight={700} pl={1}>
            Добавить сертификаты
          </Typography>
        </Grid>
        <UserCertificate 
          certificates={certificates} 
          deleteFile={deleteFile}
          addFile={addFile}/>
        {/* <Typography color={'black'} fontFamily={'Gilroy'} fontWeight={700} pt={2}> */}
        {/*  Уведомления */}
        {/* </Typography> */}
        {/* <Grid pt={2}> */}
        {/*  <Grid item container direction={'row'} alignItems={'center'} justifyContent={'space-between'}> */}
        {/*    <Typography fontFamily={'Gilroy'} fontWeight={400} fontSize={16} color={'black'} textAlign={'left'}> */}
        {/*      Уведомления от пользователей */}
        {/*    </Typography> */}
        {/*    <Grid item> */}
        {/*      <Switch/> */}
        {/*    </Grid> */}
        {/*  </Grid> */}
        {/*  <Grid item container direction={'row'} alignItems={'center'} justifyContent={'space-between'}> */}
        {/*    <Typography fontFamily={'Gilroy'} fontWeight={400} fontSize={16} color={'black'} textAlign={'left'}> */}
        {/*      Сертификаты */}
        {/*    </Typography> */}
        {/*    <Grid item> */}
        {/*      <Switch/> */}
        {/*    </Grid> */}
        {/*  </Grid> */}
        {/*  <Grid item container direction={'row'} alignItems={'center'} justifyContent={'space-between'}> */}
        {/*    <Typography fontFamily={'Gilroy'} fontWeight={400} fontSize={16} color={'black'} textAlign={'left'}> */}
        {/*      Календарь */}
        {/*    </Typography> */}
        {/*    <Grid item> */}
        {/*      <Switch/> */}
        {/*    </Grid> */}
        {/*  </Grid> */}
        {/*  <Grid item container direction={'row'} alignItems={'center'} justifyContent={'space-between'}> */}
        {/*    <Typography fontFamily={'Gilroy'} fontWeight={400} fontSize={16} color={'black'} textAlign={'left'}> */}
        {/*      Астропроцессор */}
        {/*    </Typography> */}
        {/*    <Grid item> */}
        {/*      <Switch/> */}
        {/*    </Grid> */}
        {/*  </Grid> */}
        {/*  <Grid item container direction={'row'} alignItems={'center'} justifyContent={'space-between'}> */}
        {/*    <Typography fontFamily={'Gilroy'} fontWeight={400} fontSize={16} color={'black'} textAlign={'left'}> */}
        {/*      Форум */}
        {/*    </Typography> */}
        {/*    <Grid item> */}
        {/*      <Switch/> */}
        {/*    </Grid> */}
        {/*  </Grid> */}
        {/* </Grid> */}
        <Grid mt={5} mb={5}>
          <Button type={ButtonType.gradient} text={'Сохранить'} onClick={saveChanges}/>
        </Grid>
        <Grid mb={1}>
          <MuiButton fullWidth onClick={logoutHandler} variant="outlined" size="large" color="error">
            Выйти
          </MuiButton>
        </Grid>
        <Grid mb={2}>
          <MuiButton fullWidth onClick={deleteAccount} variant="outlined" size="large" color="error">
            Удалить аккаунт
          </MuiButton>
        </Grid>
      </Grid>
    </>
  );
};

export default UserEdit;
