import React, { useEffect, useRef, useMemo } from 'react';
import {
  setContentRef,
} from './store/reducers/preferencesReducer';
import { useAppDispatch } from './store/store';
import Horoscopes from './pages/horoscopes';
import Ashtakavarga from './pages/horoscopes/ashtakavarga/Ashtakavarga';
import Dashi from './pages/horoscopes/dashi/Dashi';
import NatMap from './pages/horoscopes/natMap/NatMap';
import Zones from './pages/horoscopes/zones/Zones';
import Transitions from './pages/horoscopes/transitions/Transitions';
import Yogas from './pages/horoscopes/yogas/Yogas';
import Rectification from './pages/horoscopes/rectification/Rectification';
import Varshapkhala from './pages/horoscopes/varshapkhala/Varshapkhala';
import { processorRoutes } from './pages/astrlogicalProcessor/processorRoutes';
import { useLoadHoroscopes } from './hooks/useLoadHororscope';
import { HoroscopeAddress } from './models/types/HoroscopeAddress';
import { HoroscopeUserInfo } from './models/types/HoroscopeUserInfo';
import { useNavigationContext } from './contexts/NavigationContext';

function App () {
  const dispatch = useAppDispatch();
  const loadHoroscopes = useLoadHoroscopes();
  const { currentRoute } = useNavigationContext();

  const contentRef = useRef<any>();

  useEffect(() => {
    if (!contentRef.current) {
      return;
    }

    dispatch(setContentRef(contentRef.current));
  }, []);

  const mockAddress: HoroscopeAddress = {
    timeZone: {
      hours: '3',
      minutes: '0',
      greenwich: '+'
    },
    coordinates: {
      longitude: '37.6173',
      latitude: '55.7558'
    },
    location: {
      value: 'Москва',
      key: 'moscow'
    },
    isCustomCoordinates: false
  };

  const mockUserInfo: HoroscopeUserInfo = {
    name: 'Тестовый пользователь',
    date: '15.01.1990',
    time: '12:00'
  };

  useEffect(() => {
    loadHoroscopes({
      address: mockAddress,
      userInfo: mockUserInfo,
      activateLoader: false,
      isCaching: false,
      resetHoroscopeData: true
    })
      .then(() => {
        console.log('loadHoroscopes success');
        // Вызываем callback после завершения загрузки с небольшой задержкой для гарантии рендера
        requestAnimationFrame(() => {
          setTimeout(() => {
            if (typeof window !== 'undefined' && window.ProcessorProject?.finishLoading) {
              window.ProcessorProject.finishLoading();
            }
          }, 100);
        });
      })
      .catch((error) => {
        console.error('Ошибка при построении гороскопа:', error);
        // Вызываем callback даже при ошибке, чтобы скрыть loader
        requestAnimationFrame(() => {
          setTimeout(() => {
            if (typeof window !== 'undefined' && window.ProcessorProject?.finishLoading) {
              window.ProcessorProject.finishLoading();
            }
          }, 100);
        });
      });
  }, [loadHoroscopes]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentRoute]);
  
  // Определяем, какой компонент рендерить на основе текущего роута
  const ChildComponent = useMemo(() => {
    // Нормализуем currentRoute (убираем trailing slash и query params)
    const normalizedRoute = currentRoute.split('?')[0].replace(/\/$/, '');
    
    if (!normalizedRoute.startsWith(processorRoutes.horoscopes)) {
      return NatMap;
    }

    // Определяем дочерний компонент
    if (normalizedRoute === processorRoutes.horoscopes || normalizedRoute === `${processorRoutes.horoscopes}/`) {
      return NatMap;
    }
    
    // Проверяем каждый маршрут, начиная с самых специфичных
    if (normalizedRoute.includes('/ashtakavarga') || normalizedRoute.endsWith('/ashtakavarga')) {
      return Ashtakavarga;
    }
    
    if (normalizedRoute.includes('/dashi') || normalizedRoute.endsWith('/dashi')) {
      return Dashi;
    }
    
    if (normalizedRoute.includes('/zones') || normalizedRoute.endsWith('/zones')) {
      return Zones;
    }
    
    if (normalizedRoute.includes('/transitions') || normalizedRoute.endsWith('/transitions')) {
      return Transitions;
    }
    
    if (normalizedRoute.includes('/yogas') || normalizedRoute.endsWith('/yogas')) {
      return Yogas;
    }
    
    if (normalizedRoute.includes('/rectification') || normalizedRoute.endsWith('/rectification')) {
      return Rectification;
    }
    
    if (normalizedRoute.includes('/varshapkhala') || normalizedRoute.endsWith('/varshapkhala')) {
      return Varshapkhala;
    }

    // По умолчанию показываем NatMap
    return NatMap;
  }, [currentRoute]);
  
  return (
    <>
      <Horoscopes childComponent={ChildComponent} />
    </>
  );
}

export default App;
