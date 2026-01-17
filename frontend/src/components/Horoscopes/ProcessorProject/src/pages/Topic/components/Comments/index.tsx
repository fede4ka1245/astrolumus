import { useState, useEffect, useRef, FC, useCallback, useLayoutEffect } from 'react';
import { CircularProgress, Fade, Grid, Typography } from '@mui/material';
import CommentForm, { ICommentFormRef } from './components/CommentForm';
import Comment, { ICommentRef } from './components/Comment';
import { IServerTopic, ITopicComment } from '../../../../models/interfaces/topic';
import TextGradient from '../../../../components/textGradient/TextGradient';
import { forumCommentApi } from '../../../../api/forum';
import authRequest from '../../../../api/authRequest';
import useInfiniteScroll from '../../../../hooks/useInfiniteScroll';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import styles from './styles.module.scss';
import Modal from '../../../../components/modal/Modal';
import ButtonClose from '../../../../components/buttonClose/ButtonClose';
import { setIsAppLoading } from '../../../../store/reducers/preferencesReducer';
import { useSearchParamsState } from '../../../../hooks/useSearchParamsState';

interface IProps {
  topic: IServerTopic;
  joinToTopic: () => void;
  isOpen: boolean;
  close: () => void;
}

const pageSize = 20;

const listToTargetComment = async (topicId: number, commentId: number, pageSize = 20, page = 1) => {
  const comments = [];
  const targetPageSize = pageSize;

  let targetCount = 0;
  let hasNext = true;
  let targetPage = page;
  let isCommentFounded = false;
  let targetComment: ITopicComment | undefined;

  while (hasNext && !isCommentFounded) {
    const { results, next, count } = await authRequest.get(forumCommentApi(), {
      params: {
        topic: topicId,
        page: targetPage,
        ordering: '-created_at',
        page_size: targetPageSize
      }
    })
      .then(res => {
        return res.data;
      });

    targetCount = count;
    targetPage += 1;
    hasNext = !!next;

    for (const comment of results) {
      comments.push(comment);
      if (+comment.id === +commentId) {
        isCommentFounded = true;
        targetComment = comment;
      }
    }
  }

  console.log(targetComment, 'here123');
  
  return {
    comments,
    hasNext,
    page: targetPage,
    pageSize: targetPageSize,
    count: targetCount,
    targetComment
  };
};

