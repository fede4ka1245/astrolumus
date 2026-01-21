import 'scroll-restoration-polyfill';
import 'intersection-observer';
import './main.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { store, persister } from './store/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationProvider } from './contexts/NavigationContext';
import { YMaps } from '@pbe/react-yandex-maps';

export type HoroscopesMountResult = {
  unmount: () => void;
};

export const mountHoroscopes = (element: HTMLElement): HoroscopesMountResult => {
  if (window.history) {
    history.scrollRestoration = 'manual';
  }

  const root = ReactDOM.createRoot(element);

  root.render(
    <Provider store={store}>
      <PersistGate persistor={persister} loading={null}>
        <NavigationProvider>
          <App />
        </NavigationProvider>
      </PersistGate>
    </Provider>
  );

  return {
    unmount: () => root.unmount()
  };
};

declare global {
  interface Window {
    horoscopesMount?: (element: HTMLElement) => HoroscopesMountResult;
    ProcessorProject?: {
      finishLoading: () => void;
    };
  }
}

window.horoscopesMount = mountHoroscopes;
