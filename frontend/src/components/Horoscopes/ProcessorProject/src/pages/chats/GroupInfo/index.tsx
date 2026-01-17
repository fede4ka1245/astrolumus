import { FC } from 'react';
import classnames from 'classnames';
import { Grid } from '@mui/material';

// components
import GroupChatHeader from '../components/GroupChatHeader';
import User from './components/User';
// styles 
import styles from './styles.module.scss';

const GroupInfo: FC = () => {
  return (
    <div className={styles.container}>
      <GroupChatHeader/>
      <div className={styles.content}>
        <div className={styles.title}>
          Информация о группе
        </div>
        <div className={styles.subtitle}>
          Мощный инструмент для профессионального астролога, лёгкий в изучении и удобный в применении для начинающего астролога.
        </div>
        <div className={styles.buttons}>
          <div className={styles.info_button}>
            Пользователи (300)
          </div>
          <div className={classnames(styles.info_button, styles.purple_info_button)}>
            Запросы доступа (30)
          </div>
        </div>
        <Grid display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2.5 }}>
          <Grid display="flex" alignItems="center">
            <div className={styles.add_button}>
              <svg width="19" height="21" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="5.75806" y="1" width="7.89247" height="7.89247" rx="3.94624" stroke="#37366B" strokeWidth="2"/>
                <path d="M10.3225 11.7473L8.80062 11.7473C4.86062 11.7473 1.66663 14.9413 1.66663 18.8813V18.8813C1.66663 19.0389 1.79439 19.1667 1.95199 19.1667H9.70426H10.3225" stroke="#37366B" strokeWidth="2" strokeLinecap="round"/>
                <path d="M14.3414 12.3655V19.1666" stroke="#37366B" strokeWidth="2" strokeLinecap="round"/>
                <path d="M17.7418 15.7662L10.9407 15.7662" stroke="#37366B" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>
                Добавить в группу
              </span>
            </div>
            <div className={styles.delete_button}>
              <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.33337 8.16667V13.1667M9.66671 8.16667V13.1667M1.33337 4.83333H14.6667M13.8334 4.83333L13.1109 14.9517C13.0809 15.3722 12.8928 15.7657 12.5843 16.053C12.2758 16.3403 11.8699 16.5 11.4484 16.5H4.55171C4.13016 16.5 3.72426 16.3403 3.41578 16.053C3.10729 15.7657 2.91914 15.3722 2.88921 14.9517L2.16671 4.83333H13.8334ZM10.5 4.83333V2.33333C10.5 2.11232 10.4122 1.90036 10.256 1.74408C10.0997 1.5878 9.88772 1.5 9.66671 1.5H6.33337C6.11236 1.5 5.9004 1.5878 5.74412 1.74408C5.58784 1.90036 5.50004 2.11232 5.50004 2.33333V4.83333H10.5Z" stroke="#F15024" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </Grid>
          <div className={styles.select_button}>
            Выбрать все
          </div>
        </Grid>
        <div className={styles.user_list}>
          <User/>
        </div>
      </div>
    </div>
  );
};

export default GroupInfo;
