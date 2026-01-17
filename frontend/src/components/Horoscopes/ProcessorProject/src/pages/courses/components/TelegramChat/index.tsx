/* eslint-disable react/no-unescaped-entities */
import { FC } from 'react';

// components
import { Box } from '@mui/material';

// images
import chat from './images/img_chat.png';

// styles
import globalStyles from '../../styles.module.scss';
import styles from './styles.module.scss';

const TelegramChat: FC = () => {
  return (
    <div className={styles.container}>
      <Box sx={{ px: 3.5 }}>
        <div className={`${globalStyles.title} ${styles.title}`}>
          Активный чат 
          в telegram
        </div>
        <div className={styles.telegram_info}>
          <div className={styles.block}>
            <div className={styles.block_title}>
              +500
            </div>
            <div className={styles.block_descr}>
              учеников школы "Альфа" в основном чате
            </div>
          </div>
          <div className={`${styles.block} ${styles.rotate_90}`} style={{ alignSelf: 'flex-end' }}>
            <div className={styles.block_title}>
              1
            </div>
            <div className={styles.block_descr}>
              Основной<br/>
              <span className={globalStyles.cyan_text}>канал школы</span>
            </div>
          </div>
          <div className={`${styles.block} ${styles.rotate_180}`}>
            <div className={styles.block_title}>
              2
            </div>
            <div className={styles.block_descr}>
              Куратора в диалоге
            </div>
          </div>
        </div>
        <img src={chat} alt="chat" className={styles.image}/>
        <div className={styles.description}>
          Во время курса мы добавим вас в закрытый информационный 
          чат Telegram, где вы сможете общаться с группой и кураторами. 
          Куратор курса с вами на связи на учебной платформе и готов ответить на ваши вопросы.
        </div>
      </Box>
    </div>
  );
};

export default TelegramChat;
