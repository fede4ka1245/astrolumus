import { FC } from 'react';
import { NumberLiteralType } from 'typescript';

import image from '../../MiniCourse/images/01.png';

// styles 
import globalStyles from '../../styles.module.scss';
import styles from './styles.module.scss';

interface IProgram {
  title: string;
  image: string;
  description: string;
};

interface IProps {
  programs: IProgram[];
}

const CourseProgram: FC<IProps> = ({ programs }) => {
  return (
    <div className={styles.container}>
      <div className={globalStyles.title} style={{ marginBottom: 50 }}>
        Программа курса
      </div>
      {programs.map((program, index) => (
        <div className={styles.lesson} key={index}>
          <div className={styles.lesson_number}>Урок {index + 1}</div>
          <div className={styles.title}>{program.title}</div>
          <img src={program.image}/>
          <div className={styles.description}>
            {program.description}
          </div>
        </div>
      ))}

    </div>
  );
};

export default CourseProgram;
