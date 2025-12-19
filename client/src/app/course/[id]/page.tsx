"use client";

import { use } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
};

export default function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: courseId } = use(params);
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "content" | "qa" | "resources">("overview");
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    }
  }, [router]);

  /* ================= FETCH COURSE + VIDEOS ================= */
  useEffect(() => {
    async function fetchData() {
      try {
        const courseRes = await fetch(
          `http://localhost:5000/courses/${courseId}`
        );
        const courseData = await courseRes.json();
        setCourse(courseData);

        const videosRes = await fetch(
          `http://localhost:5000/courses/${courseId}/videos`
        );
        const videosData = await videosRes.json();

        // 🔒 HARD SAFETY
        if (Array.isArray(videosData)) {
          setVideos(videosData);
        } else {
          setVideos([]);
        }
      } catch (err) {
        console.error("Fetch failed", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [courseId]);

  useEffect(() => {
    const stored = localStorage.getItem("completedVideoIds");
    if (!stored) return;

    const completedIds: number[] = JSON.parse(stored);

    setVideos((prev) =>
      prev.map((video, index) => {
        // If video completed → unlocked
        if (completedIds.includes(video.id)) {
          return { ...video, completed: true, unlocked: true };
        }

        // Unlock next video if previous is completed
        const prevVideo = prev[index - 1];
        if (prevVideo && completedIds.includes(prevVideo.id)) {
          return { ...video, unlocked: true };
        }

        return video;
      })
    );

    // Calculate progress
    if (videos.length > 0) {
      const completedCount = completedIds.length;
      const progressPercent = Math.round((completedCount / videos.length) * 100);
      setProgress(progressPercent);
    }
  }, [videos.length]);

  /* ================= LOADING ================= */
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
                  {Math.round((progress / 100) * videos.length)} of {videos.length} lessons completed
                </p>
              </div>
            </div>
            
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => {
                  // Find first uncompleted video or last completed
                  const firstUncompleted = videos.find(v => !v.completed && v.unlocked !== false);
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
                  <div className="flex-shrink-0">
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
      {videos.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-500">Course content coming soon</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          {videos.map((video, index) => (
            <div key={video.id} className="relative flex items-start mb-8 last:mb-0">
              {/* Timeline dot */}
              <div className={`absolute left-5 w-3 h-3 rounded-full border-2 border-white z-10 ${
                video.completed 
                  ? 'bg-green-500' 
                  : video.unlocked
                  ? 'bg-blue-500'
                  : 'bg-gray-300'
              }`}></div>
              
              <div className="ml-10 flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        Lesson {video.position}
                      </span>
                      {video.completed && (
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                          Completed
                        </span>
                      )}
                    </div>
                    <h4 className={`font-medium ${
                      video.unlocked === false ? 'text-gray-400' : 'text-gray-900'
                    }`}>
                      {video.title}
                    </h4>
                  </div>
                  
                  <a
                    href={`/course/${courseId}/video/${video.id}`}
                    onClick={(e) => {
                      if (video.unlocked === false) e.preventDefault();
                    }}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      video.unlocked === false
                        ? 'text-gray-400 cursor-not-allowed'
                        : video.completed
                        ? 'text-green-700 bg-green-50 hover:bg-green-100'
                        : 'text-blue-700 bg-blue-50 hover:bg-blue-100'
                    }`}
                  >
                    {video.completed ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Replay</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        </svg>
                        <span>{video.unlocked ? 'Start' : 'Locked'}</span>
                      </>
                    )}
                  </a>
                </div>
                
                {/* Progress connector for all except last */}
                {index < videos.length - 1 && (
                  <div className={`mt-6 h-6 w-0.5 ${
                    video.completed ? 'bg-green-200' : 'bg-gray-100'
                  }`}></div>
                )}
              </div>
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