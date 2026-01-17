import { FC } from 'react';

// components
import { Box } from '@mui/material';

// styles
import globalStyles from '../../styles.module.scss';
import styles from './styles.module.scss';

const Galaxy: FC = () => {
  return (
    <div className={styles.container}>
      <div style={{ position: 'relative' }}>
        <div className={globalStyles.yellow_text} style={{ textAlign: 'center', marginBottom: 10 }}>
          Старт обучения
        </div>
        <div className={styles.title}>
          23 мая 2023 года
        </div>
        <Box sx={{ mb: 3 }}>
          <button className={globalStyles.button}>
            стать участником курса
          </button>
        </Box>
        <div className={globalStyles.link} style={{ textAlign: 'center' }}>
          получить консультацию
        </div>
      </div>
    </div>
  );
};

export default Galaxy;
