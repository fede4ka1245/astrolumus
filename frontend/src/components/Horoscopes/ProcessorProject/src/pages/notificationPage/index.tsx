import { Grid } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Modal from '../../components/modal/Modal';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import Button from '../../components/button/Button';
import { IBootcamp } from '../../models/interfaces/advertising';
import Video from '../../components/video/Video';
import camelcaseKeys from 'camelcase-keys';
import authRequest from '../../api/authRequest';
import { eventBus, EventBusEvents } from '../../helpers/eventBus';
import { useAppDispatch } from '../../store/store';
import { setIsAppLoading } from '../../store/reducers/preferencesReducer';
import { logFirebaseEvent } from '../../helpers/firebase';
import { FirebaseEvent } from '../../helpers/firebase/firebaseEvent';

interface BannerType {
  image?: string,
  imageLink?: string,
  videoLink?: string,
  title: string,
}

export interface NotificationPageType {
  title: string, // Заголовок
  primaryInfo: string, // текст
  banner: BannerType,
  primaryBanner: BannerType,
  secondaryBanner?: BannerType,
  secondaryInfo?: string,
  firstButtonText: string,
  firstButtonLink: string,
  secondButtonText?: string,
  secondButtonLink?: string
}

export const getNotificationPage = (id: number): Promise<NotificationPageType | undefined> => {
  return authRequest.get(`${import.meta.env.VITE_APP_API_URL}/notifications/notification-page/${id}`)
    .then(({ data }) => {
      return camelcaseKeys(data, { deep: true });
    })
    .catch(console.log);
};

export const Banner: React.FC<BannerType> = ({ title, image, videoLink, imageLink }) => {
  const video = useMemo<IBootcamp>(() => {
    return {
      id: 1,
      title,
      description: 'Date',
      video_link: videoLink,
      image,
      image_link: imageLink,
      color: '#37366B',
      previews: 'Date'
    } as IBootcamp;
  }, [image, videoLink, imageLink, title]);

  return (
    <Video
      video={video}
      titleColor={'#37366B'}
    />
  );
};

export const NotificationPage = () => {
  const [page, setPage] = useState<NotificationPageType | undefined>();
  const isOpen: boolean = useMemo(() => {
    return !!page;
  }, [page]);
  const dispatch = useAppDispatch();

  const closePage = useCallback(() => {
    setPage(undefined);
  }, []);

  useEffect(() => {
    FirebaseMessaging.addListener('notificationActionPerformed', async (res) => {
      if ((res.notification.data as any).notificationPageId) {
        dispatch(setIsAppLoading(true));
        try {
          const page = await getNotificationPage((res.notification.data as any).notificationPageId);

          if (page) {
            setPage(page);
          }
        } finally {
          dispatch(setIsAppLoading(false));
        }
      }
    });

    eventBus.on(EventBusEvents.triggerNotificationPageOpen, async (pageId: number) => {
      dispatch(setIsAppLoading(true));
      try {
        const page = await getNotificationPage(pageId);

        if (page) {
          setPage(page);
        }
      } finally {
        dispatch(setIsAppLoading(false));
      }
    });
  }, []);
  
  useEffect(() => {
    if (page && isOpen) {
      logFirebaseEvent({
        name: FirebaseEvent.openNotificationPage
      });
    }
  }, [page, isOpen]);
  
  const onBannerClick = useCallback(() => {
    logFirebaseEvent({
      name: FirebaseEvent.notificationPageBannerClick
    });
  }, []);

  const onFirstButtonClick = useCallback(() => {
    logFirebaseEvent({
      name: FirebaseEvent.notificationPageFirstButtonClick
    });

    if (page?.firstButtonLink) {
      window.open(page?.firstButtonLink);
    }
  }, [page]);

  const onSecondButtonClick = useCallback(() => {
    logFirebaseEvent({
      name: FirebaseEvent.notificationPageSecondButtonClick
    });

    if (page?.secondButtonLink) {
      window.open(page?.secondButtonLink);
    }
  }, [page]);

  return (
    <Modal height={'var(--modal-page-height)'} isOpen={isOpen} close={closePage}>
      <Grid display={'flex'} flexDirection={'column'} p={2}>
        <Grid fontSize={'24px'} fontFamily={'Gilroy'} fontWeight={'bold'} mt={1}>
          {page?.title}
        </Grid>
        {page?.banner && <Grid onClick={onBannerClick} fontSize={'18px'} fontFamily={'Gilroy'} mt={2}>
          <Banner
            title={page?.banner.title}
            image={page?.banner.image}
            imageLink={page?.banner.imageLink}
            videoLink={page?.banner.videoLink}
          />
        </Grid>}
        {page?.primaryInfo && <Grid dangerouslySetInnerHTML={{ __html: page.primaryInfo }} fontSize={'18px'} fontFamily={'Gilroy'} mt={2}>
        </Grid>}
        {page?.primaryBanner && <Grid onClick={onBannerClick} fontSize={'18px'} fontFamily={'Gilroy'} mt={2}>
          <Banner
            title={page?.primaryBanner.title}
            image={page?.primaryBanner.image}
            imageLink={page?.primaryBanner.imageLink}
            videoLink={page?.primaryBanner.videoLink}
          />
        </Grid>}
        {page?.secondaryBanner && <Grid onClick={onBannerClick} fontSize={'18px'} fontFamily={'Gilroy'} mt={2}>
          <Banner
            title={page?.secondaryBanner.title}
            image={page?.secondaryBanner.image}
            imageLink={page?.secondaryBanner.imageLink}
            videoLink={page?.secondaryBanner.videoLink}
          />
        </Grid>}
        {page?.secondaryInfo && <Grid dangerouslySetInnerHTML={{ __html: page.secondaryInfo }} fontSize={'18px'} fontFamily={'Gilroy'} mt={2}>
        </Grid>}
        {page?.firstButtonText && <Grid mt={2}>
          <Button text={page.firstButtonText} onClick={onFirstButtonClick} />
        </Grid>}
        {page?.secondButtonText && <Grid mt={1}>
          <Button text={page.secondButtonText} onClick={onSecondButtonClick} />
        </Grid>}
      </Grid>
    </Modal>
  );
};
