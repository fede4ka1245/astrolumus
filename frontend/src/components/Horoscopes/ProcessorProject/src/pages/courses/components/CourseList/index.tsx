import { FC } from 'react';
import parse from 'html-react-parser';
import classnames from 'classnames';

// components
import { Box } from '@mui/material';

// types 
import { ICourseAdditionalField } from '../../../../models/types/Courses';

// styles
import globalStyles from '../../styles.module.scss';
import styles from './styles.module.scss';

interface IProps {
  list: ICourseAdditionalField[];
};

const CourseList: FC<IProps> = ({ list }) => {
  return (
    <Box sx={{ px: 3.5 }}>
      {list.map((item, index) => (
        <div className={styles.item_continer} key={index}>
          <div className={classnames(globalStyles.yellow_text, styles.title)}>
            {item?.title}
          </div>
          <div className={styles.text}>
            {parse(item?.description)}
          </div>
        </div>
      ))}
    </Box>
  );
};

export default CourseList;
