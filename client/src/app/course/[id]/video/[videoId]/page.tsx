"use client";

import { useParams } from "next/navigation";

const videos = [
  {
    id: 1,
    title: "Introduction to DSA",
    youtubeId: "7fjOw8ApZ1I",
  },
  {
    id: 2,
    title: "Arrays Basics",
    youtubeId: "qYEjR6M0wSk",
  },
  {
    id: 3,
    title: "Binary Search",
    youtubeId: "aR7tcmWo_w",
  },
];

export default function VideoPage() {
  const params = useParams();
  const videoId = Number(params.videoId);
 
  
  const video = videos.find((v) => v.id === videoId);
  if (!video) {
    return <p className="p-6">Video not found</p>;
  }

  function handleMarkCompleted() {
    const stored = localStorage.getItem("completedVideoIds");
    const completed = stored ? JSON.parse(stored) : [];
    const today = new Date().toISOString().split("T")[0];
    const streakStored = localStorage.getItem("learningStreak");

    let streakData = {
      lastDate : today,
      streak : 1,
    }

      if (streakStored) {
    const parsed = JSON.parse(streakStored);

    const lastDate = parsed.lastDate;
    const streak = parsed.streak;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (lastDate === today) {
      streakData = parsed;
    } else if (lastDate === yesterdayStr) {
      streakData = {
        lastDate: today,
        streak: streak + 1,
      };
    } else {
      streakData = {
        lastDate: today,
        streak: 1,
      };
    }
  }

  localStorage.setItem("learningStreak", JSON.stringify(streakData));


    if (!completed.includes(videoId)) {
      completed.push(videoId);
    }

    localStorage.setItem("completedVideoIds", JSON.stringify(completed));

    alert("Video marked as completed");
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex flex-col items-center py-10 px-2">
      <section className="w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-zinc-800">
        <button
          onClick={() => window.history.back()}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4 font-medium"
        >
          ← Back to Course
        </button>
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">DSA with Love Babbar</p>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6 text-center tracking-tight">{video.title}</h1>
        <div className="w-full aspect-video mb-8 rounded-xl overflow-hidden shadow">
          <iframe
            className="w-full h-full bg-black"
            src={`https://www.youtube.com/embed/${video.youtubeId}`}
            title={video.title}
            allowFullScreen
          />
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleMarkCompleted}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-colors"
          >
            Mark as Completed
          </button>
        </div>
      </section>
    </main>
  );
}
