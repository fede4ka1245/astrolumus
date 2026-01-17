import React from 'react';
import { ModalProps } from '../../../components/modal/ModalProps';
import Modal from '../../../components/modal/Modal';
import { Button, Grid, Typography } from '@mui/material';
import GradientButton from '../../../components/gradientButton/GradientButton';

interface ConfirmationModalProps extends Omit<ModalProps, 'children'> {
  onSaveClick: (props?: any) => any,
  onCancelClick: (props?: any) => any
}

const ConfirmationModal = ({ isOpen, close, onSaveClick, onCancelClick }: ConfirmationModalProps) => {
  return (
    <Modal isOpen={isOpen} close={close}>
      <Grid container direction={'column'} overflow={'scroll'} p={2}>
        <Grid item color={'#D12525'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'18px'} textAlign={'center'} pt={1}>
          ВНИМАНИЕ!
        </Grid>
        <Grid item color={'#5B6062'} fontFamily={'Gilroy'} fontWeight={500} fontSize={'20px'} textAlign={'center'} pt={4}>
          Вы пытаетесь выйти из Настроек
          без сохранения, все данные будут безвозвратно утрачены
        </Grid>
        <Grid item pt={2}>
          <GradientButton onClick={onSaveClick}>Сохранить и выйти</GradientButton>
        </Grid>
        <Grid item pt={2} display={'flex'} justifyContent={'center'}>
          <Button onClick={onCancelClick}>
            <Typography textTransform={'none'} color={'#ABB0B2'} fontFamily={'Gilroy'} fontWeight={500} fontSize={'18px'} textAlign={'center'}>
              Не сохранять
            </Typography>
          </Button>
        </Grid>
      </Grid>
    </Modal>
  );
};

export default ConfirmationModal;
