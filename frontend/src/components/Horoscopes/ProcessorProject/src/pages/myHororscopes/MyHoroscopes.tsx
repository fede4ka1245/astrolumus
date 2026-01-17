import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Moon from '../../components/moon/Moon';
import { Fade, Grid, Typography } from '@mui/material';
import ButtonBack from '../../components/buttonBack/ButtonBack';
import { useNavigate } from 'react-router-dom';
import { useHideNavbar } from '../../hooks/useHideNavbar';
import DarkThemeBackground from '../../components/darkThemeBackground/DarkThemeBackground';
import authRequest from '../../api/authRequest';
import { SavedHoroscope } from '../../models/types/SavedHoroscopes';
import MyHoroscope from '../../components/myHororscope/MyHoroscope';
import { routes } from '../../models/enums/routes';
import camelcaseKeys from 'camelcase-keys';
import SavedHoroscopeHereAndNow from '../../components/savedHoroscopeHereAndNow/SavedHoroscopeHereAndNow';
import HoroscopeSearch from '../../components/horoscopeSearch/HoroscopeSearch';
import MyHoroscopeLoader from '../../components/myHoroscopeLoader/MyHoroscopeLoader';
import VideoBanners from '../../components/videoBanners/VideoBanners';
import { VideoBannerType } from '../../helpers/videoBannerType';
import CoursesCarousel from '../../components/CoursesCarousel';
import { useGetCourses } from '../../hooks/useGetCourses';
import { CoursesType } from '../../helpers/coursesType';
import IconButton from '../../components/iconButton/IconButton';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import snakeCaseKeys from 'snakecase-keys';
import { Option } from '../../models/types/Option';
import Options from '../../components/options/Options';
import { useGetSavedHoroscopes } from '../../store/selectors';
import { useAppDispatch } from '../../store/store';
import { setSavedHoroscopes } from '../../store/reducers/savedHoroscopesReducer';
import { useSearchParamsState } from '../../hooks/useSearchParamsState';
import { useGetVideoBanners } from '../../hooks/useGetVideoBanners';
import ContentSkeleton from '../../components/contentSkeleton/ContentSkeleton';
import { FirebaseEvent } from '../../helpers/firebase/firebaseEvent';
import { logFirebaseEvent } from '../../helpers/firebase';

const pageSize = 25;
enum HoroscopesOrdering {
  Id = '-id',
  Name = 'name'
}

const orderingOptions: Option [] = [
  {
    value: HoroscopesOrdering.Name,
    label: 'По имени'
  },
  {
    value: HoroscopesOrdering.Id,
    label: 'По дате добавления'
  }
];

