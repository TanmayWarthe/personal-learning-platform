"use client";

import { useParams } from "next/dist/client/components/navigation";
import { useEffect, useState } from "react";

export default function CoursePage() {
  const params = useParams();
  const courseId = params.courseId;

  const [activeTab, setActiveTab] = useState("overview");

  const [videos, setVideos] = useState([
    { id: 1, title: "Introduction to DSA", unlocked: true, completed: false },
    { id: 2, title: "Arrays Basics", unlocked: false, completed: false },
    { id: 3, title: "Binary Search", unlocked: false, completed: false },
  ]);

  const completedCount = videos.filter((v) => v.completed).length;
  const totalCount = videos.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);
  const badge = getBadge(progressPercent);

  useEffect(() => {
    const stored = localStorage.getItem("completedVideoIds");
    if (!stored) return;

    const completedIds: number[] = JSON.parse(stored);

    setVideos((prevVideos) =>
      prevVideos.map((video, index) => {
        const isCompleted = completedIds.includes(video.id);

        // completed videos
        if (isCompleted) {
          return {
            ...video,
            completed: true,
            unlocked: true,
          };
        }

        // unlock if previous video is completed
        const prevVideo = prevVideos[index - 1];
        if (prevVideo && completedIds.includes(prevVideo.id)) {
          return {
            ...video,
            unlocked: true,
          };
        }

        // never relock
        return video;
      })
    );
  }, []);

  function handleContinueLearning() {
  const nextVideo = videos.find(
    (v) => v.unlocked && !v.completed
  );

  if (nextVideo) {
    window.location.href = `/course/${courseId}/video/${nextVideo.id}`;
  } else {
    alert("Course completed 🎉");
  }
}

// course badge based on progress
function getBadge(progress: number) {
  if (progress <= 20) return "Bronze 🟤";
  if (progress <= 40) return "Silver ⚪";
  if (progress <= 60) return "Gold 🟡";
  if (progress <= 80) return "Platinum 🔵";
  return "Diamond 💎";
}



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex flex-col items-center py-10 px-2">
      {/* ================= Course Header ================= */}
      <section className="w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 dark:border-zinc-800">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 text-center tracking-tight">DSA with Love Babbar</h1>
        <p className="text-gray-500 dark:text-gray-300 text-lg text-center mb-6">Master Data Structures & Algorithms step by step</p>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-2/3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500 dark:text-gray-300">Progress</span>
              <span className="text-xs text-gray-700 dark:text-gray-200 font-semibold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-zinc-700 h-2 rounded-full">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs font-medium mt-2 text-blue-700 dark:text-blue-300">Badge: {badge}</p>
          </div>
          <button
            onClick={handleContinueLearning}
            className="mt-4 sm:mt-0 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-colors"
          >
            Continue Learning
          </button>
        </div>
      </section>

      {/* ================= Tabs ================= */}
      <section className="w-full max-w-3xl flex gap-2 bg-white dark:bg-zinc-900 rounded-xl shadow p-2 mb-8 border border-gray-100 dark:border-zinc-800">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "overview" ? "bg-blue-50 dark:bg-zinc-800 text-blue-700 dark:text-blue-300" : "text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800"}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("content")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "content" ? "bg-blue-50 dark:bg-zinc-800 text-blue-700 dark:text-blue-300" : "text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800"}`}
        >
          Course Content
        </button>
        <button
          onClick={() => setActiveTab("qa")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "qa" ? "bg-blue-50 dark:bg-zinc-800 text-blue-700 dark:text-blue-300" : "text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800"}`}
        >
          Q&A
        </button>
        <button
          onClick={() => setActiveTab("tools")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "tools" ? "bg-blue-50 dark:bg-zinc-800 text-blue-700 dark:text-blue-300" : "text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800"}`}
        >
          Learning Tools
        </button>
      </section>

      {/* ================= Tab Content ================= */}
      <section className="w-full max-w-3xl">
        {activeTab === "overview" && (
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">What you’ll learn</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 text-base">
              <li>Arrays, Strings, Linked List</li>
              <li>Stack, Queue, Recursion</li>
              <li>Binary Search & Sorting</li>
            </ul>
          </div>
        )}

        {activeTab === "content" && (
          <div className="space-y-4">
            {videos.map((video) => (
              <div
                key={video.id}
                className={`flex justify-between items-center p-4 rounded-xl shadow-sm border transition-colors ${
                  video.unlocked ? "bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700" : "bg-gray-100 dark:bg-zinc-800 border-gray-100 dark:border-zinc-700 text-gray-400 dark:text-gray-500"
                }`}
              >
                <span className="font-medium text-lg text-gray-900 dark:text-white">{video.title}</span>
                {video.completed && <span className="text-green-500 font-bold">✔</span>}
                {!video.completed && video.unlocked && (
                  <a
                    href={`/course/${courseId}/video/${video.id}`}
                    className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                  >
                    ▶ Play
                  </a>
                )}
                {!video.unlocked && <span className="text-gray-400 dark:text-gray-500">🔒 Locked</span>}
              </div>
            ))}
          </div>
        )}

        {activeTab === "qa" && (
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-6 text-center">
            <p className="text-gray-500 dark:text-gray-300 text-lg">AI-powered Q&A coming soon 🚀</p>
          </div>
        )}

        {activeTab === "tools" && (
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-6 text-center">
            <p className="text-gray-500 dark:text-gray-300 text-lg">Notes, cheat sheets, and resources.</p>
          </div>
        )}
      </section>
    </div>
  );
}
