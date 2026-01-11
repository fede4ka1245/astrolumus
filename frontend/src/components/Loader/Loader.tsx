import { Component } from 'solid-js';
import styles from './Loader.module.css';

const Loader: Component = () => {
  return (
    <div class={styles.loader}>
      <div class={styles.container}>
        {/* Центральный круг с прозрачной вырезкой */}
        <div class={styles.centerCircle}></div>
        
        {/* Среднее кольцо */}
        <div class={styles.middleRing}>
          <div class={styles.ringDot}></div>
        </div>
        
        {/* Внешнее кольцо */}
        <div class={styles.outerRing}>
          <div class={styles.ringDot}></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
