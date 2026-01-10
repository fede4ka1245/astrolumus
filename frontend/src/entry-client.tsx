import { render } from 'solid-js/web';
import { Router, Route } from '@solidjs/router';
import './styles/theme.css';
import App from './App';
import Home from './pages/Home';
import About from './pages/About';

const root = document.getElementById('app');

if (root) {
  root.innerHTML = '';
  render(
    () => (
      <Router root={App}>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
      </Router>
    ),
    root
  );
}
