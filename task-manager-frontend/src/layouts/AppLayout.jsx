import { useEffect, useState } from 'react';
import API from '../api/api';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import AppLayout from '../layouts/AppLayout';
import StatCard from '../components/StatCard';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks');
      const data = res.data.tasks || res.data || [];
      setTasks(data.map(t => ({ ...t, _id: t._id || t.id })));
    } catch (err) {
      console.error('Error loading tasks:', err);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  return (
    <AppLayout onRefresh={fetchTasks} title="Task Management">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Tasks" value={tasks.length} />
        <StatCard title="Completed" value={tasks.filter(t => t.status === 'done').length} />
        <StatCard title="Pending" value={tasks.filter(t => t.status !== 'done').length} />
      </section>

      <section className="mb-8">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Add New Task</h2>
          <TaskForm fetchTasks={fetchTasks} />
        </div>
      </section>

      <section>
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Your Tasks</h2>
          <TaskList tasks={tasks} fetchTasks={fetchTasks} />
        </div>
      </section>
    </AppLayout>
  );
}
