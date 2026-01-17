import 'scroll-restoration-polyfill';
import ReactDOM from 'react-dom/client';
import App from './App';
import { store, persister } from './store/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationProvider } from './contexts/NavigationContext';
import { YMaps } from '@pbe/react-yandex-maps';
import 'intersection-observer';
import './main.css';

if (window.history) {
  history.scrollRestoration = 'manual';
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Provider store={store}>
    <PersistGate persistor={persister} loading={null}>
      <YMaps>
        <NavigationProvider>
          <App/>
        </NavigationProvider>
      </YMaps>
    </PersistGate>
  </Provider>
);
