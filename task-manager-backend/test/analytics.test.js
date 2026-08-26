import test from 'node:test';
import assert from 'node:assert/strict';
import { buildAnalyticsSummary, scoreTaskPriority } from '../services/analytics.js';

const now = new Date('2026-08-24T12:00:00.000Z');

test('overdue high-priority tasks receive an urgent explainable score', () => {
  const result = scoreTaskPriority({
    status: 'todo',
    priority: 'high',
    dueDate: '2026-08-22T12:00:00.000Z',
    createdAt: '2026-08-01T12:00:00.000Z'
  }, now);

  assert.equal(result.level, 'urgent');
  assert.ok(result.score >= 75);
  assert.ok(result.reasons.some((reason) => reason.includes('overdue')));
});

test('analytics summary calculates portfolio KPIs and ranks open tasks', () => {
  const tasks = [
    {
      _id: '1', title: 'Finished', status: 'done', priority: 'medium',
      dueDate: '2026-08-20T12:00:00.000Z',
      completedAt: '2026-08-19T12:00:00.000Z',
      createdAt: '2026-08-10T12:00:00.000Z'
    },
    {
      _id: '2', title: 'Overdue', status: 'todo', priority: 'high',
      dueDate: '2026-08-23T12:00:00.000Z',
      createdAt: '2026-08-01T12:00:00.000Z'
    },
    {
      _id: '3', title: 'Later', status: 'todo', priority: 'low',
      dueDate: '2026-09-10T12:00:00.000Z',
      createdAt: '2026-08-20T12:00:00.000Z'
    }
  ];

  const result = buildAnalyticsSummary(tasks, { now, rangeDays: 30 });

  assert.deepEqual(result.summary, {
    total: 3,
    completed: 1,
    pending: 2,
    overdue: 1,
    completionRate: 33.3,
    onTimeRate: 100,
    productivityScore: 52.5
  });
  assert.equal(result.smartPriorities[0].title, 'Overdue');
  assert.equal(result.weeklyTrend.reduce((sum, week) => sum + week.completed, 0), 1);
});
