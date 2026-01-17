import { FC, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography } from '@mui/material';
import { IServerTopic } from '../../../../models/interfaces/topic';
import { insertZero } from '../../../../helpers/insertZero';
import { forumTopicApi } from '../../../../api/forum';
import authRequest from '../../../../api/authRequest';
import { setIsAppLoading } from '../../../../store/reducers/preferencesReducer';
import { useAppDispatch } from '../../../../store/store';
import { routes } from '../../../../models/enums/routes';
import { IOptionItem } from '../../../../models/interfaces/options';
import { TopicStatuses } from '../../../../models/enums/topic';

interface IProps {
  topic: IServerTopic;
  getDrafts: (params: object) => void;
  close: () => void;
  filtredParam: IOptionItem;
}

const Draft: FC <IProps> = ({ topic, getDrafts, filtredParam }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const onSelect = useCallback(() => {
    navigate(routes.topic + `${topic.id}/edit`);
  }, [navigate, topic.id]);
  
  const deleteDraft = useCallback(() => {
    dispatch(setIsAppLoading(true));
    authRequest.delete(forumTopicApi(topic.id))
      .then(() => {
        getDrafts(filtredParam.params);
      })
      .finally(() => dispatch(setIsAppLoading(false)));
  }, [dispatch, filtredParam.params, getDrafts, topic.id]);

  return (
    <Grid container display={'flex'}>
      <Grid item container direction={'column'} flex={1} onClick={onSelect}>
        <Grid item>
          <Typography 
            width={'100%'}
            textOverflow={'ellipsis'}
            overflow={'hidden'}
            fontWeight={700} 
            fontFamily={'Gilroy'} 
            fontSize={'18px'}>
            {topic.title}
          </Typography>
        </Grid>
        {
          topic.status === TopicStatuses.blocked && (
            <Grid item>
              <Typography color="#FF0000" fontWeight={500} fontFamily={'Gilroy'} fontSize={'16px'}>
                Заблокирован
              </Typography>
            </Grid>
          )
        }
        {
          topic.status === TopicStatuses.temporary_blocked && (
            <Grid item>
              <Typography color="#FF0000" fontWeight={500} fontFamily={'Gilroy'} fontSize={'16px'}>
                Временно заблокирован
              </Typography>
            </Grid>
          )
        }
        <Grid item>
          <Typography fontWeight={500} fontFamily={'Gilroy'} fontSize={'16px'}>
            {insertZero(new Date(topic.created_at).getDate())}.{insertZero(new Date(topic.created_at).getMonth() + 1)}.{insertZero(new Date(topic.created_at).getFullYear())}
          </Typography>
        </Grid>
        <Grid item>
          <Typography color={'#59ABDA'} fontWeight={500} fontFamily={'Gilroy'} fontSize={'16px'}>
            Использовать
          </Typography>
        </Grid>
      </Grid>
      <Grid item onClick={deleteDraft}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 11V17M14 11V17M4 7H20M19 7L18.133 19.142C18.0971 19.6466 17.8713 20.1188 17.5011 20.4636C17.1309 20.8083 16.6439 21 16.138 21H7.862C7.35614 21 6.86907 20.8083 6.49889 20.4636C6.1287 20.1188 5.90292 19.6466 5.867 19.142L5 7H19ZM15 7V4C15 3.73478 14.8946 3.48043 14.7071 3.29289C14.5196 3.10536 14.2652 3 14 3H10C9.73478 3 9.48043 3.10536 9.29289 3.29289C9.10536 3.48043 9 3.73478 9 4V7H15Z" stroke="#C3C9CD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Grid>
    </Grid>
  );
};

export default Draft;
