import { FC } from 'react';
import classnames from 'classnames';

// types
import { ICourseTeacher } from '../../../../models/types/Courses';

// styles
import styles from './styles.module.scss';
import globalStyles from '../../styles.module.scss';

interface IProps {
  teacher: ICourseTeacher;
};

const MainTeacher: FC<IProps> = ({ teacher }) => {
  return (
    <div className={styles.teacher}>
      <div className={classnames(globalStyles.title, styles.title)}>
        <span className={globalStyles.cyan_text}>Ведущая</span> Мастер-класса 
      </div>
      <div className={styles.teacher_image}>
        {teacher?.avatar && <img src={teacher?.avatar} className={styles.avatar} alt="teacher"/>}
      </div>
      <div className={styles.name}>
        {teacher?.first_name} {teacher?.last_name}
      </div>
      <div className={styles.subtitle}>
        {teacher?.teacher_title}
      </div>
      <div className={styles.description}>
        {teacher?.teacher_description}
      </div>
      <div className={globalStyles.link}>
        страница астролога
      </div>
    </div>
  );
};

export default MainTeacher;
