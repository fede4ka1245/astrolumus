import { FC, useCallback, useState } from 'react';
import { Grid, Button as MuiButton, Typography } from '@mui/material';
import styles from '../../../styles.module.scss';
import ModalPeople from '../../../components/modalPeople/ModalPeople';

const Friends: FC = () => {
  const [friends, setFriends] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [isFriendsModalOpen, setIsFriendsModalOpen] = useState(false);
  const [isSubscribersModalOpen, setIsSubscribersModalOpen] = useState(false);

  const toggleFriendsModal = useCallback(() => {
    setIsFriendsModalOpen(!isFriendsModalOpen);
  }, [isFriendsModalOpen]);

  const toggleSubscribersModal = useCallback(() => {
    setIsSubscribersModalOpen(!isSubscribersModalOpen);
  }, [isSubscribersModalOpen]);

  return (
    <Grid>
      <Grid item pl={2} pr={2} pt={3} display={'flex'} justifyContent={'space-between'}>
        <Grid display={'flex'} alignItems={'center'}>
          <Grid mr={'13px'}>
            <div className={styles.title}>
              Друзья
            </div>
          </Grid>
          <div className={styles.quantity}>
            124
          </div>
        </Grid>
        <MuiButton onClick={toggleFriendsModal} endIcon={<>
          <svg width="6" height="12" viewBox="0 0 4 9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.666016 8L2.81445 4.77735C2.92642 4.6094 2.92642 4.3906 2.81445 4.22265L0.666015 1" stroke="#ABB0B2" strokeLinecap="round"/>
          </svg>
        </>}>
          <Typography textTransform={'none'} color={'#ABB0B2'} fontWeight={400} fontSize={'14px'} fontFamily={'Gilroy'} mr={'13px'}>
            Все Друзья
          </Typography>
        </MuiButton>
      </Grid>
      <Grid item container direction={'row'} wrap={'nowrap'} maxWidth={'100%'} pl={2} pr={2} pt={3} overflow={'scroll'}>
        <ModalPeople isOpen={isFriendsModalOpen} close={toggleFriendsModal} />
      </Grid>
      <Grid item pl={2} pr={2} pt={3} display={'flex'} justifyContent={'space-between'}>
        <Grid display={'flex'} alignItems={'center'}>
          <Grid mr={'13px'}>
            <div className={styles.title}>
            Подписчики
            </div>
          </Grid>
          <div className={styles.quantity}>
            124
          </div>
        </Grid>
        <MuiButton onClick={toggleSubscribersModal} endIcon={<>
          <svg width="6" height="12" viewBox="0 0 4 9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.666016 8L2.81445 4.77735C2.92642 4.6094 2.92642 4.3906 2.81445 4.22265L0.666015 1" stroke="#ABB0B2" strokeLinecap="round"/>
          </svg>
        </>}>
          <Typography textTransform={'none'} color={'#ABB0B2'} fontWeight={400} fontSize={'14px'} fontFamily={'Gilroy'}>
            Все Подписчики
          </Typography>
        </MuiButton>
      </Grid>
      <Grid item container direction={'row'} wrap={'nowrap'} maxWidth={'100%'} pl={2} pr={2} pt={3} overflow={'scroll'}>
        <ModalPeople isOpen={isSubscribersModalOpen} close={toggleSubscribersModal} />
      </Grid>
    </Grid>
  );
};

export default Friends;
