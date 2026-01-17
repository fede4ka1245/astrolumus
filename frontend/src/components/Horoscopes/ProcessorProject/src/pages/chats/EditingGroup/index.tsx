import React, { FC, useState } from 'react';
import { Grid, FormControlLabel, Switch } from '@mui/material';
import { styled } from '@mui/material/styles';
import UserHeader from '../../../components/userHeader/UserHeader';
import ButtonBack from '../../../components/buttonBack/ButtonBack';
import Background from '../../../components/background/Background';
import group from '../__mocks__/images/group.png';
import eye from './images/eye.svg';
import eyeOff from './images/eye_off.svg';
import S from './images/S.svg';
import B from './images/B.svg';
import U from './images/U.svg';
import I from './images/I.svg';
import dots from './images/dots.svg';
import numbers from './images/numbers.svg';
import user from './images/user.svg';
import styles from './styles.module.scss';
import { useNavigateBack } from '../../../hooks/useNavigateBack';

const EditingGroup: FC = () => {
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

  const onButtonBackClick = useNavigateBack();

  const handleChange = (e: any) => {
    setChecked(e.target.checked);
  };

  return (
    <div className={styles.conatiner}>
      <Background background={'#f0f0f3'} />
      <UserHeader/>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <Grid sx={{ mb: 4 }} display="flex" alignItems="center" justifyContent="space-between">
            <ButtonBack label={'Назад'} onClick={onButtonBackClick} color={'#37366B'} />
            <div className={styles.delete}>
              Удалить группу
            </div>
          </Grid>
          <div className={styles.title}>Ваша группа</div>
          <div className={styles.avatar_container}>
            <img src={group} className={styles.avatar}/>
            <div className={styles.edit_button}>
              <svg width="11" height="15" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M6.42246 1.69212C6.87095 0.917289 7.76052 0.82836 8.53609 1.27674L9.29889 1.71815C10.0745 2.16652 10.442 2.98026 9.99374 3.75658L4.95113 12.4815C4.78269 12.7736 4.49056 12.9733 4.15693 13.0243L1.91001 13.4621L1.3059 11.376C1.18418 11.0622 1.21152 10.7099 1.37986 10.4171L6.42246 1.69212Z" stroke="#37366B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <input className={styles.input} placeholder="Название группы" value="Группа А555"/>
          <div className={styles.discription_container}>
            <textarea 
              value="Мощный инструмент для профессионального астролога, лёгкий в изучении и удобный в применении для начинающего астролога."
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
          Сохранить
        </button>
      </div>
    </div>
  );
};

export default EditingGroup;
