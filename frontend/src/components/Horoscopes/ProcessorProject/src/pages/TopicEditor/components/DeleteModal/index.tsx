import { FC, useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';

import Modal from '../../../../components/modal/Modal';
import Button from '../../../../components/button/Button';
import { ModalProps } from '../../../../components/modal/ModalProps';
import TextGradient from '../../../../components/textGradient/TextGradient';
import ButtonClose from '../../../../components/buttonClose/ButtonClose';

import styles from './styles.module.scss';

interface IProps extends ModalProps{
  deleteTopic: () => void;
  isDraft: boolean;
}

const DeleteModal: FC<IProps> = ({ isOpen, close, deleteTopic, isDraft }) => {
  return (
    <Modal isOpen={isOpen} close={close} height={'350px'}>
      <Grid container direction={'column'} pt={3} px={2} flex={1} position={'relative'}>
        <Grid container item justifyContent={'space-between'} alignItems={'center'} mb={1.5}>
          <Grid item flex={1}>
            <Typography
              textAlign={'center'}
              textTransform={'uppercase'}
              fontWeight={'bold'}
              color="#D12525"
            >
              Внимание! 
            </Typography>
          </Grid>
          <ButtonClose onClick={close}/>
        </Grid>
        {
          isDraft 
            ? (
              <Typography fontFamily={'Gilroy'} fontSize={'14px'} fontWeight={500} mb={13}>
                Если вы нажмёте кнопку &quot;ДА&quot;, Ваш черновик будет безвозвратно удален!
              </Typography>
            )
            : (
              <Typography fontFamily={'Gilroy'} fontSize={'14px'} fontWeight={500} mb={4}>
                Если вы нажмёте кнопку &quot;ДА&quot;, Ваша тема перестанет быть видна на форуме, участники не смогут оставлять комментарии в ней, а тема будет перенесена в ваши черновики. В любой момент вы можете восстановить тему из черновиков или полностью удалить её.
              </Typography>
            )
        }
      </Grid>
      <Grid display={'flex'} flexDirection={'column'} alignItems="center">
        <Grid className={styles.button} onClick={deleteTopic}>
          <TextGradient fontFamily={'Gilroy'} fontWeight={700} fontSize={'14px'}>
            Удалить
          </TextGradient>
        </Grid>
        <Typography onClick={close} color="#ABB0B2" fontWeight={500} fontSize="16px">
          Я передумал(а)
        </Typography>
      </Grid>
    </Modal>
  );
};

export default DeleteModal;
