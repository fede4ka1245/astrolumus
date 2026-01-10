import { renderToString } from 'solid-js/web';
import { Router, Route } from '@solidjs/router';
import App from './App';
import Home from './pages/Home';
import About from './pages/About';

export async function render(url: string) {
  const html = await renderToString(() => (
    <Router root={App} url={url}>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
    </Router>
  ));
  return html;
}
