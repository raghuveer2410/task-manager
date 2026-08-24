import express from 'express';
import mongoose from 'mongoose';
import Task from '../models/task.js';
import authMiddleware from '../Middleware/authMiddleware.js';

const router = express.Router();
const allowedStatuses = new Set(['todo', 'in-progress', 'done']);
const allowedPriorities = new Set(['low', 'medium', 'high']);

const validateTaskInput = ({ title, status, priority, dueDate }, { partial = false } = {}) => {
  if (!partial && (!title || !title.trim())) return 'Title is required';
  if (title !== undefined && !title.trim()) return 'Title cannot be empty';
  if (status !== undefined && !allowedStatuses.has(status)) return 'Invalid status';
  if (priority !== undefined && !allowedPriorities.has(priority)) return 'Invalid priority';
  if (dueDate !== undefined && dueDate !== null && Number.isNaN(Date.parse(dueDate))) {
    return 'Invalid due date';
  }
  return null;
};

router.get('/', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.json(tasks);
  } catch (err) {
    console.error('Fetch tasks error:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;
  const validationError = validateTaskInput({ title, status, priority, dueDate });
  if (validationError) return res.status(400).json({ message: validationError });

  try {
    const task = await Task.create({
      user: req.user.id,
      title: title.trim(),
      description: description?.trim(),
      status,
      priority,
      dueDate: dueDate || null,
      completedAt: status === 'done' ? new Date() : null
    });
    return res.status(201).json(task);
  } catch (err) {
    console.error('Create task error:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid task id' });
  }

  const editableFields = ['title', 'description', 'status', 'priority', 'dueDate'];
  const updates = {};
  for (const field of editableFields) {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) updates[field] = req.body[field];
  }

  if (updates.title !== undefined) updates.title = updates.title.trim();
  if (updates.description !== undefined) updates.description = updates.description?.trim();
  if (updates.dueDate === '') updates.dueDate = null;

  const validationError = validateTaskInput(updates, { partial: true });
  if (validationError) return res.status(400).json({ message: validationError });

  if (updates.status === 'done') updates.completedAt = new Date();
  if (updates.status && updates.status !== 'done') updates.completedAt = null;

  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    return res.json(task);
  } catch (err) {
    console.error('Update task error:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid task id' });
  }

  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    return res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error('Delete task error:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
