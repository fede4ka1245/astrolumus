import { FC, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Messages from '../../pages/chats/ChatList/components/buttons/Messages';
import Pin from '../../pages/chats/ChatList/components/buttons/Pin';
import { routes as ChatRoutes } from '../../pages/chats/routes';
import styles from './styles.module.scss';

const Contact: FC = () => {
  const navigate = useNavigate();

  const onNavigate = useCallback(() => {
    navigate(ChatRoutes.ChatUser);
  }, []);

  return (
    <div className={styles.container} onClick={onNavigate}>
      <img className={styles.avatar} alt="avatar" src="./__mocks__/images/person_1.jpg"/>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className={styles.name}>
            Алексей Пивоваров
          </div>
          <div className={styles.name}>
            17:45
          </div>
        </div>
        <div className={styles.message}>
          Новый курс это просто нечто! Давай попробуем вместе
        </div>
      </div>
      <div className={styles.tools}>
        <div style={{ marginBottom: 6 }}>
          <Pin/>
        </div>
        <Messages quantity={5}/>
      </div>
    </div>
  );
};

export default Contact;
