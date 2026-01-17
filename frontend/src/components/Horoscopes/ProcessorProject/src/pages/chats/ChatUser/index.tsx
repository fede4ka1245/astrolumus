import ChatHeader from '../components/ChatHeader';
import ChatFooter from '../components/ChatFooter';
import SomeoneMessage from '../components/SomeoneMessage';
import UserMessage from '../components/UserMessage';

// styles
import styles from './styles.module.scss';

const ChatUser = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <ChatHeader/>
      </div>
      <div className={styles.messages}>
        <SomeoneMessage/>
        <UserMessage/>
        <SomeoneMessage/>
        <UserMessage/>
        <UserMessage/>
      </div>
      <ChatFooter/>
    </div>
  );
};

export default ChatUser;
