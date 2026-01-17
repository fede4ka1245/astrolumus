import { FC } from 'react';

// component
import UserHeader from '../../../components/userHeader/UserHeader';
import PageHeader from '../../../components/pageHeader/PageHeader';
import CoursesCarousel from '../../../components/CoursesCarousel';
import MiniCourse from './components/MiniCourse';
import CoursesSteps from './components/CoursesSteps';
import AdditionalCourse from './components/AdditionalCourses';
import MasterClass from './components/MasterClass';

// styles
import styles from './styles.module.scss';
import { useGetCourses } from '../../../hooks/useGetCourses';
import { CoursesType } from '../../../helpers/coursesType';
import { getIsForumEnabled } from '../../../helpers/getIsForumEnabled';

const Courses: FC = () => {
  const { courses } = useGetCourses(CoursesType.home);
  const isForumEnabled = getIsForumEnabled();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <UserHeader/>
        <PageHeader page="КУРСЫ АЛЬФА" content={!isForumEnabled ? <></> : undefined}/>
      </div>
      <div className={styles.carousel}>
        <CoursesCarousel courses={courses} />
      </div>
      <MiniCourse/>
      <div className={styles.dark_bg}>
        <CoursesSteps/>
        <AdditionalCourse/>
        <MasterClass/>
      </div>
    </div>
  );
};

export default Courses;
