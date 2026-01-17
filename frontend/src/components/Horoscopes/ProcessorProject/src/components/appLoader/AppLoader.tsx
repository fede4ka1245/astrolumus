import React from 'react';
import { Backdrop } from '@mui/material';
import Loader from '../loader/Loader';

interface AppLoaderProps {
  isLoading?: boolean,
}

const AppLoader = ({ isLoading }: AppLoaderProps) => {
  return (
    <Backdrop open={!!isLoading} sx={{ zIndex: 100000 }}>
      <div style={{ height: '100px', width: '100px', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '20px' }}>
        <Loader />
      </div>
    </Backdrop>
  );
};

export default AppLoader;
