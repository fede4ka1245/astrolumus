import { FC, useState, useEffect, useCallback } from 'react';
import { Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Modal from '../../../../components/modal/Modal';
import Button from '../../../../components/button/Button';
import { ModalProps } from '../../../../components/modal/ModalProps';
import TextGradient from '../../../../components/textGradient/TextGradient';
import ButtonClose from '../../../../components/buttonClose/ButtonClose';

interface IProps extends ModalProps{
  saveToDraft: () => void;
}

const SaveDraftModal: FC<IProps> = ({ isOpen, close, saveToDraft }) => {
  const navigate = useNavigate();

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <Modal isOpen={isOpen} close={close} height={'200px'}>
      <Grid container direction={'column'} pt={3} px={2} flex={1} position={'relative'} mb={4}>
        <Grid container item justifyContent={'space-between'} alignItems={'center'} mb={1.5}>
          <Grid item>
            <TextGradient
              textAlign={'center'}
              textTransform={'uppercase'}
              fontWeight={'bold'}
            >
              Хотите сохранить в черновик?
            </TextGradient>
          </Grid>
          <ButtonClose onClick={close}/>
        </Grid>
      </Grid>
      <Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'} px={2}>
        <Grid flex={1} mr={2}>
          <Button text={'Да'} onClick={saveToDraft}/>
        </Grid>
        <Grid flex={1}>
          <Button text={'Нет'} onClick={goBack}/>
        </Grid>
      </Grid>
    </Modal>
  );
};

export default SaveDraftModal;
