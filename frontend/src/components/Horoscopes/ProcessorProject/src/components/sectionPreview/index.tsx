// components
import Messages from '../../pages/chats/ChatList/components/buttons/Messages';
import Pin from '../../pages/chats/ChatList/components/buttons/Pin';

// styles
import styles from './styles.module.scss';
import classNames from 'classnames';

// assets
import background from './assets/background.png';
import { Grid, Typography } from '@mui/material';

type SectionVariant = 'prophecy' | 'topic' | 'group'

interface SectionPreviewProps {
  isGray?: boolean,
  variant?: SectionVariant,
  isPinned?: boolean,
  header?: string,
  body?: string,
}

const SectionPreview = ({ isGray, variant, isPinned, header, body }: SectionPreviewProps) => {
  return (
    <div className={classNames(styles.container, { [styles.gray]: isGray })}>
      <div style={{ width: '100%' }}>
        <div className={styles.header}>
          <div className={styles.icon}>
            {variant === 'group'
              ? (<svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.1666 14.6667H18.3333V13C18.3333 12.4805 18.1713 11.9739 17.8701 11.5506C17.5688 11.1273 17.1431 10.8084 16.6523 10.6382C16.1614 10.468 15.6296 10.4549 15.131 10.6009C14.6324 10.7468 14.1916 11.0445 13.87 11.4525M14.1666 14.6667H5.83329M14.1666 14.6667V13C14.1666 12.4534 14.0616 11.9309 13.87 11.4525M13.87 11.4525C13.5605 10.6792 13.0264 10.0163 12.3366 9.54931C11.6468 9.08236 10.8329 8.83279 9.99996 8.83279C9.16697 8.83279 8.35309 9.08236 7.6633 9.54931C6.9735 10.0163 6.43942 10.6792 6.12996 11.4525M5.83329 14.6667H1.66663V13C1.66666 12.4805 1.82857 11.9739 2.12984 11.5506C2.43112 11.1273 2.85678 10.8084 3.34767 10.6382C3.83856 10.468 4.37027 10.4549 4.86891 10.6009C5.36754 10.7468 5.80832 11.0445 6.12996 11.4525M5.83329 14.6667V13C5.83329 12.4534 5.93829 11.9309 6.12996 11.4525M12.5 3.83337C12.5 4.49642 12.2366 5.1323 11.7677 5.60114C11.2989 6.06998 10.663 6.33337 9.99996 6.33337C9.33692 6.33337 8.70103 6.06998 8.23219 5.60114C7.76335 5.1323 7.49996 4.49642 7.49996 3.83337C7.49996 3.17033 7.76335 2.53445 8.23219 2.06561C8.70103 1.59677 9.33692 1.33337 9.99996 1.33337C10.663 1.33337 11.2989 1.59677 11.7677 2.06561C12.2366 2.53445 12.5 3.17033 12.5 3.83337ZM17.5 6.33337C17.5 6.7754 17.3244 7.19932 17.0118 7.51188C16.6992 7.82445 16.2753 8.00004 15.8333 8.00004C15.3913 8.00004 14.9673 7.82445 14.6548 7.51188C14.3422 7.19932 14.1666 6.7754 14.1666 6.33337C14.1666 5.89135 14.3422 5.46742 14.6548 5.15486C14.9673 4.8423 15.3913 4.66671 15.8333 4.66671C16.2753 4.66671 16.6992 4.8423 17.0118 5.15486C17.3244 5.46742 17.5 5.89135 17.5 6.33337ZM5.83329 6.33337C5.83329 6.7754 5.6577 7.19932 5.34514 7.51188C5.03258 7.82445 4.60865 8.00004 4.16663 8.00004C3.7246 8.00004 3.30068 7.82445 2.98811 7.51188C2.67555 7.19932 2.49996 6.7754 2.49996 6.33337C2.49996 5.89135 2.67555 5.46742 2.98811 5.15486C3.30068 4.8423 3.7246 4.66671 4.16663 4.66671C4.60865 4.66671 5.03258 4.8423 5.34514 5.15486C5.6577 5.46742 5.83329 5.89135 5.83329 6.33337Z" stroke="#ABB0B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>)
              : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.5 5.83333C12.942 5.83333 13.366 6.00893 13.6785 6.32149C13.9911 6.63405 14.1667 7.05797 14.1667 7.5M17.5 7.5C17.5002 8.28098 17.3175 9.05115 16.9665 9.74879C16.6155 10.4464 16.1059 11.0521 15.4786 11.5174C14.8514 11.9826 14.1238 12.2945 13.3543 12.4279C12.5848 12.5614 11.7948 12.5127 11.0475 12.2858L9.16667 14.1667H7.5V15.8333H5.83333V17.5H3.33333C3.11232 17.5 2.90036 17.4122 2.74408 17.2559C2.5878 17.0996 2.5 16.8877 2.5 16.6667V14.5117C2.50005 14.2907 2.58788 14.0787 2.74417 13.9225L7.71417 8.9525C7.50621 8.26501 7.4488 7.54079 7.54587 6.82912C7.64293 6.11746 7.89219 5.43506 8.27666 4.82837C8.66113 4.22169 9.1718 3.70495 9.77391 3.31335C10.376 2.92174 11.0554 2.66446 11.7659 2.559C12.4764 2.45355 13.2012 2.5024 13.8911 2.70224C14.581 2.90207 15.2198 3.2482 15.7639 3.71705C16.308 4.18591 16.7447 4.76649 17.0443 5.41928C17.3439 6.07207 17.4993 6.78175 17.5 7.5Z" stroke="#ABB0B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
          </div>
          <div className={styles.name}>
            { header }
          </div>
        </div>
        <div className={styles.description}>
          { body }
        </div>
        {variant !== 'prophecy' && <div className={styles.footer}>
          <div className={styles.users}>
            <img src="./__mocks__/images/person_1.jpg" alt="user" className={styles.admin_avatar}/>
            <img src="./__mocks__/images/person_2.jpg" alt="user" className={styles.user_avatar}/>
            <img src="./__mocks__/images/person_3.jpeg" alt="user" className={styles.user_avatar}/>
            <div className={styles.quantity}>
              +10
            </div>
          </div>
          <div className={styles.button}>
            {variant === 'group' ? 'Перейти в группу' : 'Перейти к теме'}
          </div>
        </div>}
        {variant === 'prophecy' && <div className={styles.prophecies}>
          <img src={background} className={styles.background}/>
          <Grid container alignItems={'center'} width={'100%'} height={'100%'} p={1} justifyContent={'space-between'}>
            <Grid color={'white'} fontFamily={'Gilroy'} fontSize={'12px'} zIndex={2} item>
              23  прогноза
            </Grid>
            <Grid zIndex={2} item display={'flex'} alignItems={'center'}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="12" height="12" rx="6" stroke="#49BC5B" strokeWidth="2"/>
                <path d="M4.66602 7L6.06246 8.39645C6.25772 8.59171 6.57431 8.59171 6.76957 8.39645L9.91602 5.25" stroke="#49BC5B" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <Typography color={'white'} fontFamily={'Gilroy'} fontSize={'12px'} ml={'7px'}>
                30.11.2022
              </Typography>
            </Grid>
          </Grid>
        </div>}
      </div>
      <div className={styles.tools}>
        {isPinned && <div style={{ marginBottom: 6 }}>
          <Pin/>
        </div>}
        <Messages quantity={5}/>
      </div>
    </div>
  );
};

export default SectionPreview;
