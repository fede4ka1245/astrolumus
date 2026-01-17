import { FC } from 'react';

// components
import { Box } from '@mui/material';
import Galaxy from '../Galaxy';

// styles
import globalStyles from '../../styles.module.scss';
import styles from './styles.module.scss';

const Cause: FC = () => {
  const sliderList = [
    {
      text: (
        <span>
          Мы исследователи! Находим и совершенствуем <span style={{ color: '#F2D113' }}> новые
          методики прогнозирования. </span>
          Вы получаете самые последние разработки в сфере астрологии.
        </span>
      )
    },
    {
      text: (
        <span>
          <span style={{ color: '#F2D113' }}> Множество сбывшихся публичных прогнозов </span>
          доказательство эффективности наших техник
        </span>
      )
    },
    {
      text: (
        <span>
          Выпускники нашей школы могут завести
          <span style={{ color: '#F2D113' }}> публичную страницу на нашем сайте </span>
          и получить поддержку в продвижении.
        </span>
      )
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={globalStyles.title} style={{ marginBottom: 25 }}>
          Почему <span className={globalStyles.cyan_text}>наши ученики — Элита</span> астрологии?
        </div>
        <div className={styles.description}>
          Доказательство эффективности наших техник - множество
          сбывшихся публичных прогнозов, размещенных на нашем <span className={globalStyles.cyan_text}> YouTube канале </span>
          и в <span className={globalStyles.cyan_text}>Instagram</span>.
        </div>
      </div>
      <div className={styles.list_container}>
        <div className={styles.list}>
          {sliderList.map((item, index) => (
            <div className={styles.item_container} key={index}>
              <div className={styles.item_number}>
                0{index + 1}
              </div>
              <div className={styles.item_text}>
                {item.text}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.gradient}/>
      </div>
    </div>
  );
};
export default Cause;
