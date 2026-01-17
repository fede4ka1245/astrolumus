import { FC } from 'react';
import { Box } from '@mui/material';
import classnames from 'classnames';

// components
import Header from '../components/Header';
import Slider from '../../../components/courseAd/components/Slider';
import Teachers from '../components/Teachers';
import CoursePrograms from '../components/CoursePrograms';
import { 
  CourseList,
  VideoCourse,
  CourseSlider,
  TelegramChat,
  Question,
  Cause,
  Workshop,
  Galaxy,
  WhatYouBuys
} from '../components';
import { MiniCourseCard } from '../components/paymentCards';

// images
import starsImage from './images/stars.png';
import cosmo from '../images/cosmo_course.png';

// mocks
import { miniCourselist, sliderList, teachers, miniCourseInfo, programs, miniCourseWhatYouBuys } from '../courses_mock';

// styles
import globalStyles from '../styles.module.scss';
import styles from './styles.module.scss';

const AdditionalCourse: FC = () => {
  const marks = [{ value: 0 }, { value: 33 }, { value: 66 }, { value: 100 }];

  return (
    <div className={globalStyles.container}>
      <div className={styles.background_img}>
        <Box sx={{ px: 3.5, flex: 1 }}>
          <Header/>
          <Box sx={{ mb: 1 }}>
            <div className={globalStyles.title}>
              Мини-курс “Поехали!”
            </div>
          </Box>
          <div className={classnames(globalStyles.yellow_text, styles.subtitle)}>
            6 уроков
          </div>
        </Box>
        <div className={styles.shadow_wrapper}>
          <Box sx={{ px: 3.5 }}>
            <Box sx={{ mb: 1 }}>
              <div className={globalStyles.description}>
              Вводный курс астрологии для начинающих. Объясним вам главный секрет
              астрологии - принцип прогнозирования по гороскопу. Этого нет в других школах!
              </div>
            </Box>
            <div className={styles.price}>
              2 590 RUB
            </div>
            <Slider
              marks={marks}
              valueLabelDisplay="on"
              value={66}
              valueLabelFormat={() => '3 дня'}
            />
          </Box>
        </div>
      </div>
      <Box sx={{ display: 'flex', px: 3.5, mb: 2.5 }}>
        <div className={styles.duration}>
         Онлайн-практикум <span className={globalStyles.yellow_text} style={{ marginRight: 5 }}> 11 июля </span>
        </div>
      </Box>
      <Box sx={{ px: 3.5 }}>
        <Box sx={{ mb: 3 }}>
          <button className={globalStyles.button}>
            Записаться на курс
          </button>
        </Box>
        {/* <div className={globalStyles.installment_plan}>
          <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_689_36271)">
              <rect x="13.75" width="17.0897" height="12" transform="rotate(50.4446 13.75 0)" fill="#A38E14"/>
              <rect x="13.4993" y="2.05108" width="14.338" height="9" transform="rotate(50.4446 13.4993 2.05108)" stroke="#6D6012"/>
              <rect x="5.18359" y="2.28711" width="20.5735" height="12" transform="rotate(22.0614 5.18359 2.28711)" fill="#CFB416"/>
              <rect x="6.11153" y="4.28181" width="17.4647" height="9" transform="rotate(22.0614 6.11153 4.28181)" stroke="#917E16"/>
              <rect x="0.5" y="9" width="24" height="12" fill="#F2D113"/>
              <rect x="9.5" y="12" width="6" height="6" rx="3" fill="#9B8714"/>
              <rect x="2" y="10.5" width="21" height="9" stroke="#9B8714"/>
            </g>
            <defs>
              <clipPath id="clip0_689_36271">
                <rect width="24" height="24" fill="white" transform="translate(0.5)"/>
              </clipPath>
            </defs>
          </svg>
          <span style={{ marginLeft: 10 }}>
            доступно в рассрочку
          </span>
        </div> */}
      </Box>
      <Box sx={{ mb: 4.5 }}>
        <CourseList list={miniCourselist}/>
      </Box>
      <Box sx={{ mb: 4.5 }}>
        <VideoCourse/>
      </Box>
      <Box sx={{ mb: 9.3, position: 'relative', zIndex: 1 }}>
        <CourseSlider list={sliderList}/>
      </Box>
      <Box sx={{ px: 3.5, mb: 3.5 }}>
        <div className={globalStyles.title}>
          Что будет на курсе
        </div>
      </Box>  
      <div className={styles.course_steps}>
        {miniCourseInfo.map((item, index) => (
          <div className={globalStyles.list_item} key={index}>
            {item.text}
          </div>
        ))}
      </div>
      <Box sx={{ px: 3.5, mb: 4.5 }}>
        <Workshop/>
      </Box>
      <Box sx={{ px: 3.5, mb: 6.5 }}>
        <Teachers teachers={teachers}/>
      </Box> 
      <Box sx={{ px: 3.5, mb: 5.5 }}>
        <CoursePrograms
          programs={programs}
        />
      </Box>  
      <Box sx={{ mb: 15 }}>
        <TelegramChat/>
      </Box>
      <Box sx={{ px: 3.5, mb: 6.5 }}>
        <MiniCourseCard/>
      </Box>
      <Box sx={{ px: 3.5, mb: 3.5 }}>
        <WhatYouBuys whatYouBuys={{
          title: "<div style='color: #FFF'>ЧТО ВЫ ПОЛУЧИТЕ В РЕЗУЛЬТАТЕ КУРСА?</div>",
          list: miniCourseWhatYouBuys,
          image: cosmo
        }}/>
      </Box> 
      <Box sx={{ mb: 6 }}>
        <Question 
          background_img={starsImage}
        />
      </Box>
      <Cause/>
      <Box sx={{ px: 3.5, mb: 5.5 }}>
        <Galaxy/>
      </Box>
      <Box sx={{ px: 3.5 }}>
        <Workshop/>
      </Box>
    </div>
  );
};

export default AdditionalCourse;
