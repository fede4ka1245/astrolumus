import { FC } from 'react';

// images
import avatar from '../../__mocks__/images/person_1.jpg';

import styles from './styles.module.scss';

const SomeoneMessage: FC = () => {
  return (
    <div className={styles.container}>
      <img className={styles.avatar} src={avatar}/>
      <div className={styles.text}>
        Меня волнует один вопрос - когда я пробую создать прогноз на политическое событие - у меня не рождается идей, как можно это провернуть, можете подсказать мне варианты решения проблемы, пожалуйста?
      </div>
      <div className={styles.time}>17.45</div>
    </div>
  );
};

export default SomeoneMessage;
