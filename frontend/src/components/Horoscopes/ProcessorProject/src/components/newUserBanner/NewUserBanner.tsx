import React, { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { setIsNewUser } from '../../store/reducers/preferencesReducer';
import Modal from '../modal/Modal';
import { useSearchParamsState } from '../../hooks/useSearchParamsState';
import authRequest from '../../api/authRequest';
import { Fade, Grid, Typography } from '@mui/material';
import ContentSkeleton from '../contentSkeleton/ContentSkeleton';
import camelcaseKeys from 'camelcase-keys';
import { useNavigate } from 'react-router-dom';

const NewUserBanner = () => {
  const [isBannerOpen, setIsBannerOpen] = useSearchParamsState('isNewUserBanner', false, false);
  const newUser = useAppSelector((state) => state.preferences.isNewUser);
  const [state, setState] = useState<any>({
    isLoading: false,
    data: {}
  });
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    if (!newUser) {
      return;
    }

    dispatch(setIsNewUser(false));
    setState((state: any) => (
      {
        ...state,
        isLoading: true
      } 
    ));
    
    authRequest.get(`${import.meta.env.VITE_APP_API_URL}/info/app-part-info/guest_tarrif/`)
      .then(({ data }) => {
        const res = camelcaseKeys(data, { deep: true });
        if (!res.isActive) {
          return;
        }
        setIsBannerOpen(true);
        setState((state: any) => (
          {
            ...state,
            isLoading: false,
            data: res
          }
        ));
      });
  }, [newUser]);
  
  const navigate = useNavigate();
  
  const closeBanner = useCallback(() => {
    navigate(-1);
  }, []);
  
  return (
    <Modal isSwipeable isOpen={isBannerOpen} close={closeBanner} height={'var(--modal-page-height))'}>
      {state.isLoading && <Grid p={2}>
        <ContentSkeleton />
      </Grid>}
      <Fade in={!state.isLoading} timeout={400}>
        <Grid display={'flex'} flexDirection={'column'} p={2} height={'100%'}>
          <Typography fontFamily={'sans-serif'} mb={2} fontSize={'22px'} fontWeight={'bold'}>
            {state.data?.title}
          </Typography>
          <Typography>
            <p dangerouslySetInnerHTML={{ __html: state.data?.description || '' }} />
          </Typography>
        </Grid>
      </Fade>
    </Modal>
  );
};

export default NewUserBanner;
