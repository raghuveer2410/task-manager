import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from './api/api';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Login from './Pages/Login';
import Register from './Pages/register';
import AppLayout from './layouts/AppLayout';

function Dashboard({ fetchTasks, tasks }) {
  return (
    <div className="min-h-screen bg-gray-100 px-4">
      {/* HEADER */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto py-4 px-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">
            📝 Task Management Dashboard
          </h1>
          <button
            onClick={fetchTasks}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Refresh
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto mt-8">
        <div className="bg-white shadow-lg rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Add a New Task
          </h2>
          <TaskForm fetchTasks={fetchTasks} />
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Your Tasks
          </h2>
          <TaskList tasks={tasks} />
        </div>
      </main>
    </div>
  );
}

function App() {
  const [tasks, setTasks] = useState([]);

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks');
      let tasks = res.data.tasks || res.data;
      tasks = tasks.map(t => ({ ...t, _id: t._id || t.id }));
      setTasks(tasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Replace with proper auth logic
  const isLoggedIn = true; // change to real auth check

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <AppLayout>
                <Dashboard fetchTasks={fetchTasks} tasks={tasks} />
              </AppLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* default route */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
