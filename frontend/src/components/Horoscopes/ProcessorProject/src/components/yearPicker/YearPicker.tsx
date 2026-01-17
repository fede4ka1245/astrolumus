import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import './YearPicker.scss';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import arrowUp from './assets/arrow-up.svg';
import arrowDown from './assets/arrow-down.svg';

const YearPicker = ({ setYear, years, year }: any) => {
  const currentYears = useMemo(() => {
    if (years) {
      return years as number [];
    }

    return [...(Array.from({ length: 120 }).map((_, index) => new Date().getFullYear() - index))];
  }, [years]);
  const swiper = useRef<any>(null);

  useEffect(() => {
    swiper.current = (document.querySelector('.my-swiper') as any)?.swiper;

    if (year && swiper.current) {
      swiper.current.slideTo(years.findIndex((_year: number) => _year === year));
    }
  }, []);

  const onPrevClick = useCallback(() => {
    if (swiper.current) {
      swiper.current.slidePrev();
    }
  }, []);

  const onNextClick = useCallback(() => {
    if (swiper.current) {
      swiper.current.slideNext();
    }
  }, []);

  const onSwipe = useCallback((swiper: any) => {
    if (setYear) {
      setYear(currentYears[swiper.activeIndex]);
    }
  }, [currentYears, setYear]);

  return (
    <section>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <div style={{ height: '2.9px', width: '100%', background: '#F0F0F3', opacity: 0.3 }}/>
        </div>
        <Swiper
          slidesPerView={'auto'}
          spaceBetween={10}
          freeMode={true}
          pagination={{
            clickable: true
          }}
          direction={'vertical'}
          style={{ height: '200px', width: '150px' }}
          centeredSlides={true}
          className={'my-swiper'}
          onSlideChange={onSwipe}
        >
          {currentYears.map((year, index) => (
            <SwiperSlide key={index} style={{ margin: 0, padding: 0, height: '30px', width: '200px' }}>
              <section style={{ height: '30px', width: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div>
                  {year}
                </div>
              </section>
            </SwiperSlide>
          ))}
        </Swiper>
        <div style={{ flex: 1 }}>
          <img src={arrowUp} style={{ padding: '20px' }} onClick={onPrevClick}/>
          <div style={{ height: '2.9px', width: '100%', background: '#F0F0F3', opacity: 0.3 }}/>
          <img src={arrowDown} style={{ padding: '20px' }} onClick={onNextClick}/>
        </div>
      </div>
    </section>
  );
};

export default YearPicker;
