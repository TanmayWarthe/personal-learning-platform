"use client";

import { use, useEffect, useState } from "react";

type Video = {
  id: number;
  title: string;
  position: number;
  youtube_video_id: string;
};

export default function VideoPage({
  params,
}: {
  params: Promise<{ id: string; videoId: string }>;
}) {
  const { id , videoId } = use(params);

  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  //   FETCH VIDEO FROM BACKEND
  useEffect(() => {
    async function fetchVideo() {
      try {
        const res = await fetch(
          `http://localhost:5000/courses/${id}/videos`
        );

        const data = await res.json();

        if (!Array.isArray(data)) return;

        //  Find current video using videoId
        const vid = Number(videoId);

        console.log("URL videoId:", vid);
        console.log(
          "Available video IDs:",
          data.map((v: any) => v.id)
        );

        const currentVideo = data.find((v: any) => Number(v.id) === vid);

        setVideo(currentVideo || null);
      } catch (error) {
        console.error("Failed to load video", error);
      } finally {
        setLoading(false);
      }
    }

    fetchVideo();
  }, [id, videoId]);

  //   MARK AS COMPLETED + STREAK
  function handleMarkCompleted() {
    if (!video) return;

    // 🔹 Completed videos
    const stored = localStorage.getItem("completedVideoIds");
    const completed: number[] = stored ? JSON.parse(stored) : [];

    if (!completed.includes(video.id)) {
      completed.push(video.id);
      localStorage.setItem("completedVideoIds", JSON.stringify(completed));
    }

    // treak logic
    const today = new Date().toISOString().split("T")[0];
    const streakStored = localStorage.getItem("learningStreak");

    let streakData = {
      lastDate: today,
      streak: 1,
    };

    if (streakStored) {
      const parsed = JSON.parse(streakStored);

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      if (parsed.lastDate === today) {
        streakData = parsed;
      } else if (parsed.lastDate === yesterdayStr) {
        streakData = {
          lastDate: today,
          streak: parsed.streak + 1,
        };
      }
    }

    localStorage.setItem("learningStreak", JSON.stringify(streakData));

    // alert("Video marked as completed ✅");
    alert("Completed ✅ Next video unlocked!");
    window.history.back();
  }

  //   STATES
  if (loading) return <p className="p-6">Loading video...</p>;
  if (!video) return <p className="p-6">Video not found</p>;

  //   UI
  return (
    <main className="min-h-screen bg-gray-50 flex justify-center py-10 px-4">
      <section className="w-full max-w-4xl bg-white rounded-2xl shadow p-8">
        <button
          onClick={() => window.history.back()}
          className="text-sm text-blue-600 hover:underline mb-4 font-medium"
        >
          ← Back to Course
        </button>

        <h1 className="text-3xl font-extrabold mb-6 text-center">
          {video.position}. {video.title}
        </h1>

        <div className="w-full aspect-video mb-8 rounded-xl overflow-hidden shadow">
          <iframe
            className="w-full h-full bg-black"
            src={`https://www.youtube.com/embed/${video.youtube_video_id}`}
            title={video.title}
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
          <a
            href={`https://www.youtube.com/watch?v=${video.youtube_video_id}`}
            target="_blank"
            className="mt-3 inline-block text-blue-600 underline"
          >
            Open on YouTube
          </a>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleMarkCompleted}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow"
          >
            Mark as Completed
          </button>
        </div>
      </section>
    </main>
  );
}
