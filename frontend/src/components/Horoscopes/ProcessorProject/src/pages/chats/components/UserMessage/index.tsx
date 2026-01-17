import { FC } from 'react';

import styles from './styles.module.scss';

const UserMessage: FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.text}>
        Ответ на вопрос, в таком случае я бы не спешил с выводами, данный способ подходит далеко не всем
      </div>
      <div className={styles.time}>17.45</div>
    </div>
  );
};

export default UserMessage;
