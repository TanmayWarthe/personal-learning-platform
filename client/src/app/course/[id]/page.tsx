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
      const safeModules = Array.isArray(modulesData) ? modulesData : [];
      setModules(safeModules);
      if (safeModules.length > 0 && openModule === null) {
        setOpenModule(safeModules[0].moduleId);
      }

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

      {/* Header + key info */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="mb-4">
            <span className="text-sm text-gray-500">Course</span>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">{course.title}</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <p className="text-gray-600 mb-6">{course.description}</p>

              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Course progress</span>
                  <span className="text-sm font-semibold text-blue-600">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progress, 100)}%` }}
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
                  const firstUncompleted = videos.find((v) => !v.completed && v.unlocked);
                  const firstVideo = videos[0];
                  if (firstUncompleted) {
                    router.push(`/course/${courseId}/video/${firstUncompleted.id}`);
                  } else if (firstVideo) {
                    router.push(`/course/${courseId}/video/${firstVideo.id}`);
                  }
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-sm transition-colors duration-200"
              >
                {progress === 100 ? "Review course" : progress > 0 ? "Continue learning" : "Start learning"}
              </button>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Total lessons</span>
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
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Overview + quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">What you’ll learn</h3>
            <p className="text-gray-600">
              This course is built from the playlist you imported. Work through each lesson in order—your progress is
              saved in the database so you can return any time.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">At a glance</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                Lessons: <span className="font-semibold text-gray-900">{videos.length}</span>
              </li>
              <li>
                Completed: <span className="font-semibold text-gray-900">{completedCount}</span>
              </li>
              <li>Unlocks & completion come directly from your backend.</li>
            </ul>
          </div>
        </div>

        {/* Course content */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Course content</h3>
              <p className="text-gray-600 text-sm mt-1">
                Follow the modules in order. Completed lessons unlock the next ones automatically.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-3 text-xs text-gray-500">
              <span>
                {modules.length} module{modules.length !== 1 ? "s" : ""}
              </span>
              <span>•</span>
              <span>
                {videos.length} lesson{videos.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
          <div className="p-6">
            {modules.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">No content found for this course yet.</p>
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
                      <span className="font-semibold text-gray-800 text-left">
                        {module.order}. {module.title}
                      </span>
                      <svg
                        className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                          openModule === module.moduleId ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openModule === module.moduleId && (
                      <div className="px-4 py-3 bg-white">
                        {module.videos.length === 0 ? (
                          <div className="text-gray-400 text-sm py-4">No videos in this module.</div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {module.videos.map((video) => {
                              const isLocked = !video.unlocked;
                              const isCompleted = !!video.completed;
                              const thumbId = (video as any).youtube_video_id as string | undefined;
                              const thumbnailUrl = thumbId
                                ? `https://img.youtube.com/vi/${thumbId}/hqdefault.jpg`
                                : undefined;
                              return (
                                <div
                                  key={video.id}
                                  className={`rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm ${
                                    isLocked ? "opacity-60" : ""
                                  }`}
                                >
                                  <div className="aspect-video bg-gray-100">
                                    {thumbnailUrl ? (
                                      <img
                                        src={thumbnailUrl}
                                        alt={video.title}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                        No thumbnail
                                      </div>
                                    )}
                                  </div>
                                  <div className="p-3 space-y-2">
                                    <div className="flex items-start justify-between gap-2">
                                      <div>
                                        <p className="text-xs text-gray-500">Lesson #{video.position}</p>
                                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                          {video.title}
                                        </p>
                                      </div>
                                      <span
                                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                                          isCompleted
                                            ? "bg-green-100 text-green-700"
                                            : isLocked
                                            ? "bg-gray-100 text-gray-500"
                                            : "bg-blue-100 text-blue-700"
                                        }`}
                                      >
                                        {isCompleted ? "Completed" : isLocked ? "Locked" : "Unlocked"}
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      disabled={isLocked}
                                      onClick={() => {
                                        if (!isLocked) {
                                          router.push(`/course/${courseId}/video/${video.id}`);
                                        }
                                      }}
                                      className={`w-full mt-1 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                                        isLocked
                                          ? "border-gray-300 text-gray-400 cursor-not-allowed"
                                          : "border-blue-600 text-blue-600 hover:bg-blue-50"
                                      }`}
                                    >
                                      {isLocked ? "Locked" : "Play"}
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}