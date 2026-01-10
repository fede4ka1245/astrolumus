import { Component } from 'solid-js';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import styles from './Home.module.css';

const Home: Component = () => {
  return (
    <div class={styles.page}>
      <Header />
      
      <main class={styles.main}>
        <SearchBar />
      </main>
      
      <footer class={styles.footer}>
        <p class={styles.copyright}>© 2026 Astrolumus</p>
      </footer>
    </div>
  );
};

export default Home;
