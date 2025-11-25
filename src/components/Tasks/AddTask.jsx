// AddTask.jsx
import React, { useState, useEffect } from "react";
import {
    Button,
    Input,
    Textarea,
    Select,
    Option,
} from "@material-tailwind/react";
import { useAddTaskMutation } from "../../redux/slices/taskSlice";
import toast from 'react-hot-toast';


export default function AddTask({ onSuccess, onClose, boardId }) {
    const [addTask, { isLoading }] = useAddTaskMutation();
    
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        assignedTo: "",
        dueDate: "",
        priority: "Medium",
        board: boardId || "", // Initialize with boardId prop
    });

    // Update formData when boardId prop changes
    useEffect(() => {
        if (boardId) {
            setFormData(prev => ({
                ...prev,
                board: boardId
            }));
        }
    }, [boardId]);

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate that boardId is present
        if (!formData.board) {
            toast("Board ID is missing. Please try again.");
            return;
        }
        
        try {
            await addTask(formData).unwrap();
            onSuccess();
            toast.success("Task added successfully");
            // Form will be automatically reset by dialog close
        } catch (error) {
            console.error("Failed to add task:", error);
            toast("Failed to add task. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Task Title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
            />

            <Textarea
                label="Description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Assigned To"
                    value={formData.assignedTo}
                    onChange={(e) => handleChange("assignedTo", e.target.value)}
                    required
                />

                <Input
                    type="date"
                    label="Due Date"
                    value={formData.dueDate}
                    onChange={(e) => handleChange("dueDate", e.target.value)}
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                    label="Priority"
                    value={formData.priority}
                    onChange={(value) => handleChange("priority", value)}
                >
                    <Option value="Low">Low</Option>
                    <Option value="Medium">Medium</Option>
                    <Option value="High">High</Option>
                </Select>
            </div>

           

            <div className="flex justify-end gap-2 pt-4">
                <Button variant="outlined" onClick={onClose} type="button">
                    Cancel
                </Button>
                <Button 
                    type="submit" 
                    className="bg-purple-500"
                    disabled={isLoading}
                >
                    {isLoading ? "Adding..." : "Add Task"}
                </Button>
            </div>
        </form>
    );
}