import { FC } from 'react';

// styles
import styles from './styles.module.scss';

interface IProps {
  quantity: number;
}

const Messages: FC <IProps> = ({ quantity }) => {
  return (
    <div className={styles.container}>
      {quantity}
    </div>
  );
};

export default Messages;
