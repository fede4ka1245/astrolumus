import { useState, forwardRef, useImperativeHandle, memo, useCallback } from 'react';
import { Grid, Typography } from '@mui/material';
import parse from 'html-react-parser';
import { useNavigate } from 'react-router-dom';
import { forumCommentApi, forumCommentLike } from '../../../../../../api/forum';
import authRequest from '../../../../../../api/authRequest';
import { ITopicComment } from '../../../../../../models/interfaces/topic';
import { routes } from '../../../../../../models/enums/routes';
import { setIsAppLoading } from '../../../../../../store/reducers/preferencesReducer';
import { useAppDispatch, useAppSelector } from '../../../../../../store/store';
import SwipeWrapper from '../../../../../../components/swipeWrapper/SwipeWrapper';
import ImageZoom from '../../../../../../hoc/ImageZoom';
import getPrependZeros from '../../../../../../helpers/getPrependZeros';
import styles from './styles.module.scss';
import RemoveCommentModal from '../RemoveCommentModal';
import ReportCommentModal from '../ReportCommentModal';
import { CommentStatus } from '../../../../../../models/enums/topic';
import BlockedComment from '../BlockedComment';

export interface IProps {
  comment: ITopicComment;
  editComment: (comment: ITopicComment | null) => void;
  replyToComment: (comment: ITopicComment | undefined) => void;
  jumpToMessage: (comment: ITopicComment) => void;
  saveComment?: (comment: ITopicComment) => void;
}

export interface ICommentRef {
  getComment: () => void;
}

