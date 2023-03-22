import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import musicReducer from './reducers';

export const store = configureStore({
  reducer: {
    music: musicReducer
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
