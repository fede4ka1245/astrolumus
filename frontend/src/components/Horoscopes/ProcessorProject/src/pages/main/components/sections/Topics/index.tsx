import { FC, useState, useEffect, useRef, useCallback } from 'react';
import { Fade, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAppSelector } from '../../../../../store/store';
import { IServerTopic, ITopicComment } from '../../../../../models/interfaces/topic';
import { forumCommentApi, forumTopicApi } from '../../../../../api/forum';
import authRequest from '../../../../../api/authRequest';
import Button from '../../../../../components/button/Button';
import Options from '../../../../../components/options/Options';
import TopicPreview from '../../../../../components/TopicPreview';
import ShowMoreButton from '../../../components/showMoreButton/ShowMoreButton';
import CommentPreview from '../../../../../components/CommentPreview';
import { routes } from '../../../../../models/enums/routes';
import DraftBar from '../../../../../components/DraftBar';
import TopicModal, { ITopicModalRef } from '../../TopicModal';
import TopicCreatorBar from '../../../../../components/TopicCreatorBar';
import { topicsSorts } from '../../../../../settings/sortsSettings';
import { topicsFiltersSetting } from '../../../../../settings/filtersSettings';
import styles from '../../../styles.module.scss';
import { useSearchParamsState } from '../../../../../hooks/useSearchParamsState';
import ContentSkeleton from '../../../../../components/contentSkeleton/ContentSkeleton';

interface TopicsProps {
  header?: string,
  showFilters?: boolean,
  onShowMore?: (props?: any | any[]) => any,
  showMoreActive?: boolean
}

