// frontend/src/components/MainLayout.jsx
import { Outlet } from "react-router";
import NotesList from "./NotesList";

const MainLayout = () => {
    return (
        <div className="min-h-screen">
            <div className="min-h-screen flex flex-col lg:flex-row">
                {/* Sidebar for desktop */}
                <div className="w-full lg:w-[16em] flex-none hidden lg:block">
                    <NotesList/>
                </div>

                {/* Main content */}
                <main className="flex-1 min-w-0 mb-16 lg:mb-0">
                    <div className="px-3 py-3">
                        <Outlet />
                    </div>
                </main>

                {/* Mobile Notes List - Fixed at bottom */}
                <div className="  bg-white border-t border-gray-200 lg:hidden ">
                        <NotesList/>
                </div>
            </div>
        </div>
    );
}

export default MainLayout;