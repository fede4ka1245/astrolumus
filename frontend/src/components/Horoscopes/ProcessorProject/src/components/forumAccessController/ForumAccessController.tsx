import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from '../../contexts/NavigationContext';
import { matchPath } from 'react-router-dom';
import Modal from '../modal/Modal';
import { useGetAppAccess } from '../../store/selectors';
import { routes } from '../../models/enums/routes';
import { Grid, Typography } from '@mui/material';
import authRequest from '../../api/authRequest';
import { eventBus, EventBusEvents } from '../../helpers/eventBus';

const ForumAccessController = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const appAccess = useGetAppAccess();
  const navigate = useNavigate();
  const [data, setData] = useState<any>();
  
  useEffect(() => {
    let isForumPath = false;

    [routes.forum, routes.topic, routes.topicCreator, routes.main, routes.user, routes.userEdit].forEach((value) => {
      if (matchPath(location.pathname, value)) {
        isForumPath = true;
      }
    });

    if (isForumPath && appAccess.isForumRestricted) {
      navigate(routes.menu);
      setIsOpen(true);
    }
  }, [location, appAccess]);

  useEffect(() => {
    authRequest.get(`${import.meta.env.VITE_APP_API_URL}/info/app-part-info/forum_blocked/`)
      .then(({ data }) => {
        setData(data);
      });
  }, []);
  
  useEffect(() => {
    const trigger = () => {
      setIsOpen(true);
    };
    
    eventBus.on(EventBusEvents.triggerForumRestrictionBanner, trigger);
    
    return () => {
      eventBus.detach(EventBusEvents.triggerForumRestrictionBanner, trigger);
    };
  }, []);
  
  return (
    <>
      <Modal height={'var(--modal-page-height)'} isOpen={isOpen} close={() => setIsOpen(false)}>
        <Grid display={'flex'} flexDirection={'column'} p={2}>
          <Typography fontFamily={'sans-serif'} mb={2} fontSize={'22px'} fontWeight={'bold'}>
            {data?.title}
          </Typography>
          <Typography>
            <p dangerouslySetInnerHTML={{ __html: data?.description || '' }} />
          </Typography>
        </Grid>
      </Modal>
    </>
  );
};

export default ForumAccessController;
