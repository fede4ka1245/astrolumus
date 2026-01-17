import { FC } from 'react';

import styles from './styles.module.scss';

const MiniCourseCard: FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.title}>
          Мини-курс<br/>
          «ПОЕХАЛИ!»
        </div>
        <div className={styles.subtitles}>
          <p className={styles.subtitle}>
            6 уроков видео <span style={{ color: '#F9F9F9' }}>в записи</span>
          </p>
          <p className={styles.subtitle}>
            23 мая 2023г.
          </p>
          <p className={styles.subtitle}>
            Татьяной Калининой
          </p>
        </div>
        <div className={styles.discription}>
          Во время курса мы добавим вас в закрытый информационный чат Telegram,
          где вы сможете общаться с группой и кураторами. Куратор курса с вами на
          связи на учебной платформе и готов ответить на ваши вопросы.
        </div>
        <div className={styles.price}>
          2 590 RUB
        </div>
        <div className={styles.button}>
          оплатить
        </div>
        <div className={styles.button_transparent}>
          Задать вопрос
        </div>
      </div>
    </div>
  );
};

export default MiniCourseCard;
