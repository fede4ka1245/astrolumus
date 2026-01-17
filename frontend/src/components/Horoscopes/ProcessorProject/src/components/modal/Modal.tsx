import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Box, Grid, SwipeableDrawer, Drawer } from '@mui/material';
import { ModalProps } from './ModalProps';
import { styled } from '@mui/material/styles';

const Puller = styled(Box)(() => ({
  width: 160,
  height: 6,
  backgroundColor: 'rgba(255,255,255,0.6)',
  borderRadius: 3,
  position: 'absolute',
  top: -10,
  left: 'calc(50% - 80px)'
}));

const Modal: React.FC<ModalProps> = ({ isOpen, close, isSwipeable = true, isDark, children, height, maxHeight, background, onScroll = () => {} }) => {
  const prev = useRef<boolean>(isOpen);

  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = 'hidden';
    }
    
    if (!isOpen && prev.current) {
      document.documentElement.style.overflow = 'unset';
    }

    prev.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    return () => {
      document.documentElement.style.overflow = 'unset';
    };
  }, []);
  
  const onClose = useCallback(() => {
    close();
  }, [close]);
  
  const paperProps = useMemo(() => {
    return { style: { borderRadius: '20px 20px 0 0', overflow: 'visible', background: background || (isDark ? '#261C5C' : '#F0F0F3'), height: height || 'max-content', maxHeight } };
  }, [background, height, isDark, maxHeight]);
  
  if (!isSwipeable) {
    return (
      <Drawer
        anchor={'bottom'}
        open={isOpen}
        onClose={onClose}
        keepMounted={false}
        PaperProps={paperProps}
      >
        <Grid borderRadius={'20px 20px 0 0'} height={'100%'} overflow={'scroll'}>
          {children}
        </Grid>
      </Drawer>
    );
  }

  return (
    <SwipeableDrawer
      anchor={'bottom'}
      disableSwipeToOpen={true}
      container={window.document.body}
      open={isOpen}
      onClose={onClose}
      onOpen={() => close()}
      swipeAreaWidth={15}
      keepMounted={false}
      PaperProps={paperProps}
    >
      <Grid>
        <Puller />
      </Grid>
      <Grid borderRadius={'20px 20px 0 0'} height={'100%'} overflow={'scroll'} onScroll={onScroll}>
        {children}
      </Grid>
    </SwipeableDrawer>
  );
};

export default Modal;
