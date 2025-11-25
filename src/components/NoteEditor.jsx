// frontend/src/components/NoteEditor.jsx
import React, { useEffect, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import { setContent, setTitle, setNoteData, setSaving, setLastSaved } from '../redux/slices/noteEditorSlice.js';
import { useGetNoteQuery, useUpdateNoteMutation } from '../redux/slices/notesApi.js';
import { useNoteSocket } from '../hooks/useNoteSocket.js';


const NoteEditor = () => {
  const { id: noteId } = useParams();
  const dispatch = useDispatch();
  const { data: noteResponse, isLoading, error } = useGetNoteQuery(noteId);
  const [updateNote] = useUpdateNoteMutation();
  const { sendUpdate } = useNoteSocket(noteId);
  
  const { content, title, lastSaved, isSaving, activeUsers, lastUpdated } = useSelector(state => state.noteEditor);
  const [localContent, setLocalContent] = useState('');
  const [localTitle, setLocalTitle] = useState('');

  // Initialize note data
  useEffect(() => {
    if (noteResponse?.success) {
      const note = noteResponse.data;
      dispatch(setNoteData(note));
      setLocalContent(note.content);
      setLocalTitle(note.title);
    }
  }, [noteResponse, dispatch]);

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!noteId || isSaving) return;

    try {
      dispatch(setSaving(true));
      await updateNote({
        id: noteId,
        content: localContent,
        title: localTitle
      }).unwrap();
      
      dispatch(setLastSaved(new Date().toISOString()));
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  }, [noteId, localContent, localTitle, updateNote, dispatch, isSaving]);

  // Set up auto-save interval
  useEffect(() => {
    const interval = setInterval(autoSave, 10000); // Save every 10 seconds
    return () => clearInterval(interval);
  }, [autoSave]);

  // Handle content changes
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setLocalContent(newContent);
    dispatch(setContent(newContent));
    sendUpdate({ content: newContent });
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setLocalTitle(newTitle);
    dispatch(setTitle(newTitle));
    sendUpdate({ title: newTitle });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading note...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-red-600">Error loading note</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              value={localTitle}
              onChange={handleTitleChange}
              className="text-2xl font-bold w-full bg-transparent border-none focus:outline-none focus:ring-0"
              placeholder="Untitled Note"
            />
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{activeUsers.length} active user(s)</span>
              {lastSaved && (
                <span>Last saved: {new Date(lastSaved).toLocaleTimeString()}</span>
              )}
              {isSaving && <span>Saving...</span>}
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="p-6">
          <TextareaAutosize
            value={localContent}
            onChange={handleContentChange}
            placeholder="Start typing your note here..."
            className="w-full resize-none border-none focus:outline-none focus:ring-0 text-gray-700 leading-relaxed min-h-[500px]"
            cacheMeasurements
          />
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>
              Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Never'}
            </span>
            <span>
              {activeUsers.length} collaborator(s) online
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;