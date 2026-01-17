import { FC, useCallback } from 'react';
import { Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../../store/store';
import { setIsAppLoading } from '../../../../store/reducers/preferencesReducer';
import Button from '../../../../components/button/Button';
import Modal from '../../../../components/modal/Modal';
import { ModalProps } from '../../../../components/modal/ModalProps';
import authRequest from '../../../../api/authRequest';
import { forumTopicAcceptApi, forumTopicLeaveApi } from '../../../../api/forum';
import { routes } from '../../../../models/enums/routes';

interface IProps extends ModalProps {
  topicTitle: string,
  topicId: number;
  getInvitations: () => void;
}

const JoinTopicModal: FC<IProps> = ({ isOpen, close, topicTitle, topicId, getInvitations }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const joinToTopic = useCallback(() => {
    dispatch(setIsAppLoading(true));
    authRequest.post(forumTopicAcceptApi(topicId))
      .then(res => {
        navigate(routes.topic + topicId);
      })
      .finally(() => {
        dispatch(setIsAppLoading(false));
      });
  }, [dispatch, navigate, topicId]);

  const leaveFromTopic = useCallback(() => {
    dispatch(setIsAppLoading(true));
    authRequest.post(forumTopicLeaveApi(topicId))
      .then(res => {
        getInvitations();
      })
      .finally(() => {
        dispatch(setIsAppLoading(false));
      });
  }, [dispatch, getInvitations, topicId]);

  return (
    <Modal isOpen={isOpen} close={close} height={'400px'}>
      <Grid display={'flex'} flexDirection={'column'} height={'100%'} bgcolor={'#FFF'} px={'30px'} pt={'30px'} position={'relative'}>
        <Grid flex={1}>
          <Typography color="#37366B" fontWeight={500} fontSize={'20px'} lineHeight={'24px'} mb={'10px'}>
            Приглашение в группу
          </Typography>
          <Grid mb={'10px'}>
            <Typography color="#292E30" fontWeight={600} fontSize={'16px'} lineHeight={'36px'}>
              Информация о теме
            </Typography>
            <Typography color="#292E30" fontWeight={400} fontSize={'14px'} lineHeight={'14px'}>
              {
                topicTitle
              }
            </Typography>
          </Grid>
          {/* <Grid mb={'10px'}>
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
          </Grid> */}
        </Grid>
        <Grid width="250px" mb={'45px'}>
          <Button text="Вступить в группу" onClick={joinToTopic}/> 
        </Grid>
        <Typography color="#9C9EA8" fontSize="20px" fontWeight={500} mb={'30px'} onClick={leaveFromTopic}>
          Отказаться
        </Typography>
      </Grid>
    </Modal>
  );
};

export default JoinTopicModal;
