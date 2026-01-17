import ChatHeader from '../components/ChatHeader';
import ChatFooter from '../components/ChatFooter';
import QuestionMessage from '../components/QuestionMessage';
import AnswerMessage from '../components/AnswerMessage';

// styles
import styles from './styles.module.scss';

const ChatQuestions = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <ChatHeader/>
      </div>
      <div className={styles.messages}>
        <div className={styles.message}>
          <QuestionMessage/>
        </div>
        <div className={styles.message}>
          <AnswerMessage/>
        </div>
      </div>
      <ChatFooter/>
    </div>
  );
};

export default ChatQuestions;
