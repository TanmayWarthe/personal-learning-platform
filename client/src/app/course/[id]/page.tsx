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
  const [activeTab, setActiveTab] = useState<"overview" | "content">("overview");
  const [loading, setLoading] = useState(true);



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

  /* ================= LOADING ================= */
  if (loading) return <p className="p-6">Loading...</p>;
  if (!course) return <p className="p-6">Course not found</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* ================= HEADER ================= */}
      <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
      <p className="text-gray-600 mb-6">{course.description}</p>

      {/* ================= TABS ================= */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded ${
            activeTab === "overview"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Overview
        </button>

        <button
          onClick={() => setActiveTab("content")}
          className={`px-4 py-2 rounded ${
            activeTab === "content"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Content
        </button>
      </div>

      {/* ================= OVERVIEW ================= */}
      {activeTab === "overview" && (
        <div className="bg-white p-4 border rounded">
          <p>{course.description}</p>
          <p className="mt-2 text-sm text-gray-500">
            Total videos: {videos.length}
          </p>
        </div>
      )}

      {/* ================= CONTENT ================= */}
      {activeTab === "content" && (
        <div className="space-y-3">
          {videos.length === 0 && (
            <p className="text-gray-500">No videos found</p>
          )}

          {videos.map((video) => (
            <div
              key={video.id}
              className="flex justify-between items-center p-4 border rounded"
            >
              <span>
                {video.position}. {video.title}
              </span>

              <a
                href={`/course/${courseId}/video/${video.id}`}
                className="text-blue-600"
              >
                ▶ Play
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
