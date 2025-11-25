import { useEffect } from "react";
import {
  List,
  ListItem,
  ListItemPrefix,
  Spinner,
} from "@material-tailwind/react";
import { useGetBoardsQuery } from "../redux/slices/boardSlice";
import AddBoardModal from "./Boards/AddBoards";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const { data: boards, isLoading, error, refetch } = useGetBoardsQuery();
  const location = useLocation();

  // Refetch boards when component mounts
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Helper function to check if a board is active
  const isBoardActive = (boardId) => {
    return location.pathname === `/tasks/${boardId}`;
  };

  return (
    <div className="h-screen fixed w-full max-w-[16rem] p-4 rounded-none border-r border-r-purple-700 bg-purple-700">
      {/* Header */}
      <div className="mb-2 p-4">
        <div className="py-6">
          <div className="flex justify-center mb-2">
            <img
              className="w-24"
              src="https://cdn-icons-png.flaticon.com/128/6024/6024190.png"
              alt="Team Collaboration"
            />
          </div>
          <h1 className="text-center text-xl text-white font-bold app-font">
            Team Collaboration Board
          </h1>
        </div>
      </div>

      {/* Add Board Modal */}
      <div className="px-2">
        <AddBoardModal refetch={refetch} />
      </div>

      {/* Boards List */}
      <List className="overflow-y-auto max-h-[calc(100vh-200px)]">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Spinner className="h-6 w-6 text-white" />
          </div>
        ) : error ? (
          <ListItem className="text-white">
            <div className="text-center text-red-200">
              {error?.data?.error || "Error loading boards"}
            </div>
          </ListItem>
        ) : boards?.boards && boards.boards.length > 0 ? (
          boards.boards.map((board) => (
            <Link 
              key={board._id} 
              to={`/tasks/${board._id}`} 
              className="block w-full"
            >
              <ListItem
                className={`text-white hover:bg-purple-600 active:bg-purple-600 focus:bg-purple-600 transition-colors duration-300 mb-2 rounded-lg ${
                  isBoardActive(board._id) ? 'bg-purple-800' : ''
                }`}
              >
                <ListItemPrefix>
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/724/724927.png"
                    className="h-6 w-6"
                    alt="Board Icon"
                  />
                </ListItemPrefix>
                <div className="flex flex-col">
                  <span className="font-semibold">{board.name}</span>
                  {board.description && (
                    <span className="text-xs text-purple-200 truncate">
                      {board.description}
                    </span>
                  )}
                </div>
              </ListItem>
            </Link>
          ))
        ) : (
          <ListItem className="text-white">
            <div className="text-center text-purple-200">
              No boards created yet
            </div>
          </ListItem>
        )}
      </List>
    </div>
  );
}