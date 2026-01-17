import React, { FC, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import parse from 'html-react-parser';

// components
import Header from '../components/Header';
import Slider from '../../../components/courseAd/components/Slider';
import Teachers from '../components/Teachers';
import { 
  CourseCard
} from '../components/paymentCards';
import ProgramCards from '../components/ProgramCards';
import { 
  CourseList,
  VideoCourse,
  CourseSlider,
  Galaxy,
  TelegramChat,
  Certificate,
  Question,
  Cause,
  WithinCourse,
  WhatYouBuys
} from '../components';

// mocks
import {
  list,
  sliderList, 
  teachers, 
  withinCourses, 
  modules, 
  nominalCertificate, 
  whatYouBuys,
  payInFull,
  payInMonth
} from '../courses_mock';

// images
import shutterstock from '../images/shutterstock.png';
import universe from '../images/universe.jpg';

// styles
import globalStyles from '../styles.module.scss';
import styles from './styles.module.scss';

const CourseSteps: FC = () => {
  const marks = [{ value: 0 }, { value: 33 }, { value: 66 }, { value: 100 }];
  return (
    <div className={globalStyles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <Box sx={{ px: 3.5, flex: 1 }}>
            <Header/>
            <div className={styles.step}>
              <Box sx={{ mr: 3 }}>
                <div className={globalStyles.yellow_text}>
                  1 ступень
                </div>
              </Box>
              <div className={globalStyles.yellow_text}>
                Специалист
              </div>
            </div>
            <Box sx={{ mb: 1 }}>
              <div className={globalStyles.title}>
                Инструменты астролога
              </div>
            </Box>
            <Box sx={{ mb: 1 }}>
              <div className={globalStyles.subtitle}>
                База анализа гороскопа. Гороскоп вопроса.
              </div>
            </Box>
          </Box>
          <div className={styles.shadow_wrapper}>
            <Box sx={{ px: 3.5 }}>
              <Box sx={{ mb: 6 }}>
                <div className={globalStyles.description}>
                  Ввод в восстребованную профессию и возможность обучаться и зарабатывать из любой точки мира
                </div>
              </Box>
              <Slider
                marks={marks}
                valueLabelDisplay="on"
                value={66}
                valueLabelFormat={() => '3 дня'}
              />
            </Box>
          </div>
        </div>
        <img src={shutterstock} className={styles.background_image}/>
      </div>
      <Box sx={{ display: 'flex', px: 3.5, mb: 2.5 }}>
        <div className={styles.duration}>
          <span className={globalStyles.yellow_text} style={{ marginRight: 5 }}>
            6
          </span>
          месяцев
        </div>
        <div className={styles.line}/>
        <div className={styles.duration}>
          Старт
          <span className={globalStyles.yellow_text} style={{ margin: '0px 5px' }}>
            22
          </span>
          ноября
        </div>
      </Box>
      <Box sx={{ px: 3.5 }}>
        <Box sx={{ mb: 3 }}>
          <a className={globalStyles.button} href="#">
            Записаться на курс
          </a>
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
        <CourseList list={list}/>
      </Box>
      <Box sx={{ mb: 4.5 }}>
        <VideoCourse/>
      </Box>
      <Box sx={{ mb: 9.3 }}>
        <CourseSlider list={sliderList}/>
      </Box>
      <WithinCourse withinCourses={withinCourses}/>
      <Box sx={{ px: 3.5, mb: 3.5 }}>
        <Galaxy/>
      </Box>
      <Box sx={{ px: 3.5, mb: 5.5 }}>
        <Teachers teachers={teachers}/>
      </Box>  
      <Box sx={{ mb: 6.5 }}>
        <TelegramChat/>
      </Box>
      <Box sx={{ px: 3.5, mb: 6 }}>
        <ProgramCards modules={modules}/>
      </Box>
      <Box sx={{ px: 3.5, mb: 6 }}>
        <Certificate certificate={nominalCertificate}/>
      </Box>
      <Box sx={{ px: 3.5, mb: 3.5 }}>
        <WhatYouBuys whatYouBuys={{
          title: 'Что вы покупаете',
          list: whatYouBuys
        }}/>
      </Box>
      <Box sx={{ px: 3.5, mb: 3.5 }}>
        <div className={globalStyles.payment_title}>
          Успейте присоединиться к потоку по выгодной ранней цене! Ранняя цена действует по 6 января включительно.
        </div>
      </Box>
      <Box sx={{ px: 3.5, mb: 6.5 }}>
        <CourseCard
          payment={payInFull}
        />
        <CourseCard
          backgroundColor="#192239"
          payment={payInMonth}
        />
      </Box>  
      <Box sx={{ mb: 6 }}>
        <Question
          background_img={universe}
        />
      </Box>
      <Cause/>
      <Box sx={{ px: 3.5 }}>
        <Galaxy/>
      </Box>
    </div>
  );
};

export default CourseSteps;
