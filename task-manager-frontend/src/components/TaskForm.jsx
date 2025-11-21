import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import API from '../api/api';
import { Calendar, Flag, ClipboardList } from 'lucide-react';

export default function TaskForm({ fetchTasks, onAddTask }) {
  const [task, setTask] = useState({ title: '', description: '', priority: 'low', status: 'todo' });
  const [dueDate, setDueDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setTask({ ...task, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/tasks', { ...task, dueDate });
      const newTask = res.data;
      if (onAddTask) onAddTask(newTask); // Optimistic update
      if (fetchTasks) fetchTasks(); // ensure backend sync
      setTask({ title: '', description: '', priority: 'low', status: 'todo' });
      setDueDate(null);
    } catch (err) {
      console.error('Error creating task:', err);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex flex-col gap-4">
      {/* Title */}
      <label className="block">
        <span className="text-gray-700 font-medium">Task Title</span>
        <input name="title" value={task.title} onChange={handleChange} required className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Enter task title" />
      </label>

      {/* Description */}
      <label className="block">
        <span className="text-gray-700 font-medium">Description</span>
        <textarea name="description" value={task.description} onChange={handleChange} rows={3} className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Enter task details" />
      </label>

      {/* Row: Priority, Status, DueDate */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label className="block">
          <span className="text-gray-700 font-medium flex items-center gap-2"><Flag size={16} /> Priority</span>
          <select name="priority" value={task.priority} onChange={handleChange} className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition">
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </label>

        <label className="block">
          <span className="text-gray-700 font-medium flex items-center gap-2"><ClipboardList size={16} /> Status</span>
          <select name="status" value={task.status} onChange={handleChange} className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition">
            <option value="todo">To-Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </label>

        <label className="block">
          <span className="text-gray-700 font-medium flex items-center gap-2"><Calendar size={16} /> Due Date</span>
          <DatePicker selected={dueDate} onChange={setDueDate} className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" placeholderText="Select date" />
        </label>
      </div>

      {/* Submit button */}
      <button type="submit" disabled={loading} className={`w-full py-3 rounded-lg text-white font-semibold transition ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>{loading ? 'Adding...' : 'Add Task'}</button>
    </form>
  );
}




