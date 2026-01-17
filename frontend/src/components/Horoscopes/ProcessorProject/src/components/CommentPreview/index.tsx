import { Grid, Typography } from '@mui/material';
import parse from 'html-react-parser';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/store';
import { ITopicComment } from '../../models/interfaces/topic';
import { routes } from '../../models/enums/routes';
import getPrependZeros from '../../helpers/getPrependZeros';
import heart from './assets/like.svg';
import classNames from 'classnames';
import styles from './styles.module.scss';
import ImageZoom from '../../hoc/ImageZoom';
import { useCallback } from 'react';

const CommentPreview = (comment: ITopicComment) => {
  const date = new Date(comment.created_at);
  const navigate = useNavigate();
  
  const getTopic = useCallback(async () => {
    try {
      navigate(routes.topic + comment.topic);
    } catch (error) {}
  }, [comment.topic, navigate]);

  return (
    <div className={classNames(styles.main)} onClick={getTopic}>
      {
        comment.user.avatar
          ? <img 
            className={styles.photo} alt="avatar" src={comment.user.avatar}/> 
          : <div className={styles.photo_mask}>
            {comment.user.first_name?.slice(0, 1)}{comment.user.last_name?.slice(0, 1)}
          </div>
      }
      <Grid direction={'column'} container pt={2} pl={2} pb={2} pr={2}>
        <Grid item container>
          <Grid item color={'#292E30'} fontWeight={600} fontSize={'10px'} fontFamily={'Gilroy'}>
            {comment.user.first_name} {comment.user.last_name}
          </Grid>
          <Grid item ml={'auto'} sx={{ opacity: 0.6 }} color={'#292E30'} fontWeight={400} fontFamily={'Gilroy'} fontSize={'10px'}>
            {getPrependZeros(date.getDate())}.{getPrependZeros(date.getMonth() + 1)}.{getPrependZeros(date.getFullYear())}
          </Grid>
        </Grid>
        {
          comment.image && (
            <Grid>
              <ImageZoom images={[comment.image.image_original]} >
                <img src={comment.image.image} height={100}/>
              </ImageZoom>
            </Grid>
          )
        }
        <Grid item py={1} className={styles.text}>
          <Typography color={'#292E30'} fontWeight={400} fontFamily={'Gilroy'} fontSize={'14px'}>
            {parse(comment.text)}
          </Typography>
        </Grid>
        <Grid item container justifyContent={'space-between'}>
          <Grid item display={'flex'}>
            <img src={heart} width={'20px'} height={'20px'} />
            <Typography pl={'4px'} sx={{ opacity: 0.6 }} color={'#292E30'} fontWeight={400} fontFamily={'Gilroy'} fontSize={'14px'}>
              {comment.likes_count}
            </Typography>
          </Grid>
          <Grid item >
            <div className={styles.button}>
              Перейти к теме
            </div>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default CommentPreview;