const Comments: FC<IProps> = ({ topic, joinToTopic, isOpen, close }) => {
  const [comments, setComments] = useState<ITopicComment[]>([]);
  const userId = useAppSelector(store => store.user.userInfo.id);
  const [selectedComment, setSelectedComment] = useState<ITopicComment | undefined>();
  const [selectedId, setSelectedId] = useSearchParamsState('selectedId', 0);
  const [loading, setLoading] = useState<boolean>(false);
  const [infiniteLoading, setInfiniteLoading] = useState<boolean>(false);
  const [hasNext, setHasNext] = useState<boolean>(true);
  const [page, setPage] = useState<number>(2);
  const [savedPage, setSavedPage] = useSearchParamsState('savedPage', 2);
  const [savedCommentId, setSavedCommentId] = useSearchParamsState('savedCommentId', 0);
  const [commentCount, setCommentCount] = useState(0);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const commentsWrapperRef = useRef<any>(null);
  const commentsRef = useRef<ICommentRef[]>([]);
  const commentFormRef = useRef<ICommentFormRef>(null);
  const timer = useRef<any>();
  const dispatch = useAppDispatch();
  const interval = useRef<any>(null);
  const commentsRefOffset = useRef<number>(0);
  const loaderRef = useRef<any>();
  const lastCommentRef = useInfiniteScroll(() => {
    if (hasNext) {
      loadMoreComments(page);
    }
  });

  const firstCommentRef = useInfiniteScroll((isIntersecting) => {
    if (isIntersecting) {
      clearInterval(interval.current);
      interval.current = setInterval(() => {
        getComments();
      }, 5000);
    } else {
      clearInterval(interval.current);
    }
  }, true);

  const loadMoreComments = useCallback(async (page: number) => {
    if (!infiniteLoading) {
      setInfiniteLoading(true);
      await authRequest.get(forumCommentApi(), {
        params: {
          topic: topic.id,
          ordering: '-created_at',
          page_size: pageSize,
          page
        }
      })
        .then(res => {
          if (loaderRef?.current) {
            commentsRefOffset.current = loaderRef?.current?.offsetTop - 50;
          }
          setPage(page + 1);
          setComments(prevState => [...prevState, ...res.data.results]);
          setHasNext(!!res.data.next);
        })
        .finally(() => {
          setInfiniteLoading(false);
        });
    }
  }, [infiniteLoading, topic.id]);

  const messageInterval = useRef<any>();

  const asyncjumpToMessage = useCallback(async (comment: ITopicComment, behavior: string = 'smooth') => {
    if (comment?.comment_parent_page && comment.comment_parent_page >= page) {
      dispatch(setIsAppLoading(true));
      const newCommentPages = await Promise.all(Array.from({ length: comment.comment_parent_page - page + 1 })
        .map((_, index) => {
          return authRequest.get(forumCommentApi(), {
            params: {
              topic: topic.id,
              ordering: '-created_at',
              page_size: pageSize,
              page: page + index
            }
          }).then(res => {
            return res.data;
          });
        })
      );

      const comments = newCommentPages.reduce((prev, current) => {
        return [...prev, ...current.results];
      }, []);

      setPage(Number(comment.comment_parent_page));
      setHasNext(!newCommentPages[newCommentPages.length - 1].next);
      setComments(prevState => [...prevState, ...comments]);
    }

    let tries = 30;
    clearInterval(messageInterval.current);
    const scrollTo = () => {
      if (!tries) {
        clearInterval(messageInterval.current);
        dispatch(setIsAppLoading(false));
        return;
      }

      const targetMsg = document.getElementById(`comment-${comment?.id}`);

      if (targetMsg) {
        const message = targetMsg;
        setSelectedId(comment.id);
        timer.current = setTimeout(() => {
          setSelectedId(0);
        }, 700);
        if (message) {
          message.scrollIntoView({ block: 'start', behavior: behavior as 'auto' | 'smooth' });
        }
        clearInterval(messageInterval.current);
        dispatch(setIsAppLoading(false));
      }
      tries -= 1;
    };

    messageInterval.current = setInterval(scrollTo.bind(this), 300);
  }, [dispatch, topic, loadMoreComments, page]);

  const getComments = useCallback(() => {
    if (!loading) {
      setLoading(true);
      authRequest.get(forumCommentApi(), {
        params: {
          topic: topic.id,
          ordering: '-created_at',
          page_size: pageSize
        }
      })
        .then(res => {
          setCommentCount(res.data.count);
          setComments(res.data.results);
          setHasNext(!!res.data.next);
          setPage(2);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [loading, topic.id]);

  const onClose = useCallback(() => {
    getComments();
    close();
  }, [close, getComments]);

  const replyToComment = useCallback((comment: ITopicComment | undefined) => {
    if (!topic.current_user_is_member && topic.user.id !== userId) {
      alert('Чтобы оставлять комментарии, вступите в тему!');
      return;
    }

    setSelectedComment(comment);
    setIsEdit(false);
  }, [topic.current_user_is_member, topic.user.id, userId]);

  const editComment = useCallback((comment: ITopicComment | null) => {
    if (comment) {
      setIsEdit(true);
      setSelectedComment(comment);
      commentFormRef.current?.setComment({ topic: topic.id, text: comment.text });
    } else {
      setIsEdit(false);
      setSelectedComment(undefined);
    }
  }, [topic]);

  const getCommentById = useCallback((commnetId: number) => {
    commentsRef.current[commnetId].getComment();
  }, []);

  const scrollToBottom = useCallback(() => {
    commentsWrapperRef.current.scrollTo(0, 0);
  }, []);
  
  const onCommentSave = useCallback((comment: ITopicComment) => {
    setSavedCommentId(comment.id);
    setSavedPage(page);
  }, [page, setSavedCommentId, setSavedPage]);
  
  useEffect(() => {
    if (!selectedId || +selectedId === 0 || isNaN(+selectedId)) {
      return;
    }

    dispatch(setIsAppLoading(true));

    listToTargetComment(topic.id, selectedId, pageSize, 1)
      .then(({ comments, count, page, hasNext, targetComment }) => {
        setCommentCount(count);
        setComments(comments);
        setHasNext(hasNext);
        setPage(page);
        if (targetComment) {
          asyncjumpToMessage(targetComment, 'auto');
        }
      }).finally(() => {
        dispatch(setIsAppLoading(false));
      });
  }, []);

  const loadSavedState = useCallback(async () => {
    dispatch(setIsAppLoading(true));
    const newCommentPages = await Promise.all(Array.from({ length: savedPage + 1 })
      .map((_, index) => {
        return authRequest.get(forumCommentApi(), {
          params: {
            topic: topic.id,
            ordering: '-created_at',
            page_size: pageSize,
            page: index + 1
          }
        }).then(res => {
          return res.data;
        }).finally(() => {
          dispatch(setIsAppLoading(false));
        });
      })
    );

    const comments = newCommentPages.reduce((prev, current) => {
      return [...prev, ...current.results];
    }, []);

    setComments(comments);
    setHasNext(!newCommentPages[newCommentPages.length - 1].next);
    clearTimeout(timer.current);

    let tries = 10;
    clearInterval(messageInterval.current);
    dispatch(setIsAppLoading(true));

    messageInterval.current = setInterval(() => {
      if (!tries) {
        clearInterval(messageInterval.current);
        dispatch(setIsAppLoading(false));
        return;
      }

      const msg = document.getElementById(`comment-${savedCommentId}`);

      if (msg) {
        setSelectedId(savedCommentId);
        timer.current = setTimeout(() => {
          setSelectedId(0);
        }, 700);
        if (savedCommentId) {
          msg.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        clearInterval(messageInterval.current);
        dispatch(setIsAppLoading(false));
      }
      tries -= 1;
    }, 300);

    setSavedPage(0);
    setSavedCommentId(0);
  }, [dispatch, savedPage, asyncjumpToMessage, setSavedPage, setSavedCommentId, topic.id, page, savedCommentId]);

  useEffect(() => {
    if (!savedPage || !savedCommentId || comments.length === 0) {
      getComments();
    }

    return () => {
      clearInterval(interval.current);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!savedPage || !savedCommentId || comments.length === 0) {
      return;
    }

    loadSavedState();
  }, [savedCommentId, savedPage, comments]);
  
  useLayoutEffect(() => {
    if (!comments.length || infiniteLoading || !commentsWrapperRef.current || !commentsRefOffset.current) {
      return;
    }

    commentsWrapperRef.current.scroll({ top: commentsRefOffset.current });
  }, [infiniteLoading]);
  
  const jumpToInternalComment = useCallback(async (msg: ITopicComment) => {
    if (msg?.comment) {
      await asyncjumpToMessage(msg?.comment);
    }
  }, [asyncjumpToMessage]);

  return (
    <Modal isSwipeable={false} isOpen={isOpen} close={close} height={'var(--modal-page-height)'}>
      <Grid display={'flex'} flexDirection={'column'} height={'100%'}>
        <Grid container justifyContent={'space-between'} alignItems={'center'}
          pb={2} px={2} pt={3}>
          <Grid item>
            <TextGradient
              textAlign={'center'}
              textTransform={'uppercase'}
              fontWeight={'bold'}
            >
              Комментарии ({commentCount})
            </TextGradient>
          </Grid>
          <ButtonClose onClick={onClose}/>
        </Grid>
        {comments.length > 0 && (
          <Grid style={{ overscrollBehavior: 'none' }} display={'flex'} ref={commentsWrapperRef} flexDirection={'column-reverse'} flex={1} px={2} pb={10} overflow={'scroll'}>
            {
              comments.map((comment, index) => (
                <Grid
                  key={comment.id}
                  id={`comment-${comment.id}`}
                  display={'flex'}
                  flexDirection={'column'}
                  className={selectedId === comment.id ? styles.selected : styles.not_select}>
                  <Grid ref={index === 0 ? firstCommentRef : null}>
                    <Grid ref={lastCommentRef}>
                      <Comment
                        jumpToMessage={jumpToInternalComment}
                        comment={comment}
                        ref={(el: any) => {
                          commentsRef.current[comment.id] = el;
                        }}
                        editComment={editComment}
                        replyToComment={replyToComment}
                        saveComment={onCommentSave}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              ))
            }
            <Fade in={infiniteLoading}>
              <Grid display="flex" justifyContent="center" mt={2} p={1} ref={loaderRef}>
                <CircularProgress
                  style={{
                    color: '#37366B'
                  }}
                  size={30}/>
              </Grid>
            </Fade>
          </Grid>
        )}
        {comments.length === 0 && !loading && (<Grid px={2}>
          <Grid py={3} px={2} display={'flex'} mb={4} justifyContent={'center'} border={'1px solid #C3C9CD'} borderRadius={'20px'}>
            <Typography fontFamily={'Gilroy'} color={'#5B6062'} fontSize={'15px'} textAlign={'center'}>
              В этой теме отсутсвуют комментарии
            </Typography>
          </Grid>
        </Grid>)}
        {loading && comments.length === 0 && (
          <Grid display="flex" justifyContent="center" height={'30px'}>
            <CircularProgress
              style={{
                color: '#37366B'
              }}
              size={30}
            />
          </Grid>
        )}
        <CommentForm
          ref={commentFormRef}
          isEdit={isEdit}
          joinToTopic={joinToTopic}
          setIsEdit={setIsEdit}
          getCommentById={getCommentById}
          scrollToBottom={scrollToBottom}
          jumpToMessage={jumpToInternalComment}
          topic={topic}
          getComments={getComments}
          selectedComment={selectedComment}
          setSelectedComment={setSelectedComment}
        />
      </Grid>
    </Modal>
  );
};

export default Comments;
