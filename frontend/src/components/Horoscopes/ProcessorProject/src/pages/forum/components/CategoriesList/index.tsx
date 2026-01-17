import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { Fade, Grid } from '@mui/material';
import authRequest from '../../../../api/authRequest';
import { forumCategoryApi, forumTopicApi } from '../../../../api/forum';
import { IOptionItem } from '../../../../models/interfaces/options';
import { IForumCategory } from '../../../../models/interfaces/forum';
import { categorySort } from '../../../../helpers/sort';
import Video from '../../../../components/video/Video';
import Category from './components/Category';
import TopicModal from './components/TopicModal';
import useInfiniteScroll from '../../../../hooks/useInfiniteScroll';
import CoursesCarousel from '../../../../components/CoursesCarousel';
import { bannersApi } from '../../../../api/advertising';
import { IBootcamp } from '../../../../models/interfaces/advertising';
import { useGetCourses } from '../../../../hooks/useGetCourses';
import { CoursesType } from '../../../../helpers/coursesType';
import { useSearchParamsState } from '../../../../hooks/useSearchParamsState';
import ContentSkeleton from '../../../../components/contentSkeleton/ContentSkeleton';
import { useNavigate } from 'react-router-dom';

interface IProps {
  filterTopicParam: IOptionItem
  sortTopicParam: IOptionItem
}

export interface ICategoriesListRef {
  getCategories: (params: object) => void;
  setCategories: (categories: IForumCategory[]) => void;
}

const getTopics = (categoryId: number) => {
  return authRequest.get(forumTopicApi(), {
    params: {
      not_published: false,
      category: categoryId,
      page_size: 3,
      ordering: '-created_at'
    }
  })
    .then(res => {
      return res.data.results;
    });
};

const CategoriesList = forwardRef<ICategoriesListRef, IProps>((props, ref) => {
  const [categories, setCategories] = useState<IForumCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [categoriesListData, setCategoriesListData] = useSearchParamsState('categoriesListData', {
    selectedCategoryId: -1,
    isTopicModalOpen: false
  }, false);
  const [hasNext, setHasNext] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [infiniteLoading, setInfiniteLoading] = useState<boolean>(false);
  const initialPageSize = 200;
  const lastItemRef = useInfiniteScroll(() => {
    if (hasNext) {
      loadMoreCategories({ 
        ...props.filterTopicParam.params, 
        ...props.sortTopicParam.params,
        page: page + 1
      });
    }
  });
  const [videos, setVideos] = useState<IBootcamp[]>([]);
  const [isVideosLoading, setIsVideosLoading] = useState(false);
  const {
    selectedCategoryId,
    isTopicModalOpen
  } = useMemo(() => {
    return {
      selectedCategoryId: categoriesListData.selectedCategoryId,
      isTopicModalOpen: categoriesListData.isTopicModalOpen
    };
  }, [categoriesListData]);

  const selectedCategory = useMemo(() => {
    return categories.find(({ id }) => {
      return id === Number(selectedCategoryId);
    });
  }, [selectedCategoryId, categories]);

  useEffect(() => {
    getBanner();
    getCategories({ ...props.filterTopicParam.params, ...props.sortTopicParam.params });
  }, []);

  useImperativeHandle(ref, () => ({
    getCategories,
    setCategories
  }));

  const getBanner = useCallback(() => {
    setIsVideosLoading(true);
    authRequest.get(bannersApi(), {
      params: {
        banner_type: 1
      }
    })
      .then(res => {
        setVideos(res.data.results);
      })
      .finally(() => {
        setIsVideosLoading(false);
      });
  }, []);

  const openModal = useCallback((category: IForumCategory) => {
    setCategoriesListData({
      selectedCategoryId: category.id,
      isTopicModalOpen: true
    });
  }, [setCategoriesListData]);

  const navigate = useNavigate();
  
  const closeModal = useCallback(() => {
    navigate(-1);
  }, [setCategoriesListData]);

  const loadMoreCategories = useCallback((params: object) => {
    if (!infiniteLoading) {
      setInfiniteLoading(true);
      authRequest.get(forumCategoryApi(), {
        params: {
          limit: initialPageSize,
          ...params
        }
      })
        .then(res => {
          setPage(page + 1);
          setCategories(prevState => categorySort([...prevState, ...res.data.results]));
          setHasNext(!!res.data.next);
        })
        .catch(() => {
          setHasNext(false);
        })
        .finally(() => {
          setInfiniteLoading(false);
        });
    }
  }, [infiniteLoading, page]);

  const getCategories = useCallback(async (params?: object) => {
    setLoading(true);
    await authRequest.get(forumCategoryApi(), {
      params: {
        limit: initialPageSize,
        ...params
      }
    })
      .then(res => {
        setHasNext(!!res.data.next);
        const sortedCategories = categorySort(res.data.results);
        return Promise.all([...sortedCategories.map(async (category) => {
          const topics = await getTopics(category.id);
          
          return {
            ...category,
            topics
          };
        })]);
      })
      .then((categories) => {
        setCategories(categorySort(categories));
      })
      .catch(() => {
        setHasNext(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const { courses, isLoading: isCoursesLoading } = useGetCourses(CoursesType.categoriesList);

  const isPageLoading = useMemo(() => {
    return loading || isCoursesLoading || isVideosLoading;
  }, [loading, isCoursesLoading, isVideosLoading]);

  if (isPageLoading) {
    return (
      <Grid m={2}>
        <ContentSkeleton />
      </Grid>
    );
  }

  return (
    <Fade timeout={300} in={true}>
      <Grid>
        <TopicModal
          category={selectedCategory}
          isOpen={isTopicModalOpen}
          close={closeModal}
        />
        <Grid item container direction={'column'} pl={2} pr={2} mb={2}>
          {categories.slice(0, 1).map((category) => (
            <Grid item key={category.id} pb={1}>
              <Category
                openModal={openModal}
                topics={category?.topics}
                category={category}
              />
            </Grid>
          ))}
        </Grid>
        <Grid item pl={2} pr={2} pt={3}>
          <CoursesCarousel courses={courses} />
        </Grid>
        <Grid item container direction={'column'} pl={2} pr={2} mb={2}>
          {categories.slice(1, 3).map((category, index) => (
            <Grid item key={index} pb={1} ref={lastItemRef}>
              <Category
                openModal={openModal}
                topics={category?.topics}
                category={category}
              />
            </Grid>
          ))}
        </Grid>
        {
          videos[0] && (
            <Grid item pl={2} pr={2} mb={2}>
              <Video video={videos[0]}/>
            </Grid>
          )
        }
        <Grid item container direction={'column'} pl={2} pr={2} mb={2}>
          {categories.slice(3, 5).map((category) => (
            <Grid item key={category.id} pb={1} ref={lastItemRef}>
              <Category
                openModal={openModal}
                topics={category?.topics}
                category={category}
              />
            </Grid>
          ))}
        </Grid>
        {
          videos[1] && (
            <Grid item pl={2} pr={2} mb={2}>
              <Video video={videos[1]}/>
            </Grid>
          )
        }
        <Grid item container direction={'column'} pl={2} pr={2} mb={2}>
          {categories.slice(5).map((category) => (
            <Grid item key={category.id} pb={1} ref={lastItemRef}>
              <Category
                topics={category?.topics}
                openModal={openModal}
                category={category}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Fade>
  );
});

CategoriesList.displayName = 'CategoriesList';

export default CategoriesList;
