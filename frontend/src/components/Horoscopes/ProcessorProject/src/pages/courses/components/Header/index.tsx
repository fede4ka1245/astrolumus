import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

// styles
import styles from './styles.module.scss';

const Header: FC = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles.container}>  
      <button className={styles.button} onClick={goBack}>
        <div className={styles.icon}>
          <svg width="7" height="14" viewBox="0 0 7 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.65625 12.3135L1.44066 6.65662L5.65625 0.999768" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className={styles.title}>
          Назад
        </div>
      </button>
    </div>
  );
};

export default Header;
