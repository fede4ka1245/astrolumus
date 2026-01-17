import { FC } from 'react';
import { Grid } from '@mui/material';

// components
import GroupChatHeader from '../components/GroupChatHeader';
import ChatFooter from '../components/ChatFooter';
import SomeoneMessage from '../components/SomeoneMessage';
import UserMessage from '../components/UserMessage';

// styles 
import styles from './styles.module.scss';

const GroupChat: FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <GroupChatHeader/>
        <Grid container pl={2} pr={2} pt={3} position={'relative'} alignItems={'center'} width={'100%'} direction={'row'}>
          <div style={{ left: 0, pointerEvents: 'none', top: 0, zIndex: 2, width: 'calc(100% + 10px)', height: '80px', position: 'absolute', overflow: 'hidden', borderRadius: '40px 0 0 0', marginLeft: '-10px', marginTop: '-5px' }}>
            <div style={{ position: 'absolute', width: '100%', height: '100px', background: 'linear-gradient(268.23deg, #37366B 2.7%, #5C5B9F 44.59%, #59ABDA 99.71%), #C4C4C4', filter: 'blur(20px)', transform: 'rotate(-180deg)', top: '-90px' }}/>
          </div>
        </Grid>
      </div>
      <div className={styles.messages}>
        <SomeoneMessage/>
        <UserMessage/>
      </div>
      <ChatFooter/>
    </div>
  );
};

export default GroupChat;
