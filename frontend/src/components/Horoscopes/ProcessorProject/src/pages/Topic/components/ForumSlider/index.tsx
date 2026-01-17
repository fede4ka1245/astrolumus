import { FC } from 'react';
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Grid } from '@mui/material';

import ImageZoom from '../../../../hoc/ImageZoom';
import { ITopicImage } from '../../../../models/interfaces/topic';

import 'swiper/css';
import 'swiper/css/pagination';
import './styles.scss';

interface IProps {
  images: ITopicImage[]
}

const ForumSlider: FC<IProps> = ({ images }) => {
  return (
    <Swiper
      slidesPerView="auto"
      spaceBetween={10}
      centeredSlides={true}
      loop={images.length > 1}
      modules={[Pagination]}
      pagination={{
        clickable: true
      }}
      className="forum-slider"
    >
      {images.map((item, index) => (
        <SwiperSlide key={item.id}>
          <Grid width={'288px'} height={'288px'} borderRadius={'10px'} overflow={'hidden'}>
            <ImageZoom slide={index} images={images.map(item => item.image_original)}>
              <img src={item.image} width={'100%'} height={'100%'}/>
            </ImageZoom>
          </Grid>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ForumSlider;
