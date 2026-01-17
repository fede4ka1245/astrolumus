import React from 'react';
import { Grid } from '@mui/material';
import Video from '../video/Video';
import { IBootcamp } from '../../models/interfaces/advertising';

export interface VideoBannersProps {
  banners: IBootcamp []
  color?: string
}

const VideoBanners = ({ banners, color }: VideoBannersProps) => {
  return (
    <>
      {
        banners.map(banner => (
          <Grid mb={2} key={banner.id} height={'max-content'}>
            <Video video={banner} titleColor={color || '#37366B'}/>
          </Grid>
        ))
      }
    </>
  );
};

export default VideoBanners;
