"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Toast, { type ToastType } from "@/components/Toast";
import { useAuth } from "@/context/AuthContext";

type Video = {
  id: number;
  title: string;
  position: number;
  youtube_video_id: string;
};

type CourseVideo = {
  id: number;
  title: string;
  position: number;
  completed?: boolean;
  unlocked?: boolean;
};

interface VideoPageProps {
  params: Promise<{ id: string; videoId: string }>;
  onProgressUpdate?: (progress: { percentage: number; completedVideos: number; totalVideos: number }) => void;
  onDashboardUpdate?: (dashboard: any) => void;
}

export default function VideoPage({ params, onProgressUpdate, onDashboardUpdate }: VideoPageProps) {
  const { id, videoId } = use(params);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [video, setVideo] = useState<Video | null>(null);
  const [courseVideos, setCourseVideos] = useState<CourseVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [authToast, setAuthToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [origin, setOrigin] = useState('');
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      setAuthToast({ message: "Please login to watch videos", type: "info" });
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    }
  }, [user, authLoading, router]);

  /* ================= FETCH VIDEOS & COMPLETED STATUS ================= */
  useEffect(() => {
    // Only fetch video data if user is authenticated
    if (!user || authLoading) return;

    async function fetchData() {
      try {
        // Fetch course content (with completed/unlocked from backend)
        const modulesRes = await fetch(`http://localhost:5000/courses/${id}/content`, { credentials: "include" });
        const modulesData = await modulesRes.json();
        const allVideos = Array.isArray(modulesData) ? modulesData.flatMap((m) => m.videos) : [];
        setCourseVideos(allVideos);

        const vid = Number(videoId);
        const current = allVideos.find((v) => Number(v.id) === vid);
        setVideo(current || null);
        const index = allVideos.findIndex((v) => Number(v.id) === vid);
        setCurrentVideoIndex(index);
      } catch (err) {
        console.error("Video fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, videoId, user, authLoading]);
  
  /* ================= MARK COMPLETE (DB) ================= */
  async function handleMarkCompleted() {
    if (!video) return;
    try {
      const res = await fetch(`http://localhost:5000/videos/${video.id}/complete`, {
        method: "POST",
        credentials: "include"
      });
      if (!res.ok) {
        setToast({ message: "Failed to mark lesson as complete.", type: "error" });
        return;
      }
      // Refetch course content to get updated unlock/completion status
      const modulesRes = await fetch(`http://localhost:5000/courses/${id}/content`, { credentials: "include" });
      const modulesData = await modulesRes.json();
      const allVideos = Array.isArray(modulesData) ? modulesData.flatMap((m) => m.videos) : [];

      // Update local state so UI immediately reflects completion
      setCourseVideos(allVideos);
      const vid = Number(videoId);
      const newIndex = allVideos.findIndex((v) => Number(v.id) === vid);
      if (newIndex >= 0) {
        setCurrentVideoIndex(newIndex);
      }
      // Show a quick success toast so the button feels responsive
      setToast({ message: "Lesson marked as completed!", type: "success" });

      // Optionally update parent (course/dashboard) progress if callbacks are provided
      try {
        const progressRes = await fetch(`http://localhost:5000/courses/${id}/progress`, { credentials: "include" });
        const progressData = await progressRes.json();
        onProgressUpdate?.(progressData);
      } catch {
        // ignore progress update errors in child UI
      }

      // Find the next video in sequence using updated list
      const next = allVideos[newIndex + 1];

      // Navigate a bit later so the user can see the toast and button state
      setTimeout(() => {
        if (next) {
          router.push(`/course/${id}/video/${next.id}`);
        } else {
          router.push(`/course/${id}`);
        }
      }, 1500);
    } catch (err) {
      setToast({ message: "Network error while updating lesson.", type: "error" });
    }
  }

  /* ================= NAVIGATION ================= */
  function handleNextVideo() {
    const next = courseVideos[currentVideoIndex + 1];
    if (next && next.unlocked) {
      router.push(`/course/${id}/video/${next.id}`);
    }
  }

  function handlePrevVideo() {
    const prev = courseVideos[currentVideoIndex - 1];
    if (prev) {
      router.push(`/course/${id}/video/${prev.id}`);
    }
  }

  /* ================= STATES ================= */
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
          <p className="text-gray-600">Loading video...</p>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Video not found</h3>
          <p className="text-gray-600 mb-4">The video you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => router.push(`/course/${id}`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  const nextVideo = courseVideos[currentVideoIndex + 1];
  const prevVideo = courseVideos[currentVideoIndex - 1];
  const isCompleted = courseVideos[currentVideoIndex]?.completed || false;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hide YouTube overlays */}
      <style jsx global>{`
        iframe[src*="youtube.com"] {
          pointer-events: auto;
        }
      `}</style>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {authToast && (
        <Toast
          message={authToast.message}
          type={authToast.type}
          onClose={() => setAuthToast(null)}
        />
      )}
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push(`/course/${id}`)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Course
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">Lesson {video.position}</span>
              <span className="text-gray-400">of</span>
              <span className="font-medium">{courseVideos.length}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className={`grid grid-cols-1 gap-8 transition-all duration-300 ${sidebarCollapsed ? 'lg:grid-cols-1' : 'lg:grid-cols-3'}`}>
          {/* Left Column - Sidebar */}
          {!sidebarCollapsed && (
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-24">
                {/* Current Lesson Info */}
                <div className="p-5 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Current Lesson</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                        {video.position}/{courseVideos.length}
                      </span>
                      <button
                        onClick={() => setSidebarCollapsed(true)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Collapse sidebar"
                      >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{video.title}</h4>
                <div className="flex items-center gap-2">
                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded-full">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      In Progress
                    </span>
                  )}
                </div>
              </div>

              {/* Lesson Progress */}
              <div className="p-5 border-b border-gray-200 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Course Progress</span>
                    <span className="text-sm font-bold text-blue-600">
                      {Math.round((courseVideos.filter(v => v.completed).length / courseVideos.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(courseVideos.filter(v => v.completed).length / courseVideos.length) * 100}%` 
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5">
                    {courseVideos.filter(v => v.completed).length} of {courseVideos.length} lessons completed
                  </p>
                </div>

                {/* Mark Complete Button */}
                <button
                  onClick={handleMarkCompleted}
                  disabled={isCompleted}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                    isCompleted
                      ? 'bg-green-100 text-green-700 cursor-default'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Lesson Completed
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Mark as Complete
                    </>
                  )}
                </button>

                {/* Navigation Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevVideo}
                    disabled={!prevVideo}
                    className={`flex-1 py-2.5 px-4 rounded-lg border font-medium transition-all duration-200 flex items-center justify-center gap-1.5 ${
                      prevVideo
                        ? 'border-blue-600 text-blue-600 hover:bg-blue-50 hover:shadow-sm'
                        : 'border-gray-300 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>
                  <button
                    onClick={handleNextVideo}
                    disabled={!nextVideo || !nextVideo.unlocked}
                    className={`flex-1 py-2.5 px-4 rounded-lg border font-medium transition-all duration-200 flex items-center justify-center gap-1.5 ${
                      nextVideo && nextVideo.unlocked
                        ? 'border-blue-600 text-blue-600 hover:bg-blue-50 hover:shadow-sm'
                        : 'border-gray-300 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Next
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Course Lessons List */}
              <div className="p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Course Lessons</h3>
                <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
                  {courseVideos.map((lesson) => (
                    <a
                      key={lesson.id}
                      href={`/course/${id}/video/${lesson.id}`}
                      className={`block p-2.5 rounded-lg transition-all duration-200 ${
                        lesson.id === video.id
                          ? 'bg-blue-50 border border-blue-200 shadow-sm'
                          : lesson.unlocked
                          ? 'hover:bg-gray-50 border border-transparent hover:border-gray-200'
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                      onClick={(e) => {
                        if (!lesson.unlocked) e.preventDefault();
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                          lesson.completed
                            ? 'bg-green-100 text-green-600'
                            : lesson.id === video.id
                            ? 'bg-blue-100 text-blue-600'
                            : lesson.unlocked
                            ? 'bg-gray-100 text-gray-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          {lesson.completed ? (
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <span className="text-xs font-semibold">{lesson.position}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium line-clamp-1 ${
                            lesson.id === video.id ? 'text-blue-700' : 'text-gray-700'
                          }`}>
                            {lesson.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {lesson.completed ? 'Completed' : lesson.unlocked ? 'Ready' : 'Locked'}
                          </p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Right Column - Video Player */}
          <div className={`${sidebarCollapsed ? 'lg:col-span-1' : 'lg:col-span-2'} order-1 lg:order-2`}>
            {/* Expand Sidebar Button - Show when collapsed */}
            {sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="mb-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-semibold">Show Course Lessons</span>
              </button>
            )}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Video Title */}
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-semibold">
                        Lesson {video.position}
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">
                        {courseVideos.length} total lessons
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {video.title}
                    </h2>
                    <p className="text-sm text-gray-600">Watch this lesson to continue your learning journey</p>
                  </div>
                  <a
                    href={`https://www.youtube.com/watch?v=${video.youtube_video_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 font-medium shrink-0 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Open in YouTube
                  </a>
                </div>
              </div>

              {/* Custom Video Player */}
              <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black">
                {/* Custom Player Container */}
                <div className="relative aspect-video bg-black group overflow-hidden">
                  {/* Thumbnail Background (fallback) */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-10 blur-2xl scale-110"
                    style={{
                      backgroundImage: `url(https://img.youtube.com/vi/${video.youtube_video_id}/maxresdefault.jpg)`
                    }}
                  />
                  
                  {/* Video Iframe with Custom Styling */}
                  <div className="relative w-full h-full flex items-center justify-center z-10">
                    <div className="w-full h-full relative">
                      <iframe
                        className="w-full h-full border-0"
                        src={`https://www.youtube-nocookie.com/embed/${video.youtube_video_id}?modestbranding=1&rel=0&showinfo=0&controls=1&iv_load_policy=3&cc_load_policy=0&fs=1&playsinline=1${origin ? `&origin=${origin}&widget_referrer=${origin}` : ''}`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  </div>
                  
                  {/* Custom Corner Accents */}
                  <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-blue-500/30 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-blue-500/30 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-blue-500/30 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-blue-500/30 rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  
                  {/* Custom Player Badge */}
                  <div className="absolute top-4 right-4 z-20">
                    <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-2 border border-white/20 shadow-lg">
                      <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs font-semibold text-white">VIDEO</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      onClick={handleMarkCompleted}
                      disabled={isCompleted}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-sm ${
                        isCompleted
                          ? 'bg-green-50 text-green-700 border border-green-200 cursor-default'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Lesson Completed
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Mark as Complete
                        </>
                      )}
                    </button>
                    {nextVideo && nextVideo.unlocked && (
                      <button
                        onClick={handleNextVideo}
                        className="px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
                      >
                        Next Lesson
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-sm font-semibold text-gray-700">
                      {Math.round((courseVideos.filter(v => v.completed).length / courseVideos.length) * 100)}% Complete
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* YouTube Disclaimer */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm text-blue-800 font-medium mb-0.5">Video hosted on YouTube</p>
                  <p className="text-xs text-blue-700">
                    This video is embedded from YouTube. Ensure you have a stable internet connection for uninterrupted learning.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}