import React, { useEffect, useState } from 'react';
import Modal from '../../modal/Modal';
import { ModalProps } from '../../modal/ModalProps';
import DarkThemeBackground from '../../darkThemeBackground/DarkThemeBackground';
import { Grid } from '@mui/material';
import { getDeepSkyInfo } from '../../../api/getDeepSkyInfo';
import DeepSkyLoader from './DeepSkyLoader';
import styles from './DeepSkyModal.module.scss';

const DeepSkyModal = ({ isOpen, close }: ModalProps) => {
  const [deepSkyInfo, setDeepSkyInfo] = useState({
    title: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    getDeepSkyInfo()
      .then((data) => {
        setDeepSkyInfo(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <Modal isOpen={isOpen} close={close} isDark height={'var(--modal-page-height)'}>
      <DarkThemeBackground>
        {isLoading && <DeepSkyLoader />}
        {!isLoading && <Grid height={'100%'} p={2}>
          <h1 className={styles.header} dangerouslySetInnerHTML={{ __html: deepSkyInfo.title }} />
          <div className={styles.desc} dangerouslySetInnerHTML={{ __html: deepSkyInfo.description }} />
        </Grid>}
      </DarkThemeBackground>
    </Modal>
  );
};

export default DeepSkyModal;
