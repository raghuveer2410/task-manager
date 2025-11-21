import { useEffect, useState } from "react";
import API from "../api/api";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

function Dashboard() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");

      // Normalize backend response
      const data = res.data.tasks || res.data;

      setTasks(
        data.map((t) => ({
          ...t,
          _id: t._id || t.id,
        }))
      );
    } catch (err) {
      console.error("Error loading tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* NAVBAR */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">
            🧭 Task Management Dashboard
          </h1>

          <button
            onClick={fetchTasks}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Refresh Tasks
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">
          Manage Your Tasks
        </h2>

        {/* Task Form */}
        <div className="mb-10">
          <TaskForm fetchTasks={fetchTasks} />
        </div>

        {/* Task List */}
        <div>
          <TaskList tasks={tasks} />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;