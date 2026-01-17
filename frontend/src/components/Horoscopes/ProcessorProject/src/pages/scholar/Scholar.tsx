import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHideNavbar } from '../../hooks/useHideNavbar';
import DarkThemeBackground from '../../components/darkThemeBackground/DarkThemeBackground';
import { Fade, Grid } from '@mui/material';
import Button from '../../components/button/Button';
import styles from './Scholar.module.scss';
import { useNavigate } from 'react-router-dom';
import ButtonBack from '../../components/buttonBack/ButtonBack';
import CoursesCarousel from '../../components/CoursesCarousel';
import { useGetCourses } from '../../hooks/useGetCourses';
import authRequest from '../../api/authRequest';
import camelcaseKeys from 'camelcase-keys';
import { processorRoutes } from '../astrlogicalProcessor/processorRoutes';
import VideoBanners from '../../components/videoBanners/VideoBanners';
import { VideoBannerType } from '../../helpers/videoBannerType';
import { CoursesType } from '../../helpers/coursesType';
import IconButton from '../../components/iconButton/IconButton';
import { useGetVideoBanners } from '../../hooks/useGetVideoBanners';
import ContentSkeleton from '../../components/contentSkeleton/ContentSkeleton';
import { useIsPaymentsEnabled } from '../../hooks/useIsPaymentsEnabled';

interface ScholarType {
  title: string
  description: string,
  mainDescription: string,
  link: string,
  subTitle: string
}

