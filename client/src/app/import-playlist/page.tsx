"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Toast, { ToastType } from "@/components/Toast";
import { useAuth } from "@/context/AuthContext";

export default function CreateCoursePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [createdCourseId, setCreatedCourseId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      setToast({ message: "Please login to import playlists", type: "info" });
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    }
  }, [user, authLoading, router]);

  const resetForm = () => {
    setPlaylistUrl("");
    setCourseTitle("");
    setDescription("");
    setError("");
    setSuccessMessage("");
    setCreatedCourseId(null);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setToast(null);
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/courses/import-playlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: courseTitle,
          description,
          playlistUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create course from playlist");
      }

      setCreatedCourseId(data.courseId);
      const msg = data.message || "Course created successfully from playlist!";
      setSuccessMessage(msg);
      setToast({ message: msg, type: "success" });
    } catch (err: any) {
      const msg = err.message || "Something went wrong while importing playlist.";
      setError(msg);
      setToast({ message: msg, type: "error" });
    } finally {
      setIsLoading(false);
    }
  }

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

  return (
    <main className="min-h-screen bg-gray-50">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Create Course from YouTube Playlist
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Paste your personal YouTube playlist and we’ll turn it into a structured course
            you can track and learn from inside your dashboard.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
          {successMessage ? (
            <div className="text-center space-y-4">
              <div className="mx-auto w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Course Created Successfully!
              </h3>
              <p className="text-gray-600">
                Your course
                {courseTitle ? ` "${courseTitle}" ` : " "}
                has been created from your playlist.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={resetForm}
                  className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Another Course
                </button>
                <a
                  href="/dashboard"
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Go to Dashboard
                </a>
                {createdCourseId && (
                  <button
                    onClick={() => router.push(`/course/${createdCourseId}`)}
                    className="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-black transition-colors"
                  >
                    View Course
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Course Details
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* YouTube Playlist URL */}
                <div>
                  <label
                    htmlFor="playlistUrl"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    YouTube Playlist URL *
                  </label>
                  <input
                    id="playlistUrl"
                    type="url"
                    value={playlistUrl}
                    onChange={(e) => setPlaylistUrl(e.target.value)}
                    placeholder="https://www.youtube.com/playlist?list=..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Make sure your playlist is set to <span className="font-medium">Public</span>.
                  </p>
                </div>

                {/* Course Title */}
                <div>
                  <label
                    htmlFor="courseTitle"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Course Title *
                  </label>
                  <input
                    id="courseTitle"
                    type="text"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    placeholder="e.g., My Web Development Roadmap"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Description (optional)
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what this playlist-based course is about..."
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Creating course...
                      </span>
                    ) : (
                      "Create Course"
                    )}
                  </button>
                  <a
                    href="/dashboard"
                    className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 text-center transition-colors"
                  >
                    Back to Dashboard
                  </a>
                </div>
              </form>
            </>
          )}
        </div>

        
      </div>
    </main>
  );
}