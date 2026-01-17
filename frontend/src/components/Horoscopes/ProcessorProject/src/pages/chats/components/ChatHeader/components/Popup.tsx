import { FC } from 'react';

// styles
import styles from './styles.module.scss';

interface IProps {
  isOpen?: boolean;
}

const Popup: FC<IProps> = ({ isOpen }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.popup}>
      <div className={styles.popup_item}>
        <svg width="19" height="21" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5.35962" y="1" width="7.89247" height="7.89247" rx="3.94624" stroke="#C3C9CD" strokeWidth="2"/>
          <path d="M1.26825 18.8813C1.26825 14.9413 4.46225 11.7473 8.40225 11.7473H10.2095C14.1495 11.7473 17.3435 14.9413 17.3435 18.8813V18.8813C17.3435 19.0389 17.2158 19.1667 17.0582 19.1667H1.55361C1.39601 19.1667 1.26825 19.0389 1.26825 18.8813V18.8813Z" stroke="#C3C9CD" strokeWidth="2"/>
        </svg>
        <span>
          Профиль
        </span>
      </div>
      <div className={styles.popup_item}>
        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="9.23793" cy="8.63636" r="7.63636" stroke="#C3C9CD" strokeWidth="2"/>
          <path d="M14.6924 14.0909L19.6924 19.0909" stroke="#ABB0B2" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <span>
          Поиск
        </span>
      </div>
      <div className={styles.popup_item}>
        <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M10.6016 3.8504C9.15343 3.84712 7.58982 3.85404 6.85157 4.74991C6.1629 5.58554 6.1302 6.97435 6.01821 8.49996C5.90516 10.0266 2.09872 13.5161 3.51822 16C4.5259 17.2813 5.75565 17.2499 10.6015 17.2499C15.4474 17.2499 16.6773 17.2813 17.6849 16C19.1055 13.5161 15.2979 10.0266 15.1849 8.49996C15.0729 6.97435 15.0402 5.58559 14.3516 4.74996C13.6133 3.85409 12.0495 3.84712 10.6016 3.8504Z" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13.5183 19.3333C11.9984 20.8775 9.19645 20.8775 7.68498 19.3333" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M11.8517 2.99145C11.9985 1.44724 9.19641 1.44724 9.3516 2.99146" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>
          Уведомления
        </span>
      </div>
      <div className={styles.popup_item} style={{ color: '#F15024' }}>
        <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.93488 8.16667V13.1667M9.26821 8.16667V13.1667M0.934875 4.83333H14.2682M13.4349 4.83333L12.7124 14.9517C12.6824 15.3722 12.4943 15.7657 12.1858 16.053C11.8773 16.3403 11.4714 16.5 11.0499 16.5H4.15321C3.73166 16.5 3.32576 16.3403 3.01728 16.053C2.70879 15.7657 2.52064 15.3722 2.49071 14.9517L1.76821 4.83333H13.4349ZM10.1015 4.83333V2.33333C10.1015 2.11232 10.0137 1.90036 9.85746 1.74408C9.70118 1.5878 9.48922 1.5 9.26821 1.5H5.93488C5.71386 1.5 5.5019 1.5878 5.34562 1.74408C5.18934 1.90036 5.10154 2.11232 5.10154 2.33333V4.83333H10.1015Z" stroke="#F15024" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>
          Удалить
        </span>
      </div>
    </div>
  );
};

export default Popup;
