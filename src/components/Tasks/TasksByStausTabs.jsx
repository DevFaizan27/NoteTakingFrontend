// Tasks.jsx
import React, { useEffect, useState } from "react";
import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
} from "@material-tailwind/react";

import AddTask from "./AddTask";
import TaskList from "./TaskList";
import { useGetTasksQuery } from "../../redux/slices/taskSlice";
import { Home, PlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AllTasks({boardId}) {
    const [activeTab, setActiveTab] = useState(() => {
        return localStorage.getItem("activeTaskTab") || "To Do";
    });
    
    const [openAddTask, setOpenAddTask] = useState(false);

    // Status options for tabs
    const statusTabs = [
        { label: "To Do", value: "To Do" },
        { label: "In Progress", value: "In Progress" },
        { label: "Completed", value: "Completed" },
    ];

    // Use RTK Query to fetch tasks
    const { 
        data: tasksData, 
        isLoading, 
        error, 
        refetch 
    } = useGetTasksQuery({ 
        status: activeTab ,
        board: boardId
    });


    const navigate = useNavigate();

    const tasks = tasksData?.tasks || [];

    useEffect(() => {
        localStorage.setItem("activeTaskTab", activeTab);
    }, [activeTab]);

    const handleOpenAddTask = () => setOpenAddTask(!openAddTask);

    const handleTaskAdded = () => {
        setOpenAddTask(false);
        // RTK Query will automatically refetch due to cache invalidation
    };


    const handlePriotyFilterChange = (value) => {

    }

    const handleGoHome = () => {
        navigate('/')
    }

    return (
        <div className="p-4">
            {/* Header with Add Task button */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
                <Button
                    className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600"
                    onClick={handleGoHome}
                >
                    <Home className="h-4 w-4" />
                    Home
                </Button>
                <Button
                    className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600"
                    onClick={handleOpenAddTask}
                >
                    <PlusIcon className="h-4 w-4" />
                    Add Task
                </Button>
            </div>

            {/* Status Tabs */}
            <Tabs value={activeTab}>
                <TabsHeader
                    className="rounded-t-lg bg-white border border-gray-900"
                    indicatorProps={{
                        className: "bg-purple-500 shadow-none rounded-none",
                    }}
                >
                    {statusTabs.map(({ label, value }) => (
                        <Tab
                            key={value}
                            value={value}
                            onClick={() => setActiveTab(value)}
                            className={`py-3 font-semibold ${
                                activeTab === value ? "text-white" : "text-gray-600"
                            }`}
                        >
                            {label}
                           
                        </Tab>
                    ))}
                </TabsHeader>

                <TabsBody>
                    {statusTabs.map(({ value }) => (
                        <TabPanel key={value} value={value} className="p-0">
                            <TaskList 
                                tasks={tasks} 
                                status={value}
                                isLoading={isLoading}
                                refetch={refetch}
                            />
                        </TabPanel>
                    ))}
                </TabsBody>
            </Tabs>

            {/* Add Task Dialog */}
            <Dialog open={openAddTask} handler={handleOpenAddTask} size="lg">
                <DialogHeader>Add New Task</DialogHeader>
                <DialogBody>
                    <AddTask boardId={boardId} onSuccess={handleTaskAdded} onClose={handleOpenAddTask} />
                </DialogBody>
            </Dialog>

            {/* Error Display */}
            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700">
                        Error: {error?.data?.error || "Failed to fetch tasks"}
                    </p>
                    <Button 
                        variant="text" 
                        className="mt-2 text-red-700"
                        onClick={refetch}
                    >
                        Retry
                    </Button>
                </div>
            )}
        </div>
    );
}