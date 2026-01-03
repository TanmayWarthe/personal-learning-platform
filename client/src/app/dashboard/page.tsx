"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Toast, { type ToastType } from "@/components/Toast";
import { apiFetch } from "@/lib/api";

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


export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
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
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Redirect to login if not authenticated (only after auth check is complete)
  useEffect(() => {
    if (!authLoading && !user) {
      setToast({ message: "Please login to access dashboard", type: "info" });
      setTimeout(() => {
        router.push("/login");
      }, 1500);
      return;
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    // Only fetch dashboard data if user is authenticated
    if (!user || authLoading) return;

    async function fetchDashboard() {
      setLoading(true);
      setError("");
      try {
        // Set user name from auth context
        setUserName(user?.name || "");

        // Dashboard summary (progress, badge, continueLearning)
        const dashRes = await apiFetch("/dashboard/summary");
        if (!dashRes.ok) throw new Error("Failed to fetch dashboard");
        const dashData = await dashRes.json();
        setProgress(dashData.progress?.percentage || 0);
        setCompletedVideos(dashData.progress?.completedVideos || 0);
        setTotalVideos(dashData.progress?.totalVideos || 0);
        setBadge(dashData.badge || "Bronze");
        setContinueLearning(dashData.continueLearning);

        // Learning streak
        const streakRes = await apiFetch("/progress/streak");
        if (streakRes.ok) {
          const streakData = await streakRes.json();
          setStreak(streakData.streak || 0);
        }

        // Fetch all courses (for "Your Courses" section)
        const coursesRes = await apiFetch("/courses");
        if (coursesRes.ok) {
          const coursesData = await coursesRes.json();
          setCourses(coursesData);
        }
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, [user, authLoading]);

  // Show loading while checking authentication
  if (authLoading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  // Show loading while fetching dashboard data
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

  // Show error if data failed to load (but user is authenticated)
  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }
  const now = new Date();
  const formattedTime = new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(now);
  const formattedDate = new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);

  return (
    <main className="min-h-screen bg-gray-50">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-full mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex flex-col gap-6 p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-blue-600 font-semibold">Dashboard</p>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">Welcome back, {userName || "Learner"}!</h1>
                <p className="text-sm text-gray-500 mt-2">
                  {formattedTime} • {formattedDate}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                  {userName ? userName.charAt(0).toUpperCase() : "U"}
                </div>
              </div>
            </div>

            {/* Simple stats row (dynamic) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md">
                <p className="text-sm text-gray-500">Overall Progress</p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-2xl font-semibold text-gray-900">{progress}%</p>
                  <span className="text-xs font-semibold text-blue-600">{totalVideos ? `${completedVideos}/${totalVideos}` : `${completedVideos} done`}</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-blue-500 transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md">
                <p className="text-sm text-gray-500">Learning Streak</p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-2xl font-semibold text-gray-900">{streak} day{streak !== 1 ? "s" : ""}</p>
                  <span className="text-xs font-semibold text-gray-500">Keep going</span>
                </div>
                <div className="mt-3 flex gap-1">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className={`flex-1 h-2 rounded-full ${i < streak ? "bg-blue-500" : "bg-gray-200"}`} />
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-sm text-gray-500">Badge</p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-2xl font-semibold text-gray-900">{badge}</p>
                  <span className="text-xl">{badge.includes("Bronze") ? "🥉" : badge.includes("Silver") ? "🥈" : "🥇"}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">Based on your recent learning.</p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md">
                <p className="text-sm text-gray-500">Your Courses</p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-2xl font-semibold text-gray-900">{courses.length}</p>
                  <span className="text-xs font-semibold text-gray-500">active</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {courses.length > 0 ? "Pick any course to continue learning." : "You haven't started a course yet."}
                </p>
              </div>
            </div>

            {/* Continue Learning */}
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-6 transition-shadow hover:shadow-md">
              {continueLearning && continueLearning.course_id ? (
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-blue-700/80">Continue Learning</p>
                    <h2 className="text-xl font-semibold mt-1 text-gray-900">{continueLearning.title}</h2>
                    <p className="text-blue-700/80 text-sm mt-1">Course ID: {continueLearning.course_id}</p>
                  </div>
                  <button
                    onClick={() => router.push(`/course/${continueLearning.course_id}/video/${continueLearning.id}`)}
                    className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                  >
                    Resume Course
                  </button>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-blue-700/80">No Course to Continue</p>
                    <h2 className="text-xl font-semibold mt-1 text-gray-900">Browse all courses to start</h2>
                    <p className="text-blue-700/80 text-sm mt-1">Pick a playlist and keep your streak alive.</p>
                  </div>
                  <button
                    onClick={() => router.push("/courses")}
                    className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                  >
                    Browse Courses
                  </button>
                </div>
              )}
            </div>

            {/* Courses list */}
            <div className="rounded-xl bg-white border border-gray-200 p-6 transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Your Courses</h2>
                <button 
                  onClick={() => router.push("/courses")}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  View all →
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.map((course: Course) => (
                  <div key={course.id} className="rounded-xl border border-gray-200 hover:border-blue-200 bg-white p-4 transition shadow-sm hover:shadow-md">
                    <div className="flex items-start justify-between">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 font-semibold flex items-center justify-center">
                        {course.title.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs text-gray-400">Course</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mt-3 mb-2 line-clamp-2">{course.title}</h3>
                    <p className="text-xs text-gray-500">Progress saves automatically as you watch.</p>
                    <button
                      onClick={() => router.push(`/course/${course.id}`)}
                      className="w-full mt-3 py-2.5 text-center bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
                    >
                      Continue Learning
                    </button>
                  </div>
                ))}
                {courses.length === 0 && (
                  <div className="col-span-full text-center text-gray-500 py-6">
                    No courses yet. Start by browsing all courses.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}