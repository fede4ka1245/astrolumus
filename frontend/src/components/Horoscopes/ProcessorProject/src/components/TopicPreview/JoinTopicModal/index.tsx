import { FC, useState } from 'react';
import { Grid, Typography } from '@mui/material';

// helpers
import convertHtmlToText from '../../../helpers/convertHtmlToText';

// redux
import { useAppDispatch } from '../../../store/store';

// components
import Button from '../../button/Button';
import Modal from '../../modal/Modal';

// models
import { IServerTopic } from '../../../models/interfaces/topic';
import { ModalProps } from '../../modal/ModalProps';
import Avatar from '../../Avatar';

// styles
import styles from '../styles.module.scss';
import authRequest from '../../../api/authRequest';
import { forumTopicJoinApi } from '../../../api/forum';
import { setIsAppLoading } from '../../../store/reducers/preferencesReducer';
import { TopicStatuses } from '../../../models/enums/topic';

interface IProps extends ModalProps {
  topic: IServerTopic
}

const JoinTopicModal: FC<IProps> = ({ isOpen, close, topic }) => {
  const dispatch = useAppDispatch();
  const [isSent, setIsSent] = useState(topic.current_user_sent_join); 

  const joinToTopic = () => {
    dispatch(setIsAppLoading(true));
    authRequest.post(forumTopicJoinApi(), {
      topic_id: topic.id
    })
      .then(res => {
        setIsSent(true);
      })
      .finally(() => {
        dispatch(setIsAppLoading(false));
      });
  };

  return (
    <Modal isOpen={isOpen} close={close} height={'400px'}>
      <Grid display={'flex'} flexDirection={'column'} height={'100%'} bgcolor={'#FFF'} px={'30px'} pt={'30px'} position={'relative'}>
        <Grid flex={1}>
          {
            !isSent 
              ? (
                <Typography color="#37366B" fontWeight={500} fontSize={'20px'} lineHeight={'24px'} mb={'10px'}>
                  Это приватная тема,
                  вы можете запросить 
                  доступ у автора темы 
                </Typography>
              )
              : (
                <Typography color="#37366B" fontWeight={500} fontSize={'20px'} lineHeight={'24px'} mb={'10px'}>
                  Вы уже отправили запрос, ожидайте ответа!
                </Typography>
              )
          }
          <Grid mb={'10px'}>
            <Typography color="#292E30" fontWeight={600} fontSize={'16px'} lineHeight={'36px'}>
              Информация о теме
            </Typography>
            <Typography color="#292E30" fontWeight={400} fontSize={'14px'} lineHeight={'14px'}>
              {
                convertHtmlToText(topic.description)
              }
            </Typography>
          </Grid>
          <Grid mb={'10px'}>
            <Typography color="#292E30" fontWeight={600} fontSize={'16px'} lineHeight={'36px'}>
              Участники в теме
            </Typography>
            <div className={styles.users}>
              <Grid mr={0.7}>
                <Avatar 
                  height={25} 
                  width={25} 
                  fontSize={13}
                  avatar={topic.user.avatar} 
                  abbreviation={`${topic.user.first_name?.slice(0, 1)}${topic.user.last_name?.slice(0, 1)}`}/>
              </Grid>
              {topic.limited_members.map(item => (
                <div key={item.id} style={{ marginRight: 3 }}>
                  <Avatar 
                    height={20} 
                    fontSize={10}
                    width={20} 
                    avatar={item.user.avatar} 
                    abbreviation={`${item.user.first_name?.slice(0, 1)}${item.user.last_name?.slice(0, 1)}`}/>
                </div>
              ))}
              {topic.count_of_members > 3 &&
                <div className={styles.quantity}>
                  +{topic.count_of_members - 3}
                </div>
              }
            </div>
          </Grid>
        </Grid>
        {
          !isSent && (
            <Grid width="250px" mb={'45px'}>
              <Button text="Запросить доступ" onClick={joinToTopic}/> 
            </Grid>
          )
        }
      </Grid>
    </Modal>
  );
};

export default JoinTopicModal;
