import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

// styles
import styles from './styles.module.scss';

// routes 
import { routes } from '../../../routes';

const Answer: FC = () => {
  const navigate = useNavigate();

  const navigateToAnswer = () => {
    navigate(routes.ChatQuestions);
  };

  return (
    <div className={styles.container} onClick={navigateToAnswer}>
      <div className={styles.wrapper}>
        <div className={styles.avatar}>
          <img src="./__mocks__/images/person_1.jpg"/>
        </div>
        <div className={styles.name}>
          Алексей Пивоваров ответила на ваш вопрос:
          Длинное название темы
        </div>
        <div className={styles.date}>
          01.10.21
        </div>
      </div>
    </div>
  );
};

export default Answer;
