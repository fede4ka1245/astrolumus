import React, { memo, startTransition, useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation, useOutletContext } from '../../contexts/NavigationContext';
import { Grid } from '@mui/material';
import Map from '../../components/map/Map';
import Input from '../../components/input/Input';
import { Option } from '../../models/types/Option';
import { InputType } from '../../components/input/InputType';
import { OptionSelector } from '../../components/optionSelector/OptionSelector';
import { Swiper, SwiperSlide } from 'swiper/react';
import './Horoscopes.scss';
import {
  useGetCurrentHoroscopeId,
  useGetHoroscopeAddressInformation,
  useGetHoroscopeUserInfo,
  useGetIsTransitionMapsActive,
  useGetIsVarshpahalaLoading,
  useGetIsYearPickerActive,
  useGetMaps,
  useGetMapType,
  useGetRectification,
  useGetSavedHoroscopeId,
  useGetTargetMapValue,
  useGetTransitionMaps,
  useGetVarshpahalaMaps
} from '../../store/selectors';
import {
  setProcessorTargetRoute,
  setTargetMapValue,
  setTargetProcessorObject
} from '../../store/reducers/horoscopesReducer';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { getTimeZoneOffsetFromGreenwichData } from '../../helpers/getTimeZoneOffsetFromGreenwichData';
import DarkThemeBackground from '../../components/darkThemeBackground/DarkThemeBackground';
import authRequest from '../../api/authRequest';
import { AspectType } from '../../components/map/types';
import { useHideNavbar } from '../../hooks/useHideNavbar';
import { processorRoutes } from '../astrlogicalProcessor/processorRoutes';
import { ProcessorContext } from '../../models/interfaces/processorContext';
import { useClearHoroscope } from '../../hooks/useClearHoroscope';
import { getProcessorRoutes } from './logic/getProcessorRoutes';
import ObjectDescription from './objectDescription';
import { useSearchParamsState } from '../../hooks/useSearchParamsState';
import Ashtakavarga from './ashtakavarga/Ashtakavarga';
import Dashi from './dashi/Dashi';
import NatMap from './natMap/NatMap';
import Zones from './zones/Zones';
import Transitions from './transitions/Transitions';
import Yogas from './yogas/Yogas';
import Rectification from './rectification/Rectification';
import Varshapkhala from './varshapkhala/Varshapkhala';
import Settings from '../settings/index/Index';

const MemoizedObjectDescription = memo(ObjectDescription);

interface HoroscopesProps {
  childComponent?: React.ComponentType;
}

