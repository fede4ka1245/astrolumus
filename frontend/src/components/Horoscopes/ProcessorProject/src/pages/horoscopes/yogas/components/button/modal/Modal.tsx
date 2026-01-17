import React from 'react';
import { ModalProps as ParentModalProps } from '../../../../../../components/modal/ModalProps';
import ModalPage from '../../../../../../components/modal/Modal';
import cross from './assets/cross.svg';
import { Grid } from '@mui/material';
import styles from './Modal.module.scss';

interface ModalProps extends ParentModalProps {
  title: string,
  text: string,
}

const Modal = ({ close, title, text, isOpen }: ModalProps) => {
  return (
    <ModalPage close={close} isOpen={isOpen} height={'250px'}>
      <section className={styles.main}>
        <img src={cross} width={'22px'} height={'22px'} onClick={() => close()} className={styles.cross}/>
        <Grid container p={3}>
          <Grid item className={styles.header} pb={4}>
            {title}
          </Grid>
          <Grid item className={styles.text}>
            {text}
          </Grid>
        </Grid>
      </section>
    </ModalPage>
  );
};

export default Modal;
