// TaskList.jsx
import React, { useState } from "react";
import {
    Card,
    CardBody,
    Typography,
    IconButton,
    Select,
    Option,
    Button,
} from "@material-tailwind/react";
import { 
    ClockIcon, 
    UserIcon, 
    PlusIcon, 
    TrashIcon,
    TagIcon,
    CalendarIcon,
    ClipboardListIcon,
    PencilIcon,
    ArrowUpDownIcon,
    FilterIcon
} from "lucide-react";
import DeleteTaskModal from "./DeleteTaskModal";
import EditTaskStatusModal from "./EditTaskStatusModal";
import EditTask from "./EditTask";
import { useDeleteTaskMutation, useUpdateTaskStatusMutation } from "../../redux/slices/taskSlice";

export default function TaskList({ 
    tasks, 
    status, 
    isLoading, 
    refetch, 
    onAddTask, 
    onDeleteTask 
}) {
    const [deleteTask] = useDeleteTaskMutation();
    const [updateTaskStatus] = useUpdateTaskStatusMutation();
    
    // State for modals and filters
    const [selectedTask, setSelectedTask] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [priorityFilter, setPriorityFilter] = useState("All");

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "High": return "bg-red-500";
            case "Medium": return "bg-yellow-500";
            case "Low": return "bg-green-500";
            default: return "bg-gray-500";
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    // Filter tasks based on priority
    const filteredTasks = tasks.filter(task => {
        if (priorityFilter === "All") return true;
        return task.priority === priorityFilter;
    });

    // Handler functions
    const handleDeleteClick = (task) => {
        setSelectedTask(task);
        setShowDeleteModal(true);
    };

    const handleStatusClick = (task) => {
        setSelectedTask(task);
        setShowStatusModal(true);
    };

    const handleEditClick = (task) => {
        setSelectedTask(task);
        setShowEditModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedTask) return;
        
        try {
            await deleteTask(selectedTask._id).unwrap();
            setShowDeleteModal(false);
            setSelectedTask(null);
            refetch(); // Refresh the task list
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        if (!selectedTask) return;
        
        try {
            await updateTaskStatus({
                taskId: selectedTask._id,
                status: newStatus
            }).unwrap();
            setShowStatusModal(false);
            setSelectedTask(null);
            refetch(); // Refresh the task list
        } catch (error) {
            console.error('Failed to update task status:', error);
        }
    };

    const handleTaskUpdate = async () => {
        setShowEditModal(false);
        setSelectedTask(null);
        refetch(); // Refresh the task list
    };

    const handleCloseModals = () => {
        setShowDeleteModal(false);
        setShowStatusModal(false);
        setShowEditModal(false);
        setSelectedTask(null);
    };

    const handlePriorityFilterChange = (value) => {
        setPriorityFilter(value);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="text-center py-12">
                <Typography variant="h6" color="gray">
                    No {status.toLowerCase()} tasks found
                </Typography>
                <Typography variant="small" color="gray" className="mt-2">
                    {status === "To Do" ? "Get started by adding a new task!" : 
                     "Tasks will appear here when they're moved to this status"}
                </Typography>
            </div>
        );
    }

    return (
        <div className="space-y-4 p-4">
            {/* Header with status, count, and filters */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                    <ClipboardListIcon className="h-5 w-5 text-gray-600" />
                    <Typography variant="h5" className="text-gray-800 font-semibold">
                        {status} Tasks
                    </Typography>
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                        {filteredTasks.length} of {tasks.length}
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <FilterIcon className="h-4 w-4 text-gray-600" />
                    <Select
                        value={priorityFilter}
                        onChange={handlePriorityFilterChange}
                        className="min-w-[120px]"
                        labelProps={{ className: "hidden" }}
                    >
                        <Option value="All">All Priorities</Option>
                        <Option value="High">High</Option>
                        <Option value="Medium">Medium</Option>
                        <Option value="Low">Low</Option>
                    </Select>
                </div>
            </div>

            {/* Priority Filter Status */}
            {priorityFilter !== "All" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                        <Typography variant="small" className="text-blue-800">
                            Showing <span className="font-semibold">{priorityFilter}</span> priority tasks only
                        </Typography>
                        <Button
                            variant="text"
                            size="sm"
                            className="text-blue-700 hover:text-blue-900"
                            onClick={() => setPriorityFilter("All")}
                        >
                            Clear Filter
                        </Button>
                    </div>
                </div>
            )}

            {/* Tasks List */}
            {filteredTasks.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <TagIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <Typography variant="h6" color="gray" className="mb-2">
                        No {priorityFilter.toLowerCase()} priority tasks found
                    </Typography>
                    <Typography variant="small" color="gray">
                        Try selecting a different priority filter
                    </Typography>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredTasks.map((task) => (
                        <Card key={task._id} className="border border-gray-300 hover:shadow-md transition-shadow">
                            <CardBody className="p-4">
                                {/* Task Header with Title and Actions */}
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <Typography variant="h6" className="text-gray-800 font-medium">
                                            {task.title}
                                        </Typography>
                                        {/* Priority Badge */}
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white ${getPriorityColor(task.priority)}`}>
                                            <TagIcon className="h-3 w-3" />
                                            {task.priority}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {/* Change Status Button */}
                                        <IconButton 
                                            size="sm" 
                                            className="bg-blue-500 hover:bg-blue-600"
                                            onClick={() => handleStatusClick(task)}
                                            title="Change Status"
                                        >
                                            <ArrowUpDownIcon className="h-4 w-4" />
                                        </IconButton>
                                        
                                        {/* Edit Task Button */}
                                        <IconButton 
                                            size="sm" 
                                            className="bg-green-500 hover:bg-green-600 ml-1"
                                            onClick={() => handleEditClick(task)}
                                            title="Edit Task"
                                        >
                                            <PencilIcon className="h-4 w-4" />
                                        </IconButton>
                                        
                                        {/* Delete Task Button */}
                                        <IconButton 
                                            size="sm" 
                                            className="bg-red-500 hover:bg-red-600 ml-1"
                                            onClick={() => handleDeleteClick(task)}
                                            title="Delete Task"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </IconButton>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="flex items-start gap-2 mb-3">
                                    <Typography variant="small" className="text-gray-600 flex-1">
                                        {task.description}
                                    </Typography>
                                </div>

                                {/* Task Metadata */}
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <div className="flex items-center gap-4">
                                        {/* Assigned To */}
                                        <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                                            <UserIcon className="h-4 w-4 text-blue-600" />
                                            <span className="font-medium">Assigned:</span>
                                            <span className="text-blue-700">{task.assignedTo}</span>
                                        </div>
                                        
                                        {/* Due Date */}
                                        <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded">
                                            <ClockIcon className="h-4 w-4 text-orange-600" />
                                            <span className="font-medium">Due:</span>
                                            <span className="text-orange-700">{formatDate(task.dueDate)}</span>
                                        </div>

                                        {/* Created Date */}
                                        {task.createdAt && (
                                            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                                                <CalendarIcon className="h-4 w-4 text-gray-600" />
                                                <span className="font-medium">Created:</span>
                                                <span className="text-gray-700">
                                                    {formatDate(task.createdAt)}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Board */}
                                    {task.board && (
                                        <div className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded">
                                            <span className="font-medium">Board:</span>
                                            <span className="text-purple-700">
                                                {typeof task.board === 'object' ? task.board.name : task.board}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Current Status */}
                                <div className="mt-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm text-gray-700">Current Status:</span>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            task.status === 'Done' ? 'bg-green-100 text-green-800' :
                                            task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {task.status}
                                        </span>
                                    </div>
                                    
                                    {/* Task ID (for reference) */}
                                    <Typography variant="small" className="text-gray-400 text-xs">
                                        ID: {task._id.slice(-8)}
                                    </Typography>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}

            {/* Modals */}
            <DeleteTaskModal
                task={selectedTask}
                isOpen={showDeleteModal}
                onClose={handleCloseModals}
                onSuccess={handleDeleteConfirm}
            />

            <EditTaskStatusModal
                task={selectedTask}
                isOpen={showStatusModal}
                onClose={handleCloseModals}
                onSuccess={handleStatusUpdate}
            />

            <EditTask
                task={selectedTask}
                isOpen={showEditModal}
                onClose={handleCloseModals}
                onSuccess={handleTaskUpdate}
            />
        </div>
    );
}