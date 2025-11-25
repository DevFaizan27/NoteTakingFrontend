/* eslint-disable no-unused-vars */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const apiSlice = createApi({
  reducerPath: 'api',
  tagTypes: [], 
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BACKEND_HOST_URL}/api/v1` }),
  endpoints: (builder) => ({
  }), // Initially, we'll keep this empty
});

export default apiSlice;