const MyHoroscopes = () => {
  const [isSearchOpen, setIsSearchOpen] = useSearchParamsState('isSearchOpen', false, false);
  const [isHoroscopesLoading, setIsHoroscopesLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const savedHoroscopes = useGetSavedHoroscopes();
  const dispatch = useAppDispatch();
  const [ordering, setOrdering] = useState(orderingOptions[0]);
  const [total, setTotal] = useState<number>(0);
  const navigate = useNavigate();
  
  const loadHoroscopes = useCallback((savedHoroscopes: SavedHoroscope [], page: number, ordering: HoroscopesOrdering) => {
    setIsHoroscopesLoading(true);
    authRequest.get(`${import.meta.env.VITE_APP_API_URL}/horoscope/my-horoscopes/`, {
      params: snakeCaseKeys({
        page,
        pageSize,
        ordering
      })
    })
      .then(({ data }) => {
        setTotal(data.count);
        dispatch(setSavedHoroscopes([
          ...savedHoroscopes,
          ...camelcaseKeys(data.results, { deep: true })
        ]));
        setPage((page) => page + 1);
        setHasNext(!!data.next);
      })
      .finally(() => {
        setIsHoroscopesLoading(false);
      });
  }, [dispatch]);

  useEffect(() => {
    dispatch(setSavedHoroscopes([]));
    setIsHoroscopesLoading(true);
    setPage(1);
    loadHoroscopes([], 1, ordering.value);
  }, [ordering.value]);

  const lastItemRef = useInfiniteScroll(() => {
    if (isHoroscopesLoading || isSearchOpen || !hasNext || !savedHoroscopes.length) {
      return;
    }

    loadHoroscopes(savedHoroscopes, page, ordering.value);
  });

  useEffect(() => {
    return () => {
      dispatch(setSavedHoroscopes([]));
    };
  }, []);

  const toggleIsSearchOpen = useCallback(() => {
    if (isSearchOpen) {
      navigate(-1);
    } else {
      setIsSearchOpen(true);
    }
  }, [setIsSearchOpen, isSearchOpen]);

  useHideNavbar();

  const { courses, isLoading: isCoursesLoading } = useGetCourses(CoursesType.myHoroscopes);
  const { banners, isLoading: isBannersLoading } = useGetVideoBanners(VideoBannerType.myHoroscopes);
  
  const isPageLoading = useMemo(() => {
    return isBannersLoading || isCoursesLoading;
  }, [isBannersLoading, isCoursesLoading]);

  useEffect(() => {
    logFirebaseEvent({
      name: FirebaseEvent.openMyHoroscopes
    });
  }, []);

  return (
    <DarkThemeBackground fillBody>
      <Grid position={'relative'} height={'100%'} width={'100%'} minHeight={'100vh'}>
        <Moon/>
        <Grid container pt={2} pb={5} rowSpacing={2} overflow={'hidden'}>
          {isSearchOpen && <HoroscopeSearch close={toggleIsSearchOpen} />}
          {!isSearchOpen && (
            <>
              <Grid item container alignItems={'center'} justifyContent={'space-between'} pr={2} pl={2}>
                <Grid item>
                  <ButtonBack label={'Назад'} onClick={() => navigate(routes.astrologicalProcessor)}/>
                </Grid>
                <IconButton onClick={toggleIsSearchOpen}>
                  <svg width="23" height="23" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8.63636" cy="8.63636" r="7.63636" stroke="#C3C9CD" strokeWidth="2"/>
                    <path d="M14.0908 14.0909L19.0908 19.0909" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </IconButton>
              </Grid>
              {isPageLoading && <Grid width={'100%'} p={2} mt={1}>
                <ContentSkeleton isDarkTheme={true} />
              </Grid>}
              <Fade in={!isPageLoading} timeout={300}>
                <Grid container pt={2} pb={5} rowSpacing={2} overflow={'hidden'}>
                  <Grid item pr={2} pl={2}>
                    <Options
                      options={orderingOptions}
                      setValue={setOrdering}
                      value={ordering.value}
                    />
                  </Grid>
                  <Grid item pt={2} pr={2} pl={2}>
                    <Typography fontFamily={'Playfair Display'} fontWeight={'bold'} fontSize={24} color={'white'} textAlign={'center'}>
                        Мои гороскопы ({ total + 1 })
                    </Typography>
                  </Grid>
                  <Grid item container direction={'column'}>
                    <Grid item pb={4} pr={2} pl={2}>
                      <SavedHoroscopeHereAndNow />
                    </Grid>
                    <Grid pl={2} pr={2} pb={2} display={'flex'} flexDirection={'column'} width={'100%'}>
                      <VideoBanners banners={banners} color={'white'} />
                      <CoursesCarousel courses={courses} />
                    </Grid>
                    {savedHoroscopes?.map((savedHoroscope: SavedHoroscope, index) => (
                      <Grid key={index} item pb={2} pr={2} pl={2}>
                        <MyHoroscope horoscope={savedHoroscope} />
                      </Grid>
                    ))}
                    {isHoroscopesLoading && Array.from({ length: 5 }).map((_, index) => (
                      <Grid pb={2} pr={2} pl={2} key={index}>
                        <MyHoroscopeLoader />
                      </Grid>
                    ))}
                    <div ref={lastItemRef} />
                  </Grid>
                </Grid>
              </Fade>
            </>
          )}
        </Grid>
      </Grid>
    </DarkThemeBackground>
  );
};

export default MyHoroscopes;
