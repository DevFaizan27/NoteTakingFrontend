// frontend/src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
// import { notesApi } from './api/notesApi.js';
import noteEditorReducer from './slices/noteEditorSlice.js';
import { notesApi } from './slices/notesApi.js';

export const store = configureStore({
  reducer: {
    noteEditor: noteEditorReducer,
    [notesApi.reducerPath]: notesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(notesApi.middleware),
});

export default store;


