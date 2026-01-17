import React, { FC, useCallback } from 'react';
import { Grid, Skeleton } from '@mui/material';
import { ITopicUser } from '../../models/interfaces/topic';
import Avatar from '../Avatar';
import { useAppDispatch } from '../../store/store';
import { routes } from '../../models/enums/routes';
import { useNavigate } from 'react-router-dom';

interface IProps {
  user: ITopicUser
}

const UserPreview: FC<IProps> = ({ user }) => {
  const navigate = useNavigate();
  
  const selectUser = useCallback(() => {
    navigate(routes.user + user.id);
  }, []);

  return (
    <Grid container direction={'column'} justifyContent={'center'} onClick={selectUser}>
      <Grid item display={'flex'} justifyContent={'center'} pb={1}>
        <Avatar
          fontSize={'20px'}
          width={'60px'}
          height={'60px'}
          avatar={user.avatar}
          abbreviation={`${user.first_name?.slice(0, 1)}${user.last_name?.slice(0, 1)}`}
        />
      </Grid>
      <Grid item color={'#292E30'} textAlign={'center'} fontSize={'12px'} fontWeight={400} fontFamily={'Gilroy'}>
        {user.first_name} {user.last_name}
      </Grid>
    </Grid>
  );
};

export default UserPreview;
