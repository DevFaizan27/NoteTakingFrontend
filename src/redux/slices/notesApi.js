// frontend/src/store/api/notesApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const notesApi = createApi({
  reducerPath: 'notesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_HOST_URL || 'http://localhost:4000/api',
  }),
  tagTypes: ['Note'],
  endpoints: (builder) => ({
    createNote: builder.mutation({
      query: (noteData) => ({
        url: '/notes',
        method: 'POST',
        body: noteData,
      }),
      invalidatesTags: ['Note'],
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
      invalidatesTags: (result, error, { id }) => [{ type: 'Note', id }],
    }),
  }),
});

export const {
  useCreateNoteMutation,
  useGetNoteQuery,
  useUpdateNoteMutation,
} = notesApi;