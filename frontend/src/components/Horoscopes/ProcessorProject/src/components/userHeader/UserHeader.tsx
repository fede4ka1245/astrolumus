import { FC, useCallback, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Levels from '../../pages/levels/Levels';
import { useAppSelector } from '../../store/store';
import { routes } from '../../models/enums/routes';
import Modal from '../modal/Modal';
import Avatar from '../Avatar';
import { IUserOpenInfo } from '../../models/interfaces/user';
import { useGetAppAccess } from '../../store/selectors';
import { eventBus, EventBusEvents } from '../../helpers/eventBus';

interface IProps {
  selectedUser?: IUserOpenInfo;
}

const UserHeader: FC<IProps> = ({ selectedUser }) => {
  const navigate = useNavigate();
  const [isLevelsModalActive, setIsLevelsModalActive] = useState(false);
  const userInfo = useAppSelector(state => state.user.userInfo);
  const user = selectedUser || userInfo;
  const appAccess = useGetAppAccess();

  const onProfileClick = useCallback(() => {
    if (appAccess.isForumRestricted) {
      eventBus.emit(EventBusEvents.triggerForumRestrictionBanner);
      return;
    }
    
    if (!selectedUser) {
      navigate(routes.user + user.id);
    }
  }, [appAccess.isForumRestricted, navigate, selectedUser, user.id]);

  if (!user) {
    return null;
  }

  return (
    <>
      <Grid container pl={2} pr={2} mt={1} paddingTop={'var(--status-bar-offset)'} display={'flex'} alignItems={'center'} onClick={onProfileClick}>
        <Grid item zIndex={3}>
          <Avatar
            width={97}
            height={97}
            fontSize={40}
            avatar={user.avatar}
            abbreviation={`${user.first_name?.slice(0, 1)}${user.last_name?.slice(0, 1)}`}
          />
        </Grid>
        <Grid item container direction={'column'} flex={1} pl={2}>
          <Grid item>
            <Typography fontFamily={'Playfair Display'} fontWeight={700} fontSize={'18px'} color={'#292E30'}>
              {user.first_name} {user.last_name}
            </Typography>
          </Grid>
          {/* <Grid item display={'flex'} alignItems={'center'}>
            <Typography fontFamily={'Playfair Display'} fontWeight={700} fontSize={'18px'} color={'#967440'}>
              II
            </Typography>
            <Typography pl={'6px'} fontFamily={'Gilroy'} fontWeight={400} fontSize={'14px'} color={'#967440'}>
              уровень
            </Typography>
          </Grid> */}
        </Grid>
        {/* <Grid item flex={1} container width={'150px'} onClick={() => setIsLevelsModalActive(true)} justifyContent={'space-between'} alignItems={'center'}>
          <Grid item>
            <img src={firstLevel} width={35} height={35}/>
          </Grid>
          <Grid item>
            <img src={secondLevel} width={35} height={35}/>
          </Grid>
          <Grid item>
            <img src={thirdLevel} width={35} height={35}/>
          </Grid>
        </Grid> */}
        <Modal isOpen={isLevelsModalActive} height={'var(--modal-page-height)'} close={() => setIsLevelsModalActive(false)}>
          <Grid position={'relative'} pt={2} pb={2}>
            <Levels />
          </Grid>
        </Modal>
      </Grid>
      <Grid container pl={2} pr={2} pt={3} position={'relative'} alignItems={'center'} width={'100%'} direction={'row'}>
        <div style={{ left: 0, pointerEvents: 'none', top: 0, zIndex: 2, width: 'calc(100% + 10px)', height: '80px', position: 'absolute', overflow: 'hidden', borderRadius: '40px 0 0 0', marginLeft: '-10px', marginTop: '-5px' }}>
          <div style={{ position: 'absolute', width: '100%', height: '100px', background: 'linear-gradient(268.23deg, #37366B 2.7%, #5C5B9F 44.59%, #59ABDA 99.71%), #C4C4C4', filter: 'blur(20px)', transform: 'rotate(-180deg)', top: '-90px' }}/>
        </div>
      </Grid>
    </>
  );
};

export default UserHeader;
