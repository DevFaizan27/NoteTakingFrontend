// frontend/src/store/api/notesApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const notesApi = createApi({
  reducerPath: 'notesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_HOST_URL || 'http://localhost:4000/api',
  }),
  tagTypes: ['Note', 'NotesList'],
  endpoints: (builder) => ({
    // Existing endpoints...
    createNote: builder.mutation({
      query: (noteData) => ({
        url: '/notes',
        method: 'POST',
        body: noteData,
      }),
      invalidatesTags: ['NotesList'],
    }),
    
    getNote: builder.query({
      query: (id) => `/notes/${id}`,
      providesTags: (result, error, id) => [{ type: 'Note', id }],
    }),
    
    updateNote: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/notes/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Note', id },
        'NotesList'
      ],
    }),

    // New endpoints for notes list
    getAllNotes: builder.query({
      query: ({ page = 1, limit = 10, sortBy = 'updatedAt', sortOrder = 'desc' } = {}) => 
        `/notes?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
      providesTags: ['NotesList'],
    }),

    searchNotes: builder.query({
      query: ({ query, page = 1, limit = 10 }) => 
        `/notes/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
      providesTags: ['NotesList'],
    }),

    deleteNote: builder.mutation({
      query: (id) => ({
        url: `/notes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['NotesList'],
    }),
  }),
});

export const {
  useCreateNoteMutation,
  useGetNoteQuery,
  useUpdateNoteMutation,
  useGetAllNotesQuery,
  useSearchNotesQuery,
  useDeleteNoteMutation,
} = notesApi;