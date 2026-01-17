import React, { FC } from 'react';
import classnames from 'classnames';

// types
import { ICourseTeacher } from '../../../../models/types/Courses';

// styles
import styles from './styles.module.scss';
import globalStyles from '../../styles.module.scss';

interface IProps {
  teachers: ICourseTeacher[];
};

const Teachers: FC<IProps> = ({ teachers }) => {
  return (
    <React.Fragment>
      <div className={classnames(globalStyles.title, styles.title)}>
        преподаватели <span className={globalStyles.cyan_text}>курса</span>
      </div>
      {teachers.map((teacher, index) => (
        <div className={styles.teacher} key={index}>
          <div className={styles.teacher_image}>
            <div className={styles.shadow} style={{ backgroundColor: teacher.shadow }}/>
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
          {/* <div className={globalStyles.link}>
            страница астролога
          </div> */}
        </div>
      ))}
    </React.Fragment>

  );
};

export default Teachers;
