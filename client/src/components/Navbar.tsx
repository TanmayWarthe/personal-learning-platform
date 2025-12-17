"use client";

export default function Navbar({ toggleTheme, theme }: { toggleTheme?: () => void; theme?: string | null }) {
  return (
    <nav className="w-full px-6 py-4 border-b border-amber-300 flex justify-between items-center bg-white dark:bg-zinc-900 dark:border-zinc-700">
      <h1 className="font-bold dark:text-white">Learning Platform</h1>

      <div className="flex items-center space-x-4">
        <a href="/login" className="dark:text-gray-200">Login</a>
        <a href="/dashboard" className="dark:text-gray-200">Dashboard</a>
        <a href="/course/1" className="dark:text-gray-200">Courses</a>
        {toggleTheme && (
          <button
            onClick={toggleTheme}
            className="ml-4 px-3 py-1 rounded bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-700 transition"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>
        )}
      </div>
    </nav>
  );
}
