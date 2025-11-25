import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Welcome to Team Collaboration Board
      </h1>
      <p className="text-lg text-gray-600 mb-8 text-center">
        Get started by creating your first board or selecting an existing one from the sidebar.
      </p>
    </div>
  );
}

export default HomePage;