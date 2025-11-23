// src/layouts/AppLayout.jsx
export default function AppLayout({ title, onRefresh, children }) {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* NAVBAR */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Refresh
            </button>
          )}
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}