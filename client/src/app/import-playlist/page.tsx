"use client";

import { useState } from "react";

export default function CreateCoursePage() {
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    return (
      <div className="min-h-screen bg-gray-50">
        <TopBar />
        <div className="max-w-2xl mx-auto mt-12 px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Course from YouTube Playlist</h1>
            <p className="text-gray-700">Convert a YouTube playlist into a structured learning course</p>
          </div>
          <form className="bg-white rounded-xl border p-8 flex flex-col gap-6 w-full max-w-md">
            <input type="text" placeholder="YouTube Playlist URL" className="px-4 py-3 rounded-lg bg-blue-900/60 text-white placeholder-blue-300 border border-blue-500/30 focus:ring-2 focus:ring-blue-500 outline-none" />
            <input type="text" placeholder="Course Title" className="px-4 py-3 rounded-lg bg-blue-900/60 text-white placeholder-blue-300 border border-blue-500/30 focus:ring-2 focus:ring-blue-500 outline-none" />
            <textarea placeholder="Course Description" className="px-4 py-3 rounded-lg bg-blue-900/60 text-white placeholder-blue-300 border border-blue-500/30 focus:ring-2 focus:ring-blue-500 outline-none resize-none" rows={4} />
            <button type="submit" className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700">Create Course</button>
          </form>
        </div>
      </div>
    );
  }
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Course Created Successfully!</h3>
              <p className="text-gray-600 mb-6">
                Your course "{courseTitle}" has been created from the playlist.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleReset}
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                >
                  Create Another Course
                </button>
                <a
                  href="/dashboard"
                  className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                >
                  Go to Dashboard
                </a>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Course Details</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* YouTube Playlist URL */}
                <div>
                  <label htmlFor="playlistUrl" className="block text-sm font-medium text-gray-700 mb-2">
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
                  <p className="mt-1 text-sm text-gray-500">Public playlists only</p>
                </div>

                {/* Course Title */}
                <div>
                  <label htmlFor="courseTitle" className="block text-sm font-medium text-gray-700 mb-2">
                    Course Title *
                  </label>
                  <input
                    id="courseTitle"
                    type="text"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    placeholder="e.g., Data Structures & Algorithms"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what students will learn in this course..."
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

                {/* Info Note */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-blue-700">
                        Videos will be imported in the same order as they appear in the playlist.
                        Please make sure your playlist is public and accessible.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Course...
                      </span>
                    ) : (
                      "Create Course"
                    )}
                  </button>
                  <a
                    href="/dashboard"
                    className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 text-center"
                  >
                    Back to Dashboard
                  </a>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help? Ensure your YouTube playlist is set to "Public"
          </p>
        </div>
      </div>
    </main>
  );
}