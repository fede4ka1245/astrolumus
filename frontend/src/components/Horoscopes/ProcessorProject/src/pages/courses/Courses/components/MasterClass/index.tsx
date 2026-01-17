import { FC } from 'react';
import classnames from 'classnames';
import { useNavigate } from 'react-router-dom';

// modules
import { routes } from '../../../routes';

// components
import Slider from '../../../../../components/courseAd/components/Slider';

// styles
import globalStyles from '../../styles.module.scss';
import styles from './styles.module.scss';

export const MasterСlassItem:FC = () => {
  const navigate = useNavigate();

  const navigateTo = () => {
    navigate(routes.MasterClass);
  };

  return (
    <div className={styles.additional}>
      <div className={styles.additional_card} onClick={navigateTo}>
        <div className={styles.additional_content}>
          <div className={styles.additional_footer}>
            <div className={styles.additional_title}>
              Галактики в гороскопе
            </div>
            <div className={styles.additional_date}>
              Дата 11.05.2023 в 19:00 МСК
            </div>
          </div>
        </div>
      </div>
      <Slider
        valueLabelDisplay="on"
        value={80}
        valueLabelFormat={() => '3 дня'}
      />
      <div className={styles.additional_info}>
        <div className={styles.additional_description}>
          <div className={styles.additional_prices}>
            <div className={styles.additional_full_price}>
              19₽
            </div>
            <div className={styles.additional_discount_price}>
              20₽
            </div>
          </div>
          <div className={styles.additional_second_date}>
            до 01.05.2023
          </div>
        </div>
        <div className={styles.additional_btn} onClick={navigateTo}>
          Подробнее
        </div>
      </div>
    </div>
  );
};

const MasterСlass:FC = () => {
  return (
    <div className={styles.steps}>
      <div className={classnames(globalStyles.title, styles.steps_title)}>
        Мастер-классы
      </div>
      <MasterСlassItem/>
    </div>
  );
};

export default MasterСlass;
