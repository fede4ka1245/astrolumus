import { FC, useCallback } from 'react';
import { Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ITopicComment } from '../../../../../../models/interfaces/topic';
import { routes } from '../../../../../../models/enums/routes';
import { useAppSelector } from '../../../../../../store/store';
import getPrependZeros from '../../../../../../helpers/getPrependZeros';
import styles from './styles.module.scss';

export interface IProps {
  comment: ITopicComment;
};

const BlockedComment: FC<IProps> = ({ comment }) => {
  const date = new Date(comment.created_at);
  const userId = useAppSelector(store => store.user.userInfo.id);
  const navigate = useNavigate();
  
  const selectUser = useCallback(async (comment: ITopicComment) => {
    if (userId) {
      if (comment.user.id !== userId) {
        navigate(routes.user + comment.user.id);
      }
    }
  }, [navigate, userId]);

  return (
    <Grid display={'flex'} flexDirection={'column'}>
      <div className={styles.main} 
        style={comment.user.id === userId ? { borderColor: '#EAE4DB', alignSelf: 'flex-end' } : {} }>
        <Grid onClick={() => selectUser(comment)}>
          {comment.user.id !== userId 
            ? comment.user.avatar
              ? <img 
                className={styles.photo} alt="avatar" src={comment.user.avatar}/> 
              : <div className={styles.photo_mask}>
                {comment.user.first_name?.slice(0, 1)}{comment.user.last_name?.slice(0, 1)}
              </div>
            : null}
        </Grid>
        <Grid direction={'column'} container pt={1} pl={2} pb={1} pr={2}>
          <Grid item container >
            <Grid item color={'#292E30'} fontWeight={400} fontSize={'14px'} fontFamily={'Gilroy'} onClick={() => selectUser(comment)}>
              {comment.user.first_name} {comment.user.last_name}
            </Grid>
            <Grid item ml={'auto'} sx={{ opacity: 0.6 }} color={'#292E30'} fontWeight={400} fontFamily={'Gilroy'} fontSize={'10px'}>
              {getPrependZeros(date.getHours())}:{getPrependZeros(date.getMinutes())} {getPrependZeros(date.getDate())}.{getPrependZeros(date.getMonth() + 1)}.{getPrependZeros(date.getFullYear())}
            </Grid>
          </Grid>
          <Grid item pt={1} pb={1} width={'100%'} overflow={'hidden'}>
            <Typography color={'#292E30'} fontWeight={400} fontFamily={'Gilroy'} fontSize={'16px'} textAlign={'center'}>
              Комментарий удален модератором за нарушение правил
            </Typography>
          </Grid>
        </Grid>
      </div>
    </Grid>
  );
};

export default BlockedComment;
