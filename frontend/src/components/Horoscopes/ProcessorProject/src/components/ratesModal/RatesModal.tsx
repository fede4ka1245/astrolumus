import React from 'react';
import { Grid } from '@mui/material';
import Modal from '../modal/Modal';
import { ModalProps } from '../modal/ModalProps';
import RatesContent from '../ratesContent/RatesContent';
import DarkThemeBackground from '../darkThemeBackground/DarkThemeBackground';

const RatesModal = ({ isOpen, close }: ModalProps) => {
  return (
    <Modal isOpen={isOpen} close={close} height={'var(--modal-page-height)'} isDark>
      <DarkThemeBackground>
        <Grid p={2} pb={4}>
            <RatesContent />
        </Grid>
      </DarkThemeBackground>
    </Modal>
  );
};

export default RatesModal;
