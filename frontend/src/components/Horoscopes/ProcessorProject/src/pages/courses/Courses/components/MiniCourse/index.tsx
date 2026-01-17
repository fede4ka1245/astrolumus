import { FC } from 'react';
import classnames from 'classnames';
import { useNavigate } from 'react-router-dom';

// modules
import { routes } from '../../../routes';

import Slider from '../../../../../components/courseAd/components/Slider';

import globalStyles from '../../styles.module.scss';
import styles from './styles.module.scss';

const MiniCourse: FC = () => {
  const navigate = useNavigate();

  const navigateToMiniCourse = () => {
    navigate(routes.MiniCourse);
  };

  return (
    <div className={styles.container} onClick={navigateToMiniCourse}>
      <div className={styles.wrapper}>
        <div style={{ flex: 1 }}>
          <div className={classnames(globalStyles.title, styles.title)}>
            мини курс
          </div>
          <div className={styles.lesson}>
            6 уроков
          </div>
          <div className={styles.subtitle}>
            Мини курс “Поехали!”
          </div>
          <div className={styles.date}>
            Онлайн
            практикум
            23.05.22
          </div>
        </div>
        <Slider
          valueLabelDisplay="on"
          value={80}
          valueLabelFormat={() => '3 дня'}
        />
        <div className={styles.footer}>
          <div className={styles.price}>
            2590₽
          </div>
          <div className={styles.footer_right}>
            <div className={styles.more}>
              Подробнее
            </div>
            <button className={styles.button} onClick={navigateToMiniCourse}>
              <svg width="7" height="14" viewBox="0 0 7 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 12.5L5.74095 7.31662C5.89164 7.13244 5.89164 6.86756 5.74095 6.68338L1.5 1.5" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniCourse;
