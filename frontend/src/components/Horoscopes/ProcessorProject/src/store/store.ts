import { combineReducers, configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import userReducer from './reducers/userReducer';
import preferencesReducer from './reducers/preferencesReducer';
import horoscopesReducer from './reducers/horoscopesReducer';
import varshpahalaReducer from './reducers/varshpahalaReducer';
import zonesReducer from './reducers/zonesReducer';
import transitionReduser from './reducers/transitionReduser';
import settingsReducer from './reducers/settingsReducer';
import savedHoroscopesReducer from './reducers/savedHoroscopesReducer';
import { persistStore, persistReducer } from 'redux-persist';
import deepSkyReducer from './reducers/deepSkyReducer';
import horoscopeSettingsReducer from './reducers/horoscopeSettings';
import RectificationReducer from './reducers/rectificationReducer';
import notificationReducer from './reducers/notificationReducer';
import objectDescriptionReducer from '../pages/horoscopes/objectDescription/store';
import domainsReducer from './reducers/domainsReducer';

const rootReducer = combineReducers({
  user: userReducer,
  objectDescription: objectDescriptionReducer,
  preferences: preferencesReducer,
  horoscopes: horoscopesReducer,
  rectification: RectificationReducer,
  horoscopeSettings: horoscopeSettingsReducer,
  varshpahala: varshpahalaReducer,
  zones: zonesReducer,
  transition: transitionReduser,
  settings: settingsReducer,
  deepSky: deepSkyReducer,
  savedHoroscopes: savedHoroscopesReducer,
  notification: notificationReducer,
  domains: domainsReducer
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['settings', 'horoscopes', 'horoscopeSettings', 'transition', 'deepSky', 'zones', 'varshpahala']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
      },
    }),
});

export const persister = persistStore(store);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
