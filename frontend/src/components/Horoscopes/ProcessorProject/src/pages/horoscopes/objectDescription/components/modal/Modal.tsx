import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { PlanetModalProps } from '../../types/PlanetModalProps';
import { Box, Grid, SwipeableDrawer } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';
import IconButton from '../../../../../components/iconButton/IconButton';
import styles from './Modal.module.scss';
import classNames from 'classnames';
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

const Modal = ({ isOpen, close, children, isCollapse }: PlanetModalProps) => {
  const [collapsed, setIsCollapsed] = useState<boolean>(isCollapse);

  useLayoutEffect(() => {
    if (children && isOpen && !isCollapse) {
      setIsCollapsed(false);
    }

    if (children && isOpen && isCollapse) {
      setIsCollapsed(true);
    }
  }, [isOpen]);

  const toggleCollapsed = useCallback(() => {
    setIsCollapsed((collapsed) => !collapsed);
  }, []);

  const paperProps = useMemo(() => {
    return { style: { borderRadius: '20px 20px 0 0', overflow: 'visible', background: '#F0F0F3', height: !collapsed ? 'calc(100vh - 101px)' : 'calc(50vh - 101px)' } };
  }, [collapsed]);

  const height = useMemo(() => {
    return !collapsed ? 'calc(100vh - 101px)' : 'calc(50vh - 101px)';
  }, [collapsed]);

  return (
    <SwipeableDrawer
      anchor={'bottom'}
      disableSwipeToOpen={true}
      container={window.document.body}
      open={isOpen}
      onClose={close}
      onOpen={() => close()}
      swipeAreaWidth={15}
      keepMounted={true}
      PaperProps={paperProps}
    >
      <Grid>
        <Puller />
      </Grid>
      <Grid borderRadius={'20px 20px 0 0'} overflow={'hidden'}>
        {isCollapse && <Grid
          sx={{ background: 'rgba(240,240,243,0.2)', borderRadius: '50%', width: '50px', height: '50px' }}
          position={'absolute'}
          right={'15px'}
          top={'-60px'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <IconButton onClick={toggleCollapsed}>
            <Grid className={classNames({ [styles.iconOpen]: collapsed })}>
              <ArrowDropDown
                sx={{ color: 'white' }}
              />
            </Grid>
          </IconButton>
        </Grid>}
        <Grid overflow={'scroll'} height={height}>
          {children}
        </Grid>
      </Grid>
    </SwipeableDrawer>
  );
};

export default React.memo(Modal);
