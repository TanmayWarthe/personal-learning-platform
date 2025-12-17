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
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* ================= Course Header ================= */}
      <section className="border-b pb-6 mb-6">
        <h1 className="text-3xl font-bold">DSA with Love Babbar</h1>

        <p className="text-gray-600 mt-2">
          Master Data Structures & Algorithms step by step
        </p>

        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-500">
            <p className="text-sm text-gray-500">
              Progress: {progressPercent}%
            </p>
            

            <div className="w-full bg-gray-200 h-2 rounded mt-2">
              <div
                className="bg-black h-2 rounded"
                style={{ width: `${progressPercent}%` }}
              />
              <p className="text-sm font-medium mt-1">Badge: {badge}</p>
            </div>
          </span>

          <button onClick={handleContinueLearning} className="px-5 py-2 bg-black text-white rounded">
            Continue Learning
          </button>
        </div>
      </section>

      {/* ================= Tabs ================= */}
      <section className="flex gap-6 border-b mb-6">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 ${
            activeTab === "overview"
              ? "border-b-2 border-black font-medium"
              : "text-gray-500"
          }`}
        >
          Overview
        </button>

        <button
          onClick={() => setActiveTab("content")}
          className={`pb-3 ${
            activeTab === "content"
              ? "border-b-2 border-black font-medium"
              : "text-gray-500"
          }`}
        >
          Course Content
        </button>

        <button
          onClick={() => setActiveTab("qa")}
          className={`pb-3 ${
            activeTab === "qa"
              ? "border-b-2 border-black font-medium"
              : "text-gray-500"
          }`}
        >
          Q&A
        </button>

        <button
          onClick={() => setActiveTab("tools")}
          className={`pb-3 ${
            activeTab === "tools"
              ? "border-b-2 border-black font-medium"
              : "text-gray-500"
          }`}
        >
          Learning Tools
        </button>
      </section>

      {/* ================= Tab Content ================= */}
      <section>
        {activeTab === "overview" && (
          <div>
            <h2 className="text-xl font-semibold mb-3">What you’ll learn</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
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
                className={`flex justify-between items-center p-4 border rounded ${
                  video.unlocked ? "bg-white" : "bg-gray-100 text-gray-400"
                }`}
              >
                <span className="font-medium">{video.title}</span>

                {video.completed && <span>✔</span>}

                {!video.completed && video.unlocked && (
                  <a
                    href={`/course/${courseId}/video/${video.id}`}
                    className="text-blue-600 font-medium"
                  >
                    ▶ Play
                  </a>
                )}

                {!video.unlocked && <span>🔒 Locked</span>}
              </div>
            ))}
          </div>
        )}

        {activeTab === "qa" && (
          <div>
            <p className="text-gray-600">AI-powered Q&A coming soon 🚀</p>
          </div>
        )}

        {activeTab === "tools" && (
          <div>
            <p className="text-gray-600">Notes, cheat sheets, and resources.</p>
          </div>
        )}
      </section>
    </div>
  );
}
