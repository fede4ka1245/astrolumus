import { useEffect, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import { CircularProgress, Grid, Typography } from '@mui/material';
import { forumCommentApi } from '../../../../api/forum';
import authRequest from '../../../../api/authRequest';
import TopicSkeleton from '../../../../components/skeletons/TopicSkeleton';
import CommentPreview from '../../../../components/CommentPreview';
import useInfiniteScroll from '../../../../hooks/useInfiniteScroll';
import { ITopicComment } from '../../../../models/interfaces/topic';
import { IOptionItem } from '../../../../models/interfaces/options';

interface IProps {
  filterTopicParam: IOptionItem 
  sortTopicParam: IOptionItem
}

export interface ICommentsListRef {
  getTopicComments: (params: object) => void;
  setTopicComments: (categories: ITopicComment[]) => void;
}

const CommentsList = forwardRef<ICommentsListRef, IProps>((props, ref) => {
  const [topicComments, setTopicComments] = useState<ITopicComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [infiniteLoading, setInfiniteLoading] = useState<boolean>(false);
  const [hasNext, setHasNext] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const initialPageSize = 10;
  const lastItemRef = useInfiniteScroll(() => {
    if (hasNext) {
      loadMoreComments({ 
        ...props.filterTopicParam.params, 
        ...props.sortTopicParam.params,
        page: page + 1
      });
    }
  });

  useEffect(() => {
    getTopicComments({ ...props.filterTopicParam.params, ...props.sortTopicParam.params });
  }, []);

  useImperativeHandle(ref, () => ({
    getTopicComments,
    setTopicComments
  }));

  const loadMoreComments = useCallback((params: object) => {
    if (!infiniteLoading) {
      setInfiniteLoading(true);
      authRequest.get(forumCommentApi(), {
        params: {
          page_size: initialPageSize,
          ...params
        }
      })
        .then(res => {
          setPage(page + 1);
          setTopicComments(prevState => [...prevState, ...res.data.results]);
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

  const getTopicComments = useCallback(async (params: object) => {
    if (!loading) {
      setLoading(true);
      await authRequest.get(forumCommentApi(), {
        params: {
          page_size: initialPageSize,
          ...params
        }
      })
        .then(res => {
          setPage(1);
          setTopicComments(res.data.results);
          setHasNext(!!res.data.next);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [loading]);

  return (
    <Grid>
      {loading
        ? Array(3)
          .fill(0).map((item, index) => (
            <Grid item pl={2} pr={2} width={'100%'} mb={2} key={index}>
              <TopicSkeleton/>
            </Grid>
          ))
        : topicComments.length > 0 
          ? (
            <>
              {
                topicComments.map(comment => (
                  <Grid item px={2} width={'100%'} mb={2} key={comment.id} ref={lastItemRef}>
                    <CommentPreview
                      {...comment}
                    />
                  </Grid>
                ))
              }
              {
                infiniteLoading && (
                  <Grid display="flex" justifyContent="center" width={'100%'}>
                    <CircularProgress 
                      style={{
                        color: '#37366B'
                      }}
                      size={30}/>
                  </Grid>
                )
              }
            </>)
          : (
            <Grid item pl={2} pr={2} width={'100%'}>
              <Grid container justifyContent={'center'} px={2} width={'100%'} py={5} bgcolor={'#FFF'} borderRadius={'10px'} boxShadow={'-5px -5px 20px #FFFFFF, 5px 5px 20px rgba(174, 174, 192, 0.5)'}>
                <Typography fontFamily={'Gilroy'} fontSize={'20px'} fontWeight={700} textAlign={'center'} mb={2}>
                  Комментарий отсутствуют
                </Typography>
              </Grid>
            </Grid>
          )}
    </Grid>
  );
});

CommentsList.displayName = 'CommentsList';

export default CommentsList;
