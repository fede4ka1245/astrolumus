import React from 'react';
import styles from './TabBar.module.scss';

const Courses = () => {
  return (
    <svg className={styles.stroke} width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
      <linearGradient id="gradient"
        x1="0" y1="0%">
        <stop offset="0%" stopColor="#37366B"
          className="stop-1"/>
        <stop offset="49%" stopColor="#5C5B9F"
          className="stop-2"/>
        <stop offset="100%" stopColor="#59ABDA"
          className="stop-3"/>
      </linearGradient>
      <circle cx="14.4625" cy="14.0029" r="12.5543" stroke="#9C9EA8" strokeWidth="2"/>
      <rect x="2.30078" y="19.4954" width="6.66948" height="6.66948" rx="3.33474" fill="#F3F3F5" stroke="#9C9EA8" strokeWidth="2"/>
    </svg>
  );
};

export default Courses;
