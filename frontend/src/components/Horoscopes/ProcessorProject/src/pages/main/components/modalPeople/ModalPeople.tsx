import React from 'react';
import Modal from '../../../../components/modal/Modal';
import { Grid } from '@mui/material';
import UserLink from '../../../../components/userLink/UserLink';
import { ModalProps } from '../../../../components/modal/ModalProps';

const ModalPeople = ({ isOpen, close }: ModalProps) => {
  return (
    <Modal isOpen={isOpen} close={close} height={'var(--modal-page-height)'}>
      <Grid container direction={'column'} pl={2} pr={2} pt={3}>
        {Array.from({ length: 8 }).map((_, index) => (
          <Grid key={index} pb={1}>
            {/* <UserLink /> */}
          </Grid>
        ))}
      </Grid>
    </Modal>
  );
};

export default ModalPeople;
