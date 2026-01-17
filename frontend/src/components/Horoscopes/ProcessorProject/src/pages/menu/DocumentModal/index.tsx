import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import parse from 'html-react-parser';
import Modal from '../../../components/modal/Modal';
import styles from './styles.module.scss';
import { documentApi } from '../../../api/document';
import { useAppDispatch } from '../../../store/store';
import { setIsAppLoading } from '../../../store/reducers/preferencesReducer';
import axios from 'axios';

interface IPrivacyDocumentModal {
  isOpen: boolean,
  close: () => any,
  code?: string
}

const DocumentModal = ({ isOpen, close, code }: IPrivacyDocumentModal) => {
  const dispatch = useAppDispatch();
  const [data, setData] = useState({
    title: '',
    description: ''
  });

  useEffect(() => {
    if (isOpen) {
      getDocument();
    } else {
      setData({
        title: '',
        description: ''
      });
    }
  }, [isOpen]);

  const getDocument = () => {
    if (code) {
      dispatch(setIsAppLoading(true));
      axios.get(documentApi(code))
        .then(({ data }) => {
          setData(data);
        })
        .finally(() => {
          dispatch(setIsAppLoading(false));
        });
    };
  };

  return (
    <Modal isOpen={isOpen} close={close} height={'var(--modal-page-height)'}>
      <Grid sx={{ background: 'white' }} width={'100%'} height={'100%'} overflow={'scroll'} position={'relative'} p={3}>
        <div className={styles.cross} onClick={close}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.5835 1.58331L14.4168 14.4166" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
            <path d="M14.4165 1.58331L1.58317 14.4166" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <Grid item width={'100%'}>
          <div className={styles.title}>
            {data.title}
          </div>
          <div className={styles.rule}>
            {parse(data.description)}
          </div>
        </Grid>
      </Grid>
    </Modal>
  );
};

export default DocumentModal;
