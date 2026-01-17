import { FC } from 'react';
import classnames from 'classnames';
import { useNavigate } from 'react-router-dom';

// modules
import { routes } from '../../../routes';

// components
import Slider from '../../../../../components/courseAd/components/Slider';

import styles from './styles.module.scss';
import globalStyles from '../../styles.module.scss';

export const CoursesStep:FC = () => {
  const navigate = useNavigate();

  const navigateToCoursesStep = () => {
    navigate(routes.CourseSteps);
  };

  return (
    <div className={styles.step}>
      <div className={styles.step_card} onClick={navigateToCoursesStep}>
        <div className={styles.step_content}>
          <div className={styles.step_header}>
            I ступень
          </div>
          <div className={styles.step_footer}>
            <div className={styles.step_title}>
              Моя профессия астролог
            </div>
            <div className={styles.step_date}>
              Дата старта 11.05.2023
            </div>
          </div>
        </div>
      </div>
      <Slider
        valueLabelDisplay="on"
        value={80}
        valueLabelFormat={() => '3 дня'}
      />
      <div className={styles.step_info}>
        <div className={styles.step_description}>
          <div className={styles.step_prices}>
            <div className={styles.step_full_price}>
              19₽
            </div>
            <div className={styles.step_discount_price}>
              20₽
            </div>
          </div>
          <div className={styles.step_second_date}>
            до 11.05.2023
          </div>
        </div>
        <div className={styles.step_btn} onClick={navigateToCoursesStep}>
          Подробнее
        </div>
      </div>
    </div>
  );
};

const CoursesSteps:FC = () => {
  return (
    <div className={styles.steps}>
      <div className={classnames(globalStyles.title, styles.steps_title)}>
        Ступени мастерства
      </div>
      <CoursesStep/>
    </div>
  );
};

export default CoursesSteps;
