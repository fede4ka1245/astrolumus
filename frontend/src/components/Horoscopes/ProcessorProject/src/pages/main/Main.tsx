import React, { useCallback, useMemo, useState } from 'react';
import { CardActionArea, Fade, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/store';
import UserHeader from '../../components/userHeader/UserHeader';
import PageHeader from '../../components/pageHeader/PageHeader';
import CoursesCarousel from '../../components/CoursesCarousel';
import Processor from './components/processor/Processor';
import Background from '../../components/background/Background';
import { Topics } from './components/sections';
import Friends from '../../components/sections/Friends';
import Search from './components/sections/Search';
import { useGetCourses } from '../../hooks/useGetCourses';
import { processorRoutes } from '../astrlogicalProcessor/processorRoutes';
import VideoBanners from '../../components/videoBanners/VideoBanners';
import { VideoBannerType } from '../../helpers/videoBannerType';
import { CoursesType } from '../../helpers/coursesType';
import IconButton from '../../components/iconButton/IconButton';
import { useGetVideoBanners } from '../../hooks/useGetVideoBanners';
import ContentSkeleton from '../../components/contentSkeleton/ContentSkeleton';
import WarnInfo from '../../components/warnInfo/WarnInfo';
import ShowMoreButton from './components/showMoreButton/ShowMoreButton';
import { routes } from '../../models/enums/routes';
import { useIsPaymentsEnabled } from '../../hooks/useIsPaymentsEnabled';
import { getIsForumEnabled } from '../../helpers/getIsForumEnabled';

const Main = () => {
  const { id } = useAppSelector(state => state.user.userInfo);
  const [isOpenSearch, setIsOpenSearch] = useState<boolean>(false);
  const navigate = useNavigate();
  const isPaymentsEnabled = useIsPaymentsEnabled();
  const onWalletClick = useCallback(() => {
    navigate(processorRoutes.rates);
  }, [navigate]);

  const onForumOpen = useCallback(() => {
    navigate(routes.forum);
  }, [navigate]);

  const { banners, isLoading: isVideosLoading } = useGetVideoBanners(VideoBannerType.Home);
  const { courses, isLoading: isCoursesLoading } = useGetCourses(CoursesType.home);
  const isForumEnabled = getIsForumEnabled();
  
  const closeIsSearch = useCallback(() => {
    setIsOpenSearch(false);
  }, []);

  const isPageLoading = useMemo(() => {
    return isCoursesLoading || isVideosLoading;
  }, [isCoursesLoading, isVideosLoading]);

  if (isOpenSearch) {
    return <Search closeSearch={closeIsSearch}/>;
  }

  return (
    <>
      <Background background={'#F0F0F3'} />
      <UserHeader />
      <PageHeader 
        page={'Меню'}
        content={<>
          {isPaymentsEnabled && <Grid item display={'flex'} alignItems={'center'}>
            <IconButton onClick={onWalletClick}> 
              <img alt='wallet' width={'24px'} height={'24px'} src={'/assets/wallet-forum.svg'}/>
            </IconButton> 
          </Grid>}
          {isForumEnabled && (
            <Grid item display={'flex'} alignItems={'center'}>
              <IconButton onClick={() => setIsOpenSearch(true)}>
                <svg width="23" height="23" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8.63636" cy="8.63636" r="7.63636" stroke="#979C9E" strokeWidth="2"/>
                  <path d="M14.0908 14.0909L19.0908 19.0909" stroke="#979C9E" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </IconButton>
            </Grid>
          )}
        </>}
      />
      <Grid ml={2} mr={2}>
        <WarnInfo />
      </Grid>
      {isPageLoading && (
        <Grid m={2}>
          <ContentSkeleton />
        </Grid>
      )}
      <Fade mountOnEnter in={!isPageLoading} timeout={400}>
        <div>
          <Grid item pl={2} pr={2} pt={3}>
            <CoursesCarousel courses={courses}/>
          </Grid>
          <Grid>
            {isForumEnabled && (
              <Grid>
                <Topics
                  showMoreActive={false}
                  showFilters={false}
                  header={'Последние темы на форуме'}
                />
                <Grid pl={2} pr={2} pb={5}>
                  <CardActionArea onClick={onForumOpen}>
                    <ShowMoreButton text={'Перейти на форум'} />
                  </CardActionArea>
                </Grid>
              </Grid>
            )}
            {/* <Courses/> */}
            <Grid p={2}>
              <VideoBanners banners={banners} />
            </Grid>
            <Grid pl={2} pr={2}>
              <Processor />
            </Grid>
            {isForumEnabled && (
              <Grid mb={6} pt={2}>
                {id > 0 && <Friends id={id}/>}
              </Grid>
            )}
          </Grid>
        </div>
      </Fade>
    </>
  );
};

export default Main;
