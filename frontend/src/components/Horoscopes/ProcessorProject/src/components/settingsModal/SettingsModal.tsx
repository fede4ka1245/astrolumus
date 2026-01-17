import React, { useCallback, useState } from 'react';
import Modal from '../modal/Modal';
import Main from '../../pages/settings/main/Main';
import MapDisplaying from '../../pages/settings/mapDisplaying/MapDisplaying';
import { Grid } from '@mui/material';
import Button from '../button/Button';
import ButtonClose from '../buttonClose/ButtonClose';
import { useSearchParamsState } from '../../hooks/useSearchParamsState';

interface SettingsModalProps {
  isOpen: boolean,
  close: () => any,
}

const SettingsModal = ({ isOpen, close }: SettingsModalProps) => {
  const [isMainSettingsModalOpen, setIsMainSettingsModalOpen] = useSearchParamsState('isMainSettingsModalOpen', false, false);
  const [isMapDisplayingOpen, setIsMapDisplayingOpen] = useSearchParamsState('isMapDisplayingOpen', false, false);

  const openMainSettings = useCallback(() => {
    setIsMainSettingsModalOpen(true, true);
  }, []);

  const closeMainSettings = useCallback(() => {
    setIsMainSettingsModalOpen(false, true);
    close();
  }, [close]);

  const openMapDisplaying = useCallback(() => {
    setIsMapDisplayingOpen(true, true);
  }, []);

  const closeMapDisplaying = useCallback(() => {
    setIsMapDisplayingOpen(false, true);
    close();
  }, [close]);

  return (
    <div>
      <Modal isOpen={isOpen} close={close} height={'190px'}>
        <Grid container direction={'column'} p={2}>
          <Grid pb={2}>
            <Button text={'Основные'} onClick={openMainSettings} />
          </Grid>
          <Grid>
            <Button text={'Отображение карт'} onClick={openMapDisplaying} />
          </Grid>
        </Grid>
      </Modal>
      <Modal isDark isOpen={isMainSettingsModalOpen} close={closeMainSettings} height={'var(--modal-page-height)'}>
        <Grid position={'absolute'} right={'10px'} top={'10px'} zIndex={4}>
          <ButtonClose onClick={closeMainSettings} />
        </Grid>
        <Main closeSettings={closeMainSettings} isModal />
      </Modal>
      <Modal isDark isOpen={isMapDisplayingOpen} close={closeMapDisplaying} height={'var(--modal-page-height)'}>
        <Grid position={'absolute'} right={'10px'} top={'10px'} zIndex={4}>
          <ButtonClose onClick={closeMapDisplaying} />
        </Grid>
        <MapDisplaying closeSettings={closeMapDisplaying} />
      </Modal>
    </div>
  );
};

export default SettingsModal;
