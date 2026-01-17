import { FC } from 'react';

// styles
import globalStyles from '../../styles.module.scss';
import styles from './styles.module.scss';

interface IProps {
  certificate: {
    description: string,
    image?: string,
  }

}

const Certificate: FC<IProps> = ({ certificate }) => {
  return (
    <div className={styles.container}>
      <div className={globalStyles.title}>
        <span style={{ color: '#F2D113' }}>Именной</span><br/>
        <span style={{ color: '#F2D113' }}>сертификат</span><br/>
        школы
      </div>
      <img src={certificate.image} alt="certificate" className={styles.image}/>
      <div className={styles.description}>
        {certificate.description}
      </div>
      <div className={globalStyles.link}>
        договор оферты на обучение
      </div>
    </div>
  );
};

export default Certificate;
