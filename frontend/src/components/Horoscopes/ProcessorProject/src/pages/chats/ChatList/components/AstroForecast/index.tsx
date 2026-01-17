import { FC } from 'react';

// styles
import styles from './styles.module.scss';

const AstroForecast: FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <img src="./__mocks__/images/person_1.jpg" className={styles.avatar}/>
          <div className={styles.name}>
            Алексей Пивоваров сделал новый прогноз для
            Иванова Татьяна
          </div>
        </div>
        <div className={styles.title}>
          Длинное название темы
        </div>
        <div className={styles.button}>
          Посмотреть прогноз
        </div>
        <div className={styles.subtitle}>
          Сделать собстенный прогноз
        </div>
      </div>
    </div>
  );
};

export default AstroForecast;
