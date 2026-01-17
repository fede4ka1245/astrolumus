import { render } from 'solid-js/web';
import { Router, Route } from '@solidjs/router';
import './styles/theme.css';
import App from './App';
import Home from './pages/Home';
import About from './pages/About';

function initClient() {
  const root = document.getElementById('app');
  if (!root) {
    console.error('[Client] Root element not found');
    return;
  }

  root.innerHTML = '';
  
  // Set app height CSS variable
  const appHeight = () => {
    const doc = document.documentElement;
    doc.style.setProperty('--app-height', `${window.innerHeight}px`);
  };
  window.addEventListener('resize', appHeight);
  appHeight();
  
  render(
    () => (
      <App>
        <Router>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
        </Router>
      </App>
    ),
    root
  );
}

// Инициализация при загрузке страницы
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initClient);
} else {
  // Если DOM уже загружен, используем requestAnimationFrame для гарантии готовности
  if (typeof requestAnimationFrame !== 'undefined') {
    requestAnimationFrame(initClient);
  } else {
    initClient();
  }
}
