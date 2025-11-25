// frontend/src/components/NoteCreation.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateNoteMutation } from '../redux/slices/notesApi.js';

const NoteCreation = () => {
  const [title, setTitle] = useState('');
  const [createNote, { isLoading }] = useCreateNoteMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const result = await createNote({ title: title.trim() }).unwrap();
      if (result.success) {
        navigate(`/note/${result.data._id}`);
      }
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center ">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Create New Note
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Note Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !title.trim()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Creating...' : 'Create Note'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NoteCreation;