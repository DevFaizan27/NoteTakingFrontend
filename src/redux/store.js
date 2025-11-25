import { configureStore } from '@reduxjs/toolkit';
import apiSlice from './slices/apiSlice';

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,  // Reducer for cityApi
        // [shopApi.reducerPath]: shopApi.reducer,  // Reducer for shopApi
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(apiSlice.middleware)  // Include  middleware

        });

export default store;