import { FC, useCallback, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import Modal from '../../../../components/modal/Modal';
import Button from '../../../../components/button/Button';
import { ModalProps } from '../../../../components/modal/ModalProps';
import ButtonClose from '../../../../components/buttonClose/ButtonClose';
import { useAppDispatch } from '../../../../store/store';
import { setIsAppLoading } from '../../../../store/reducers/preferencesReducer';
import authRequest from '../../../../api/authRequest';
import Avatar from '../../../../components/Avatar';
import styles from './styles.module.scss';
import { IUserOpenInfo } from '../../../../models/interfaces/user';
import { reportUserApi } from '../../../../api/user';
import { useSnackbarAlert } from '../../../../hooks/useSnackbarAlert';

interface IProps extends ModalProps {
  user: IUserOpenInfo;
  setReportSended: (value: boolean) => void;
}

interface IReportData {
  details: string;
}

const ReportUserModal: FC<IProps> = ({ isOpen, close, user, setReportSended }) => {
  const [reportData, setReportData] = useState<IReportData>({
    details: ''
  });
  const snackbarAlert = useSnackbarAlert();
  const dispatch = useAppDispatch();

  const reportToComment = useCallback(() => {
    dispatch(setIsAppLoading(true));
    authRequest.post(reportUserApi(user.user_id), reportData)
      .then(() => {
        setReportData({
          details: ''
        });
        snackbarAlert('Ваша жалоба отправлена. Модератор рассмотрит ее и примет меры');
        setReportSended(true);
        close();
      })
      .finally(() => {
        dispatch(setIsAppLoading(false));
      });
  }, [close, dispatch, reportData, setReportSended, snackbarAlert, user.user_id]);

  return (
    <Modal isOpen={isOpen} close={close} height={'400px'}>
      <div className={styles.container}>
        <Grid flex={1}>
          <Grid display={'flex'} alignItems={'flex-start'} mb={3} >
            <Grid display={'flex'} alignItems={'center'} flex={1} mr={2}>
              <Avatar
                width={35}
                height={35}
                fontSize={10}
                avatar={user.avatar}
                abbreviation={`${user.first_name?.slice(0, 1)}${user.last_name?.slice(0, 1)}`}
              />
              <Grid ml={2}>
                <Typography fontSize={'15px'} color={'#FFF'} fontWeight={700}>
                  Пожаловаться на:
                </Typography>
                <Typography fontSize={'15px'} color={'#FFF'}>
                  {user.first_name} {user.last_name}
                </Typography>
              </Grid>
            </Grid>
            <ButtonClose onClick={close}/>
          </Grid>
          <textarea 
            placeholder='Причина жалобы'
            className={styles.text} 
            value={reportData.details} 
            onChange={e => setReportData(prev => ({ ...prev, details: e.target.value }))}/>
        </Grid>
        <Button text="Отправить" onClick={reportToComment}/>  
      </div>
    </Modal>
  );
};

export default ReportUserModal;
