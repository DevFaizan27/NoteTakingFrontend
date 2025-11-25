// frontend/src/store/slices/noteEditorSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  content: '',
  title: '',
  lastSaved: null,
  isSaving: false,
  activeUsers: [],
  lastUpdated: null,
};

const noteEditorSlice = createSlice({
  name: 'noteEditor',
  initialState,
  reducers: {
    setContent: (state, action) => {
      state.content = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    setTitle: (state, action) => {
      state.title = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    setLastSaved: (state, action) => {
      state.lastSaved = action.payload;
      state.isSaving = false;
    },
    setSaving: (state, action) => {
      state.isSaving = action.payload;
    },
    setActiveUsers: (state, action) => {
      state.activeUsers = action.payload;
    },
    setNoteData: (state, action) => {
      state.content = action.payload.content || '';
      state.title = action.payload.title || '';
      state.lastUpdated = action.payload.updatedAt;
    },
    resetEditor: () => initialState,
  },
});

export const {
  setContent,
  setTitle,
  setLastSaved,
  setSaving,
  setActiveUsers,
  setNoteData,
  resetEditor,
} = noteEditorSlice.actions;

export default noteEditorSlice.reducer;