import React, { FC, useState } from 'react';
import { Box, FormControlLabel, Switch } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

// components
import UserHeader from '../../../components/userHeader/UserHeader';
import ButtonBack from '../../../components/buttonBack/ButtonBack';
import Background from '../../../components/background/Background';

// images
import avatarSkeleton from './images/avatar_skeleton.svg';
import eye from './images/eye.svg';
import eyeOff from './images/eye_off.svg';
import S from './images/S.svg';
import B from './images/B.svg';
import U from './images/U.svg';
import I from './images/I.svg';
import dots from './images/dots.svg';
import numbers from './images/numbers.svg';
import user from './images/user.svg';

// styles 
import styles from './styles.module.scss';

const CreateChatGroup: FC = () => {
  const navigate = useNavigate();
  const [checked, setChecked] = useState<boolean>(true);
  const StyledSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase': {
      '&.Mui-checked': {
        '& + .MuiSwitch-track': {
          backgroundColor: '#37366B',
          opacity: 1
        }
      }
    },
    '& .MuiSwitch-thumb': {
      backgroundColor: '#FFF'
    }
  }));

  const onButtonBackClick = () => {
    navigate(-1);
  };

  const handleChange = (e: any) => {
    setChecked(e.target.checked);
  };

  return (
    <div className={styles.conatiner}>
      <Background background={'#f0f0f3'} />
      <UserHeader/>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <Box sx={{ mb: 4 }}>
            <ButtonBack label={'Назад'} onClick={onButtonBackClick} color={'#37366B'} />
          </Box>
          <div className={styles.title}>Новая группа</div>
          <div className={styles.avatar_container}>
            <img src={avatarSkeleton} className={styles.avatar}/>
            <div className={styles.avatar_text}>
              Загрузите<br/>
              изображение группы
            </div>
          </div>
          <input className={styles.input} placeholder="Название группы"/>
          <div className={styles.discription_container}>
            <textarea 
              className={styles.discription}
              placeholder="Описание группы"
            />
            <div className={styles.toolbar}>
              <img src={B} className={styles.toolbar_item}/>
              <img src={I} className={styles.toolbar_item}/>
              <img src={U} className={styles.toolbar_item}/>
              <img src={S} className={styles.toolbar_item}/>
              <img src={dots} className={styles.toolbar_item}/>
              <img src={numbers} className={styles.toolbar_item}/>
            </div>
          </div>
          <div className={styles.toolbar_button}>
            <div className={styles.toolbar_text}>
              {checked
                ? (
                  <React.Fragment>
                    <img src={eye} className={styles.toolbar_icon}/> 
                    <span>
                      Публичная
                    </span>
                  </React.Fragment>
                )
                : (
                  <React.Fragment>
                    <img src={eyeOff} className={styles.toolbar_icon}/> 
                    <span style={{ color: '#ABB0B2' }}>
                      Приватная
                    </span>
                  </React.Fragment>
                )}
            </div>
            <FormControlLabel
              checked={checked}
              onChange={handleChange}
              control={<StyledSwitch/>}
              label
            />
          </div>
          <div className={styles.toolbar_button}>
            <div className={styles.toolbar_text}>
              <img src={user} className={styles.toolbar_icon}/> 
              <span>
                Пригласить пользователей
              </span>
            </div>
          </div>
        </div>
        <button className={styles.button}>
          Создать группу
        </button>
      </div>
    </div>
  );
};

export default CreateChatGroup;
