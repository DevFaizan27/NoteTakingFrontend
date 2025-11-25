// taskSlice.js
import apiSlice from "./apiSlice";

export const taskSlice = apiSlice.injectEndpoints({
    tagTypes: ["Tasks"],
    endpoints: (builder) => ({
        // Fetch tasks endpoint with status filter
        getTasks: builder.query({
            query: ({ status, board, page = 1, limit = 10, assignedToName }) => {
                const params = new URLSearchParams({
                    status,
                    board,
                    page,
                    limit,
                    assignedToName,
                });

                // Remove undefined/null values
                for (const key of params.keys()) {
                    if (!params.get(key)) {
                        params.delete(key);
                    }
                }

                return {
                    url: `/task/get-tasks?${params.toString()}`,
                    method: "GET",
                    headers: {
                        "auth-token": JSON.parse(localStorage.getItem("token")),
                    },
                };
            },
            keepUnusedDataFor: 3600,
            refetchOnMountOrArgChange: true,
            refetchOnReconnect: true,
            refetchOnFocus: true,
            providesTags: (result) =>
                result
                    ? [
                        ...result.tasks.map(({ _id }) => ({ type: "Tasks", id: _id })),
                        { type: "Tasks", id: "LIST" },
                    ]
                    : [{ type: "Tasks", id: "LIST" }],
        }),

        // Create task endpoint
        addTask: builder.mutation({
            query: (taskData) => ({
                url: "/task/add-task",
                method: "POST",
                body: taskData,
                headers: {
                    "auth-token": JSON.parse(localStorage.getItem("token")),
                },
            }),
            invalidatesTags: [{ type: "Tasks", id: "LIST" }],
        }),

        // Update task status endpoint
        updateTaskStatus: builder.mutation({
            query: ({ taskId, status }) => ({
                url: `/task/${taskId}/status`,
                method: "PATCH",
                body: { status },
                headers: {
                    "auth-token": JSON.parse(localStorage.getItem("token")),
                },
            }),
            invalidatesTags: (result, error, { taskId }) => [
                { type: "Tasks", id: taskId },
                { type: "Tasks", id: "LIST" }
            ],
        }),

        // Delete task endpoint
        deleteTask: builder.mutation({
            query: (taskId) => ({
                url: `/task/${taskId}`,
                method: "DELETE",
                headers: {
                    "auth-token": JSON.parse(localStorage.getItem("token")),
                },
            }),
            invalidatesTags: (result, error, taskId) => [
                { type: "Tasks", id: taskId },
                { type: "Tasks", id: "LIST" }
            ],
        }),

        // Update task endpoint (full update)
        updateTask: builder.mutation({
            query: ({ taskId, ...updateData }) => ({
                url: `/task/${taskId}`,
                method: "PUT",
                body: updateData,
                headers: {
                    "auth-token": JSON.parse(localStorage.getItem("token")),
                },
            }),
            invalidatesTags: (result, error, { taskId }) => [
                { type: "Tasks", id: taskId },
                { type: "Tasks", id: "LIST" }
            ],
        }),

        // Get tasks by status (convenience endpoint)
        getTasksByStatus: builder.query({
            query: (status) => ({
                url: `/task/get-tasks?status=${status}`,
                method: "GET",
                headers: {
                    "auth-token": JSON.parse(localStorage.getItem("token")),
                },
            }),
            providesTags: (result, error, status) => [
                { type: "Tasks", id: status },
                { type: "Tasks", id: "LIST" }
            ],
        }),
    }),
});

export const {
    useGetTasksQuery,
    useAddTaskMutation,
    useUpdateTaskStatusMutation,
    useDeleteTaskMutation,
    useUpdateTaskMutation,
    useGetTasksByStatusQuery
} = taskSlice;