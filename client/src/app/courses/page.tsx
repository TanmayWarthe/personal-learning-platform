"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Toast, { type ToastType } from "@/components/Toast";
import { apiFetch } from "@/lib/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faExclamationCircle, faBook, faVideo, faCheckCircle, faArrowRight, faTrash, faExclamationTriangle, faSpinner } from "@fortawesome/free-solid-svg-icons";

type Course = {
  id: number;
  title: string;
  description: string;
  video_count?: number;
  completed_videos?: number;
  progress_percentage?: number;
  created_at?: string;
};

export default function CoursesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; courseId: number | null; title: string }>({
    show: false,
    courseId: null,
    title: "",
  });
  const [deleting, setDeleting] = useState(false);

  // Redirect to login if not authenticated (only after auth check is complete)
  useEffect(() => {
    if (!authLoading && !user) {
      setToast({ message: "Please login to access courses", type: "info" });
      setTimeout(() => {
        router.push("/login");
      }, 1500);
      return;
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    // Only fetch courses if user is authenticated
    if (!user || authLoading) return;

    async function fetchCourses() {
      try {
        setLoading(true);
        setError("");
        const res = await apiFetch("/courses");
        
        if (!res.ok) {
          throw new Error("Failed to fetch courses");
        }
        
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        console.error("Failed to fetch courses", error);
        setError("Failed to load courses. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, [user, authLoading]);

  const handleDeleteClick = (e: React.MouseEvent, course: Course) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();
    setDeleteModal({ show: true, courseId: course.id, title: course.title });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.courseId) return;

    setDeleting(true);
    try {
      const res = await apiFetch(`/courses/${deleteModal.courseId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete course");
      }

      setToast({ message: "Course deleted successfully", type: "success" });
      setCourses(courses.filter((c) => c.id !== deleteModal.courseId));
      setDeleteModal({ show: false, courseId: null, title: "" });
    } catch (error) {
      console.error("Delete error:", error);
      setToast({ message: "Failed to delete course", type: "error" });
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ show: false, courseId: null, title: "" });
  };

  // Show loading while checking authentication
  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-full mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Courses</h1>
              <p className="text-gray-600 mt-2">Browse and continue your learning journey</p>
            </div>
            <Link
              href="/import-playlist"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <FontAwesomeIcon icon={faPlus} className="w-5 h-5 mr-2" />
              Import Playlist
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading && (
          <div className="flex justify-center items-center h-60">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Loading courses...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faExclamationCircle} className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && courses.length === 0 && (
          <div className="text-center py-16">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FontAwesomeIcon icon={faBook} className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses available</h3>
            <p className="text-gray-500 mb-4">Check back later for new courses.</p>
            <Link
              href="/import-playlist"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FontAwesomeIcon icon={faPlus} className="w-5 h-5 mr-2" />
              Import Your First Course
            </Link>
          </div>
        )}

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="relative">
              <Link
                href={`/course/${course.id}`}
                className="group block bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <div className="p-6">
                  {/* Course Icon */}
                  <div className="w-12 h-12 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors duration-200 flex items-center justify-center mb-4">
                    <FontAwesomeIcon icon={faBook} className="w-6 h-6 text-blue-600" />
                  </div>

                  {/* Course Title */}
                  <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-2 line-clamp-2">
                    {course.title}
                  </h2>

                {/* Course Description */}
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {course.description || "No description available"}
                </p>

                {/* Course Stats */}
                <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faVideo} className="w-4 h-4" />
                    <span>{course.video_count || 0} videos</span>
                  </div>
                  {course.progress_percentage !== undefined && (
                    <div className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4" />
                      <span>{course.completed_videos || 0} completed</span>
                    </div>
                  )}
                </div>

                {/* Progress Indicator */}
                {course.progress_percentage !== undefined ? (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Your Progress</span>
                      <span className="text-xs font-medium text-blue-600">{course.progress_percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${course.progress_percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Total Videos</span>
                      <span className="text-xs font-medium text-gray-700">{course.video_count || 0}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-300 h-2 rounded-full" style={{ width: "100%" }}></div>
                    </div>
                  </div>
                )}

                {/* Course Status Badge */}
                {course.progress_percentage !== undefined && course.progress_percentage > 0 && (
                  <div className="mb-4">
                    {course.progress_percentage === 100 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3 mr-1" />
                        Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        In Progress
                      </span>
                    )}
                  </div>
                )}

                {/* View Course Button */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700 transition-colors duration-200">
                    {course.progress_percentage !== undefined && course.progress_percentage > 0 
                      ? "Continue Learning" 
                      : "View Course"}
                  </span>
                  <FontAwesomeIcon icon={faArrowRight} className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors duration-200" />
                </div>
              </div>
            </Link>

            {/* Delete Button */}
            <button
              onClick={(e) => handleDeleteClick(e, course)}
              className="absolute top-4 right-4 p-2 bg-white rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 shadow-sm border border-gray-200 hover:border-red-200 z-10"
              title="Delete course"
            >
              <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
            </button>
          </div>
          ))}
        </div>

        {/* Pagination Note (if needed) */}
        {courses.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500">
              Showing {courses.length} course{courses.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all animate-in fade-in zoom-in duration-200">
            {/* Icon */}
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <FontAwesomeIcon icon={faExclamationTriangle} className="h-6 w-6 text-red-600" />
            </div>

            {/* Content */}
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Course
              </h3>
              <p className="text-sm text-gray-600">
                Are you sure you want to delete <span className="font-medium text-gray-900">"{deleteModal.title}"</span>? 
                This will permanently remove all videos and progress data. This action cannot be undone.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleDeleteCancel}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {deleting ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}