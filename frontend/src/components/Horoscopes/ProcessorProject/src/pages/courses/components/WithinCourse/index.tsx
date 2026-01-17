import { FC } from 'react';
import parse from 'html-react-parser';
import classnames from 'classnames';

// styles
import globalStyles from '../../styles.module.scss';
import styles from './styles.module.scss';

interface withinCourse {
  description: string;
}

interface IProps {
  withinCourses: withinCourse[]
};

const WithinCourse: FC<IProps> = ({ withinCourses }) => {
  return (
    <div className={styles.conatiner}>
      <div className={classnames(globalStyles.title, styles.title)}>
        В рамках курса вы:
      </div>
      <div className={styles.course_steps}>
        {withinCourses.map((item, index) => (
          <div className={globalStyles.list_item} key={index}>
            {parse(item?.description)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WithinCourse;
