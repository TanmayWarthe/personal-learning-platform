"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Toast, { type ToastType } from "@/components/Toast";

type Course = {
  id: number;
  title: string;
  description: string;
};

type Video = {
  id: number;
  title: string;
  position: number;
  completed?: boolean;
  unlocked?: boolean;
  youtube_video_id?: string;
};

type Module = {
  moduleId: number;
  title: string;
  order: number;
  videos: Video[];
};

export default function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Next.js 16 app router passes params as a Promise in client components – unwrap with React.use
  const { id: courseId } = use(params);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "content" | "qa" | "resources">("overview");
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [openModule, setOpenModule] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  // const [videoPageKey, setVideoPageKey] = useState(0); // for potential future re-mounts

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      setToast({ message: "Please login to view course details", type: "info" });
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    }
  }, [user, authLoading, router]);

  // Fetch course and videos (for progress and overview)
  async function refetchCourseData() {
    try {
      // Fetch course info
      const courseRes = await fetch(
        `http://localhost:5000/courses/${courseId}`
      );
      const courseData = await courseRes.json();
      setCourse(courseData);

      // Fetch modules with videos (with completed/unlocked from backend)
      const modulesRes = await fetch(
        `http://localhost:5000/courses/${courseId}/content`,
        { credentials: "include" }
      );
      const modulesData = await modulesRes.json();
      setModules(Array.isArray(modulesData) ? modulesData : []);

      // Flatten all videos for progress bar and quick nav
      const allVideos = (Array.isArray(modulesData)
        ? modulesData.flatMap((m) => m.videos)
        : []);
      setVideos(allVideos);

      // Fetch progress (completed/total/progress%)
      const progressRes = await fetch(
        `http://localhost:5000/courses/${courseId}/progress`,
        { credentials: "include" }
      );
      const progressData = await progressRes.json();
      setProgress(progressData.percentage || 0);
      setCompletedCount(progressData.completedVideos || 0);
      setTotalCount(progressData.totalVideos || allVideos.length);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Only fetch course data if user is authenticated
    if (!user || authLoading) return;
    refetchCourseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, user, authLoading]);

  // Removed localStorage logic. All progress and completion comes from backend only.

  // Show loading while checking authentication
  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Course not found</h3>
          <button
            onClick={() => router.push("/courses")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse All Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {/* If you want to always show VideoPage, render here: */}
      {/* <VideoPage params={params} onProgressUpdate={handleProgressUpdate} key={videoPageKey} /> */}
      {/* Header Card */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="mb-4">
            <span className="text-sm text-gray-500">Course</span>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">{course.title}</h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <p className="text-gray-600 mb-6">{course.description}</p>
              
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Course Progress</span>
                  <span className="text-sm font-semibold text-blue-600">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {completedCount} of {totalCount} lessons completed
                </p>
              </div>
            </div>
            
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => {
                  const firstUncompleted = videos.find(v => !v.completed && v.unlocked);
                  const firstVideo = videos[0];
                  if (firstUncompleted) {
                    router.push(`/course/${courseId}/video/${firstUncompleted.id}`);
                  } else if (firstVideo) {
                    router.push(`/course/${courseId}/video/${firstVideo.id}`);
                  }
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-sm transition-colors duration-200"
              >
                {progress === 100 ? "Review Course" : progress > 0 ? "Continue Learning" : "Start Learning"}
              </button>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Total Lessons</span>
                  <span className="font-semibold text-gray-900">{videos.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completion</span>
                  <span className="font-semibold text-green-600">{progress}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs Section */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "overview"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("content")}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "content"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Course Content
              </button>
              <button
                onClick={() => setActiveTab("qa")}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "qa"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Q&A
              </button>
              <button
                onClick={() => setActiveTab("resources")}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "resources"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Resources
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Course Overview</h3>
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-4">{course.description}</p>
              
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-start">
                  <div className="shrink-0">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-blue-800">Course Details</h4>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>• Total videos: {videos.length}</p>
                      <p>• Suitable for engineering students</p>
                      <p>• Focus on practical learning</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "content" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Learning Path</h3>
                  <p className="text-gray-600 text-sm mt-1">Follow the sequence to complete the course</p>
                </div>
                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  {progress}% Complete
                </div>
              </div>
            </div>
            <div className="p-6">
              {modules.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">Course content coming soon</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {modules.map((module) => (
                    <div key={module.moduleId} className="border border-gray-200 rounded-lg">
                      <button
                        className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 focus:outline-none"
                        onClick={() => setOpenModule(openModule === module.moduleId ? null : module.moduleId)}
                        aria-expanded={openModule === module.moduleId}
                      >
                        <span className="font-semibold text-gray-800 text-left">{module.title}</span>
                        <svg
                          className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${openModule === module.moduleId ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {openModule === module.moduleId && (
                        <div className="px-4 py-2 bg-white">
                          {module.videos.length === 0 ? (
                            <div className="text-gray-400 text-sm py-4">No videos in this module.</div>
                          ) : (
                            <ul>
                              {module.videos.map((video) => (
                                <li
                                  key={video.id}
                                  className={`flex items-center justify-between py-2 border-b last:border-b-0 ${!video.unlocked ? 'opacity-50' : ''}`}
                                >
                                  <div className="flex items-center space-x-3">
                                    <span className="text-xs font-mono text-gray-500">#{video.position}</span>
                                    <span className="text-gray-800">{video.title}</span>
                                    {video.completed && <span className="ml-2 text-green-600">✔</span>}
                                    {!video.unlocked && <span className="ml-2 text-gray-400">🔒</span>}
                                  </div>
                                  <a
                                    href={video.unlocked ? `/course/${courseId}/video/${video.id}` : undefined}
                                    onClick={e => { if (!video.unlocked) e.preventDefault(); }}
                                    className={`ml-4 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium transition-colors ${!video.unlocked ? 'pointer-events-none' : ''}`}
                                  >
                                    Play
                                  </a>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "qa" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Q&A Coming Soon</h3>
              <p className="text-gray-600">This feature is under development and will be available soon.</p>
            </div>
          </div>
        )}

        {activeTab === "resources" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Resources Coming Soon</h3>
              <p className="text-gray-600">Course resources and materials will be available here soon.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}