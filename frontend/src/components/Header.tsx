import { Component } from 'solid-js';
import styles from './Header.module.css';

const Header: Component = () => {
  return (
    <header class={styles.header}>
      <div class={styles.headerContainer}>
        <a href="/" class={styles.logo}>
          <span class={styles.logoText}>Astro Lumus</span>
        </a>
      </div>
    </header>
  );
};

export default Header;