const Index: React.FC<HoroscopesProps> = ({ childComponent }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const swiper = useRef<any>();
  const targetMapValue = useGetTargetMapValue();
  const maps = useGetMaps();
  const dispatch = useAppDispatch();
  const horoscopeUserInfo = useGetHoroscopeUserInfo();
  const mapsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fixedTop, setFixedTop] = React.useState<number>(0);
  const varshpahalaMaps = useGetVarshpahalaMaps();
  const isYearPickerActive = useGetIsYearPickerActive();
  const isTransitionMapsActive = useGetIsTransitionMapsActive();
  const transitionMaps = useGetTransitionMaps();
  const address = useGetHoroscopeAddressInformation();
  const rectification = useGetRectification();
  const savedHoroscopeId = useGetSavedHoroscopeId();
  const targetHoroscopeId = useGetCurrentHoroscopeId();
  const mapType = useGetMapType();
  const { route, isExternalHoroscope } = useOutletContext<ProcessorContext>();
  const processorRoutesOptions = useMemo(() => getProcessorRoutes(route), [route]);
  const targetRoute = useAppSelector((state) => state.horoscopes.targetRoute);

  useLayoutEffect(() => {
    dispatch(setProcessorTargetRoute(processorRoutesOptions[0]));
  }, []);

  useEffect(() => {
    if (targetHoroscopeId) {
      authRequest.patch(`${import.meta.env.VITE_APP_API_URL}/horoscope/my-horoscopes/${targetHoroscopeId}/`, {
        city: address.location.value,
        name: horoscopeUserInfo.name
      }).catch((error) => {
        console.warn('Failed to update horoscope:', error);
      });
    }
  }, [targetHoroscopeId, horoscopeUserInfo.name, address.location]);

  useHideNavbar();

  useEffect(() => {
    if (savedHoroscopeId) {
      authRequest.patch(`${import.meta.env.VITE_APP_API_URL}/horoscope/horoscopes/${savedHoroscopeId}/`, {
        longitude: address.coordinates.longitude,
        latitude: address.coordinates.latitude,
        dt: horoscopeUserInfo.date.split('.').reverse().join('-') + 'T' + horoscopeUserInfo.time,
        tz_hour: Number(address.timeZone.greenwich + address.timeZone.hours),
        tz_minutes: address.timeZone.minutes,
        settings: address.isCustomCoordinates ? 'customCoordinates' : ''
      }).catch((error) => {
        console.warn('Failed to update horoscope data:', error);
      });
    }
  }, [savedHoroscopeId, horoscopeUserInfo.date, horoscopeUserInfo.time, address]);

  const mapTransitSections = useCallback((targetValue: string) => {
    if (!transitionMaps.length) {
      return;
    }

    return transitionMaps.find(({ value }) => targetValue === value)?.mapSections;
  }, [transitionMaps]);

  const timeZoneOffset = useMemo(() => {
    if (targetRoute.value === route + processorRoutes.rectification) {
      return getTimeZoneOffsetFromGreenwichData(
        rectification.addressInformation.timeZone.greenwich,
        rectification.addressInformation.timeZone.hours,
        rectification.addressInformation.timeZone.minutes
      );
    }

    return getTimeZoneOffsetFromGreenwichData(
      address.timeZone.greenwich,
      address.timeZone.hours,
      address.timeZone.minutes
    );
  }, [address.timeZone, rectification, targetRoute, route]);

  useEffect(() => {
    if (!targetRoute?.value) {
      return;
    }

    // Проверяем, не совпадает ли уже текущий роут с targetRoute
    const currentPath = location.pathname.replace(/\/$/, '');
    const targetPath = targetRoute.value.replace(/\/$/, '');
    
    if (currentPath === targetPath) {
      // Роут уже установлен, не нужно навигировать снова
      // Но все равно обновляем swiper settings
      if (swiper.current) {
        if (targetRoute.value === route + processorRoutes.ashtakavarga || targetRoute.value.endsWith(processorRoutes.ashtakavarga)) {
          swiper.current.allowTouchMove = false;
        } else {
          swiper.current.allowTouchMove = true;
        }
      }
      return;
    }
    
    dispatch(setTargetMapValue('D-1'));
    
    // Navigate to the new route
    navigate(targetRoute.value, {
      replace: true
    });

    if (!swiper.current) {
      return;
    }

    if (targetRoute.value === route + processorRoutes.ashtakavarga || targetRoute.value.endsWith(processorRoutes.ashtakavarga)) {
      swiper.current.allowTouchMove = false;
      return;
    }

    swiper.current.allowTouchMove = true;
  }, [targetRoute?.value, route, navigate, dispatch, location.pathname]);

  const onSwipe = useCallback((swiper: any) => {
    if (typeof swiper?.activeIndex !== 'number') {
      return;
    }

    dispatch(setTargetMapValue(maps[swiper?.activeIndex].value));
  }, [dispatch, maps]);

  const onMapSet = useCallback(({ value }: Option) => {
    dispatch(setTargetMapValue(value));
  }, []);

  const isMapSelectDisabled = useMemo(() => {
    return targetRoute.value === route + processorRoutes.ashtakavarga;
  }, [targetRoute, route]);

  const currentMaps = useMemo(() => {
    if (targetRoute.value === route + processorRoutes.rectification) {
      return rectification.maps;
    }

    if (targetRoute.value === route + processorRoutes.transitions && !isTransitionMapsActive && !!transitionMaps.length) {
      return transitionMaps;
    }

    if (targetRoute.value === route + processorRoutes.varshapkhala && !isYearPickerActive) {
      return varshpahalaMaps;
    }

    return maps;
  }, [targetRoute, route, rectification.maps, isYearPickerActive, varshpahalaMaps, maps, transitionMaps, isTransitionMapsActive]);

  const isVarshpahalaLoading = useGetIsVarshpahalaLoading();

  useEffect(() => {
    if (!swiper.current || !currentMaps || currentMaps.length === 0) {
      return;
    }

    // Проверяем, что swiper полностью инициализирован
    if (!swiper.current.params || !swiper.current.slides || swiper.current.slides.length === 0) {
      return;
    }

    // Убеждаемся, что params.speed существует
    if (!swiper.current.params.speed) {
      swiper.current.params.speed = 300;
    }

    const targetIndex = currentMaps.findIndex(({ value }) => value === targetMapValue);
    if (targetIndex >= 0 && typeof swiper.current.slideTo === 'function') {
      try {
        swiper.current.slideTo(targetIndex);
      } catch (error) {
        console.warn('Swiper slideTo error:', error);
      }
    }
  }, [targetMapValue, currentMaps]);

  const aspectType = useMemo(() => {
    if (!isYearPickerActive && !isVarshpahalaLoading && location.pathname.includes(route + processorRoutes.varshapkhala)) {
      return AspectType.VarhaSignAspects;
    }

    return AspectType.SignApsects;
  }, [location, route, location, isVarshpahalaLoading, isYearPickerActive]);

  const horoscopeInfo = useMemo(() => {
    const items: string [] = [];

    const { name, time, date } = horoscopeUserInfo;

    if (name) {
      items.push(name);
    }

    if (address.location.value) {
      items.push(address.location.value);
    } else {
      items.push(`Выбор на карте: ${address.coordinates.latitude} (Широта), ${address.coordinates.longitude} (Долгота)`);
    }

    if (time) {
      items.push(time);
    }

    if (date) {
      items.push(date);
    }

    if (timeZoneOffset !== ':' && timeZoneOffset) {
      items.push(timeZoneOffset);
    }

    return items.join(', ');
  }, [horoscopeUserInfo, address, timeZoneOffset]);

  const clearHoroscope = useClearHoroscope();

  useEffect(() => {
    return () => {
      clearHoroscope();
    };
  }, [clearHoroscope]);
  
  const [isObjectDescriptionOpen, setIsObjectDescriptionOpen] = useSearchParamsState<boolean>('isObjectDescriptionOpen', false);
  const targetProcessorObject = useAppSelector((state) => state.horoscopes.targetProcessorObject);

  const closeObjectDescription = useCallback(() => {
    if (!isObjectDescriptionOpen) {
      return;
    }

    startTransition(() => {
      navigate(-1);
      dispatch(setTargetProcessorObject(undefined));
    });
  }, [navigate, isObjectDescriptionOpen]);

  useEffect(() => {
    if (targetProcessorObject) {
      startTransition(() => {
        setIsObjectDescriptionOpen(true, false);
      });
    }
  }, [targetProcessorObject]);

  // Установка фиксированной позиции относительно верха контейнера
  useEffect(() => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      setFixedTop(containerRect.top);
    }
  }, []);

  return (
    <>
      <Grid 
        ref={containerRef}
        height={'100%'} 
        minHeight={'100vh'} 
        overflow={'scroll'} 
        zIndex={10} 
        sx={{ backgroundColor: 'rgb(23, 23, 25)' }}
      >
        <Grid 
          ref={contentRef} 
          container 
          direction={'column'} 
          justifyContent={'center'} 
          zIndex={10}
          sx={{
            position: 'fixed',
            left: 0,
            right: 0,
            backgroundColor: 'rgb(30, 30, 33)',
            width: 'calc(100% + 32px)',
            margin: '-16px -16px 0 -16px',
            zIndex: 1000,
            borderRadius: '16px 16px 0 0'
          }}
        >
          <Grid item container direction={'row'} justifyContent={'space-between'} gap={1}>
            <Grid item width={'70%'}>
              <OptionSelector
                options={processorRoutesOptions}
                value={targetRoute?.value}
                onChange={(option: Option) => dispatch(setProcessorTargetRoute(option))}
                type="normal"
                itemHeight={25}
              />
            </Grid>
            <Grid item flex={1}>
              <OptionSelector
                disabled={isMapSelectDisabled}
                options={currentMaps}
                value={targetMapValue}
                onChange={onMapSet}
                type="normal"
                itemHeight={25}
              />
            </Grid>
          </Grid>
          <Grid item height='20px' display={'flex'} justifyContent={'center'} position={'relative'} mb={'-20px'}>            
            {/* ЛЕВЫЙ УГОЛОК (Скругление) */}
            <div style={{ 
              position: 'absolute', 
              top: -1, // Прижимаем к линии
              right: 0, 
              width: '20px', 
              height: '20px', 
              // Убираем backgroundColor, используем Градиент
              // circle at 0 100% -> центр круга в левом нижнем углу
              background: 'radial-gradient(circle at 0 100%, transparent 20px, rgb(30, 30, 33) 20px)',
              // Результат: прозрачная дырка слева-внизу, остальное — цвет
            }} />

            {/* ПРАВЫЙ УГОЛОК (Скругление) */}
            <div style={{ 
              position: 'absolute', 
              top: -1, 
              left: 0, 
              width: '20px', 
              height: '20px', 
              // circle at 100% 100% -> центр круга в правом нижнем углу
              background: 'radial-gradient(circle at 100% 100%, transparent 20px, rgb(30, 30, 33) 20px)',
            }} />
          </Grid>
        </Grid>
        {(() => {
          const normalizedRoute = location.pathname.split('?')[0].replace(/\/$/, '');
          const isSettingsRoute = normalizedRoute.includes('/settings') || normalizedRoute.endsWith('/settings');
          
          if (isSettingsRoute) {
            return <Settings />;
          }
          
          return (
            <>
              <Grid ref={mapsRef} item pt={'80px'}>
                <Swiper
                  slidesPerView="auto"
                  slidesPerGroup={1}
                  className={'maps'}
                  initialSlide={0}
                  centeredSlides
                  spaceBetween={5}
                  onSwiper={(_swiper) => {
                    swiper.current = _swiper;
                    // Используем requestAnimationFrame для гарантии полной инициализации
                    requestAnimationFrame(() => {
                      setTimeout(() => {
                        if (swiper.current && typeof swiper.current.slideTo === 'function') {
                          // Проверяем, что swiper полностью инициализирован
                          if (swiper.current.params && swiper.current.slides && swiper.current.slides.length > 0) {
                            // Убеждаемся, что params.speed существует
                            if (!swiper.current.params.speed) {
                              swiper.current.params.speed = 300;
                            }
                            try {
                              swiper.current.slideTo(0);
                              dispatch(setTargetMapValue('D-1'));
                            } catch (error) {
                              console.warn('Swiper slideTo error:', error);
                            }
                          }
                        }
                      }, 100);
                    });
                  }}
                  onSlideChange={onSwipe}
                >
                  {currentMaps.map((map) => (
                    <SwiperSlide key={map.value}>
                      <Map
                        mapType={mapType}
                        aspectType={aspectType}
                        mapSections={map.mapSections}
                        mapTransitSections={isTransitionMapsActive ? mapTransitSections('D-1') : mapTransitSections(map.value)}
                        isTransit={isTransitionMapsActive}
                        mapName={map.value}
                        targetMapValue={targetMapValue}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Grid>
              <Grid item pl={2} pr={2} pt={1} display={'flex'} justifyContent={'center'}>
                <div className="horoscopeInfoCard">
                  <span className="horoscopeInfoValue">{horoscopeInfo}</span>
                </div>
              </Grid>
              {(() => {
                // Определяем, какой компонент показывать на основе текущего роута
                if (normalizedRoute.includes('/ashtakavarga') || normalizedRoute.endsWith('/ashtakavarga')) {
                  return <Ashtakavarga />;
                }
                
                if (normalizedRoute.includes('/dashi') || normalizedRoute.endsWith('/dashi')) {
                  return <Dashi />;
                }
                
                if (normalizedRoute.includes('/zones') || normalizedRoute.endsWith('/zones')) {
                  return <Zones />;
                }
                
                if (normalizedRoute.includes('/transitions') || normalizedRoute.endsWith('/transitions')) {
                  return <Transitions />;
                }
                
                if (normalizedRoute.includes('/yogas') || normalizedRoute.endsWith('/yogas')) {
                  return <Yogas />;
                }
                
                if (normalizedRoute.includes('/rectification') || normalizedRoute.endsWith('/rectification')) {
                  return <Rectification />;
                }
                
                if (normalizedRoute.includes('/varshapkhala') || normalizedRoute.endsWith('/varshapkhala')) {
                  return <Varshapkhala />;
                }
                
                // По умолчанию показываем NatMap
                return <NatMap />;
              })()}
            </>
          );
        })()}
        <MemoizedObjectDescription />
      </Grid>
    </>
  );
};

const Horoscopes = Index;
export default Horoscopes;
