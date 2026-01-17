import { FC } from 'react';

// models 
import { ICoursePaymentCard } from './models';

// styles 
import styles from '../styles.module.scss';
import globalStyles from '../../../styles.module.scss';

interface IProps {
  payment: ICoursePaymentCard;
  backgroundColor?: string
}

const CourseCard: FC<IProps> = ({ payment, backgroundColor }) => {
  return (
    <div className={styles.container} style={{ backgroundColor }}>
      <img src={payment.image} className={styles.image}/>
      <div className={styles.wrapper}>
        <div className={styles.title}>
          {payment.title}
        </div>
        <div className={styles.list}>
          {payment.list.map((item, index) => (
            <div className={globalStyles.list_item} key={index}>
              {item.description}
            </div>)
          )}
        </div>
        {payment.bonus_list.length > 0 && (
          <div className={styles.bonus_container}>
            {payment.bonus_list.map((bonus, index) => (
              <div
                style={bonus.disabled ? { opacity: 0.2 } : {}} 
                className={styles.bonus} 
                key={index}>
                <div className={styles.bonus_title}>
                  Бонус
                </div>
                <div className={styles.bonus_text}>
                  {bonus.description}
                </div>
              </div>
            ))}
          </div>
        )}
        {
          payment.description && (
            <div className={styles.description_container}>
              <div className={styles.description}>
                {payment.description}
              </div>
            </div>
          )
        }
        {payment.monthly_fee.show && (
          <div className={styles.description_container}>
            <div className={styles.description}>
              {payment.monthly_fee.title}
            </div>
            <div className={styles.description_payment}>
              {payment.monthly_fee.quantity} <span style={{ color: '#F9F9F9' }}>Х</span> {payment.monthly_fee.price} Rub
            </div>
          </div>
        )}
        {
          payment.discount_price > 0 && (
            <div>
              <div className={styles.full_cost_title}>
                {payment.payment_title}
              </div>
              <div className={styles.full_cost}>
                {payment.full_price} Rub
              </div>
            </div>
          )
        }
        {
          payment.full_price > 0 && (
            <div className={styles.cost}>
              {payment.discount_price > 0 ? payment.discount_price : payment.full_price} Rub
            </div>
          )
        }
        {
          payment.subtitle && (
            <div className={styles.subtitle}>
              {payment.subtitle} 
            </div>
          )
        }
        <div className={globalStyles.button}>
          {payment.button_text ?? 'оплатить'} 
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