const Scholar = () => {
  const [scholar, setScholar] = useState<ScholarType>();
  const [isScholarLoading, setIsScholarLoading] = useState(false);
  const navigate = useNavigate();
  const isPaymentsEnabled = useIsPaymentsEnabled();

  const onBackClick = useCallback(() => {
    navigate(-1);
  }, []);

  const onWalletClick = useCallback(() => {
    navigate(processorRoutes.rates);
  }, []);

  useEffect(() => {
    setIsScholarLoading(true);
    authRequest.get(`${import.meta.env.VITE_APP_API_URL}/info/app-part-info/scholar/`)
      .then(({ data }) => {
        setScholar(camelcaseKeys(data, { deep: true }));
      })
      .finally(() => {
        setIsScholarLoading(false);
      });
  }, []);
  
  useHideNavbar();

  const { courses, isLoading: isCoursesLoading } = useGetCourses(CoursesType.scholar);
  
  const onButtonClick = useCallback(() => {
    window.open(scholar?.link);
  }, [scholar]);

  const { banners, isLoading: isBannersLoading } = useGetVideoBanners(VideoBannerType.Scholar);

  const isLoading = useMemo(() => {
    return isCoursesLoading || isScholarLoading || isBannersLoading;
  }, [isCoursesLoading, isScholarLoading, isBannersLoading]);

  return (
    <DarkThemeBackground fillBody={true} backgroundVariant={'galaxy'}>
      <Grid display={'flex'} flexDirection={'column'} p={2} height={'100vh'}>
        <Grid mt={5}>
          <Grid display={'flex'}>
            <ButtonBack label={'Назад'} onClick={onBackClick} />
            {isPaymentsEnabled && <Grid item ml={'auto'} display={'flex'} alignItems={'center'}>
              <IconButton onClick={onWalletClick}>
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g opacity="0.7">
                    <path d="M23.3136 13.9474V10.593C23.3136 9.49145 22.4175 8.59527 21.3159 8.59527H13.357C13.4472 8.26001 13.4941 7.9116 13.4941 7.55583C13.4941 7.21798 13.4515 6.88999 13.372 6.57652C14.1034 7.42837 15.1869 7.96959 16.3951 7.96959C18.5923 7.96959 20.3799 6.18205 20.3799 3.9848C20.3799 1.78755 18.5923 0 16.395 0C14.1978 0 12.4102 1.78755 12.4102 3.9848C12.4102 4.32264 12.4528 4.65069 12.5323 4.96411C11.8009 4.11226 10.7174 3.57103 9.50923 3.57103C7.31203 3.57103 5.52448 5.35863 5.52448 7.55583C5.52448 7.91155 5.57135 8.25991 5.66154 8.59527H3.05139C1.94985 8.59527 1.05371 9.4914 1.05371 10.593V24.0023C1.05371 25.1038 1.94985 26 3.05139 26H21.3159C22.4174 26 23.3136 25.1038 23.3136 24.0023V20.6478C24.2314 20.5406 24.9461 19.7586 24.9461 18.8125V15.7828C24.9462 14.8366 24.2314 14.0546 23.3136 13.9474ZM16.395 1.6803C17.6657 1.6803 18.6995 2.7141 18.6995 3.9848C18.6995 5.25549 17.6657 6.2893 16.395 6.2893C15.1243 6.2893 14.0905 5.25549 14.0905 3.9848C14.0905 2.7141 15.1243 1.6803 16.395 1.6803ZM9.50928 5.25128C10.78 5.25128 11.8138 6.28508 11.8138 7.55578C11.8138 7.92222 11.7293 8.27545 11.567 8.59522H7.45153C7.28928 8.2754 7.20478 7.92222 7.20478 7.55578C7.20483 6.28513 8.23858 5.25128 9.50928 5.25128ZM21.6333 24.0022C21.6333 24.1773 21.4909 24.3196 21.3158 24.3196H3.05134C2.8763 24.3196 2.73396 24.1772 2.73396 24.0022V10.5929C2.73396 10.4179 2.87635 10.2755 3.05134 10.2755C3.41356 10.2755 20.8794 10.2755 21.3158 10.2755C21.4909 10.2755 21.6333 10.4179 21.6333 10.5929V13.9345C21.1106 13.9345 16.2286 13.9345 15.7045 13.9345C14.7183 13.9345 13.916 14.7368 13.916 15.723C13.916 16.4251 13.916 18.6126 13.916 18.8723C13.916 19.8584 14.7183 20.6608 15.7045 20.6608C16.2285 20.6608 21.1106 20.6608 21.6333 20.6608V24.0022ZM23.2659 18.8124C23.2659 18.9051 23.1906 18.9804 23.0979 18.9804C22.8327 18.9804 16.1316 18.9804 15.7643 18.9804C15.6717 18.9804 15.5963 18.9051 15.5963 18.8124V15.7827C15.5963 15.6901 15.6717 15.6147 15.7643 15.6147C16.1398 15.6147 22.8376 15.6147 23.0979 15.6147C23.1905 15.6147 23.2659 15.6901 23.2659 15.7827V18.8124Z" fill="white"/>
                    <path d="M17.2733 18.4106C17.888 18.4106 18.3864 17.9122 18.3864 17.2974C18.3864 16.6827 17.888 16.1843 17.2733 16.1843C16.6585 16.1843 16.1602 16.6827 16.1602 17.2974C16.1602 17.9122 16.6585 18.4106 17.2733 18.4106Z" fill="white"/>
                  </g>
                </svg>
              </IconButton>
            </Grid>}
          </Grid>
        </Grid>
        {isLoading && <Grid mt={2}>
          <ContentSkeleton isDarkTheme={true} />
        </Grid>}
        
        <Fade in={!isLoading} timeout={400}>
          <Grid display={'flex'} flexDirection={'column'} style={{ overflowY: 'scroll', overflowX: 'hidden' }} flex={1}>
            <h1 className={styles.title}>
              {scholar?.title}
            </h1>
            <p className={styles.subTitle} dangerouslySetInnerHTML={{ __html: scholar?.subTitle || '' }} />
            <Grid mt={2}>
              <p className={styles.text} dangerouslySetInnerHTML={{ __html: scholar?.description || '' }} />
            </Grid>
            <Grid item mt={3} maxWidth={'100%'} overflow={'visible'}>
              <CoursesCarousel courses={courses} />
            </Grid>
            <Grid mt={1} flex={1}>
              <p className={styles.text} dangerouslySetInnerHTML={{ __html: scholar?.mainDescription || '' }} />
            </Grid>
            <Grid mt={2} mb={2}>
              <VideoBanners banners={banners} color={'white'} />
            </Grid>
          </Grid>
        </Fade>
        <Fade in={true} timeout={300}>
          <Grid mt={2} mb={2}>
            <Button text={'Техническая поддержка'} onClick={onButtonClick} />
          </Grid>
        </Fade>
      </Grid>
    </DarkThemeBackground>
  );
};

export default Scholar;
