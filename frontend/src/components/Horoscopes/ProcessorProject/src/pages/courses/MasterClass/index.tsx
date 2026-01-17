import { FC } from 'react';

// components
import Header from '../components/Header';
import { Box } from '@mui/material';
import Slider from '../../../components/courseAd/components/Slider';
import MainTeacher from '../components/MainTeacher';
import { 
  CourseList,
  CourseSlider,
  Cause,
  VideoCourse,
  Details
} from '../components';
import { CourseCard } from '../components/paymentCards';

// images
import masterClass from '../images/master_class.png';

import {
  masterClassList,
  sliderList,
  mainTeacher,
  freePayment
} from '../courses_mock';

// styles
import globalStyles from '../styles.module.scss';
import styles from './styles.module.scss';

const MasterClass: FC = () => {
  const marks = [{ value: 0 }, { value: 33 }, { value: 66 }, { value: 100 }];

  return (
    <div className={globalStyles.container}>
      <div className={styles.background_img}>
        <Box sx={{ px: 3.5, flex: 1 }}>
          <Header/>
          <Box sx={{ mb: 1 }}>
            <div className={globalStyles.yellow_text}>
              Мастер-класс от школы Альфа
            </div>
          </Box>
          <Box sx={{ mb: 1 }}>
            <div className={globalStyles.title}>
              Прогнозирование 
              в деторождении
            </div>
          </Box>
          <Box sx={{ mb: 3 }}>
            <div className={globalStyles.subtitle}>
              Участие БЕСПЛАТНО
            </div>
          </Box>
          <img src={masterClass} alt="mater-class" className={styles.image}/>
        </Box>
        <div className={styles.shadow_wrapper}>
          <Box sx={{ px: 3.5 }}>
            <Box sx={{ mb: 1.5 }}>
              <div className={globalStyles.description}>
              Гражданский брак в женском гороскопе. Оригинальное 
              исследование на тему задержки вступления в брак в гороскопах женщин.
              </div>
            </Box>
            <Slider
              marks={marks}
              valueLabelDisplay="on"
              value={66}
              valueLabelFormat={() => '3 дня'}
            />
          </Box>
        </div>
        <Box sx={{ px: 3.5, mb: 2.5 }}>
          <div className={globalStyles.yellow_text}>
            21 ноября в 19.00 МСК
          </div>
        </Box>
      </div>
      <Box sx={{ px: 3.5 }}>
        <Box sx={{ mb: 3 }}>
          <button className={globalStyles.button}>
            купить мастер-класс
          </button>
        </Box>
        <div className={globalStyles.link} style={{ textAlign: 'center' }}>
          задать вопрос
        </div>
      </Box>
      <Box sx={{ mb: 4.5 }}>
        <CourseList list={masterClassList}/>
      </Box>
      <Box sx={{ mb: 4.5 }}>
        <VideoCourse/>
      </Box>
      <Box sx={{ mb: 6.5 }}>
        <CourseSlider list={sliderList}/>
      </Box>
      <Box sx={{ mb: 6.5 }}>
        <div className={styles.question}>
          <div className={globalStyles.title} style={{ marginBottom: 20 }}>
            Основной вопрос
          </div>
          <div className={styles.description}>
            Для многих не секрет, что вопрос 
            <span style={{ color: '#F2D113' }}> «Когда я выйду замуж» </span> является 
            одним из самых популярных вопросов, задаваемых клиентами-женщинами 
            во время астрологической консультации. Между тем, отбросив всякую иронию, популярность 
            этого вопроса обусловлена устройством общества и института брака в современном мире.
          </div>
        </div> 
      </Box>
      <Box sx={{ mb: 4.5 }}>
        <div className={styles.master_class_list}>
          <div className={globalStyles.title} style={{ marginBottom: 30 }}>
            На мастер-классе <br/>
            <span style={{ color: '#F2D113' }}> вы изучите:</span>
          </div>
          <div className={globalStyles.list_item}>
            формулы, показывающие позднее замужество
          </div>
          <div className={globalStyles.list_item}>
            формулы на отсутствие брака и серьезные задержки
          </div>
          <div className={globalStyles.list_item}>
            ормулы на отсутствие брака и серьезные задержки
          </div>
        </div>
      </Box>
      <Box>
        <div className={styles.master_class_list}>
          <div className={globalStyles.title} style={{ marginBottom: 30 }}>
            На мастер-классе <br/>
            <span style={{ color: '#F2D113' }}> вы изучите:</span>
          </div>
          <div className={globalStyles.list_item}>
            формулы, показывающие позднее замужество
          </div>
          <div className={globalStyles.list_item}>
            формулы на отсутствие брака и серьезные задержки
          </div>
          <div className={globalStyles.list_item}>
            ормулы на отсутствие брака и серьезные задержки
          </div>
        </div>
      </Box>
      <div className={styles.master_class_container}>
        <div className={styles.master_class_title}>Старт МК</div>
        <div className={styles.master_class_date}>22 ноября</div>
        <div className={styles.master_class_descr}>
          Изучите новую дисциплину по астрологии и углубите личную практику
        </div>
        <div className={styles.master_class_price}>
          3 000 RUB
        </div>
        <div className={globalStyles.button} style={{ marginBottom: 35 }}>
          Купить мастер-класс
        </div>
        <div className={globalStyles.link}>
          Задать вопросы
        </div>
      </div>
      <div className={styles.for_whom}>
        <Box sx={{ px: 3.5, mb: 3.5, py: 3.5 }}>
          <div className={globalStyles.title} style={{ marginBottom: 20 }}>
            <span style={{ color: '#F2D113' }}>
              Для кого 
            </span>  этот Мастер-класс
          </div>
          <p className={styles.description} style={{ marginBottom: 30 }}>
            Данный мастер-класс рассчитан на астрологов, имеющих
            знание основ Джйотиш, а также для тех, кто прошел в нашей
            школе хотя бы Интенсив с Нуля до Прогнозов.
          </p>
          <p className={styles.description}>
            Мы постарались адаптировать уже имеющиеся знания,
            а также дополнили их своими наработками и наблюдениями. 
            Весь <span style={{ color: '#F2D113' }}> материал преподносится в максимально простой
            и понятной форме</span> даже для тех, кто совсем недавно начал изучать Астрологию.
          </p>
        </Box> 
      </div>
      <div className={styles.main_teacher}>
        <MainTeacher teacher={mainTeacher}/>
      </div> 
      <Box sx={{ px: 3.5, mb: 6.5 }}>
        <CourseCard
          payment={freePayment}
        />
      </Box> 
      <Cause/>
      <Box sx={{ px: 3.5 }}>
        <Details/>
      </Box>
    </div>
  );
};

export default MasterClass;
