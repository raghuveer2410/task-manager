import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TaskItem from "./TaskItem";
import { useState, useEffect } from "react";
import API from "../api/api";
function TaskList({ tasks: initialTasks, fetchTasks }) {
  const [taskList, setTaskList] = useState(initialTasks);

  useEffect(() => {
    setTaskList(initialTasks);
  }, [initialTasks]);

  const moveTask = (fromIndex, toIndex) => {
    setTaskList(prev => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  };

  const saveOrder = async () => {
  try {
    const order = taskList.map(t => t._id);
    await API.post("/tasks/reorder", { order }); // use `order`
  } catch (err) {
    console.error("Error saving task order:", err);
  }
};

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="mt-4">
        {taskList.length === 0 && <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl border border-gray-200">No tasks yet. Add your first task!</div>}
        <ul className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {taskList.map((task, index) => (
            <TaskItem
              key={task._id}
              task={task}
              index={index}
              moveTask={moveTask}
              onDrop={saveOrder}
              removeTask={(id) => setTaskList(prev => prev.filter(t => t._id !== id))}
            />
          ))}
        </ul>
      </div>
    </DndProvider>
  );
}

export default TaskList;