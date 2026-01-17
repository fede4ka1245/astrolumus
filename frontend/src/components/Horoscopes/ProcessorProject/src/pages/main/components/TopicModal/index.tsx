import { useEffect, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import { Grid, Typography } from '@mui/material';
import Modal from '../../../../components/modal/Modal';
import { ModalProps } from '../../../../components/modal/ModalProps';
import CommentPreview from '../../../../components/CommentPreview';
import TopicPreview from '../../../../components/TopicPreview';
import ButtonClose from '../../../../components/buttonClose/ButtonClose';
import Options from '../../../../components/options/Options';
import TopicSkeleton from '../../../../components/skeletons/TopicSkeleton';
import { useAppSelector } from '../../../../store/store';
import { IOptionItem } from '../../../../models/interfaces/options';
import { IServerTopic, ITopicComment } from '../../../../models/interfaces/topic';
import { topicsFiltersSetting } from '../../../../settings/filtersSettings';
import { topicsSorts } from '../../../../settings/sortsSettings';
import { forumTopicApi, forumSearch, forumCommentApi } from '../../../../api/forum';
import authRequest from '../../../../api/authRequest';
import styles from './styles.module.scss';
import { useSearchParamsState } from '../../../../hooks/useSearchParamsState';
import IconButton from '../../../../components/iconButton/IconButton';

interface IProps extends ModalProps {
}

export interface ITopicModalRef {
  setFilterTopicParam: (value: IOptionItem) => void;
  setSortTopicParam: (value: IOptionItem) => void;
}

const TopicModal = forwardRef<ITopicModalRef, IProps>(({ isOpen, close }, ref) => {
  const { id } = useAppSelector(state => state.user.userInfo);
  const topicsFilters = topicsFiltersSetting(id);
  const [filterTopicParam, setFilterTopicParam] = useSearchParamsState('topicModalFilterParam', topicsFilters[0]);
  const [topicModalValue, setTopicModalValue] = useSearchParamsState('topicModalValue', '');
  const [sortTopicParam, setSortTopicParam] = useSearchParamsState('sortTopicModalParam', topicsSorts[0]);
  const [topics, setTopics] = useState<IServerTopic[]>([]);
  const [comments, setComments] = useState<ITopicComment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      if (filterTopicParam.value !== 'commented') {
        getTopics({ ...sortTopicParam.params, ...filterTopicParam.params });
      } else {
        getTopicComments({ ...sortTopicParam.params, ...filterTopicParam.params });
      };
    } else {
      setTopics([]);
      setComments([]);
    }
  }, [isOpen]);

  useImperativeHandle(ref, () => ({
    setSortTopicParam,
    setFilterTopicParam
  }));

  const getTopics = useCallback((params: object) => {
    setLoading(true);
    authRequest.get(forumTopicApi(), {
      params: {
        not_published: false,
        ...params
      }
    })
      .then(res => {
        setTopics(res.data.results);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getTopicComments = useCallback((params: object) => {
    setLoading(true);
    authRequest.get(forumCommentApi(), {
      params
    })
      .then(res => {
        setComments(res.data.results);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const onSearch = useCallback((text: string) => {
    setLoading(true);
    authRequest.get(forumSearch(), {
      params: {
        ...sortTopicParam.params, 
        ...filterTopicParam.params,
        query: text
      }
    })
      .then(res => {
        setTopics(res.data.results);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [filterTopicParam.params, sortTopicParam.params]);

  useEffect(() => {
    if (!topicModalValue) {
      if (isOpen) {
        if (filterTopicParam.value !== 'commented') {
          getTopics({ ...sortTopicParam.params, ...filterTopicParam.params });
        } else {
          getTopicComments({ ...sortTopicParam.params, ...filterTopicParam.params });
        }
      } else {
        setTopics([]);
        setComments([]);
      }
      return;
    }

    onSearch(topicModalValue);
  }, [topicModalValue]);

  const setTopicFilter = useCallback((value: any) => {
    setFilterTopicParam(value);
    if (value.value !== 'commented') {
      getTopics({ ...value.params, ...sortTopicParam.params });
      setComments([]);
    } else {
      getTopicComments({ ...value.params, ...sortTopicParam.params });
      setTopics([]);
    }
  }, [getTopicComments, getTopics, setFilterTopicParam, sortTopicParam.params]);

  const setTopicSort = useCallback((value: any) => {
    setSortTopicParam(value);
    if (filterTopicParam.value !== 'commented') {
      getTopics({ ...value.params, ...filterTopicParam.params });
      setComments([]);
    } else {
      getTopicComments({ ...value.params, ...filterTopicParam.params });
      setTopics([]);
    }
  }, [filterTopicParam.params, filterTopicParam.value, getTopicComments, getTopics, setSortTopicParam]);

  if (filterTopicParam.value === 'commented') {
    return (
      <Modal isOpen={isOpen} close={close} height={'var(--modal-page-height)'}>
        <Grid p={2} height={'100%'} sx={{ background: 'white' }}>
          <Grid display={'flex'} justifyContent={'flex-end'}>
            <ButtonClose onClick={close}/>
          </Grid>
          <Grid item width={'100%'} mb={0.5}>
            <Options options={topicsFilters} value={filterTopicParam?.value} setValue={setTopicFilter} isOutlined isScrollable/>
          </Grid>
          <Grid item width={'100%'} mb={2}>
            <Options options={topicsSorts} value={sortTopicParam.value} setValue={setTopicSort} isOutlined isScrollable/>
          </Grid>
          {loading
            ? Array(3)
              .fill(0).map((item, index) => (
                <Grid item width={'100%'} mb={2} key={index}>
                  <TopicSkeleton/>
                </Grid>
              ))
            : comments.length > 0 
              ? comments.map(comment => (
                <Grid item width={'100%'} mb={2} key={comment.id}>
                  <CommentPreview
                    {...comment}
                  />
                </Grid>
              ))
              : (
                <Grid item width={'100%'}>
                  <Grid container justifyContent={'center'} width={'100%'} py={5} bgcolor={'#FFF'} borderRadius={'10px'} boxShadow={'-5px -5px 20px #FFFFFF, 5px 5px 20px rgba(174, 174, 192, 0.5)'}>
                    <Typography fontFamily={'Gilroy'} fontSize={'20px'} fontWeight={700} textAlign={'center'} mb={2}>
                      Комментарии отсутствуют
                    </Typography>
                  </Grid>
                </Grid>
              )}
        </Grid>
      </Modal>);
  };
  return (
    <Modal isOpen={isOpen} close={close} height={'calc(100% - 7rem)'}>
      <Grid p={2} height={'100%'} sx={{ background: 'white' }}>
        <Grid className={styles.search} mb={1}>
          <Grid pl={1} display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <svg width="17" height="17" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8.63636" cy="8.63636" r="7.63636" stroke="#C3C9CD" strokeWidth="2"/>
              <path d="M14.0908 14.0909L19.0908 19.0909" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </Grid>
          <input
            placeholder={'Введите фразу для поиска'}
            value={topicModalValue}
            onChange={(e) => setTopicModalValue(e.target.value)}
          />
          <Grid pr={1} display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <IconButton onClick={() => setTopicModalValue('')}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 1.5L12.5 12.5" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12.5 1.5L1.5 12.5" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </IconButton>
          </Grid>
        </Grid>
        <Grid item width={'100%'} mb={0.5} >
          <Options options={topicsFilters} value={filterTopicParam?.value} setValue={setTopicFilter} isOutlined isScrollable/>
        </Grid>
        <Grid item width={'100%'} mb={2}>
          <Options options={topicsSorts} value={sortTopicParam.value} setValue={setTopicSort} isOutlined isScrollable/>
        </Grid>
        {loading
          ? Array(3)
            .fill(0).map((item, index) => (
              <Grid item width={'100%'} mb={2} key={index}>
                <TopicSkeleton/>
              </Grid>
            ))
          : topics.length > 0 
            ? topics.map(topic => (
              <Grid item width={'100%'} mb={2} key={topic.id}>
                <TopicPreview
                  topic={topic}
                  isModalTopic={true}
                />
              </Grid>
            ))
            : (
              <Grid item width={'100%'}>
                <Grid container justifyContent={'center'} width={'100%'} py={5} bgcolor={'#FFF'} borderRadius={'10px'} boxShadow={'-5px -5px 20px #FFFFFF, 5px 5px 20px rgba(174, 174, 192, 0.5)'}>
                  <Typography fontFamily={'Gilroy'} fontSize={'20px'} fontWeight={700} textAlign={'center'} mb={2}>
                    Темы отсутствуют
                  </Typography>
                </Grid>
              </Grid>
            )}
      </Grid>
    </Modal>
  );
});

TopicModal.displayName = 'TopicModal';

export default TopicModal;
