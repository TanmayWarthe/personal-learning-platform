"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const [video, setVideo] = useState<Video | null>(null);
  const [courseVideos, setCourseVideos] = useState<CourseVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  /* ================= FETCH VIDEOS & COMPLETED STATUS ================= */
  useEffect(() => {
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
  }, [id, videoId]);
  
  /* ================= MARK COMPLETE (DB) ================= */
  async function handleMarkCompleted() {
    if (!video) return;
    try {
      const res = await fetch(`http://localhost:5000/videos/${video.id}/complete`, {
        method: "POST",
        credentials: "include"
      });
      if (!res.ok) {
        alert("Failed to mark complete");
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
      if (next) {
        router.push(`/course/${id}/video/${next.id}`);
      } else {
        router.push(`/course/${id}`);
      }
    } catch (err) {
      alert("Network error");
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
  if (loading) return <p className="p-6">Loading...</p>;
  if (!video) return <p className="p-6">Video not found</p>;

  const nextVideo = courseVideos[currentVideoIndex + 1];
  const prevVideo = courseVideos[currentVideoIndex - 1];
  const isCompleted = courseVideos[currentVideoIndex]?.completed || false;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push(`/course/${id}`)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Course
            </button>
            <div className="text-sm text-gray-500">
              Lesson {video.position} of {courseVideos.length}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-8">
              {/* Current Lesson Info */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Current Lesson</h3>
                  <span className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {video.position} of {courseVideos.length}
                  </span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">{video.title}</h4>
                <p className="text-sm text-gray-600">
                  {isCompleted ? "✓ Completed" : "In Progress"}
                </p>
              </div>

              {/* Lesson Progress */}
              <div className="p-6 border-b border-gray-200">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Course Progress</span>
                    <span className="text-sm font-semibold text-blue-600">
                      {Math.round((courseVideos.filter(v => v.completed).length / courseVideos.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(courseVideos.filter(v => v.completed).length / courseVideos.length) * 100}%` 
                      }}
                    />
                  </div>
                </div>

                {/* Mark Complete Button */}
                <button
                  onClick={handleMarkCompleted}
                  disabled={isCompleted}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${
                    isCompleted
                      ? 'bg-green-100 text-green-700 cursor-default'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isCompleted ? (
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Lesson Completed
                    </div>
                  ) : (
                    'Mark as Complete'
                  )}
                </button>

                {/* Navigation Buttons */}
                <div className="flex space-x-3 mt-4">
                  <button
                    onClick={handlePrevVideo}
                    disabled={!prevVideo}
                    className={`flex-1 py-2 px-4 rounded-lg border font-medium transition-colors ${
                      prevVideo
                        ? 'border-blue-600 text-blue-600 hover:bg-blue-50'
                        : 'border-gray-300 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextVideo}
                    disabled={!nextVideo || !nextVideo.unlocked}
                    className={`flex-1 py-2 px-4 rounded-lg border font-medium transition-colors ${
                      nextVideo && nextVideo.unlocked
                        ? 'border-blue-600 text-blue-600 hover:bg-blue-50'
                        : 'border-gray-300 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>

              {/* Course Lessons List */}
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Course Lessons</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                  {courseVideos.map((lesson) => (
                    <a
                      key={lesson.id}
                      href={`/course/${id}/video/${lesson.id}`}
                      className={`block p-3 rounded-lg transition-colors ${
                        lesson.id === video.id
                          ? 'bg-blue-50 border border-blue-200'
                          : lesson.unlocked
                          ? 'hover:bg-gray-50'
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                      onClick={(e) => {
                        if (!lesson.unlocked) e.preventDefault();
                      }}
                    >
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          lesson.completed
                            ? 'bg-green-100 text-green-600'
                            : lesson.id === video.id
                            ? 'bg-blue-100 text-blue-600'
                            : lesson.unlocked
                            ? 'bg-gray-100 text-gray-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          {lesson.completed ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className="text-xs font-medium">{lesson.position}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            lesson.id === video.id ? 'text-blue-700' : 'text-gray-700'
                          }`}>
                            {lesson.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
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

          {/* Right Column - Video Player */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Video Title */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {video.position}. {video.title}
                  </h2>
                  <a
                    href={`https://www.youtube.com/watch?v=${video.youtube_video_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Open in YouTube
                  </a>
                </div>
                <p className="text-gray-600">Watch this lesson to continue your learning journey</p>
              </div>

              {/* Video Player */}
              <div className="aspect-video bg-black">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${video.youtube_video_id}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  frameBorder="0"
                />
              </div>

              {/* Quick Actions */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleMarkCompleted}
                      disabled={isCompleted}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        isCompleted
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {isCompleted ? '✓ Completed' : 'Mark Complete'}
                    </button>
                    {nextVideo && nextVideo.unlocked && (
                      <button
                        onClick={handleNextVideo}
                        className="px-6 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors"
                      >
                        Next Lesson →
                      </button>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {Math.round((courseVideos.filter(v => v.completed).length / courseVideos.length) * 100)}% of course completed
                  </div>
                </div>
              </div>
            </div>

            {/* YouTube Disclaimer */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-gray-400 mt-0.5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-600">
                    This video is embedded from YouTube. Make sure you have a stable internet connection for uninterrupted learning.
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