import { Component } from 'solid-js';
import Header from '../components/Header';
import styles from './About.module.css';

const About: Component = () => {
  return (
    <div class={styles.page}>
      <Header />
      
      <main class={styles.main}>
        <div class={styles.content}>
          <h1 class={styles.title}>О сервисе</h1>
          <p class={styles.description}>
            Astrolumus — это современный поисковый сервис, созданный с использованием 
            технологий SolidJS и серверного рендеринга для максимальной производительности.
          </p>
          
          <div class={styles.features}>
            <div class={styles.feature}>
              <div class={styles.featureIcon}>⚡</div>
              <h3 class={styles.featureTitle}>Быстрый</h3>
              <p class={styles.featureText}>Мгновенные результаты благодаря SSR</p>
            </div>
            <div class={styles.feature}>
              <div class={styles.featureIcon}>🎯</div>
              <h3 class={styles.featureTitle}>Точный</h3>
              <p class={styles.featureText}>Релевантные результаты поиска</p>
            </div>
            <div class={styles.feature}>
              <div class={styles.featureIcon}>🔒</div>
              <h3 class={styles.featureTitle}>Приватный</h3>
              <p class={styles.featureText}>Ваши данные под защитой</p>
            </div>
          </div>
          
          <a href="/" class={styles.backLink}>← Вернуться на главную</a>
        </div>
      </main>
    </div>
  );
};

export default About;
