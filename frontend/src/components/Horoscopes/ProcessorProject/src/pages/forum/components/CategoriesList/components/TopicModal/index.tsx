import { useEffect, useState, FC, useRef, useCallback } from 'react';
import { CircularProgress, Fade, Grid, Typography } from '@mui/material';
import Modal from '../../../../../../components/modal/Modal';
import { ModalProps } from '../../../../../../components/modal/ModalProps';
import CommentPreview from '../../../../../../components/CommentPreview';
import TopicPreview from '../../../../../../components/TopicPreview';
import ButtonClose from '../../../../../../components/buttonClose/ButtonClose';
import Options from '../../../../../../components/options/Options';
import TopicSkeleton from '../../../../../../components/skeletons/TopicSkeleton';
import { useAppSelector } from '../../../../../../store/store';
import { IForumCategory } from '../../../../../../models/interfaces/forum';
import { IServerTopic, ITopicComment } from '../../../../../../models/interfaces/topic';
import { forumTopicApi, forumSearch, forumCommentApi } from '../../../../../../api/forum';
import authRequest from '../../../../../../api/authRequest';
import search from '../../../../assets/search.svg';
import closeSrc from '../../../../assets/close.svg';
import styles from './styles.module.scss';
import { topicsFiltersSettings, topicsSortsSettings } from './settings';
import useInfiniteScroll from '../../../../../../hooks/useInfiniteScroll';
import IconButton from '../../../../../../components/iconButton/IconButton';
import { useSearchParamsState } from '../../../../../../hooks/useSearchParamsState';

interface IProps extends ModalProps {
  category: IForumCategory | undefined;
  isOpen: boolean;
  close: () => void;
  setSelectedCategory?: (value: IForumCategory) => void;
}

const initialPageSize = 20;

