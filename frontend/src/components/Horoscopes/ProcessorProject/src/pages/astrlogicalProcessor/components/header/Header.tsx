import React from 'react';
import { Grid, Typography } from '@mui/material';
import menu from './assets/menu.svg';
import setting from './assets/setting.svg';
import wallet from './assets/wallet.svg';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { routes } from '../../../../models/enums/routes';
import { processorRoutes } from '../../processorRoutes';
import { ProcessorContext } from '../../../../models/interfaces/processorContext';
import IconButton from '../../../../components/iconButton/IconButton';
import { useIsPaymentsEnabled } from '../../../../hooks/useIsPaymentsEnabled';

const Header = () => {
  const navigate = useNavigate();
  const { route, isExternalHoroscope } = useOutletContext<ProcessorContext>();
  const isPaymentsEnabled = useIsPaymentsEnabled();

  const onMenuButtonClick = () => {
    navigate(routes.menu);
  };

  const onSettingsClick = () => {
    navigate(route + processorRoutes.settings);
  };

  const onWalletClick = () => {
    navigate(route + processorRoutes.rates);
  };

  return (
    <Grid item container direction={'row'} alignItems={'center'}>
      {!isExternalHoroscope && <Grid item pr={3} display={'flex'} justifyContent={'center'} alignItems={'center'}>
        <IconButton onClick={onMenuButtonClick}>
          <img alt='menu' width={'30px'} height={'30px'} src={menu}/>
        </IconButton>
      </Grid>}
      <Grid item flex={1}>
        <Typography color={'white'} fontFamily={'Gilroy'}>
          Астропроцессор
        </Typography>
      </Grid>
      {!isExternalHoroscope && isPaymentsEnabled && <Grid item display={'flex'} alignItems={'center'}> 
        <IconButton onClick={onWalletClick}> 
          <img alt='wallet' width={'24px'} height={'24px'} src={wallet}/> 
        </IconButton> 
      </Grid>} 
      {!isExternalHoroscope && <Grid ml={3} item display={'flex'} alignItems={'center'}>
        <IconButton onClick={onSettingsClick}>
          <img alt='setting' width={'28px'} height={'28px'} src={setting}/>
        </IconButton>
      </Grid>}
    </Grid>
  );
};

export default Header;
