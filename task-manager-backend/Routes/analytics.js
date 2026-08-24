import express from 'express';
import Task from '../models/task.js';
import authMiddleware from '../Middleware/authMiddleware.js';
import { buildAnalyticsSummary } from '../services/analytics.js';

const router = express.Router();
const allowedRanges = new Set([7, 30, 90]);

router.get('/summary', authMiddleware, async (req, res) => {
  const requestedRange = Number(req.query.range || 30);
  if (!allowedRanges.has(requestedRange)) {
    return res.status(400).json({ message: 'Range must be 7, 30, or 90 days' });
  }

  try {
    const tasks = await Task.find({ user: req.user.id }).lean();
    return res.json(buildAnalyticsSummary(tasks, { rangeDays: requestedRange }));
  } catch (err) {
    console.error('Analytics summary error:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
