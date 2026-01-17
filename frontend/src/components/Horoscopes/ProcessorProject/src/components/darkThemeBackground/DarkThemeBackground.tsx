import React, { useEffect } from 'react';
import styles from './DarkThemeBackground.module.scss';
import classNames from 'classnames';

export interface DarkThemeBackgroundProps {
  children?: React.ReactNode;
  fillBody?: boolean;
  backgroundVariant?: 'planet' | 'galaxy'
}

const DarkThemeBackground = ({ children, fillBody, backgroundVariant = 'planet' }: DarkThemeBackgroundProps) => {
  useEffect(() => {
    if (fillBody) {
      document.body.style.background = backgroundVariant === 'planet' ? '#271C5C' : '#261B5C';
    }

    return () => {
      if (fillBody) {
        document.body.style.background = '';
      }
    };
  }, [fillBody, backgroundVariant]);

  return (
    <div className={classNames({ [styles.planet]: backgroundVariant === 'planet', [styles.galaxy]: backgroundVariant === 'galaxy' })}>
      <div
        className={styles.blurBackground}
      />
      <div
        className={styles.content}
      >
        { children }
      </div>
    </div>
  );
};

export default DarkThemeBackground;
