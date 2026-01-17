import { FC, useState } from 'react';
import styles from './styles.module.scss';

const ChatFooter: FC = () => {
  const [message, setMessage] = useState<string>('');
  return (
    <div className={styles.footer}>
      <input 
        className={styles.input} 
        placeholder="Начните вводить сообщение..."
        value={message} onChange={e => setMessage(e.target.value)}/>
      {
        message.length > 0 
          ? (
            <div className={styles.send}>
              <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.6016 17L19.6016 19L10.6016 1L1.60156 19L10.6016 17ZM10.6016 17V9" stroke="#3F3F46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          ) 
          : (
            <div className={styles.icon}>
              <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.6016 1C11.8059 1 11.0429 1.31607 10.4802 1.87868C9.91763 2.44129 9.60156 3.20435 9.60156 4V12C9.60156 12.7956 9.91763 13.5587 10.4802 14.1213C11.0429 14.6839 11.8059 15 12.6016 15C13.3972 15 14.1603 14.6839 14.7229 14.1213C15.2855 13.5587 15.6016 12.7956 15.6016 12V4C15.6016 3.20435 15.2855 2.44129 14.7229 1.87868C14.1603 1.31607 13.3972 1 12.6016 1V1Z" stroke="#9C9EA8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19.6016 10V12C19.6016 13.8565 18.8641 15.637 17.5513 16.9498C16.2386 18.2625 14.4581 19 12.6016 19C10.745 19 8.96457 18.2625 7.65182 16.9498C6.33906 15.637 5.60156 13.8565 5.60156 12V10" stroke="#9C9EA8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12.6016 19V23" stroke="#9C9EA8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.60156 23H16.6016" stroke="#9C9EA8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )
      }
    </div>
  );
};

export default ChatFooter;
