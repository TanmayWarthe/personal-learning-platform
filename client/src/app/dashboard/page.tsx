"use client";

import { useEffect, useState } from "react";

type Course = {
  id: string;
  title: string;
  // add more fields as needed
};

type ContinueLearning = {
  course_id: string;
  id: string;
  title: string;
  // add more fields as needed
};
import { useRouter } from "next/navigation";


export default function DashboardPage() {
  const [progress, setProgress] = useState(0);
  const [completedVideos, setCompletedVideos] = useState(0);
  const [totalVideos, setTotalVideos] = useState(0);
  const [badge, setBadge] = useState("Bronze");
  const [streak, setStreak] = useState(0);
  const [userName, setUserName] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [continueLearning, setContinueLearning] = useState<ContinueLearning | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      setError("");
      try {
        // Auth check and user name
        const userRes = await fetch("http://localhost:5000/users/me", { credentials: "include" });
        if (!userRes.ok) throw new Error("Unauthenticated");
        const userData = await userRes.json();
        setUserName(userData.name);

        // Dashboard summary (progress, badge, continueLearning)
        const dashRes = await fetch("http://localhost:5000/dashboard/summary", { credentials: "include" });
        const dashData = await dashRes.json();
        setProgress(dashData.progress?.percentage || 0);
        setCompletedVideos(dashData.progress?.completedVideos || 0);
        setTotalVideos(dashData.progress?.totalVideos || 0);
        setBadge(dashData.badge || "Bronze");
        setContinueLearning(dashData.continueLearning);

        // Learning streak
        const streakRes = await fetch("http://localhost:5000/progress/streak", { credentials: "include" });
        const streakData = await streakRes.json();
        setStreak(streakData.streak || 0);

        // Fetch all courses (for "Your Courses" section)
        const coursesRes = await fetch("http://localhost:5000/courses", { credentials: "include" });
        const coursesData = await coursesRes.json();
        setCourses(coursesData);
      } catch (err) {
        setError("Failed to load dashboard. Please login again.");
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </main>
    );
  }
  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-red-600">{error}</p>
        </div>
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-gray-50">
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
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">Completed</span>
                <span className="text-xs text-gray-700">{completedVideos} / {totalVideos} videos</span>
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
                {badge}
              </span>
              <p className="text-sm text-gray-500 mt-1">Current badge: {badge}</p>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              {/* Optionally, show progress to next level if backend provides */}
              <div className="w-2/3 bg-amber-500 h-full rounded-full" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Progress to next level</p>
          </div>
        </div>
        {/* Continue Learning Card */}
        <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg mb-8 overflow-hidden">
          <div className="p-8">
            {continueLearning && continueLearning.course_id ? (
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-2xl font-bold text-white mb-2">Continue Learning</h2>
                  <p className="text-blue-100 mb-4">Pick up where you left off</p>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 inline-block">
                    <h3 className="font-semibold text-white">{continueLearning.title}</h3>
                    <p className="text-blue-100 text-sm">Course ID: {continueLearning.course_id}</p>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/course/${continueLearning.course_id}/video/${continueLearning.id}`)}
                  className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded-lg shadow transition-colors duration-200"
                >
                  Resume Course
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center">
                <h2 className="text-2xl font-bold text-white mb-2">No Course to Continue</h2>
                <p className="text-blue-100 mb-4">You haven't started any course yet. Browse all courses to begin your learning journey!</p>
                <button
                  onClick={() => router.push("/courses")}
                  className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded-lg shadow transition-colors duration-200"
                >
                  Browse Courses
                </button>
              </div>
            )}
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
            {courses.map((course: Course) => (
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
                  {/* Optionally, fetch and show per-course progress here */}
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
        </div>
      </div>
    </main>
  );
}