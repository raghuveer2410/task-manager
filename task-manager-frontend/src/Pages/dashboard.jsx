// src/pages/Dashboard.jsx
import { useEffect, useState, useCallback, useMemo } from "react";
import API from "../api/api";
import AppLayout from "../layouts/AppLayout";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import StatCard from "../components/StatCard";

export default function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch all tasks from backend
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get("/api/tasks"); // fix endpoint
      const data = res.data.tasks || res.data || [];
      setTasks(data.map((t) => ({ ...t, _id: t._id || t.id })));
    } catch (err) {
      console.error("Error loading tasks:", err);
      setError(err.response?.data?.message || "Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Task statistics
  const completedCount = useMemo(
    () => tasks.filter((t) => t.status === "done").length,
    [tasks]
  );
  const pendingCount = useMemo(
    () => tasks.filter((t) => t.status !== "done").length,
    [tasks]
  );

  return (
    <AppLayout title="Task Management" onRefresh={fetchTasks}>
      {error && (
        <p className="mb-6 text-red-600 bg-red-100 p-3 rounded">{error}</p>
      )}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Tasks" value={tasks.length} />
        <StatCard title="Completed" value={completedCount} />
        <StatCard title="Pending" value={pendingCount} />
      </section>

      <section className="mb-8">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Add New Task</h2>
          <TaskForm
            onAddTask={(newTask) =>
              setTasks((prev) => [...prev, { ...newTask, _id: newTask._id || newTask.id }])
            }
          />
        </div>
      </section>

      <section>
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Your Tasks</h2>
          {loading ? (
            <p>Loading tasks...</p>
          ) : (
            <TaskList tasks={tasks} fetchTasks={fetchTasks} />
          )}
        </div>
      </section>
    </AppLayout>
  );
}