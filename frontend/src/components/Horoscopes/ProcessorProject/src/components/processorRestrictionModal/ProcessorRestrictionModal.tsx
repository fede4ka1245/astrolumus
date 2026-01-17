import React, { useEffect, useState, useMemo } from 'react';
import { ModalProps } from '../modal/ModalProps';
import Modal from '../modal/Modal';
import { Grid, Typography } from '@mui/material';
import authRequest from '../../api/authRequest';
import Button from '../button/Button';
import { useGetEmail } from '../../store/selectors';
import { getBackendUrl } from '../../helpers/getApiUrl';
import { processTariffLink, replaceDomainsInHtml } from '../../helpers/replaceDomainsInContent';

const ProcessorRestrictionModal = ({ isOpen, close }: ModalProps) => {
  const [data, setData] = useState<any>();
  const email = useGetEmail();

  useEffect(() => {
    const backendUrl = getBackendUrl();
    authRequest.get(`${backendUrl}/info/app-part-info/processor_blocked/`)
      .then(({ data }) => {
        setData(data);
      });
  }, []);

  const processedLink = useMemo(() => {
    if (!data?.link) return '';
    return processTariffLink(data.link, email);
  }, [data?.link, email]);

  const processedDescription = useMemo(() => {
    if (!data?.description) return '';
    return replaceDomainsInHtml(data.description);
  }, [data?.description]);

  const handlePaymentClick = () => {
    if (processedLink) {
      window.open(processedLink);
    }
  };

  return (
    <Modal height={'var(--modal-page-height)'} isOpen={isOpen} close={close}>
      <Grid display={'flex'} flexDirection={'column'} p={2} height={'100%'}>
        <Typography fontFamily={'sans-serif'} mb={2} fontSize={'22px'} fontWeight={'bold'}>
          {data?.title}
        </Typography>
        <Typography>
          <p dangerouslySetInnerHTML={{ __html: processedDescription }} />
        </Typography>
        <Grid mt={'auto'} mb={2}>
          <Button text={'Оплатить астропроцессор'} onClick={handlePaymentClick} />
        </Grid>
      </Grid>
    </Modal>
  );
};

export default ProcessorRestrictionModal;
