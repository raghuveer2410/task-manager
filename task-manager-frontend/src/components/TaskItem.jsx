import { useDrag, useDrop } from "react-dnd";
import API from "../api/api";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";

const priorityStyles = {
  low: "text-green-600 bg-green-100 border-green-300",
  medium: "text-yellow-700 bg-yellow-100 border-yellow-300",
  high: "text-red-600 bg-red-100 border-red-300",
};

const TaskItem = ({ task, index, moveTask, fetchTasks }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "TASK",
    hover: (item) => {
      if (item.index !== index) moveTask(item.index, index);
      item.index = index;
    },
  });

  const deleteTask = async () => {
    await API.delete(`/tasks/${task._id}`);
    fetchTasks();
  };

  const now = new Date();
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isDueSoon = dueDate && (dueDate - now) / (1000 * 60 * 60 * 24) <= 1;

  return (
    <li
      ref={(node) => drag(drop(node))}
      className={`relative bg-white p-5 rounded-xl shadow 
      border border-gray-200 hover:shadow-xl transition-all duration-200 
      cursor-grab active:cursor-grabbing
      ${isDragging ? "opacity-50 scale-[0.98]" : ""}
      `}
    >
      {/* LEFT colored strip */}
      <div
        className={`absolute left-0 top-0 h-full w-2 rounded-l-xl ${
          isDueSoon ? "bg-red-500" : `bg-${task.priority}-500`
        }`}
      />

      {/* Top section */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
          )}
        </div>

        {/* Delete button */}
        <button
          onClick={deleteTask}
          className="text-red-500 hover:bg-red-50 p-2 rounded-full transition"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Bottom row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-3">
        {/* Priority Badge */}
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${priorityStyles[task.priority]}`}
        >
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>

        {/* Status */}
        <span className="text-sm text-gray-700 font-medium capitalize">
          {task.status}
        </span>

        {/* Due Date */}
        {dueDate && (
          <span
            className={`text-sm ${
              isDueSoon ? "text-red-500 font-semibold" : "text-gray-500"
            }`}
          >
            Due: {format(dueDate, "MM/dd/yyyy")}
          </span>
        )}
      </div>
    </li>
  );
};

export default TaskItem;