const Topics:FC<TopicsProps> = ({ header, showFilters = true, onShowMore, showMoreActive = true }) => {
  const { id } = useAppSelector(state => state.user.userInfo);
  const topicsFilters = topicsFiltersSetting(id);
  const [filterTopicParam, setFilterTopicParam] = useSearchParamsState('topicsFilters', topicsFilters[0]);
  const topicModalRef = useRef<ITopicModalRef>(null);
  const [sortTopicParam, setSortTopicParam] = useSearchParamsState('sortTopicParam', topicsSorts[0]);
  const [isOpenModal, setIsOpenModal] = useSearchParamsState('isOpenModal', false, false);
  const [topicListLoading, setTopicListLoading] = useState(false);
  const [topicList, setTopicList] = useState<IServerTopic[]>([]);
  const [topicComments, setTopicComments] = useState<ITopicComment[]>([]);
  const axiosToken = useRef(axios.CancelToken.source());
  const navigate = useNavigate();

  useEffect(() => {
    getTopicsList({ ...sortTopicParam.params, ...filterTopicParam.params });
  }, []);

  const getTopicsList = useCallback((params: object) => {
    setTopicListLoading(true);
    authRequest.get(forumTopicApi(), {
      cancelToken: axiosToken.current.token,
      params: {
        ...params,
        not_published: false, 
        page_size: 4
      } 
    })
      .then(res => {
        setTopicList(res.data.results);
      })
      .finally(() => {
        setTopicListLoading(false);
      });
  }, []);

  const getTopicComments = useCallback((params: object) => {
    setTopicListLoading(true);
    authRequest.get(forumCommentApi(), {
      params: { 
        ...params, 
        page_size: 4
      }
    })
      .then(res => {
        setTopicComments(res.data.results);
      })
      .finally(() => {
        setTopicListLoading(false);
      });
  }, []);

  const setTopicFilter = useCallback((value: any) => {
    if (filterTopicParam.value !== value) {
      topicModalRef.current?.setFilterTopicParam(value);
      if (value.value !== 'commented') {
        getTopicsList({ ...value.params, ...sortTopicParam.params });
        setTopicComments([]);
      } else {
        getTopicComments({ ...value.params, ...sortTopicParam.params });
        setTopicList([]);
      }
    }
  }, [filterTopicParam.value, getTopicsList, sortTopicParam.params, getTopicComments]);

  const setTopicSort = useCallback((value: any) => {
    if (sortTopicParam.value !== value) {
      topicModalRef.current?.setSortTopicParam(value);
      if (filterTopicParam.value !== 'commented') {
        getTopicsList({ ...value.params, ...filterTopicParam.params });
        setTopicComments([]);
      } else {
        getTopicComments({ ...value.params, ...filterTopicParam.params });
        setTopicList([]);
      }
    }
  }, [sortTopicParam.value, filterTopicParam.value, filterTopicParam.params, getTopicsList, getTopicComments]);

  const navigateToForum = useCallback(() => {
    navigate(routes.forum);
  }, []);
  
  const onShowMoreButtonClick = useCallback(() => {
    if (onShowMore) {
      onShowMore();
      return;
    }

    setIsOpenModal(true);
  }, [onShowMore]);

  if (filterTopicParam.value === 'commented') {
    return (<Grid container direction={'column'}>
      <Grid item pl={2} pr={2} width={'100%'} pt={2}>
        <div className={styles.title}>
          {header || 'Темы на форуме'}
        </div>
      </Grid>
      {showFilters && <>
        <Grid item pl={2} pr={2} width={'100%'} mb={0.5} mt={2}>
          <Options options={topicsFilters} value={filterTopicParam?.value} setValue={(value) => {
            setFilterTopicParam(value);
            setTopicFilter(value);
          }} isOutlined isScrollable/>
        </Grid>
        <Grid item pl={2} pr={2} width={'100%'} mb={2}>
          <Options options={topicsSorts} value={sortTopicParam.value} setValue={(value) => {
            setSortTopicParam(value);
            setTopicSort(value);
          }} isOutlined isScrollable/>
        </Grid>
      </>}
      {topicListLoading && (
        <Grid m={2}>
          <ContentSkeleton />
        </Grid>
      )}
      <Fade in={!topicListLoading} timeout={300}>
        <div>
          {topicComments.length > 0 && topicComments.slice(0, 3).map(comment => (
            <Grid item px={2} width={'100%'} mb={2} key={comment.id}>
              <CommentPreview
                {...comment}
              />
            </Grid>
          ))}
          {!topicComments.length && (
            <Grid item width={'100%'} mb={2} px={2}>
              <Grid
                display={'flex'}
                flexDirection={'column'}
                justifyContent={'center'}
                alignItems={'center'}
                px={2} width={'100%'} py={5} bgcolor={'#FFF'} borderRadius={'10px'}
                boxShadow={'-5px -5px 20px #FFFFFF, 5px 5px 20px rgba(174, 174, 192, 0.5)'}>
                <Typography fontFamily={'Gilroy'} fontSize={'20px'} fontWeight={700} textAlign={'center'} mb={2}>
                  Комментарии отсутствуют
                </Typography>
                <Grid item width={200}>
                  <Button onClick={navigateToForum} text='Показать еще'/>
                </Grid>
              </Grid>
            </Grid>
          )}
          {showMoreActive && topicComments.length > 3 && (
            <Grid item px={2} width={'100%'}>
              <Grid onClick={onShowMoreButtonClick}>
                <ShowMoreButton/>
              </Grid>
            </Grid>
          )}
        </div>
      </Fade>
      <TopicModal ref={topicModalRef} isOpen={isOpenModal} close={() => navigate(-1)}/>
    </Grid>);
  }

  return (
    <Grid container direction={'column'}>
      <Grid item pl={2} pr={2} width={'100%'} pt={2}>
        <div className={styles.title}>
          {header || 'Темы на форуме'}
        </div>
      </Grid>
      {showFilters && <>
        <Grid item pl={2} pr={2} width={'100%'} mt={2}>
          <Options options={topicsFilters} value={filterTopicParam?.value} setValue={(value) => {
            setFilterTopicParam(value);
            setTopicFilter(value);
          }} isOutlined isScrollable/>
        </Grid>
        <Grid item pl={2} pr={2} width={'100%'} mt={0.5}>
          <Options options={topicsSorts} value={sortTopicParam.value} setValue={(value) => {
            setSortTopicParam(value);
            setTopicSort(value);
          }} isOutlined isScrollable/>
        </Grid>
      </>}
      <Grid px={2} item mt={2}>
        {filterTopicParam.value === 'my_topic' &&
          <>
            <Grid mb={2}>
              <DraftBar/>
            </Grid>
            <Grid mb={2}>
              <TopicCreatorBar/>
            </Grid>
          </>
        }
        {topicListLoading && (
          <Grid>
            <ContentSkeleton />
          </Grid>
        )}
        <Fade in={!topicListLoading} timeout={300}>
          <div>
            {topicList.slice(0, 3).map(topic => (
              <Grid item width={'100%'} mb={2} key={topic.id}>
                <TopicPreview
                  topic={topic}
                />
              </Grid>
            ))}
            {!topicListLoading && !topicList.length && (
              <Grid item width={'100%'} mb={2}>
                <Grid
                  display={'flex'}
                  flexDirection={'column'}
                  justifyContent={'center'}
                  alignItems={'center'}
                  px={2} width={'100%'} py={5} bgcolor={'#FFF'} borderRadius={'10px'}
                  boxShadow={'-5px -5px 20px #FFFFFF, 5px 5px 20px rgba(174, 174, 192, 0.5)'}>
                  <Typography fontFamily={'Gilroy'} fontSize={'20px'} fontWeight={700} textAlign={'center'} mb={2}>
                    Темы отсутствуют
                  </Typography>
                  <Grid item width={200}>
                    <Button onClick={navigateToForum} text='Показать еще'/>
                  </Grid>
                </Grid>
              </Grid>
            )}
            {showMoreActive && topicList.length > 3 && (
              <Grid item width={'100%'}>
                <Grid onClick={onShowMoreButtonClick}>
                  <ShowMoreButton/>
                </Grid>
              </Grid>
            )}
          </div>
        </Fade>
      </Grid>
      <TopicModal ref={topicModalRef} isOpen={isOpenModal} close={() => setIsOpenModal(false)}/>
    </Grid>
  );
};

export default Topics;
