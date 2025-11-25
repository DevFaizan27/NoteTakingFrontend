import apiSlice from "./apiSlice";

export const boardSlice = apiSlice.injectEndpoints({
  tagTypes: ["Boards"],
  endpoints: (builder) => ({
    // Endpoint to fetch all boards
    getBoards: builder.query({
      query: () => ({
        url: "/board/get-boards",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.boards.map(({ id }) => ({ type: "Boards", id })),
              { type: "Boards", id: "LIST" },
            ]
          : [{ type: "Boards", id: "LIST" }],
    }),

    // Endpoint to add a new board
    addBoard: builder.mutation({
      query: (newBoard) => ({
        url: "/board/create-board",
        method: "POST",
        body: newBoard,
      }),
      invalidatesTags: [{ type: "Boards", id: "LIST" }],
    }),
  }),
});

// Export hooks for usage in components
export const { useGetBoardsQuery, useAddBoardMutation } = boardSlice;