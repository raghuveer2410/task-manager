const DAY_MS = 24 * 60 * 60 * 1000;

const round = (value) => Math.round(value * 10) / 10;

export const scoreTaskPriority = (task, now = new Date()) => {
  if (task.status === 'done') {
    return { score: 0, level: 'completed', reasons: ['Task is already completed'] };
  }

  let score = { high: 35, medium: 20, low: 10 }[task.priority] ?? 20;
  const reasons = [`${task.priority || 'medium'} declared priority`];

  if (task.status === 'in-progress') {
    score += 15;
    reasons.push('Already in progress');
  }

  if (task.dueDate) {
    const daysUntilDue = Math.ceil((new Date(task.dueDate) - now) / DAY_MS);
    if (daysUntilDue < 0) {
      score += 40;
      reasons.push(`${Math.abs(daysUntilDue)} day(s) overdue`);
    } else if (daysUntilDue <= 1) {
      score += 30;
      reasons.push('Due within 24 hours');
    } else if (daysUntilDue <= 3) {
      score += 20;
      reasons.push('Due within 3 days');
    } else if (daysUntilDue <= 7) {
      score += 10;
      reasons.push('Due within 7 days');
    }
  }

  if (task.createdAt) {
    const ageInDays = Math.max(0, Math.floor((now - new Date(task.createdAt)) / DAY_MS));
    const ageBoost = Math.min(10, Math.floor(ageInDays / 7) * 2);
    if (ageBoost > 0) {
      score += ageBoost;
      reasons.push(`${ageInDays} day(s) old`);
    }
  }

  score = Math.min(100, score);
  const level = score >= 70 ? 'urgent' : score >= 45 ? 'high' : score >= 25 ? 'medium' : 'low';
  return { score, level, reasons };
};

export const buildAnalyticsSummary = (tasks, { now = new Date(), rangeDays = 30 } = {}) => {
  const openTasks = tasks.filter((task) => task.status !== 'done');
  const completedTasks = tasks.filter((task) => task.status === 'done');
  const overdueTasks = openTasks.filter(
    (task) => task.dueDate && new Date(task.dueDate) < now
  );
  const completedOnTime = completedTasks.filter(
    (task) => !task.dueDate || (task.completedAt && new Date(task.completedAt) <= new Date(task.dueDate))
  );

  const completionRate = tasks.length ? (completedTasks.length / tasks.length) * 100 : 0;
  const onTimeRate = completedTasks.length
    ? (completedOnTime.length / completedTasks.length) * 100
    : 0;
  const overdueRate = openTasks.length ? (overdueTasks.length / openTasks.length) * 100 : 0;
  const productivityScore = tasks.length
    ? round(completionRate * 0.6 + onTimeRate * 0.25 + (100 - overdueRate) * 0.15)
    : 0;

  const statusBreakdown = ['todo', 'in-progress', 'done'].map((status) => ({
    status,
    count: tasks.filter((task) => task.status === status).length
  }));
  const priorityBreakdown = ['low', 'medium', 'high'].map((priority) => ({
    priority,
    count: tasks.filter((task) => task.priority === priority).length
  }));

  const rangeStart = new Date(now.getTime() - (rangeDays - 1) * DAY_MS);
  rangeStart.setHours(0, 0, 0, 0);
  const weeklyTrend = [];
  for (let offset = 5; offset >= 0; offset -= 1) {
    const end = new Date(now.getTime() - offset * 7 * DAY_MS);
    const start = new Date(end.getTime() - 6 * DAY_MS);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    weeklyTrend.push({
      label: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      completed: completedTasks.filter((task) => {
        if (!task.completedAt) return false;
        const date = new Date(task.completedAt);
        return date >= start && date <= end && date >= rangeStart;
      }).length
    });
  }

  const smartPriorities = openTasks
    .map((task) => ({
      id: task._id?.toString?.() || task.id,
      title: task.title,
      dueDate: task.dueDate || null,
      ...scoreTaskPriority(task, now)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return {
    rangeDays,
    generatedAt: now.toISOString(),
    summary: {
      total: tasks.length,
      completed: completedTasks.length,
      pending: openTasks.length,
      overdue: overdueTasks.length,
      completionRate: round(completionRate),
      onTimeRate: round(onTimeRate),
      productivityScore
    },
    statusBreakdown,
    priorityBreakdown,
    weeklyTrend,
    smartPriorities
  };
};
