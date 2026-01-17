import { FC } from 'react';

import styles from './styles.module.scss';

const QuestionMessage: FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
      Вы задали вопрос эксперту в теме - <span style={{ color: '#37366B' }}>Длинное название темы</span>
      </div>
      <div className={styles.text}>
        Меня волнует один вопрос - когда я пробую создать прогноз на политическое событие - у меня не рождается идей, как можно это провернуть, можете подсказать мне варианты решения проблемы, пожалуйста?
      </div>
    </div>
  );
};

export default QuestionMessage;
