import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { CircularProgress, Fade, Grid, Typography } from '@mui/material';
import authRequest from '../../../../api/authRequest';
import { IServerTopic } from '../../../../models/interfaces/topic';
import { forumTopicApi } from '../../../../api/forum';
import TopicPreview from '../../../../components/TopicPreview';
import { IOptionItem } from '../../../../models/interfaces/options';
import useInfiniteScroll from '../../../../hooks/useInfiniteScroll';
import VideoBanners from '../../../../components/videoBanners/VideoBanners';
import { VideoBannerType } from '../../../../helpers/videoBannerType';
import ContentSkeleton from '../../../../components/contentSkeleton/ContentSkeleton';
import { useGetVideoBanners } from '../../../../hooks/useGetVideoBanners';
import { useSearchParamsState } from '../../../../hooks/useSearchParamsState';

interface IProps {
  filterTopicParam: IOptionItem
  sortTopicParam: IOptionItem
}

export interface ITopicsListRef {
  getTopics: (params: object) => void;
  setTopicList: (topics: IServerTopic[]) => void;
}

const initialPageSize = 10;

const TopicsList = forwardRef<ITopicsListRef, IProps>((props, ref) => {
  const [topicList, setTopicList] = useState<IServerTopic[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState<boolean>(true);
  const [page, setPage] = useSearchParamsState<number>('TopicsListPage', 1);
  const [infiniteLoading, setInfiniteLoading] = useState<boolean>(false);
  const lastItemRef = useInfiniteScroll(() => {
    if (hasNext) {
      loadMoreTopics({ 
        ...props.filterTopicParam.params, 
        ...props.sortTopicParam.params,
        page: page + 1
      });
    }
  });

  useEffect(() => {
    if (page !== 1) {
      setLoading(true);
      authRequest.get(forumTopicApi(), {
        params: {
          not_published: false,
          page_size: initialPageSize * page,
          ...{ ...props.filterTopicParam.params, ...props.sortTopicParam.params }
        }
      })
        .then(res => {
          setPage(page);
          setHasNext(!!res.data.next);
          setTopicList(res.data.results);
        })
        .finally(() => {
          setLoading(false);
        });
      return;
    }

    getTopics({ ...props.filterTopicParam.params, ...props.sortTopicParam.params });
  }, []);

  const loadMoreTopics = useCallback((params: object) => {
    if (!infiniteLoading) {
      setInfiniteLoading(true);
      authRequest.get(forumTopicApi(), {
        params: { 
          not_published: false,
          page_size: initialPageSize,
          ...params
        }
      })
        .then(res => {
          setPage(page + 1);
          setHasNext(!!res.data.next);
          setTopicList(prevState => [...prevState, ...res.data.results]);
        })
        .catch(() => {
          setHasNext(false);
        })
        .finally(() => {
          setInfiniteLoading(false);
        });
    }
  }, [infiniteLoading, page]);

  const getTopics = useCallback(async (params: object) => {
    if (!loading) {
      setLoading(true);
      await authRequest.get(forumTopicApi(), {
        params: { 
          not_published: false,
          page_size: initialPageSize,
          ...params
        }
      })
        .then(res => {
          setPage(1);
          setHasNext(!!res.data.next);
          setTopicList(res.data.results);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [loading]);

  useImperativeHandle(ref, () => ({
    getTopics,
    setTopicList
  }));
  
  const { banners, isLoading: isVideosLoading } = useGetVideoBanners(VideoBannerType.allTopics);

  if (loading || isVideosLoading) {
    return (
      <Grid m={2}>
        <ContentSkeleton />
      </Grid>
    );
  }

  return (
    <Grid item container mb={2} pl={2} pr={2}>
      {topicList.length > 0 && (
        <Fade in={true} timeout={300}>
          <div>
            {props.filterTopicParam.value === 'all' && <>
              {topicList.slice(0, 3).map(topic => (
                <Grid item width={'100%'} mb={2} key={topic.id} ref={lastItemRef}>
                  <TopicPreview
                    topic={topic}
                  />
                </Grid>
              ))}
              {!!banners.length && <Grid pb={2} width={'100%'}>
                <VideoBanners banners={banners} />
              </Grid>}
              {topicList.slice(3).map(topic => (
                <Grid item width={'100%'} mb={2} key={topic.id} ref={lastItemRef}>
                  <TopicPreview
                    topic={topic}
                  />
                </Grid>
              ))}
            </>}
            {props.filterTopicParam.value !== 'all' && topicList.map(topic => (
              <Grid item width={'100%'} mb={2} key={topic.id} ref={lastItemRef}>
                <TopicPreview
                  topic={topic}
                />
              </Grid>
            ))}
            {
              infiniteLoading && (
                <Grid display="flex" justifyContent="center" width="100%">
                  <CircularProgress
                    style={{
                      color: '#37366B'
                    }}
                    size={30}/>
                </Grid>
              )
            }
          </div>
        </Fade>
      )}
      {!topicList.length && (
        <Fade in={true} timeout={300}>
          <Grid item width={'100%'}>
            <Grid container justifyContent={'center'} px={2} width={'100%'} py={5} bgcolor={'#FFF'} borderRadius={'10px'} boxShadow={'-5px -5px 20px #FFFFFF, 5px 5px 20px rgba(174, 174, 192, 0.5)'}>
              <Typography fontFamily={'Gilroy'} fontSize={'20px'} fontWeight={700} textAlign={'center'} mb={2}>
                Темы отсутствуют
              </Typography>
            </Grid>
          </Grid>
        </Fade>
      )}
    </Grid>
  );
});

TopicsList.displayName = 'TopicsList';

export default TopicsList;
