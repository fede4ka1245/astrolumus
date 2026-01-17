import { FC } from 'react';
import ReactPlayer from 'react-player';
import { Box } from '@mui/material';

// styles
import globalStyles from '../../styles.module.scss';
import styles from './styles.module.scss';

interface IProps {
  background_img?: string
};

const VideoCourse: FC<IProps> = (props) => {
  return (
    <div className={styles.container}>
      <Box sx={{ px: 3.5 }}>
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <div className={globalStyles.title} style={{ width: 250, position: 'relative' }}>
              Посмотрите видео о курсе
              <div className={styles.arrow}>
                <svg width="72" height="80" viewBox="0 0 72 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M64.2848 79.1404C64.0145 79.2988 63.6669 79.2079 63.5086 78.9375L60.9287 74.5315C60.7704 74.2611 60.8613 73.9136 61.1316 73.7553C61.402 73.597 61.7495 73.6878 61.9079 73.9582L64.2011 77.8747L68.1176 75.5814C68.3879 75.4231 68.7355 75.514 68.8938 75.7843C69.0521 76.0547 68.9612 76.4022 68.6909 76.5606L64.2848 79.1404ZM0.852765 5.60277C20.8915 0.217518 35.6509 -0.712768 46.3343 1.66752C57.0518 4.05542 63.6539 9.77438 67.3258 17.5974C70.9811 25.385 71.7088 35.2048 70.8224 45.7842C69.9352 56.3722 67.4251 67.7844 64.547 78.7944L63.4493 78.5074C66.3222 67.5173 68.8127 56.1795 69.6917 45.6894C70.5714 35.1907 69.8307 25.6043 66.2987 18.0795C62.7834 10.5901 56.4793 5.0903 46.0875 2.77499C35.6616 0.45207 21.1085 1.3341 1.14723 6.6985L0.852765 5.60277Z" fill="#00EABD"/>
                </svg>
              </div>
            </div>
          </div>
          <div className={styles.video}>
            <ReactPlayer
              className={styles.video_player}
              url='https://www.youtube.com/watch?v=1REE8dDqe2c'
              width='100%'
              height='100%'
            />
          </div>
        </div>
      </Box>
      {props.background_img && (
        <img src={props.background_img} className={styles.background_img}/>
      )}
    </div>
  );
};

export default VideoCourse;
