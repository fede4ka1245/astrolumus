import React from 'react';
import styles from './Notification.module.scss';
import { Grid, Skeleton } from '@mui/material';
import classNames from 'classnames';
import more from './assests/more.svg';
import error from './assests/error.svg';
import time from './assests/time.svg';
import accept from './assests/accept.svg';
import SwipeWrapper from '../../../../components/swipeWrapper/SwipeWrapper';
import MessageEditor from '../../../../components/messageEditor/MessageEditor';

type NotificationVariant = 'DARK' | 'WHITE' | 'GRADIENT';
type NotificationType = 'ERROR' | 'TIME' | 'ACCEPT';

interface NotificationProps {
  text?: string,
  notificationVariant?: NotificationVariant,
  notificationType?: NotificationType,
  isMoreButtonShowed?: boolean,
  image?: string,
  isImageCircled?: boolean
}

const Notification = ({ text, notificationVariant, notificationType, isMoreButtonShowed, isImageCircled }: NotificationProps) => {
  return (
    <SwipeWrapper backgroundComponent={<MessageEditor />}>
      <div className={classNames(
        styles.main,
        {
          [styles.dark]: notificationVariant === 'DARK',
          [styles.white]: notificationVariant === 'WHITE' || !notificationVariant,
          [styles.gradient]: notificationVariant === 'GRADIENT'
        }
      )}>
        <Grid p={1} container display={'flex'} flexDirection={'row'} alignItems={'center'} height={'100%'}>
          <Grid item display={'flex'} justifyContent={'center'} alignItems={'center'} pr={2}>
            {!notificationType
              ? (
                <>
                  {!notificationType && !isImageCircled && <Skeleton sx={{
                    background: 'gray',
                    borderRadius: '8px'
                  }} variant={'rectangular'} width={'42px'} height={'42px'}/>}
                  {!notificationType && isImageCircled && <Skeleton sx={{
                    background: 'gray',
                    borderRadius: '50%'
                  }} variant={'rectangular'} width={'42px'} height={'42px'}/>}
                </>
              )
              : (
                <>
                  {notificationType === 'ERROR' && <img src={error}/>}
                  {notificationType === 'ACCEPT' && <img src={accept}/>}
                  {notificationType === 'TIME' && <img src={time}/>}
                </>
              )}
          </Grid>
          <Grid item flex={1} className={styles.text}>
            {text || 'Рекламное уведомление от школы'}
          </Grid>
          <Grid item display={'flex'} justifyContent={'center'} alignItems={'center'}>
            {isMoreButtonShowed && <img src={more} className={styles.more}/>}
          </Grid>
        </Grid>
      </div>
    </SwipeWrapper>
  );
};

export default Notification;
