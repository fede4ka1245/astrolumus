import React, { useEffect, useState } from 'react';
import { App as nativeApp, URLOpenListenerEvent } from '@capacitor/app';
import { HoroscopeUserInfo } from '../../models/types/HoroscopeUserInfo';
import { HoroscopeAddress } from '../../models/types/HoroscopeAddress';
import { useNavigate } from 'react-router-dom';
import { parseHoroscopeUrl } from '../../helpers/horoscopeUrl';
import AppLoader from '../appLoader/AppLoader';
import { useAppDispatch } from '../../store/store';
import { resetHoroscopes } from '../../store/reducers/horoscopesReducer';
import { getTargetHoroscopeLink } from '../../api/getTargetHoroscopeLink';
import { routes } from '../../models/enums/routes';
import { useGetIsAuthenticated } from '../../store/selectors';

const AppUrlListener: React.FC<any> = () => {
  const [userInfo, setUserInfo] = useState<HoroscopeUserInfo>();
  const [address, setAddress] = useState<HoroscopeAddress>();
  const [isAppLoading, setIsAppLoading] = useState(false);
  const isAuth = useGetIsAuthenticated();
  const [link, setLink] = useState<string>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    nativeApp.addListener('appUrlOpen', async (event: URLOpenListenerEvent) => {
      if (!import.meta.env.VITE_APP_PREVIEW_PAGE_URL || !event.url.includes(import.meta.env.VITE_APP_PREVIEW_PAGE_URL)) {
        return;
      }

      if (event.url.includes('/topics')) {
        setLink(`/topics/${event.url.split('api/')[1]}`);
        return;
      }

      setIsAppLoading(true);

      try {
        let link;
        if (event.url.includes('api/')) {
          link = await getTargetHoroscopeLink(event.url.split('api/')[1]);
        } else if (event.url.includes('?')) {
          link = event.url;
        }

        if (!link) {
          return;
        }

        const parsedHoroscope = parseHoroscopeUrl(link);

        if (!parsedHoroscope) {
          return;
        }

        const { address, userInfo } = parsedHoroscope;

        if (!address || !userInfo) {
          return;
        }

        setAddress(address);
        setUserInfo(userInfo);
      } finally {
        setIsAppLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    if (!userInfo || !address) {
      return;
    }

    navigate(routes.astrologicalProcessor, {
      state: { userInfo, address, isExternal: true }
    });
  }, [userInfo, address]);
  
  useEffect(() => {
    if (isAuth && link) {
      navigate(link);
      setLink('');
    }
  }, [isAuth, link]);

  return (
    <>
      <AppLoader isLoading={isAppLoading} />
    </>
  );
};

export default AppUrlListener;
