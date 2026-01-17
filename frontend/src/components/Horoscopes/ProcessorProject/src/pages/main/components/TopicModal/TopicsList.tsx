import { useEffect, useState, FC, forwardRef, useImperativeHandle } from 'react';
import { CircularProgress, Grid, Typography } from '@mui/material';

// models
import authRequest from '../../../../api/authRequest';
import { IServerTopic } from '../../../../models/interfaces/topic';
import TopicSkeleton from '../../../../components/skeletons/TopicSkeleton';
import { forumTopicApi } from '../../../../api/forum';
import TopicPreview from '../../../../components/TopicPreview';
import { IOptionItem } from '../../../../models/interfaces/options';
import useInfiniteScroll from '../../../../hooks/useInfiniteScroll';

interface IProps {
  filterTopicParam: IOptionItem
  sortTopicParam: IOptionItem
}

export interface ITopicsListRef {
  getTopics: (params: object) => void;
  setTopicList: (topics: IServerTopic[]) => void;
}

const TopicsList = forwardRef<ITopicsListRef, IProps>((props, ref) => {
  const [topicList, setTopicList] = useState<IServerTopic[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [infiniteLoading, setInfiniteLoading] = useState<boolean>(false);
  const initialPageSize = 100;
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
    getTopics({ ...props.filterTopicParam.params, ...props.sortTopicParam.params });
  }, []);

  const loadMoreTopics = (params: object) => {
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
  };

  const getTopics = (params: object) => {
    if (!loading) {
      setLoading(true);
      authRequest.get(forumTopicApi(), {
        params: { 
          not_published: false,
          page_size: initialPageSize,
          ...params
        }
      })
        .then(res => {
          setHasNext(!!res.data.next);
          setTopicList(res.data.results);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useImperativeHandle(ref, () => ({
    getTopics,
    setTopicList
  }));

  return (
    <Grid item container mb={2} pl={2} pr={2}>
      {loading
        ? Array(3)
          .fill(0).map((item, index) => (
            <Grid item width={'100%'} mb={2} key={index}>
              <TopicSkeleton/>
            </Grid>
          ))
        : topicList.length > 0 
          ? (
            <>
              {
                topicList.map(topic => (
                  <Grid item width={'100%'} mb={2} key={topic.id} ref={lastItemRef}>
                    <TopicPreview
                      topic={topic}
                    />
                  </Grid>
                ))
              }
              {
                infiniteLoading && (
                  <Grid display="flex" justifyContent="center">
                    <CircularProgress
                      style={{
                        color: '#37366B'
                      }}
                      size={30}/>
                  </Grid>
                )
              }
            </>
          )
          : (
            <Grid item width={'100%'}>
              <Grid container justifyContent={'center'} px={2} width={'100%'} py={5} bgcolor={'#FFF'} borderRadius={'10px'} boxShadow={'-5px -5px 20px #FFFFFF, 5px 5px 20px rgba(174, 174, 192, 0.5)'}>
                <Typography fontFamily={'Gilroy'} fontSize={'20px'} fontWeight={700} textAlign={'center'} mb={2}>
                  Темы отсутствуют
                </Typography>
              </Grid>
            </Grid>
          )}
    </Grid>
  );
});

TopicsList.displayName = 'TopicsList';

export default TopicsList;
