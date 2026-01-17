import { useEffect, useState } from 'react';
import authRequest from '../api/authRequest';
import { bootcampCoursesApi } from '../api/bootcamp';
import { IBootcamp } from '../models/interfaces/bootcamp';
import { CoursesType } from '../helpers/coursesType';

export interface GetCoursesReturnType {
  courses: IBootcamp[],
  isLoading: boolean
}

export const useGetCourses = (coursesType?: CoursesType): GetCoursesReturnType => {
  const [courses, setCourses] = useState<IBootcamp[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    
    authRequest.get(bootcampCoursesApi(), {
      params: {
        banner_type__alias: coursesType
      }
    })
      .then(res => {
        setCourses(res.data.results);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  
  return {
    courses,
    isLoading
  };
};
