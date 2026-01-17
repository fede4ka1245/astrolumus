import { FC } from 'react';
import { Checkbox, Grid, Typography } from '@mui/material';
import Avatar from '../Avatar';
import { ITopicUser } from '../../models/interfaces/topic';
import styles from './UserCheckBox.module.scss';

interface IProps {
  user: ITopicUser;
  selectedUsers?: ITopicUser[];
  onChecked?: (value: boolean) => void;  
  isAdded?: boolean;
  withCheck?: boolean;
}

const UserLink: FC<IProps> = ({ user, onChecked = () => {}, selectedUsers, isAdded, withCheck }) => {
  const findedUser = withCheck ? selectedUsers?.find(item => item.id === user.id) : null;
  return (
    <div className={styles.main} style={isAdded ? { backgroundColor: '#FFF', filter: 'none', boxShadow: '-5px -5px 20px #FFFFFF, 5px 5px 20px rgba(174, 174, 192, 0.5)' } : {}}>
      <Grid container display={'flex'} alignItems={'center'} p={1}>
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
          <Typography color={'#292E30'} fontWeight={500} fontSize={'16px'}>
            {user.first_name} {user.last_name}
          </Typography>
          {
            user.birth_date && (
              <Typography color={'#292E30'} fontWeight={400} fontSize={'12px'}>
                {user.birth_date.toString().split('-').reverse().join('.')}
              </Typography>
            )
          }
        </Grid>
        {withCheck && <Grid item>
          <Checkbox 
            checked={!!findedUser} 
            onChange={(e) => onChecked(e.target.checked)}
            sx={{
              '& .MuiSvgIcon-root': {
                fontSize: '25px',
                fill: '#37366B'
              },
              '& .MuiTouchRipple-root': {
                color: '#979C9E'
              }
            }}/>
        </Grid>}
      </Grid>
    </div>
  );
};

export default UserLink;
