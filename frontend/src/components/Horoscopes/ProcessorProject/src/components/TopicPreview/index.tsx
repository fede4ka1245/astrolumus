import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography } from '@mui/material';
import { useAppSelector } from '../../store/store';
import convertHtmlToText from '../../helpers/convertHtmlToText';
import { IServerTopic } from '../../models/interfaces/topic';
import { routes } from '../../models/enums/routes';
import { AccessLevel, TopicStatuses } from '../../models/enums/topic';
import Avatar from '../Avatar';
import JoinTopicModal from './JoinTopicModal';
import styles from './styles.module.scss';
import { insertZero } from '../../helpers/insertZero';
import { useSearchParamsState } from '../../hooks/useSearchParamsState';
import { FirebaseEvent } from '../../helpers/firebase/firebaseEvent';
import { logFirebaseEvent } from '../../helpers/firebase';

interface SectionPreviewProps {
  topic: IServerTopic;
  onClick?: () => void;
  isDraft?: boolean;
  isModalTopic?: boolean;
}

function isInViewport (element: HTMLElement) {
  const bounding = element.getBoundingClientRect();

  if (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.right <= (window.innerWidth || document.documentElement.clientWidth) &&
    bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)
  ) {
    return true;
  } else {
    return false;
  }
}

const TopicPreview: FC<SectionPreviewProps> = ({ topic, onClick, isModalTopic, isDraft }) => {
  const navigate = useNavigate();
  const { id } = useAppSelector(state => state.user.userInfo);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const [targetTopicId, setTargetTopicId] = useSearchParamsState('targetTopicId', -1);

  const getTopic = useCallback(() => {
    if (topic.access_level === AccessLevel.public || topic.user.id === id || topic.current_user_is_member) {
      setTargetTopicId(topic.id);
      navigate(routes.topic + topic.id);
    } else {
      setIsOpenModal(true);
    }
  }, [id, navigate, setTargetTopicId, topic.access_level, topic.current_user_is_member, topic.id, topic.user.id]);

  useEffect(() => {
    if (!targetTopicId || !topic?.id || !mainRef.current) {
      return;
    }

    if (!isModalTopic && document.documentElement.style.overflow === 'hidden') {
      return;
    }

    if (Number(targetTopicId) === topic?.id && mainRef.current) {
      document.body.style.scrollBehavior = 'auto';
      document.documentElement.style.scrollBehavior = 'auto';
      mainRef.current.scrollIntoView({ behavior: 'auto', block: 'center' });

      const animate = (counter: number) => {
        setTimeout(() => {
          if (counter === 35) {
            document.body.style.scrollBehavior = 'smooth';
            document.documentElement.style.scrollBehavior = 'smooth';
            return;
          }

          if (!mainRef.current || !isInViewport(mainRef.current)) {
            animate(counter + 1);
            return;
          }

          document.body.style.scrollBehavior = 'smooth';
          document.documentElement.style.scrollBehavior = 'smooth';

          (mainRef.current as HTMLElement).animate([
            { opacity: 0.4 },
            { opacity: 1 }
          ], {
            duration: 600,
            iterations: 1
          });
        }, 250);
      };

      animate(0);

      setTargetTopicId(-1);
    }
  }, [topic, targetTopicId]);
  
  const onTopicClick = useCallback(() => {
    logFirebaseEvent({
      name: FirebaseEvent.openTopic
    });

    if (onClick) {
      onClick();
    } else {
      getTopic();
    }
  }, [onClick]);

  return (
    <div ref={mainRef}>
      <JoinTopicModal
        isOpen={isOpenModal}
        close={() => setIsOpenModal(false)}
        topic={topic}
      />
      <div className={styles.container} onClick={onTopicClick}>
        <div style={{ width: '100%' }}>
          <Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'} mb={0.7}>
            <Grid mr={2} display={'flex'} alignItems={'center'} borderRadius={'10px'}>
              <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.9625 15.675L8.6625 15.4125C1.8375 9.8625 0 7.9125 0 4.725C0 2.1 2.1375 0 4.725 0C6.9 0 8.1375 1.2375 8.9625 2.175C9.7875 1.2375 11.025 0 13.2 0C15.825 0 17.925 2.1375 17.925 4.725C17.925 7.9125 16.0875 9.8625 9.2625 15.4125L8.9625 15.675Z"
                  fill="#C3C9CD"/>
              </svg>
              <Typography color="#292E30" fontFamily={'Gilroy'} fontSize={'14px'} ml={'10px'}>
                {topic.likes_count}
              </Typography>
            </Grid>
            {topic.published_at && (
              <Typography fontSize={'14px'} fontFamily={'Gilroy'}>
                {insertZero(new Date(topic.published_at).getHours())}:
                {insertZero(new Date(topic.published_at).getMinutes())} {insertZero(new Date(topic.published_at).getDate())}.
                {insertZero(new Date(topic.published_at).getMonth() + 1)}.
                {insertZero(new Date(topic.published_at).getFullYear())}              
              </Typography>
            )}
          </Grid>
          <Grid display="flex" justifyContent={'space-between'} mb={'5px'}>
            <div className={styles.header}>
              {topic.access_level === 0 && (
                <div className={styles.icon}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.5 5.83333C12.942 5.83333 13.366 6.00893 13.6785 6.32149C13.9911 6.63405 14.1667 7.05797 14.1667 7.5M17.5 7.5C17.5002 8.28098 17.3175 9.05115 16.9665 9.74879C16.6155 10.4464 16.1059 11.0521 15.4786 11.5174C14.8514 11.9826 14.1238 12.2945 13.3543 12.4279C12.5848 12.5614 11.7948 12.5127 11.0475 12.2858L9.16667 14.1667H7.5V15.8333H5.83333V17.5H3.33333C3.11232 17.5 2.90036 17.4122 2.74408 17.2559C2.5878 17.0996 2.5 16.8877 2.5 16.6667V14.5117C2.50005 14.2907 2.58788 14.0787 2.74417 13.9225L7.71417 8.9525C7.50621 8.26501 7.4488 7.54079 7.54587 6.82912C7.64293 6.11746 7.89219 5.43506 8.27666 4.82837C8.66113 4.22169 9.1718 3.70495 9.77391 3.31335C10.376 2.92174 11.0554 2.66446 11.7659 2.559C12.4764 2.45355 13.2012 2.5024 13.8911 2.70224C14.581 2.90207 15.2198 3.2482 15.7639 3.71705C16.308 4.18591 16.7447 4.76649 17.0443 5.41928C17.3439 6.07207 17.4993 6.78175 17.5 7.5Z" stroke="#ABB0B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
              <div className={styles.name}>
                {topic.title}
              </div>
            </div>
          </Grid>
          {
            topic.status === TopicStatuses.blocked && (
              <Grid mb={'5px'}>
                <Typography color="#FF0000" fontWeight={500} fontFamily={'Gilroy'} fontSize={'16px'}>
                  Заблокирован модератором
                </Typography>
              </Grid>
            )
          }
          {
            topic.status === TopicStatuses.temporary_blocked && (
              <Grid mb={'5px'}>
                <Typography color="#FF0000" fontWeight={500} fontFamily={'Gilroy'} fontSize={'16px'}>
                  Временно заблокирована модератором
                </Typography>
              </Grid>
            )
          }
          <div className={styles.description}>
            {convertHtmlToText(topic.description)}
          </div>
          <div className={styles.footer}>
            <div className={styles.users}>
              <Grid mr={0.7}>
                <Avatar 
                  height={25} 
                  width={25} 
                  fontSize={13}
                  avatar={topic.user.avatar} 
                  abbreviation={`${topic.user.first_name?.slice(0, 1)}${topic.user.last_name?.slice(0, 1)}`}/>
              </Grid>
              {topic.limited_members.map(item => (
                <div key={item.id} style={{ marginRight: 3 }}>
                  <Avatar 
                    height={20} 
                    fontSize={10}
                    width={20} 
                    avatar={item.user.avatar} 
                    abbreviation={`${item.user.first_name?.slice(0, 1)}${item.user.last_name?.slice(0, 1)}`}/>
                </div>
              ))}
              {topic.count_of_members > 3 &&
                <div className={styles.quantity}>
                  +{topic.count_of_members - 3}
                </div>
              }
            </div>
            <div className={styles.button}>
              {isDraft ? 'Использовать' : 'Перейти к теме'}
            </div>
          </div>
        </div>
        {/* <div className={styles.tools}>
          {<div style={{ marginBottom: 6 }}>
            <Pin/>
          </div>}
          <Messages quantity={5}/>
        </div> */}
      </div>
    </div>
  );
};

export default TopicPreview;
