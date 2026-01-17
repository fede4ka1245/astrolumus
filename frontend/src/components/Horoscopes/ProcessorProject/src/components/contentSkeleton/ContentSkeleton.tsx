import React from 'react';
import styles from './ContentSkeleton.module.scss';
import classNames from 'classnames';

export interface ContentSkeletonProps {
  isDarkTheme?: boolean
}

const ContentSkeleton = ({ isDarkTheme = false }: ContentSkeletonProps) => {
  return (
    <div className={classNames(styles.main, { [styles.bright]: isDarkTheme })}>
      <div className={classNames(styles.item1, styles.skeleton)} />
      <div className={classNames(styles.item2, styles.skeleton)} />
      <div className={classNames(styles.item3, styles.skeleton)} />
    </div>
  );
};

export default ContentSkeleton;
