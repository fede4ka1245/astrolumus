import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SavedHoroscope } from '../models/types/SavedHoroscopes';
import moment from 'moment/moment';
import { HoroscopeAddress } from '../models/types/HoroscopeAddress';
import { routes } from '../models/enums/routes';
import { useAppDispatch } from '../store/store';
import { setCurrentSavedHoroscope } from '../store/reducers/savedHoroscopesReducer';

export const useCountSavedHoroscope = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return useCallback((horoscope: SavedHoroscope) => {
    if (!horoscope.horoscope.id) {
      return;
    }

    const userInfo = {
      name: horoscope.name || '',
      date: moment(horoscope.horoscope.dt.replace('T', ' ').slice(0, 19), 'YYYY-MM-DD hh:mm:ss').format('DD.MM.YYYY'),
      time: moment(horoscope.horoscope.dt.replace('T', ' ').slice(0, 19), 'YYYY-MM-DD hh:mm:ss').format('HH:mm:ss')
    };

    const address : HoroscopeAddress = {
      timeZone: {
        hours: horoscope.horoscope.tzHour.replace('-', ''),
        minutes: horoscope.horoscope.tzMinutes,
        greenwich: horoscope.horoscope.tzHour.includes('-') ? '-' : '+'
      },
      location: {
        key: '',
        value: horoscope.city as string
      },
      coordinates: {
        longitude: horoscope.horoscope.longitude,
        latitude: horoscope.horoscope.latitude
      }
    };

    dispatch(setCurrentSavedHoroscope(horoscope));
    address.isCustomCoordinates = horoscope.city === '' || horoscope.horoscope.settings.includes('customCoordinates');

    navigate(routes.astrologicalProcessor, {
      state: { userInfo, address }
    });
  }, [dispatch, navigate]);
};
