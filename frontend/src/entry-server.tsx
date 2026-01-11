import { renderToString } from 'solid-js/web';
import App from './App';
import Home from './pages/Home';
import About from './pages/About';

const ROUTES = {
  '/': Home,
  '/about': About,
} as const;

const DEFAULT_ROUTE = '/';

function getPathname(url: string): string {
  try {
    return new URL(url, 'http://localhost').pathname;
  } catch {
    return DEFAULT_ROUTE;
  }
}

function getPageComponent(pathname: string) {
  return ROUTES[pathname as keyof typeof ROUTES] || ROUTES[DEFAULT_ROUTE];
}

export async function render(url: string): Promise<string> {
  try {
    const pathname = getPathname(url);
    const PageComponent = getPageComponent(pathname);
        
    const html = renderToString(() => (
      <App>
        <PageComponent />
      </App>
    ));
    
    if (!html || html.trim().length === 0) {
      return '<div id="app"></div>';
    }
    
    return html;
  } catch (error) {
    if (error instanceof Error) {
      console.error('[SSR] Error message:', error.message);
      console.error('[SSR] Error stack:', error.stack);
    }
    return '<div id="app"></div>';
  }
}
