import { FC, useState, useEffect, useCallback } from 'react';
import { Grid, Typography } from '@mui/material';

import Modal from '../../../../../../components/modal/Modal';
import Button from '../../../../../../components/button/Button';
import { ModalProps } from '../../../../../../components/modal/ModalProps';
import TextGradient from '../../../../../../components/textGradient/TextGradient';
import ButtonClose from '../../../../../../components/buttonClose/ButtonClose';
import { ITopicComment } from '../../../../../../models/interfaces/topic';
import { useAppDispatch } from '../../../../../../store/store';
import { setIsAppLoading } from '../../../../../../store/reducers/preferencesReducer';
import authRequest from '../../../../../../api/authRequest';
import { forumCommentApi } from '../../../../../../api/forum';

interface IProps extends ModalProps {
  comment: ITopicComment;
  setCommentData: (comment: ITopicComment | null) => void;
  editComment: (comment: ITopicComment | null) => void;
}

const RemoveCommentModal: FC<IProps> = ({ isOpen, close, comment, setCommentData, editComment }) => {
  const dispatch = useAppDispatch();

  const deleteComment = useCallback(() => {
    dispatch(setIsAppLoading(true));
    authRequest.delete(forumCommentApi(comment.id))
      .then(res => {
        setCommentData(null);
        editComment(null);
      })
      .finally(() => {
        dispatch(setIsAppLoading(false));
      });
  }, [comment.id, dispatch, editComment, setCommentData]);

  return (
    <Modal isOpen={isOpen} close={close} height={'200px'}>
      <Grid container direction={'column'} pt={3} px={2} flex={1} position={'relative'} mb={4}>
        <Grid item display={'flex'} justifyContent={'space-between'} alignItems={'flex-start'} mb={1.5}>
          <TextGradient
            textTransform={'uppercase'}
            fontWeight={'bold'}
          >
            Вы точно хотите удалить комментарий?
          </TextGradient>
          <ButtonClose onClick={close}/>
        </Grid>
      </Grid>
      <Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'} px={2}>
        <Grid flex={1} mr={2}>
          <Button text={'Да'} onClick={deleteComment}/>
        </Grid>
        <Grid flex={1}>
          <Button text={'Нет'} onClick={close}/>
        </Grid>
      </Grid>
    </Modal>
  );
};

export default RemoveCommentModal;
