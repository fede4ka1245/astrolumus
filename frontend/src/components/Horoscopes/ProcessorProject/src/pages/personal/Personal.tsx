import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './Personal.module.scss';
import { Grid, Typography } from '@mui/material';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import ProfilePhoto from '../../components/profilePhoto/ProfilePhoto';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../models/enums/routes';
import { InputStyle } from '../../components/input/InputStyle';
import { InputType } from '../../components/input/InputType';
import { setUserInfo } from '../../store/reducers/userReducer';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { useHideNavbar } from '../../hooks/useHideNavbar';
import { useGetAvatar } from '../../store/selectors';
import Background from '../../components/background/Background';

const Personal = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [email, setEmail] = useState('');
  const userInfo = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const avatar = useGetAvatar();

  const isSaveButtonDisabled = useMemo(() => {
    return !(firstName && lastName && birthday && email);
  }, [name, lastName, birthday, email]);

  const navigate = useNavigate();

  const onButtonSaveClick = useCallback(() => {
    // dispatch(setUserInfo({
    //   email,
    //   lastName,
    //   birthday,
    //   avatar
    // }));

    navigate(routes.menu);
  }, [firstName, email, lastName, birthday, dispatch, navigate, avatar]);

  useHideNavbar();

  // useEffect(() => {
  //   // setFirstName(userInfo?.firstName as string);
  //   // setEmail(userInfo?.email as string);
  //   // setBirthday(userInfo?.birthday as string);
  //   // setLastName(userInfo?.lastName as string);
  // }, [userInfo]);

  return (
    <div className={styles.main}>
      <Background background={'#F0F0F3'} />
      <Grid container direction={'column'} pl={2} pr={2} pt={4} spacing={4} height={'100%'}>
        <Grid item>
          <Typography fontFamily={'Playfair'} fontSize={24}>
            Заполните профиль
          </Typography>
        </Grid>
        <Grid item>
          {/* <ProfilePhoto /> */}
        </Grid>
        <Grid item container width={'100%'} rowSpacing={2}>
          <Grid item width={'100%'}>
            <Input
              placeholder={'Имя'}
              inputStyle={InputStyle.outlined}
              value={firstName}
              onChange={(value) => setFirstName(value)}
            />
          </Grid>
          <Grid item width={'100%'}>
            <Input
              placeholder={'Фамилия'}
              inputStyle={InputStyle.outlined}
              value={lastName}
              onChange={(value) => setLastName(value)}
            />
          </Grid>
          <Grid item width={'100%'}>
            <Input
              placeholder={'Дата Рождения'}
              inputStyle={InputStyle.outlined}
              inputType={InputType.date}
              value={birthday}
              onChange={(value) => setBirthday(value)}
            />
          </Grid>
        </Grid>
        <Grid item>
          <Typography fontFamily={'Playfair'} fontSize={24}>
            Контакты
          </Typography>
        </Grid>
        <Grid item container width={'100%'} rowSpacing={2}>
          {/* <Grid item width={'100%'}>
            <Input
              placeholder={'Телефон'}
              inputStyle={InputStyle.outlined}
              inputType={InputType.phone}
              value={phone}
              onChange={(value) => setPhone(value)}
            />
          </Grid> */}
          <Grid item width={'100%'}>
            <Input
              placeholder={'Email'}
              inputStyle={InputStyle.outlined}
              value={email}
              onChange={(value) => setEmail(value)}
            />
          </Grid>
        </Grid>
        <Grid item marginTop={'auto'}>
          <Button text='Сохранить' isDisabled={isSaveButtonDisabled} onClick={onButtonSaveClick}/>
        </Grid>
      </Grid>
    </div>
  );
};

export default Personal;
