import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  IconButton,
} from "@material-tailwind/react";
import { Plus } from "lucide-react";
import { useAddBoardMutation } from "../../redux/slices/boardSlice";
import toast from 'react-hot-toast';

const AddBoardModal = (refetch) => {
  const [addBoard, { isLoading, isSuccess, error, isError }] = useAddBoardMutation();

  // Local form state
  const [formData, setFormData] = useState({
    name: "",
  });

  // Modal open state
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen((prev) => !prev);

  // Handle add success and errors
  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message || "Failed to create board");
    }
    if (isSuccess) {
      toast.success("Board created successfully");
      setFormData({ name: "" });
      toggleOpen();
    }
  }, [isError, error, isSuccess]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.name.trim()) {
      toast.error("Board name is required");
      return;
    }

    try {
      await addBoard(formData).unwrap();
      refetch()
    } catch (err) {
      console.error("Create board failed:", err);
    }
  };

  return (
    <>
      <Button
        onClick={toggleOpen}
        variant="gradient"
        color="white"
        className="flex items-center gap-2 w-full mb-4"
      >
        <Plus className="h-4 w-4" />
        Add New Board
      </Button>

      <Dialog
        open={open}
        handler={toggleOpen}
        size="lg"
        className="shadow-lg rounded-lg bg-gray-50 overflow-y-auto max-h-[80vh]"
      >
        <DialogHeader>Create New Board</DialogHeader>
        <DialogBody divider>
          <form className="grid gap-4">
            <Input
              label="Board Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </form>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={toggleOpen}>
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Board"}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default AddBoardModal;