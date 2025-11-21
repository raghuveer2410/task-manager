import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TaskItem from "./TaskItem";
import { useState, useEffect } from "react";
import API from "../api/api";

function TaskList({ tasks: initialTasks }) {
  const [taskList, setTaskList] = useState(initialTasks);

  useEffect(() => {
    setTaskList(initialTasks);
  }, [initialTasks]);

  const moveTask = (from, to) => {
    const updated = [...taskList];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setTaskList(updated);
  };

  const saveOrder = async () => {
    try {
      const order = taskList.map((task) => task._id);
      await API.post("/tasks/reorder", { order });
    } catch (err) {
      console.error("Error saving task order:", err);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="mt-4">
        {/* Empty State UI */}
        {taskList.length === 0 && (
          <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl border border-gray-200">
            No tasks yet. Add your first task! 
          </div>
        )}

        {/* Scroll container for long lists */}
        <ul className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {taskList.map((task, index) => (
            <TaskItem
              key={task._id}
              task={task}
              index={index}
              moveTask={moveTask}
              fetchTasks={saveOrder}
            />
          ))}
        </ul>
      </div>
    </DndProvider>
  );
}

export default TaskList;
