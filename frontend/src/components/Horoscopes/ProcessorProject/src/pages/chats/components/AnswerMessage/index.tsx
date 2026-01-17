import { FC, useState } from 'react';

// images
import avatar from '../../__mocks__/images/person_1.jpg';

import styles from './styles.module.scss';

const AnswerMessage: FC = () => {
  const [isOpenAnswer, setIsOpenAnser] = useState<boolean>(false);

  const onOpen = () => {
    setIsOpenAnser(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.expert}>
        <div className={styles.expert_title}>Ответ эксперта</div>
        <img src={avatar} className={styles.expert_avatar}/>
        <div className={styles.expert_name}>Наталья Хвизюк</div>
      </div>
      <div className={styles.text} style={!isOpenAnswer ? { filter: 'blur(2px)' } : {}}>
        Меня волнует один вопрос - когда я пробую создать прогноз на политическое событие - у меня не рождается идей, как можно это провернуть, можете подсказать мне варианты решения проблемы, пожалуйста?
      </div>
      {
        !isOpenAnswer && (
          <button className={styles.button} onClick={onOpen}>
            Прочитать ответ за 5$
          </button>
        )
      }
      <div className={styles.subtitle}>
        Прочитало 21 человек
      </div>
    </div>
  );
};

export default AnswerMessage;
