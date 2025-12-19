"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [progress, setProgress] = useState(0);
  const [badge, setBadge] = useState("Bronze 🟤");
  const [streak, setStreak] = useState(0);
  const [userName, setUserName] = useState("Tanmay");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const data = localStorage.getItem("learningStreak");
    if (data) {
      setStreak(JSON.parse(data).streak);
    }
  });

  useEffect(() => {
    const data = localStorage.getItem("courseProgress");
    if (data) {
      const parsed = JSON.parse(data);
      setProgress(parsed.progress);
      setBadge(parsed.badge);
    }
  }, []);

  // Courses data from original code
  const courses = [
    { id: 1, title: "DSA with Love Babbar", progress: 40 },
    { id: 2, title: "Web Development", progress: 20 },
  ];

  return (
    <main className="min-h-screen bg-gray-50">


      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, <span className="text-blue-600">{userName}!</span>
          </h1>
          <p className="text-gray-600 mt-2">Continue your journey to mastering programming & DSA</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Progress Summary Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Learning Progress</h3>
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Overall Progress</span>
                <span className="text-lg font-bold text-blue-600">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <p className="text-sm text-gray-500">Keep learning to increase your progress</p>
          </div>

          {/* Learning Streak Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Learning Streak</h3>
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                <span className="text-xl">🔥</span>
              </div>
            </div>
            <div className="flex items-end space-x-2 mb-3">
              <span className="text-4xl font-bold text-gray-900">{streak}</span>
              <span className="text-gray-600 mb-1">day{streak !== 1 ? "s" : ""}</span>
            </div>
            <p className="text-sm text-gray-500">🔥 Learning Streak: {streak} day{streak !== 1 ? "s" : ""}</p>
            <div className="mt-4 flex space-x-1">
              {Array.from({ length: 7 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`flex-1 h-2 rounded ${i < streak ? 'bg-orange-500' : 'bg-gray-200'}`}
                />
              ))}
            </div>
          </div>

          {/* Badge / Level Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Current Level</h3>
              <div className={`w-10 h-10 rounded-lg ${
                badge.includes("Bronze") ? "bg-amber-800" : 
                badge.includes("Silver") ? "bg-gray-400" : 
                "bg-yellow-500"
              } flex items-center justify-center`}>
                <span className="text-xl text-white">
                  {badge.includes("Bronze") ? "🥉" : 
                   badge.includes("Silver") ? "🥈" : "🥇"}
                </span>
              </div>
            </div>
            <div className="mb-3">
              <span className="text-2xl font-bold text-gray-900">
                {badge.includes("Bronze") ? "Bronze" : 
                 badge.includes("Silver") ? "Silver" : "Gold"} Level
              </span>
              <p className="text-sm text-gray-500 mt-1">Current badge: {badge}</p>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div className="w-2/3 bg-amber-500 h-full rounded-full" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Progress to next level</p>
          </div>
        </div>

        {/* Continue Learning Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg mb-8 overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-2xl font-bold text-white mb-2">Continue Learning</h2>
                <p className="text-blue-100 mb-4">Pick up where you left off</p>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 inline-block">
                  <h3 className="font-semibold text-white">{courses[0]?.title || "Your Course"}</h3>
                  <p className="text-blue-100 text-sm">Progress: {courses[0]?.progress || 0}%</p>
                </div>
              </div>
              <button
                onClick={() => router.push(`/course/${courses[0]?.id || 1}`)}
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded-lg shadow transition-colors duration-200"
              >
                Resume Course
              </button>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-100 text-sm">Progress</span>
                <span className="text-white font-semibold">{courses[0]?.progress || 0}%</span>
              </div>
              <div className="w-full bg-white/30 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-white h-full rounded-full transition-all duration-500"
                  style={{ width: `${courses[0]?.progress || 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recently Accessed Courses Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Courses</h2>
            <button 
              onClick={() => router.push("/courses")}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              View all →
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="border border-gray-200 hover:border-blue-300 rounded-lg p-5 transition-colors duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-blue-600">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <button
                    onClick={() => router.push(`/course/${course.id}`)}
                    className="w-full mt-4 py-2.5 text-center bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    Continue Learning
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Overall Progress Section (from original code) */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold mb-2 text-gray-900">Overall Progress</h2>
            <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `60%` }}
              />
            </div>
            <p className="mt-2 text-sm text-gray-600">60% completed</p>
          </div>
        </div>

        {/* Logout Button (from original code) */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg shadow transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </main>
  );
}