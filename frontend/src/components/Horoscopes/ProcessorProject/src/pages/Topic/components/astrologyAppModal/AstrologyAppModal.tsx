import React, { useCallback } from 'react';
import { ModalProps } from '../../../../components/modal/ModalProps';
import { Grid, Drawer, IconButton, Typography, CardActionArea } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Outlet } from 'react-router-dom';

const AstrologyAppModal = ({ close, isOpen }: ModalProps) => {
  const onClose = useCallback(() => {
    close();
  }, [close]);
  
  return (
    <Drawer
      anchor={'bottom'}
      open={isOpen}
      keepMounted={false}
      PaperProps={{ style: { height: '100%', background: '#261C5C' } }}
    >
      <Grid
        display={'flex'}
        padding={'10px'}
        paddingTop={'calc(var(--status-bar-offset) + 10px)'}
        alignItems={'center'}
        sx={{
          width: '100%',
          boxShadow: 'rgba(0, 0, 0, 0.2) 0px 2px 4px -1px, rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(0, 0, 0, 0.12) 0px 1px 10px 0px',
          top: 0,
          left: 0,
          position: 'sticky',
          zIndex: 100,
          background: '#3C336C'
        }}
      >
        <CardActionArea onClick={onClose} sx={{ width: 'max-content' }}>
          <Grid display={'flex'} alignItems={'center'} ml={2} mr={1}>
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: '8px' }}>
              <ArrowBack style={{ color: 'white' }} />
            </IconButton>
            <Typography variant="h6" color="white" component="div">
              Назад в тему
            </Typography>
          </Grid>
        </CardActionArea>
      </Grid>
      <Grid height={'max-content'}>
        <Outlet />
      </Grid>
    </Drawer>
  );
};

export default AstrologyAppModal;
