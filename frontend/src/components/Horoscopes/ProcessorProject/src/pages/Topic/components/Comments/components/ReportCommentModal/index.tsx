import { FC, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import Modal from '../../../../../../components/modal/Modal';
import Button from '../../../../../../components/button/Button';
import { ModalProps } from '../../../../../../components/modal/ModalProps';
import ButtonClose from '../../../../../../components/buttonClose/ButtonClose';
import { useAppDispatch } from '../../../../../../store/store';
import { setIsAppLoading } from '../../../../../../store/reducers/preferencesReducer';
import authRequest from '../../../../../../api/authRequest';
import { forumReportCommentApi } from '../../../../../../api/forum';
import { ITopicComment } from '../../../../../../models/interfaces/topic';
import Avatar from '../../../../../../components/Avatar';
import styles from './styles.module.scss';
import { useSnackbarAlert } from '../../../../../../hooks/useSnackbarAlert';

interface IProps extends ModalProps {
  comment: ITopicComment
}

interface IReportData {
  details?: string
}

const ReportCommentModal: FC<IProps> = ({ isOpen, close, comment }) => {
  const [reportData, setReportData] = useState<IReportData>({
    details: ''
  });
  const dispatch = useAppDispatch();
  const snackbarAlert = useSnackbarAlert();

  const reportToComment = () => {
    dispatch(setIsAppLoading(true));
    authRequest.post(forumReportCommentApi(comment.id), reportData)
      .then(() => {
        setReportData({
          details: ''
        });
        close();
        snackbarAlert('Ваша жалоба отправлена. Модератор рассмотрит ее и примет меры');
      })
      .finally(() => {
        dispatch(setIsAppLoading(false));
      });
  };

  return (
    <Modal isOpen={isOpen} close={close} height={'400px'}>
      <div className={styles.container}>
        <Grid display={'flex'} alignItems={'flex-start'} mb={3}>
          <Grid display={'flex'} alignItems={'center'} flex={1} mr={2}>
            <Avatar
              width={35}
              height={35}
              fontSize={10}
              avatar={comment.user.avatar}
              abbreviation={`${comment.user.first_name?.slice(0, 1)}${comment.user.last_name?.slice(0, 1)}`}
            />
            <Grid ml={2}>
              <Typography fontSize={'15px'} color={'#FFF'} fontWeight={700}>
                Автор комментария
              </Typography>
              <Typography fontSize={'15px'} color={'#FFF'}>
                {comment.user.first_name} {comment.user.last_name}
              </Typography>
            </Grid>
          </Grid>
          <ButtonClose onClick={close}/>
        </Grid>
        <Grid mb={4}>
          <Typography color={'#FFF'} textTransform={'uppercase'} fontWeight={700} fontSize={'15px'}>
            Пожаловаться на комментарий:
          </Typography>
          <div className={styles.comment}>
            {comment.text}
          </div>
        </Grid>
        <textarea 
          placeholder='Причина жалобы'
          className={styles.text} 
          value={reportData.details} 
          onChange={e => setReportData(prev => ({ ...prev, details: e.target.value }))}/>
        <Button text="Отправить" onClick={reportToComment}/>  
      </div>
    </Modal>
  );
};

export default ReportCommentModal;
