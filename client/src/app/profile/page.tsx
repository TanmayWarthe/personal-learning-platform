"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Toast, { type ToastType } from "@/components/Toast";
import { useAuth } from "@/context/AuthContext";

type User = {
  name: string;
  email: string;
  username: string;
  accountCreated: string;
};

type Stats = {
  coursesEnrolled: number;
  videosCompleted: number;
  currentBadge: string;
};

export default function ProfilePage() {
  const { user: authUser, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempEmail, setTempEmail] = useState("");
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !authUser) {
      setToast({ message: "Please login to view your profile", type: "info" });
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    }
  }, [authUser, authLoading, router]);

  useEffect(() => {
    // Only fetch profile data if user is authenticated
    if (!authUser || authLoading) return;

    async function fetchProfile() {
      setLoading(true);
      setError("");
      try {
        // Fetch user info
        const userRes = await fetch("http://localhost:5000/users/me", { credentials: "include" });
        if (!userRes.ok) throw new Error("Not authenticated");
        const userData = await userRes.json();

        // Fetch stats
        const statsRes = await fetch("http://localhost:5000/dashboard/summary", { credentials: "include" });
        const statsData = await statsRes.json();

        // Fetch streak
        const streakRes = await fetch("http://localhost:5000/progress/streak", { credentials: "include" });
        const streakData = await streakRes.json();

        setUser({
          name: userData.name,
          email: userData.email,
          username: userData.username || userData.email?.split("@")[0],
          accountCreated: userData.created_at,
        } as User);
        setStats({
          coursesEnrolled: statsData.coursesEnrolled ?? 0,
          videosCompleted: statsData.progress?.completedVideos || 0,
          currentBadge: statsData.badge || "Bronze",
        } as Stats);
        setStreak(streakData.streak || 0);
        setTempName(userData.name);
        setTempEmail(userData.email);
      } catch (err) {
        setError("Failed to load profile. Please login again.");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [authUser, authLoading]);


  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      const res = await fetch("http://localhost:5000/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name: tempName, email: tempEmail }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setToast({ message: (data as any).message || "Failed to update profile", type: "error" });
        return;
      }

      const updated = (data as any).user;
      setUser((prev) =>
        prev
          ? {
              ...prev,
              name: updated?.name ?? tempName,
              email: updated?.email ?? tempEmail,
            }
          : prev
      );
      setIsEditing(false);
      setToast({ message: "Profile updated!", type: "success" });
    } catch {
      setToast({ message: "Network error while updating profile.", type: "error" });
    }
  };

  const handleCancelEdit = () => {
    setTempName(user?.name || "");
    setTempEmail(user?.email || "");
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
  };

  const handleChangePassword = () => {
    setToast({ message: "Password change feature coming soon!", type: "info" });
  };

  const getBadgeColor = (badge: string) => {
    switch (badge.toLowerCase()) {
      case "gold": return "bg-yellow-100 text-yellow-800";
      case "silver": return "bg-gray-100 text-gray-800";
      case "bronze": return "bg-amber-100 text-amber-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  // Show loading while checking authentication
  if (authLoading || !authUser) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </main>
    );
  }
  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-red-600">{error}</p>
        </div>
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your account</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-3xl font-bold text-blue-600">
                      {user?.name?.charAt(0) || "U"}
                    </span>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Profile Info */}
                <div className="flex-1 w-full">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={tempName}
                          onChange={(e) => setTempName(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={tempEmail}
                          onChange={(e) => setTempEmail(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={handleSaveProfile}
                          className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                      <p className="text-gray-600 mt-1">{user?.email}</p>
                      <p className="text-gray-500 text-sm mt-1">
                        Joined {user?.accountCreated ? new Date(user.accountCreated).toLocaleDateString() : "-"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded border border-blue-100">
                  <div className="text-2xl font-bold text-blue-600">{stats?.coursesEnrolled ?? 0}</div>
                  <p className="text-sm text-gray-600">Courses</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded border border-green-100">
                  <div className="text-2xl font-bold text-green-600">{stats?.videosCompleted ?? 0}</div>
                  <p className="text-sm text-gray-600">Lessons</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded border border-orange-100">
                  <div className="text-2xl font-bold text-orange-600">{streak}</div>
                  <p className="text-sm text-gray-600">Streak</p>
                </div>
                <div className={`text-center p-3 rounded border ${getBadgeColor(stats?.currentBadge || "Bronze")}`}>
                  <div className="text-2xl font-bold mb-1">
                    {stats?.currentBadge === "Gold" ? "🥇" : 
                     stats?.currentBadge === "Silver" ? "🥈" : "🥉"}
                  </div>
                  <p className="text-sm">{stats?.currentBadge || "Bronze"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Account Info */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Info</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Username</label>
                  <div className="p-2 bg-gray-50 rounded border border-gray-200">
                    <p className="text-gray-900">@{user?.username}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Email</label>
                  <div className="p-2 bg-gray-50 rounded border border-gray-200">
                    <p className="text-gray-900">{user?.email}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Account Created</label>
                  <div className="p-2 bg-gray-50 rounded border border-gray-200">
                    <p className="text-gray-900">
                      {user?.accountCreated ? new Date(user.accountCreated).toLocaleDateString() : "-"}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Status</label>
                  <div className="p-2 bg-green-50 rounded border border-green-200">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-green-700">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleChangePassword}
                  className="w-full py-2 px-4 border border-blue-600 text-blue-600 font-medium rounded hover:bg-blue-50"
                >
                  Change Password
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 px-4 bg-red-600 text-white font-medium rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}