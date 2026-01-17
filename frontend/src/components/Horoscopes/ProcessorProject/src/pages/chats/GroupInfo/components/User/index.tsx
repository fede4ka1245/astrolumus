import { FC } from 'react';
import { Grid, Checkbox } from '@mui/material';

// images
import avatar from '../../../__mocks__/images/person_1.jpg';
import planetary from '../images/Planetary.svg';

import styles from './styles.module.scss';

const User: FC = () => {
  return (
    <div className={styles.container}>
      <Grid display="flex" alignItems="center">
        <img src={avatar} className={styles.avatar}/>
        <div className={styles.info}>
          <div className={styles.name}>
            Анастасия Квашонкина
          </div>
          <div className={styles.date}>19.01.1980</div>
        </div>
      </Grid>
      <Grid display="flex" alignItems="center">
        <img src={planetary} className={styles.status}/>
        <Checkbox
          sx={{
            '&.Mui-checked': {
              color: '#37366B'
            }
          }}
        />
      </Grid>
    </div>
  );
};

export default User;
