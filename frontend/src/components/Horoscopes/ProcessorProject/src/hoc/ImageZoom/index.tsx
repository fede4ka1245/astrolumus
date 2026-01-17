import { FC, useState, useRef } from 'react';
import { Grid, Zoom, Modal } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';

import styles from './styles.module.scss';

interface IProps {
  children: any;
  images: string[];
  slide?: number;
}

const ImageZoom: FC<IProps> = ({ children, images, slide = 0 }) => {
  const [isOpen, setIsOpean] = useState<boolean>(false);
  const windowWidth = useRef(window.innerWidth);
  const handleOpen = () => {
    setIsOpean(true);
  };

  const handleClose = () => {
    setIsOpean(false);
  };

  return (
    <Grid width={'100%'} height={'100%'}>
      <Grid className={styles.children_container} onClick={handleOpen}>
        {children}
      </Grid>
      <Modal
        open={isOpen}
        onClose={handleClose}
      >
        <Grid className={styles.container} width={windowWidth.current - 20}>
          <Swiper
            slidesPerView={1}
            spaceBetween={10}
            freeMode={true}
            initialSlide={slide}
            centeredSlides={true}
            style={{
              height: '100%'
            }}
          >
            {images.map((item, index) => (
              <SwiperSlide key={index} style={{ height: '100%', width: '100%' }}>
                <Zoom
                  in={true}
                  style={{ transitionDelay: '100ms' }}
                >
                  <img src={item} className={styles.image} onClick={handleClose}/>
                </Zoom>
              </SwiperSlide>
            ))}
          </Swiper>
        </Grid>
      </Modal>
    </Grid>
  );
};

export default ImageZoom;
