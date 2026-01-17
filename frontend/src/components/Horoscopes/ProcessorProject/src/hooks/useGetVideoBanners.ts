import { useEffect, useState } from 'react';
import authRequest from '../api/authRequest';
import { IBootcamp } from '../models/interfaces/advertising';
import { VideoBannerType } from '../helpers/videoBannerType';
import { bannersApi } from '../api/advertising';

export interface GetCoursesReturnType {
  banners: IBootcamp[],
  isLoading: boolean
}

export const useGetVideoBanners = (bannerType?: VideoBannerType): GetCoursesReturnType => {
  const [banners, setBanners] = useState<IBootcamp[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    authRequest.get(bannersApi(), {
      params: {
        banner_type: bannerType,
        limit: 10
      }
    })
      .then(res => {
        setBanners(res.data.results);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return {
    banners,
    isLoading
  };
};
