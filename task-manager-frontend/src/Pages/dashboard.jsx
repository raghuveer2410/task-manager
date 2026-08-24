import { useEffect, useState, useCallback, useMemo } from "react";
import API from "../api/api";
import AppLayout from "../layouts/AppLayout";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import StatCard from "../components/StatCard";
import AnalyticsPanel from "../components/AnalyticsPanel";

export default function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [range, setRange] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [tasksResponse, analyticsResponse] = await Promise.all([
        API.get("/api/tasks"),
        API.get(`/api/analytics/summary?range=${range}`)
      ]);
      const data = tasksResponse.data.tasks || tasksResponse.data || [];
      setTasks(data.map((task) => ({ ...task, _id: task._id || task.id })));
      setAnalytics(analyticsResponse.data);
    } catch (err) {
      console.error("Error loading dashboard:", err);
      setError(err.response?.data?.message || "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const completedCount = useMemo(
    () => tasks.filter((task) => task.status === "done").length,
    [tasks]
  );
  const pendingCount = useMemo(
    () => tasks.filter((task) => task.status !== "done").length,
    [tasks]
  );

  return (
    <AppLayout title="Task Management" onRefresh={fetchDashboard}>
      {error && <p className="mb-6 rounded bg-red-100 p-3 text-red-600">{error}</p>}

      <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard title="Total Tasks" value={tasks.length} />
        <StatCard title="Completed" value={completedCount} />
        <StatCard title="Pending" value={pendingCount} />
      </section>

      <AnalyticsPanel
        analytics={analytics}
        range={range}
        onRangeChange={setRange}
      />

      <section className="mb-8">
        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">Add New Task</h2>
          <TaskForm onAddTask={fetchDashboard} />
        </div>
      </section>

      <section>
        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">Your Tasks</h2>
          {loading ? <p>Loading tasks...</p> : (
            <TaskList tasks={tasks} fetchTasks={fetchDashboard} />
          )}
        </div>
      </section>
    </AppLayout>
  );
}
