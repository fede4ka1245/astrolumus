import { useState, useEffect, useCallback } from 'react';
import { Grid, Typography } from '@mui/material';
import authRequest from '../../api/authRequest';
import { forumTopicApi } from '../../api/forum';
import styles from './styles.module.scss';
import { useAppSelector } from '../../store/store';
import DraftsModal from '../modals/DraftsModal';
import CategorySkeleton from '../skeletons/CategorySkeleton';

const DraftBar = () => {
  const { userInfo } = useAppSelector(state => state.user);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    getDrafts();
  }, []);

  const getDrafts = useCallback(() => {
    setLoading(true);
    authRequest.get(forumTopicApi(), {
      params: { 
        not_published: true,
        user: userInfo.id 
      }
    })
      .then(res => {
        setCount(res.data.count);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userInfo.id]);

  if (loading) {
    return <CategorySkeleton />;
  }

  return (
    <Grid width={'100%'}>
      <Grid 
        onClick={() => setIsOpen(true)}
        item className={styles.drafts} px="18px" py="13px" borderRadius="10px" width={'100%'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
        <Typography fontSize="16px" fontWeight={700} color="#FFF">
          Черновики ({count})
        </Typography>
        <Grid style={{
          rotate: isOpen ? '180deg' : '0deg'
        }}>
          <svg width="16" height="10" viewBox="0 0 13 7" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L6.18338 5.24095C6.36756 5.39164 6.63244 5.39164 6.81662 5.24095L12 1" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </Grid>
      </Grid>
      <DraftsModal isOpen={isOpen} close={() => setIsOpen(false)}/>
    </Grid>
  );
};

export default DraftBar;
