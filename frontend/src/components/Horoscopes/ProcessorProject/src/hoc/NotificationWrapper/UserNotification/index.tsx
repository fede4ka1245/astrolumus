
import { FC } from 'react';
import { Checkbox, Grid, Skeleton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Avatar from '../../../components/Avatar';

import { IUser } from '../../../models/interfaces/notification';

import styles from './styles.module.scss';
import { routes } from '../../../models/enums/routes';

interface IProps {
  user: IUser
}

const UserNotification: FC<IProps> = ({ user }) => {
  const navigation = useNavigate();

  const navigateToUser = () => {
    navigation(routes.user + user.id);
  };

  return (
    <div className={styles.main} onClick={navigateToUser}>
      <Grid container display={'flex'} alignItems={'center'}>
        <Grid item pr={2}>
          <Avatar
            width={45}
            height={45}
            fontSize={20}
            avatar={user.avatar}
            abbreviation={`${user.first_name?.slice(0, 1)}${user.last_name?.slice(0, 1)}`}
          />
        </Grid>
        <Grid item flex={1}>
          <Typography color={'#292E30'} fontWeight={500} fontSize={'16px'} fontFamily={'Gilroy'}>
            {user.first_name} {user.last_name}
          </Typography>
          {
            user.birth_date && (
              <Typography color={'#292E30'} fontWeight={400} fontSize={'12px'} fontFamily={'Gilroy'}>
                {user.birth_date.toString().split('-').reverse().join('.')}
              </Typography>
            )
          }
        </Grid>
      </Grid>
    </div>
  );
};

export default UserNotification;
