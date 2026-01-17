import { FC, useState, useEffect, useRef, useCallback } from 'react';
import { Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Button from '../../../../../components/button/Button';
import Options from '../../../../../components/options/Options';
import TopicPreview from '../../../../../components/TopicPreview';
import TopicSkeleton from '../../../../../components/skeletons/TopicSkeleton';
import { routes } from '../../../../../models/enums/routes';
import styles from './styles.module.scss';
import CommentPreview from '../../../../../components/CommentPreview';
import { IServerTopic, ITopicComment } from '../../../../../models/interfaces/topic';
import authRequest from '../../../../../api/authRequest';
import { forumCommentApi, forumTopicApi } from '../../../../../api/forum';
import ShowMoreButton from '../../../../main/components/showMoreButton/ShowMoreButton';
import TopicModal, { ITopicModalRef } from '../../TopicModal';
import { useSearchParamsState } from '../../../../../hooks/useSearchParamsState';

interface IProps {
  userId: number
}

const Topics:FC<IProps> = ({ userId }) => {
  const topicsFilters = [
    {
      label: 'Aвтор',
      value: 'my_topic',
      params: { user: userId }
    },
    {
      label: 'Участник',
      value: 'user',
      params: { membership_user: userId }
    },
    {
      label: 'Комментируемые',
      value: 'commented',
      params: { user: userId }
    }
  ];
  const [filterTopicParam, setFilterTopicParam] = useState(topicsFilters[0]);
  const [topicListLoading, setTopicListLoading] = useState(false);
  const [topicList, setTopicList] = useState<IServerTopic[]>([]);
  const topicModalRef = useRef<ITopicModalRef>(null);
  const [topicComments, setTopicComments] = useState<ITopicComment[]>([]);
  const [isOpenModal, setIsOpenModal] = useSearchParamsState('isTopicsOpenModal', false, false);
  const navigate = useNavigate();

  useEffect(() => {
    setFilterTopicParam(topicsFilters[0]);
    getTopics(topicsFilters[0].params);
  }, [userId]);

  const getTopics = useCallback((params: object) => {
    setTopicListLoading(true);
    authRequest.get(forumTopicApi(), {
      params: {
        page_size: 4,
        not_published: false,
        ...params
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
        page_size: 4,
        ...params
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
    setFilterTopicParam(value);
    topicModalRef.current?.setFilterTopicParam(value);
    if (value.value !== 'commented') {
      getTopics(value.params);
      setTopicComments([]);
    } else {
      getTopicComments(value.params);
      setTopicList([]);
    }
  }, [getTopicComments, getTopics]);

  const navigateToForum = useCallback(() => {
    navigate(routes.forum);
  }, []);

  if (filterTopicParam.value === 'commented') {
    return (<Grid container direction={'column'}>
      <Grid item pl={2} pr={2} width={'100%'} pt={2}>
        <div className={styles.title}>
          Активность на форуме
        </div>
      </Grid>
      <Grid item pl={2} pr={2} width={'100%'} pt={0.5} mb={2}>
        <Options options={topicsFilters} value={filterTopicParam?.value} setValue={setTopicFilter} isOutlined isScrollable/>
      </Grid>
      {topicListLoading
        ? Array(3)
          .fill(0).map((item, index) => (
            <Grid item pl={2} pr={2} width={'100%'} mb={2} key={index}>
              <TopicSkeleton/>
            </Grid>
          ))
        : topicComments.length > 0 
          ? topicComments.slice(0, 3).map(comment => (
            <Grid item px={2} width={'100%'} mb={2} key={comment.id}>
              <CommentPreview
                {...comment}
              />
            </Grid>
          ))
          : (
            <Grid item pl={2} pr={2} width={'100%'}>
              <Grid container justifyContent={'center'} px={2} width={'100%'} py={5} bgcolor={'#FFF'} borderRadius={'10px'} boxShadow={'-5px -5px 20px #FFFFFF, 5px 5px 20px rgba(174, 174, 192, 0.5)'}>
                <Typography fontFamily={'Gilroy'} fontSize={'20px'} fontWeight={700} textAlign={'center'} mb={2}>
                  Комментарии отсутствуют
                </Typography>
                <Grid item width={200}>
                  <Button onClick={navigateToForum} text='Показать еще'/>
                </Grid>
              </Grid>
            </Grid>
          )}
      <TopicModal
        userId={userId}
        ref={topicModalRef} 
        isOpen={isOpenModal} 
        close={() => navigate(-1)}/>
      {
        topicComments.length > 3 && (
          <Grid item px={2} width={'100%'}>
            <Grid onClick={() => setIsOpenModal(true)}>
              <ShowMoreButton/>
            </Grid>
          </Grid>
        )
      }
    </Grid>);
  }

  return (
    <Grid container direction={'column'}>
      <Grid item pl={2} pr={2} width={'100%'} pt={2}>
        <div className={styles.title}>
          Темы на форуме
        </div>
      </Grid>
      <Grid item pl={2} pr={2} width={'100%'} pt={0.5} mb={2}>
        <Options options={topicsFilters} value={filterTopicParam?.value} setValue={setTopicFilter} isOutlined isScrollable/>
      </Grid>
      {topicListLoading
        ? Array(3)
          .fill(0).map((item, index) => (
            <Grid item pl={2} pr={2} width={'100%'} mb={2} key={index}>
              <TopicSkeleton/>
            </Grid>
          ))
        : topicList.length > 0 
          ? topicList.slice(0, 3).map(topic => (
            <Grid item px={2} width={'100%'} mb={2} key={topic.id}>
              <TopicPreview
                topic={topic}
              />
            </Grid>
          ))
          : (
            <Grid item pl={2} pr={2} width={'100%'}>
              <Grid container justifyContent={'center'} px={2} width={'100%'} py={5} bgcolor={'#FFF'} borderRadius={'10px'} boxShadow={'-5px -5px 20px #FFFFFF, 5px 5px 20px rgba(174, 174, 192, 0.5)'}>
                <Typography fontFamily={'Gilroy'} fontSize={'20px'} fontWeight={700} textAlign={'center'} mb={2}>
                  Темы отсутствуют
                </Typography>
                <Grid item width={200}>
                  <Button onClick={navigateToForum} text='Показать еще'/>
                </Grid>
              </Grid>
            </Grid>
          )}
      <TopicModal 
        userId={userId}
        ref={topicModalRef} 
        isOpen={isOpenModal} 
        close={() => navigate(-1)}/>
      {
        topicList.length > 3 && (
          <Grid item px={2} width={'100%'}>
            <Grid onClick={() => setIsOpenModal(true)}>
              <ShowMoreButton/>
            </Grid>
          </Grid>
        )
      }
    </Grid>
  );
};

export default Topics;
