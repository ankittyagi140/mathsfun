import { configureStore } from '@reduxjs/toolkit';
import appsReducer from './appsSlice';

const makeStore = () => configureStore({
  reducer: {
    apps: appsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
  devTools: true
});

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export const store = makeStore(); 