"use client";

import { useEffect , useState } from "react";

export default function DashboardPage() {

  const [progress, setProgress] = useState(0);
  const [badge, setBadge] = useState("Bronze 🟤");
  const [streak, setStreak] = useState(0);

  useEffect(()=>{
    const data = localStorage.getItem("learningStreak")
    if(data){
      setStreak(JSON.parse(data).streak)
    }
  })


  useEffect(() => {
    const data = localStorage.getItem("courseProgress");
    if (data) {
      const parsed = JSON.parse(data);
      setProgress(parsed.progress);
      setBadge(parsed.badge);
    }
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex flex-col items-center py-10 px-2">
      <section className="w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 dark:border-zinc-800">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 text-center tracking-tight">Welcome back 👋</h1>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Profile Section */}
          <div className="flex flex-col items-center md:items-start gap-4 w-full md:w-1/3">
            <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center text-3xl font-bold text-gray-500 dark:text-gray-200">T</div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tanmay</h2>
              <p className="text-gray-500 dark:text-gray-300">Aspiring Software Developer</p>
            </div>
            <section className="w-full bg-blue-50 dark:bg-zinc-800 rounded-lg p-4 mt-2">
              <h3 className="font-semibold mb-1 text-blue-700 dark:text-blue-300">Your Progress</h3>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Progress</span>
                <span className="font-semibold text-blue-700 dark:text-blue-300">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-zinc-700 h-2 rounded-full mt-2">
                <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-600 dark:text-gray-300">Badge</span>
                <span className="font-semibold text-blue-700 dark:text-blue-300">{badge}</span>
              </div>
              <p className="mt-2 font-medium text-orange-600">🔥 Learning Streak: {streak} day{streak !== 1 ? "s" : ""}</p>
            </section>
          </div>
          {/* Courses Section */}
          <div className="w-full md:w-2/3">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Your Courses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Course Card */}
              <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow p-5 flex flex-col gap-2">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">DSA with Love Babbar</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Progress: 40%</p>
                <button className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-colors">Continue</button>
              </div>
              {/* Course Card */}
              <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow p-5 flex flex-col gap-2">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Web Development</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Progress: 20%</p>
                <button className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-colors">Continue</button>
              </div>
            </div>
            {/* Overall Progress Section */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Overall Progress</h2>
              <div className="w-full bg-gray-200 dark:bg-zinc-700 h-3 rounded-full">
                <div className="bg-blue-600 h-3 rounded-full transition-all duration-300" style={{ width: `60%` }} />
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">60% completed</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

