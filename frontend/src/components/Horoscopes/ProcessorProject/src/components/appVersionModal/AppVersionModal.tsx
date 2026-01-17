import React, { useCallback, useEffect, useState } from 'react';
import Modal from '../modal/Modal';
import { Grid } from '@mui/material';
import { Device } from '@capacitor/device';
import axios from 'axios';
import { App } from '@capacitor/app';
import styles from './AppVersion.module.scss';
import Button from '../button/Button';

interface UpdatedInfo {
  version: string,
  description: string,
  link: string,
  id: number
}

const info = '';

const AppVersionModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState<UpdatedInfo>();

  const toggleModal = useCallback(() => {
    setIsModalOpen((isOpen) => !isOpen);
  }, []);

  const updateInfo = useCallback(async () => {
    try {
      const deviceInfo = await Device.getInfo();
      const platform = deviceInfo.platform;
      
      if (platform === 'ios' || platform === 'android') {
        const appInfo = await App.getInfo();
        const version = appInfo.version;

        const { data } = await axios.get<UpdatedInfo>(`${import.meta.env.VITE_APP_API_URL}/info/mobile-app-verion/${platform}/`);

        setUpdatedInfo(data);

        if (data.version && version && Number(data.version) > Number(version)) {
          setIsModalOpen(true);
        }
      }
    } catch (error) {
      console.warn('App version check not available:', error);
    }
  }, []);

  const onDownloadClick = useCallback(() => {
    window.open(updatedInfo?.link);
  }, [updatedInfo]);
  
  useEffect(() => {
    updateInfo();
  }, []);
  
  return (
    <Modal isOpen={isModalOpen} close={toggleModal} height={'var(--modal-page-height)'}>
      <Grid height={'100%'} p={2} display={'flex'} flexDirection={'column'}>
        <h1 className={styles.header}>
          Доступна новая версия!
        </h1>
        <div className={styles.desc} dangerouslySetInnerHTML={{ __html: updatedInfo?.description || '' }} />
        <Grid mb={2} mt={'auto'}>
          <Button text={'Скачать новую версию'} onClick={onDownloadClick}/>
        </Grid>
      </Grid>
    </Modal>
  );
};

export default AppVersionModal;
