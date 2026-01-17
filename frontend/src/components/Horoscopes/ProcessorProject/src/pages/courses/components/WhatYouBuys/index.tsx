import { FC } from 'react';
import parse from 'html-react-parser';
import classnames from 'classnames';

import { ICourseWhatYouBuys } from '../../../../models/types/Courses';

import globalStyles from '../../styles.module.scss';
import styles from './styles.module.scss';

interface IProps {
  whatYouBuys: {
    title: string;
    list: ICourseWhatYouBuys[];
    image?: string;
  }
}

const WhatYouBuys: FC<IProps> = ({ whatYouBuys }) => {
  return (
    <div className={styles.container}>
      <div className={classnames(globalStyles.title, styles.title)} style={{ color: '#F2D113' }}>
        {parse(whatYouBuys.title)}
      </div>
      {whatYouBuys.image && <img src={whatYouBuys.image} className={styles.cosmo_course}/>}
      <div className={styles.course_steps} style={{ marginBottom: 60 }}>
        {whatYouBuys.list.map((item) => (
          <div className={globalStyles.list_item} key={item.id}>
            {parse(item.description)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhatYouBuys;
