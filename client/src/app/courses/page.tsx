"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Course = {
  id: number;
  title: string;
  description: string;
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("http://localhost:5000/courses");
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        console.error("Failed to fetch courses", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-900 tracking-tight">All Courses</h1>

      {loading && (
        <div className="flex justify-center items-center h-40">
          <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-3"></span>
          <span className="text-lg text-gray-600">Loading courses...</span>
        </div>
      )}

      {!loading && courses.length === 0 && (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500 text-lg">No courses available.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/course/${course.id}`}
            className="group bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 p-6 flex flex-col justify-between min-h-[220px] hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <div>
              <h2 className="text-2xl font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                {course.title}
              </h2>
              <p className="text-gray-600 text-base line-clamp-3">
                {course.description}
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <span className="inline-block px-4 py-1 text-sm font-medium bg-blue-50 text-blue-600 rounded-full group-hover:bg-blue-100 transition">View Course</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
