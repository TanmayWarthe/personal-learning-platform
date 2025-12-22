
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-white dark:from-zinc-900 dark:to-zinc-800 py-12 px-4">
      <section className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-10 border border-gray-100 dark:border-zinc-800 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 text-center tracking-tight">Welcome to Personal Learning Platform</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-8">Your journey to mastering new skills starts here. Explore courses, track your progress, and achieve your goals!</p>
        <a href="/login" className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-colors">Get Started</a>
      </section>
    </main>
  );
}
