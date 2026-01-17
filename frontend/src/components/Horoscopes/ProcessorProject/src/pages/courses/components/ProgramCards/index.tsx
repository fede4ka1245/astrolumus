import React, { FC } from 'react';
import parse from 'html-react-parser';

import { ICourseModule } from '../../../../models/types/Courses';

// styles
import globalStyles from '../../styles.module.scss';
import styles from './styles.module.scss';

interface IProps {
  modules: ICourseModule[]
}

const ProgramCards:FC<IProps> = ({ modules }) => {
  const endingGenerator = (number: number): string => {
    if (number === 1) {
      return `${number} Урок`;
    }

    if (number > 1 && number < 5) {
      return `${number} Урока`;
    }

    return `${number} Уроков`;
  };

  return (
    <React.Fragment>
      <div className={globalStyles.title} style={{ textAlign: 'center', marginBottom: 30 }}>
        Программа курса
      </div>
      {modules.map(module => (
        <div className={styles.container} key={module.id}>
          <div className={styles.header}>
            <div className={styles.module_number}>{module?.title}</div>
            <div className={styles.lesson_number}>{endingGenerator(module?.lessons_count)}</div>
          </div>
          <div className={styles.title}>{parse(module?.description)}</div>
          {
            module?.lessons?.map(lesson => (
              <div className={styles.lesson} key={lesson?.id}>
                <div className={styles.lesson_title}>
                  {lesson?.title}
                </div>
                <div className={styles.lesson_descr}>
                  {parse(lesson?.description)}
                </div>
              </div>
            ))
          }
        </div>
      ))}
    </React.Fragment>
  );
};

export default ProgramCards;