const Comment = forwardRef<ICommentRef, IProps>(({ comment, replyToComment, jumpToMessage, editComment, saveComment }, ref) => {
  const userId = useAppSelector(store => store.user.userInfo.id);
  const [date, setDate] = useState(new Date(comment.created_at));
  const [commentData, setCommentData] = useState<ITopicComment | null>(comment); 
  const [isOpenRemoveModal, setIsOpenRemoveModal] = useState<boolean>(false);
  const [isOpenReportModal, setIsOpenReportModal] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const selectUser = useCallback((comment: ITopicComment) => {
    if (saveComment) {
      saveComment(comment);
    }
    
    if (userId) {
      if (comment.user.id !== userId) {
        navigate(routes.user + comment.user.id);
      }
    }
  }, [navigate, saveComment, userId]);

  const getComment = useCallback(() => {
    dispatch(setIsAppLoading(true));
    authRequest.get(forumCommentApi(comment.id))
      .then(res => {
        setCommentData(res.data);
        setDate(new Date(res.data.created_at));
      })
      .finally(() => {
        dispatch(setIsAppLoading(false));
      });
  }, [comment.id, dispatch]);

  useImperativeHandle(ref, () => ({
    getComment
  }));

  const onLike = useCallback((comment: ITopicComment) => {
    dispatch(setIsAppLoading(true));
    authRequest.post(forumCommentLike(comment.id))
      .then(() => {
        getComment();
      })
      .finally(() => {
        dispatch(setIsAppLoading(false));
      });
  }, [dispatch, getComment]);

  if (!commentData) {
    return null;
  }

  if (commentData.status === CommentStatus.blocked) {
    return (
      <BlockedComment
        comment={commentData}
      />
    );
  }

  return (
    <SwipeWrapper
      maxMove={commentData.user.id === userId ? 100 : 60}
      fastSwipeThreshold={40}
      swipeThreshold={40}
      backgroundComponent={
        commentData.user.id === userId
          ? (
            <Grid display={'flex'} height={'100%'} px={2} justifyContent={'flex-end'} alignItems={'center'}>
              <Grid onClick={() => setIsOpenRemoveModal(true)} mr={4}>
                <svg width="20" height="23" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.33398 8.16667V13.1667M9.66732 8.16667V13.1667M1.33398 4.83333H14.6673M13.834 4.83333L13.1115 14.9517C13.0816 15.3722 12.8934 15.7657 12.5849 16.053C12.2764 16.3403 11.8705 16.5 11.449 16.5H4.55232C4.13077 16.5 3.72487 16.3403 3.41639 16.053C3.1079 15.7657 2.91975 15.3722 2.88982 14.9517L2.16732 4.83333H13.834ZM10.5007 4.83333V2.33333C10.5007 2.11232 10.4129 1.90036 10.2566 1.74408C10.1003 1.5878 9.88833 1.5 9.66732 1.5H6.33398C6.11297 1.5 5.90101 1.5878 5.74473 1.74408C5.58845 1.90036 5.50065 2.11232 5.50065 2.33333V4.83333H10.5007Z" stroke="#F15024" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Grid>
              <Grid onClick={() => editComment(comment)}>
                <svg width="18" height="23" viewBox="0 0 14 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M8.22995 1.92283C8.82793 0.889719 10.014 0.771146 11.0481 1.36898L12.0652 1.95753C13.0993 2.55537 13.5893 3.64034 12.9917 4.67543L6.26818 16.3087C6.04358 16.6981 5.65409 16.9644 5.20924 17.0324L2.21335 17.6161L1.40787 14.8346C1.24557 14.4162 1.28202 13.9465 1.50648 13.5561L8.22995 1.92283Z" stroke="#37366B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Grid>
            </Grid>
          ) 
          : (
            <Grid display={'flex'} height={'100%'} pr={6} justifyContent={'flex-end'} alignItems={'center'}>
              <Grid onClick={() => setIsOpenReportModal(true)}>
                <svg width="23" height="23" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.75" y="1.25" width="15.5" height="15.5" rx="7.75" stroke="#F15024" strokeWidth="1.5"/>
                  <path d="M13.8125 3.6875L2.47919 15.0208" stroke="#F15024" strokeWidth="1.5"/>
                </svg>
              </Grid>
            </Grid>
          )}>
      <RemoveCommentModal
        isOpen={isOpenRemoveModal}
        editComment={editComment}
        close={() => setIsOpenRemoveModal(false)}
        setCommentData={setCommentData}
        comment={comment}
      />
      <ReportCommentModal
        isOpen={isOpenReportModal}
        close={() => setIsOpenReportModal(false)}
        comment={comment}
      />
      <Grid display={'flex'} flexDirection={'column'}>
        <div className={styles.main} 
          style={commentData.user.id === userId ? { backgroundColor: '#EAE4DB', alignSelf: 'flex-end' } : {} }>
          {
            commentData.comment && (
              <Grid
                onClick={() => jumpToMessage(commentData)}   
                display={'flex'}
                height={'40px'} 
                px={2}
                pt={1}
                borderRadius={'10px'}>
                <Grid height={'100%'} width={'2px'} bgcolor={'#37366B'} borderRadius={'2px'} flexShrink={0} mr={0.5}/>
                { commentData.comment.image && <img src={commentData.comment.image?.image} height={30}/>}
                <Grid width={'100%'} px={0.5}>
                  <Grid height={'40px'} width={'100%'} overflow={'hidden'}>
                    <Typography color={'#292E30'} fontWeight={600} fontSize={'10px'} fontFamily={'Gilroy'}>
                      {commentData.comment.user.first_name} {commentData.comment.user.last_name}
                    </Typography>
                    <Typography color={'#292E30'} fontWeight={400} fontFamily={'Gilroy'} fontSize={'14px'} whiteSpace={'pre-wrap'}>
                      {parse(commentData.comment.text)}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            )
          }
          <Grid onClick={() => selectUser(comment)}>
            {commentData.user.id !== userId 
              ? commentData.user.avatar
                ? <img 
                  className={styles.photo} alt="avatar" src={commentData.user.avatar}/> 
                : <div className={styles.photo_mask}>
                  {commentData.user.first_name?.slice(0, 1)}{commentData.user.last_name?.slice(0, 1)}
                </div>
              : null}
          </Grid>
          <Grid direction={'column'} container pt={1} pl={2} pb={1} pr={2}>
            <Grid item container alignItems={'center'}>
              <Grid item color={'#292E30'} fontWeight={600} fontSize={'14px'} fontFamily={'Gilroy'} onClick={() => selectUser(comment)}>
                {commentData.user.first_name} {commentData.user.last_name}
              </Grid>
              <Grid item ml={'auto'} sx={{ opacity: 0.6 }} color={'#292E30'} fontWeight={400} fontFamily={'Gilroy'} fontSize={'10px'}>
                {getPrependZeros(date.getHours())}:{getPrependZeros(date.getMinutes())} {getPrependZeros(date.getDate())}.{getPrependZeros(date.getMonth() + 1)}.{getPrependZeros(date.getFullYear())}
              </Grid>
            </Grid>
            {
              commentData.image && (
                <Grid width="100px">
                  <ImageZoom images={[commentData.image.image_original]} >
                    <img src={commentData.image.image} className={styles.image}/>
                  </ImageZoom>
                </Grid>
              )
            }
            <Grid item pt={1} pb={1} width={'100%'} overflow={'hidden'}>
              <Typography color={'#292E30'} fontWeight={400} fontFamily={'Gilroy'} fontSize={'16px'} whiteSpace={'pre-wrap'}>
                {parse(commentData.text)}
              </Typography>
            </Grid>
            <Grid item container justifyContent={'space-between'}>
              <Grid item display={'flex'} onClick={() => onLike(comment)}>
                <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 12.3984L7.3125 12.2344C3.04687 8.76562 1.89844 7.54687 1.89844 5.55469C1.89844 3.91406 3.23437 2.60156 4.85156 2.60156C6.21094 2.60156 6.98437 3.375 7.5 3.96093C8.01562 3.375 8.78906 2.60156 10.1484 2.60156C11.7891 2.60156 13.1016 3.9375 13.1016 5.55469C13.1016 7.54687 11.9531 8.76562 7.6875 12.2344L7.5 12.3984Z" fill={commentData.current_user_liked ? '#E72222' : '#C3C9CD'}/>
                </svg>
                <Typography pl={'4px'} sx={{ opacity: 0.6 }} color={'#292E30'} fontWeight={400} fontFamily={'Gilroy'} fontSize={'14px'}>
                  {commentData.likes_count}
                </Typography>
              </Grid>
              <Grid item onClick={() => replyToComment(comment)}>
                <svg width="20" height="13" viewBox="0 0 20 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.5364 6.17272L15.9364 6.71817L17.9546 8.98181H9.8273C5.08185 8.98181 1.23639 5.13635 1.23639 0.3909H0.418213C0.418213 5.59999 4.64548 9.79999 9.85458 9.82726H17.9546L15.9091 12.0636L16.5091 12.6091L19.4 9.36363L16.5364 6.17272Z" fill="#37366B"/>
                </svg>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Grid>
    </SwipeWrapper>
  );
});

Comment.displayName = 'Comment';

export default memo(Comment);
