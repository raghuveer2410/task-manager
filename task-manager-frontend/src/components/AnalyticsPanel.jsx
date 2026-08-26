const metricCards = [
  ['completionRate', 'Completion rate', '%'],
  ['overdue', 'Overdue', ''],
  ['onTimeRate', 'On-time rate', '%'],
  ['productivityScore', 'Productivity score', '/100']
];

const levelColor = {
  urgent: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700'
};

export default function AnalyticsPanel({ analytics, range, onRangeChange }) {
  if (!analytics) return null;
  const maxCompleted = Math.max(1, ...analytics.weeklyTrend.map((week) => week.completed));

  return (
    <section className="mb-8 space-y-6" aria-labelledby="analytics-title">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="analytics-title" className="text-xl font-semibold">Productivity analytics</h2>
          <p className="text-sm text-gray-500">Explainable metrics calculated from your task history.</p>
        </div>
        <select
          value={range}
          onChange={(event) => onRangeChange(Number(event.target.value))}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          aria-label="Analytics date range"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metricCards.map(([key, label, suffix]) => (
          <div key={key} className="rounded-2xl bg-white p-4 shadow">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {analytics.summary[key]}{suffix}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow">
          <h3 className="font-semibold">Weekly completions</h3>
          <div className="mt-6 flex h-44 items-end gap-3">
            {analytics.weeklyTrend.map((week) => (
              <div key={week.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="text-xs font-medium">{week.completed}</span>
                <div
                  className="w-full rounded-t bg-indigo-500"
                  style={{ height: `${Math.max(4, (week.completed / maxCompleted) * 120)}px` }}
                  title={`${week.completed} completed`}
                />
                <span className="text-center text-xs text-gray-500">{week.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h3 className="font-semibold">Smart priority queue</h3>
          <p className="mt-1 text-xs text-gray-500">Rule-based score using urgency, due date, status, and task age.</p>
          <div className="mt-4 space-y-3">
            {analytics.smartPriorities.length === 0 && (
              <p className="text-sm text-gray-500">No pending tasks to rank.</p>
            )}
            {analytics.smartPriorities.map((task) => (
              <div key={task.id} className="rounded-xl border border-gray-100 p-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium">{task.title}</p>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${levelColor[task.level]}`}>
                    {task.score}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">{task.reasons.join(' · ')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
