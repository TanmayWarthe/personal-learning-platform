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

    if (!completed.includes(videoId)) {
      completed.push(videoId);
    }

    localStorage.setItem("completedVideoIds", JSON.stringify(completed));

    alert("Video marked as completed");
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <p className="text-sm text-gray-500 mb-2">DSA with Love Babbar</p>

      <h1 className="text-2xl font-bold mb-6">{video.title}</h1>

      <div className="w-full aspect-video mb-6">
        <iframe
          className="w-full h-full rounded"
          src={`https://www.youtube.com/embed/${video.youtubeId}`}
          title={video.title}
          allowFullScreen
        />
      </div>

      <button
        onClick={handleMarkCompleted}
        className="px-6 py-3 bg-black text-white rounded"
      >
        Mark as Completed
      </button>
    </div>
  );
}
