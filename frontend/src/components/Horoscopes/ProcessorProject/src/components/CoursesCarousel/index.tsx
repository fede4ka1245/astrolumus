import { FC, useCallback, useEffect, useState } from 'react';
import Slider from 'react-slick';
import classnames from 'classnames';
import SliderBar from '../courseAd/components/Slider';
import { IBootcamp } from '../../models/interfaces/bootcamp';
import './slider.scss';
import styles from './styles.module.scss';
import FinishedSlider from '../courseAd/components/FinishedSlider';
import AspectRatio from '@mui/joy/AspectRatio';

interface IProps {
  bootcamp: IBootcamp;
}

interface CarouselCoursesProps {
  courses: IBootcamp []
}

const CarouselItem: FC<IProps> = ({ bootcamp }) => {
  const navigateToCourse = useCallback(() => {
    window.open(bootcamp.link);
  }, []);
  
  return (
    <AspectRatio ratio={41 / 27}>
      <div className={styles.slider_item} onClick={navigateToCourse}>
        {/* <div className={styles.text_wrapper}> */}
        {/*  <div className={styles.title}> */}
        {/*    {bootcamp.title} */}
        {/*  </div> */}
        {/*  <div className={styles.descr}> */}
        {/*    {bootcamp.description} */}
        {/*  </div> */}
        {/*  <div className={styles.date}> */}
        {/*    Дата старта {insertZero(date.getDate())}.{insertZero(date.getMonth() + 1)}.{insertZero(date.getFullYear())} */}
        {/*  </div> */}
        {/* </div> */}
        <img src={bootcamp.image} className={styles.slider_image}/>
        <img src={bootcamp.image} className={styles.slider_image_background}/>
      </div>
    </AspectRatio>
  );
};

const CoursesCarousel: FC<CarouselCoursesProps> = ({ courses }) => {
  const [daysPercent, setDaysPercent] = useState<number>(0);
  const [daysCount, setDaysCount] = useState<number>(0);

  const getPercentUntilDeadline = (deadline: Date) => {
    const deadlineDate = new Date(deadline);
    const countdownDate = new Date(deadlineDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    const currentDate = new Date();
    const isWithin30Days = currentDate >= countdownDate && currentDate <= deadlineDate;
    if (currentDate > deadlineDate) {
      return 100;
    } else if (isWithin30Days) {
      const daysLeft = Math.ceil((deadlineDate.getTime() - currentDate.getTime()) / (24 * 60 * 60 * 1000));
      return Math.round((30 - daysLeft) / 29 * 99);
    } else {
      return 0;
    }
  };

  const getDaysUntilDeadline = (deadline: Date) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
  
    const timeDifference = deadlineDate.getTime() - now.getTime();
    const daysUntilDeadline = Math.ceil(timeDifference / (24 * 60 * 60 * 1000));
  
    return daysUntilDeadline;
  };
  
  useEffect(() => {
    if (courses.length <= 0) {
      return;
    }

    handleSlideChange(courses[0]);
  }, [courses]);

  const handleSlideChange = (bootcamp: IBootcamp) => {
    setDaysPercent(getPercentUntilDeadline(bootcamp.publish_start));
    setDaysCount(getDaysUntilDeadline(bootcamp.publish_start));
  };

  const declensionOfDays = (number: number) => {
    const cases = [2, 0, 1, 1, 1, 2];
    const titles = ['день', 'дня', 'дней'];
    const index = (number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5];

    return titles[index];
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 4000,
    dotsClass: 'courses-slider_dots'
  };

  // if (courses?.length === 0) {
  //   return <AspectRatio ratio={41 / 27}>
  //     <Skeleton variant={'rectangular'} style={{ width: '100%', borderRadius: '20px' }} />
  //   </AspectRatio>;
  // }

  if (courses?.length === 0) {
    return null;
  }

  return (
    <div className={styles.slider}>
      {/* <div className={styles.soon_bar}>Скоро</div> */}
      <div className={classnames(styles.slider_wrapper, 'courses-slider-wrapper')}>
        <Slider {...settings} afterChange={(index) => handleSlideChange(courses[index])}>
          {
            courses.map(item => (
              <div key={item.id} style={{ borderRadius: '20px', overflow: 'hidden' }}>
                <CarouselItem bootcamp={item}/>
              </div>
            ))
          }
          
        </Slider>
      </div>  
      <div className={styles.slider_bar_wrapper}>
        {
          daysPercent === 100 
            ? (
              <FinishedSlider
                valueLabelDisplay="on"
                value={daysPercent}
                valueLabelFormat="Стартовал!"
              />
            ) 
            : (
              <SliderBar
                marks={[{ value: 0 }, { value: 100 }]}
                valueLabelDisplay="on"
                value={daysPercent}
                valueLabelFormat={`${daysCount} ${declensionOfDays(daysCount)}`}
              />
            ) 
        }
      </div>
    </div>
  );
};

export default CoursesCarousel;
