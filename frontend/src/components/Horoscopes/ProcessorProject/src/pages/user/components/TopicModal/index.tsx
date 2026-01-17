import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Grid, Typography } from '@mui/material';
import Modal from '../../../../components/modal/Modal';
import { ModalProps } from '../../../../components/modal/ModalProps';
import CommentPreview from '../../../../components/CommentPreview';
import TopicPreview from '../../../../components/TopicPreview';
import ButtonClose from '../../../../components/buttonClose/ButtonClose';
import Options from '../../../../components/options/Options';
import TopicSkeleton from '../../../../components/skeletons/TopicSkeleton';
import { IOptionItem } from '../../../../models/interfaces/options';
import { IServerTopic, ITopicComment } from '../../../../models/interfaces/topic';
import { forumTopicApi, forumSearch, forumCommentApi } from '../../../../api/forum';
import authRequest from '../../../../api/authRequest';
import styles from './styles.module.scss';

interface IProps extends ModalProps {
  userId: number;
}

export interface ITopicModalRef {
  setFilterTopicParam: (value: IOptionItem) => void;
}

const TopicModal = forwardRef<ITopicModalRef, IProps>(({ isOpen, close, userId }, ref) => {
  const topicsFilters = [
    {
      label: 'Aвтор',
      value: 'my_topic',
      params: { user: userId }
    },
    {
      label: 'Участник',
      value: 'user',
      params: { invited_user: userId }
    },
    {
      label: 'Комментируемые',
      value: 'commented',
      params: { user: userId }
    }
  ];
  const [filterTopicParam, setFilterTopicParam] = useState(topicsFilters[0]);
  const [topics, setTopics] = useState<IServerTopic[]>([]);
  const [comments, setComments] = useState<ITopicComment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      if (filterTopicParam.value !== 'commented') {
        getTopics(filterTopicParam.params);
      } else {
        getTopicComments(filterTopicParam.params);
      };
    } else {
      setTopics([]);
      setComments([]);
    }
  }, [isOpen]);

  const getTopics = (params: object) => {
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
  };

  const getTopicComments = (params: object) => {
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
  };

  const onSearch = (text: string) => {
    setLoading(true);
    authRequest.get(forumSearch(), {
      params: {
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
  };

  const setTopicFilter = (value: any) => {
    setFilterTopicParam(value);
    if (value.value !== 'commented') {
      getTopics(value.params);
      setComments([]);
    } else {
      getTopicComments(value.params);
      setTopics([]);
    };
  };

  useImperativeHandle(ref, () => ({
    setFilterTopicParam
  }));

  if (filterTopicParam.value === 'commented') {
    return (
      <Modal isOpen={isOpen} close={close} height={'var(--modal-page-height)'}>
        <Grid p={2} height={'100%'} sx={{ background: 'white' }}>
          <Grid display={'flex'} justifyContent={'flex-end'}>
            <ButtonClose onClick={close}/>
          </Grid>
          <Grid item width={'100%'} mb={2}>
            <Options options={topicsFilters} value={filterTopicParam?.value} setValue={setTopicFilter} isOutlined isScrollable/>
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
    <Modal isOpen={isOpen} close={close} height={'var(--modal-page-height)'}>
      <Grid p={2} height={'100%'} sx={{ background: 'white' }}>
        <Grid display={'flex'} justifyContent={'flex-end'}>
          <ButtonClose onClick={close}/>
        </Grid>
        <Grid className={styles.search} mt={2} mb={1}>
          <Grid pl={1} display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <svg width="17" height="17" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8.63636" cy="8.63636" r="7.63636" stroke="#C3C9CD" strokeWidth="2"/>
              <path d="M14.0908 14.0909L19.0908 19.0909" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </Grid>
          <input placeholder={'Введите фразу для поиска'} onChange={(e) => e.target.value.length > 0 ? onSearch(e.target.value) : () => {}}/>
          <Grid pr={1} display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.5 1.5L12.5 12.5" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12.5 1.5L1.5 12.5" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </Grid>
        </Grid>
        <Grid item width={'100%'} mb={2} >
          <Options options={topicsFilters} value={filterTopicParam?.value} setValue={setTopicFilter} isOutlined isScrollable/>
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
                />
              </Grid>
            ))
            : (
              <Grid item width={'100%'}>
                <Grid container justifyContent={'center'}width={'100%'} py={5} bgcolor={'#FFF'} borderRadius={'10px'} boxShadow={'-5px -5px 20px #FFFFFF, 5px 5px 20px rgba(174, 174, 192, 0.5)'}>
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
