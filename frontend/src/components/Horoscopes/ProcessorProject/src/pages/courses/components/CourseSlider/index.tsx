import { FC } from 'react';
import parse from 'html-react-parser';
import classnames from 'classnames';

// types
import { IForWhomCourses } from '../../../../models/types/Courses';

// helpers 
import getPrependZeros from '../../../../helpers/getPrependZeros';

// styles
import globalStyles from '../../styles.module.scss';
import styles from './styles.module.scss';

interface IProps {
  list: IForWhomCourses[]
};

const CourseSlider: FC<IProps> = ({ list }) => {
  return (
    <div className={styles.container}>
      <div className={classnames(globalStyles.title, styles.title)}>
        для кого этот курс?
      </div>
      <div className={styles.wrapper}>
        <div className={styles.list}>
          {list.map((item, index) => (
            <div className={styles.item_container} key={index}>
              <div className={styles.item_number}>
                {getPrependZeros(index + 1)}
              </div>
              <div className={globalStyles.yellow_text} style={{ marginBottom: 10 }}>
                {item?.title}
              </div>
              <div className={styles.item_text}>
                {parse(item?.description)}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.gradient}/>
      </div>
    </div>
  );
};

export default CourseSlider;