const TopicModal: FC <IProps> = ({ isOpen, close, category, setSelectedCategory }) => {
  const { id } = useAppSelector(state => state.user.userInfo);
  const [filterTopicParam, setFilterTopicParam] = useSearchParamsState('topicModalFilterTopicParam', topicsFiltersSettings(id)[0]);
  const [sortTopicParam, setsortTopicParam] = useSearchParamsState('topicModalTopicParam', topicsSortsSettings[0]);
  const [topics, setTopics] = useState<IServerTopic[]>([]);
  const [searchText, setSearchText] = useSearchParamsState('topicModalSearchText', '');
  const [comments, setComments] = useState<ITopicComment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasNext, setHasNext] = useState(true);
  const [page, setPage] = useSearchParamsState('topicModalPage', 1);
  const [infiniteLoading, setInfiniteLoading] = useState(false);
  const abortController = useRef(new AbortController());
  const isFirstRender = useRef<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      if (searchText) {
        onSearch(searchText);
        return;
      }

      if (page > 1 && category) {
        getTopics({ ...sortTopicParam.params, ...filterTopicParam.params, category: category.id, page: 1, page_size: page * initialPageSize });
        return;
      }

      if (category) {
        setPage(1);
        getTopics({ ...sortTopicParam.params, ...filterTopicParam.params, category: category.id, page: 1 });
      }
    } else {
      setTopics([]);
    }
  }, [isOpen, category, searchText]);

  const lastItemRef = useInfiniteScroll(() => {
    if (searchText) {
      return;
    }

    if (hasNext && !infiniteLoading && !loading) {
      if (filterTopicParam.value !== 'commented') {
        setPage(page + 1);
        getTopics({ ...filterTopicParam.params, ...sortTopicParam.params, category: category?.id, page: page + 1 }, true);
        setComments([]);
      } else {
        setPage(page + 1);
        getTopicComments({ ...filterTopicParam.params, ...sortTopicParam.params, category: category?.id, page: page + 1 }, true);
        setTopics([]);
      }
    }
  });

  const getTopics = useCallback((params: any, isInfinity?: boolean) => {
    abortController.current.abort();
    abortController.current = new AbortController();

    if (!isInfinity) {
      setLoading(true);
    } else {
      setInfiniteLoading(true);
    }

    authRequest.get(forumTopicApi(), {
      params: {
        category: category?.id,
        not_published: false,
        page_size: initialPageSize,
        ...params
      },
      signal: abortController.current.signal
    })
      .then(res => {
        if (isInfinity) {
          setTopics(prev => [...prev, ...res.data.results]);
        } else {
          setTopics(res.data.results);
        }
        setHasNext(!!res.data.next);

        if (!isInfinity) {
          setLoading(false);
        } else {
          setInfiniteLoading(false);
        }
      })
      .catch((err) => {
        if (err.message === 'canceled') {
          return;
        }

        if (!isInfinity) {
          setLoading(false);
        } else {
          setInfiniteLoading(false);
        }
      });
  }, [category?.id]);

  const getTopicComments = useCallback((params: object, isInfinity?: boolean) => {
    if (!isInfinity) {
      setLoading(true);
    } else {
      setInfiniteLoading(true);
    }
    authRequest.get(forumCommentApi(), {
      params: {
        category: category?.id,
        page_size: initialPageSize,
        ...params
      }
    })
      .then(res => {
        if (isInfinity) {
          setComments(prev => [...prev, ...res.data.results]);
        } else {
          setComments(res.data.results);
        }
        setHasNext(res.data.next);
      })
      .finally(() => {
        if (!isInfinity) {
          setLoading(false);
        } else {
          setInfiniteLoading(false);
        }
      });
  }, [category?.id]);

  const onSearch = useCallback((text: string) => {
    setSearchText(text);
    setLoading(true);

    abortController.current.abort();
    abortController.current = new AbortController();

    authRequest.get(forumSearch(), {
      params: {
        ...sortTopicParam.params,
        ...filterTopicParam.params,
        query: text,
        category: category?.id
      },
      signal: abortController.current.signal
    })
      .then(res => {
        setTopics(res.data.results);
        setLoading(false);
      })
      .catch((err) => {
        if (err.message === 'canceled') {
          return;
        }

        setLoading(false);
      });
  }, [category?.id, filterTopicParam.params, setSearchText, sortTopicParam.params]);

  const selectCategory = useCallback((category: IForumCategory) => {
    if (setSelectedCategory) {
      setSelectedCategory(category);
    }
    setPage(1);
    if (filterTopicParam.value !== 'commented') {
      getTopics({ ...filterTopicParam.params, ...sortTopicParam.params, category: category.id });
      setComments([]);
    } else {
      getTopicComments({ ...filterTopicParam.params, ...sortTopicParam.params, category: category.id });
      setTopics([]);
    }
  }, [filterTopicParam.params, filterTopicParam.value, getTopicComments, getTopics, setPage, setSelectedCategory, sortTopicParam.params]);

  const setTopicFilter = useCallback((value: any) => {
    setFilterTopicParam(value);
    setSearchText('');
    if (value.value !== 'commented') {
      getTopics({ ...value.params, ...sortTopicParam.params });
      setComments([]);
    } else {
      getTopicComments({ ...value.params, ...sortTopicParam.params });
      setTopics([]);
    }
  }, [getTopicComments, getTopics, setFilterTopicParam, setSearchText, sortTopicParam.params]);

  const setTopicSort = useCallback((value: any) => {
    setsortTopicParam(value);
    setSearchText('');
    if (filterTopicParam.value !== 'commented') {
      getTopics({ ...value.params, ...filterTopicParam.params });
      setComments([]);
    } else {
      getTopicComments({ ...value.params, ...filterTopicParam.params });
      setTopics([]);
    }
  }, [filterTopicParam.params, filterTopicParam.value, getTopicComments, getTopics, setSearchText, setsortTopicParam]);

  const getListByType = useCallback((type: string) => {
    if (type === 'commented') {
      if (comments.length > 0) {
        return comments.map(comment => (
          <Grid item width={'100%'} mb={2} key={comment.id}>
            <CommentPreview
              {...comment}
            />
          </Grid>));
      } else {
        return (
          <Grid item width={'100%'}>
            <Grid container justifyContent={'center'} width={'100%'} py={5} bgcolor={'#FFF'} borderRadius={'10px'} boxShadow={'-5px -5px 20px #FFFFFF, 5px 5px 20px rgba(174, 174, 192, 0.5)'}>
              <Typography fontFamily={'Gilroy'} fontSize={'20px'} fontWeight={700} textAlign={'center'} mb={2}>
                Комментарии отсутствуют
              </Typography>
            </Grid>
          </Grid>
        );
      }
    } else {
      if (topics.length > 0) {
        return (<>
          {topics.map(topic => (
            <Grid item width={'100%'} mb={2} key={topic.id}>
              <TopicPreview
                isModalTopic={true}
                topic={topic}
              />
            </Grid>
          ))}
        </>);
      } else {
        return (
          <Grid item width={'100%'}>
            <Grid container justifyContent={'center'} width={'100%'} py={5} bgcolor={'#FFF'} borderRadius={'10px'} boxShadow={'-5px -5px 20px #FFFFFF, 5px 5px 20px rgba(174, 174, 192, 0.5)'}>
              <Typography fontFamily={'Gilroy'} fontSize={'20px'} fontWeight={700} textAlign={'center'} mb={2}>
                Темы отсутствуют
              </Typography>
            </Grid>
          </Grid>
        );
      }
    }
  }, [comments, topics]);
  
  const onClose = useCallback(() => {
    setSearchText('');
    setPage(1);
    setFilterTopicParam(topicsFiltersSettings(id)[0]);
    setsortTopicParam(topicsSortsSettings[0]);
    isFirstRender.current = true;
    close();
  }, [close, id, setFilterTopicParam, setPage, setSearchText, setsortTopicParam]);

  return (
    <Modal isOpen={isOpen} close={onClose} height={'var(--modal-page-height)'}>
      {category && <>
        <Grid p={2} height={'100%'} width={'100%'} bgcolor="#FFF">
          <Grid display={'flex'} alignItems={'flex-start'} justifyContent={'space-between'}>
            <Typography fontFamily={'Gilroy'} fontWeight={'bold'} fontSize={'19px'} textTransform={'uppercase'} mb={1}>
              {category?.title}
            </Typography>
            <Grid>
              <ButtonClose onClick={onClose}/>
            </Grid>
          </Grid>
          <Grid display={'flex'} flexWrap={'wrap'} >
            {(category?.children && category?.children.length > 0) && (
              <Grid mr={2}>
                <svg width="24" height="16" viewBox="0 0 20 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.5361 6.17272L15.9361 6.71817L17.9543 8.98181H9.82706C5.0816 8.98181 1.23615 5.13635 1.23615 0.3909H0.417969C0.417969 5.59999 4.64524 9.79999 9.85433 9.82726H17.9543L15.9089 12.0636L16.5089 12.6091L19.3998 9.36363L16.5361 6.17272Z" fill="#37366B"/>
                </svg>
              </Grid>
            )
            }
            {category?.children?.map((child) => (
              <Grid key={child.id} display={'flex'} alignItems={'center'} mr={2} onClick={() => selectCategory(child)}>
                <Typography
                  fontFamily={'Gilroy'} fontWeight={500} fontSize={'15px'} color={'#37366B'} key={child.id} mr={1}>
                  {child.title}
                </Typography>
              </Grid>
            ))}
          </Grid>
          {
            filterTopicParam.value !== 'commented' && (
              <Grid className={styles.search} mt={2} mb={1}>
                <Grid pl={1} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                  <img width={17} height={17} src={search} />
                </Grid>
                <input placeholder={'Введите фразу для поиска'}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}/>
                <Grid pr={1} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                  <IconButton
                    onClick={() => setSearchText('')}
                    style={{ width: '20px', height: '20px' }}
                    fillStyle={{ width: '32px', height: '32px' }}
                  >
                    <img width={12} height={12} src={closeSrc} />
                  </IconButton>
                </Grid>
              </Grid>
            )
          }
          <Grid container width={'100%'} direction={'column'}>
            <Grid item width={'100%'} mb={0.5} mt={2}>
              <Options options={topicsFiltersSettings(id)} value={filterTopicParam?.value} setValue={setTopicFilter} isOutlined isScrollable/>
            </Grid>
            <Grid item width={'100%'} mb={2}>
              <Options options={topicsSortsSettings} value={sortTopicParam.value} setValue={setTopicSort} isOutlined isScrollable/>
            </Grid>
          </Grid>
          <Grid mb={2}>
            {loading && Array(4).fill(0).map((item, index) => (
              <Grid item width={'100%'} mb={2} key={index}>
                <TopicSkeleton/>
              </Grid>
            ))}
            <Fade mountOnEnter timeout={300} in={!loading}>
              <div>
                { getListByType(filterTopicParam.value)}
              </div>
            </Fade>
          </Grid>
          <Fade in={infiniteLoading}>
            <Grid display="flex" justifyContent="center" width="100%" pb={2}>
              <CircularProgress
                style={{
                  color: '#37366B'
                }}
                size={30}/>
            </Grid>
          </Fade>
          <Grid height={'5px'} ref={lastItemRef} />
        </Grid>
      </>}
    </Modal>
  );
};

export default TopicModal;
