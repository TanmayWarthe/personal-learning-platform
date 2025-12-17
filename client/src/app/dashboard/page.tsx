"use client";

export default function DashboardPage() {
  return (
    <div className="vh-screen max-w-5xl mx-auto px-6 py-8 md:-8">
      {/* Welcome */}
      <h1 className="text-3xl font-bold mb-6">
        Welcome back 👋
      </h1>

      {/* Progress Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          Overall Progress
        </h2>

        <div className="w-full bg-gray-200 h-3 rounded">
          <div className="bg-black h-3 w-[60%] rounded"></div>
        </div>

        <p className="mt-2 text-sm text-gray-600">
          60% completed
        </p>
      </div>

      {/* Courses Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Your Courses
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Course Card */}
          <div className="border p-4 rounded shadow-sm">
            <h3 className="font-bold text-lg">DSA with Love Babbar</h3>
            <p className="text-sm text-gray-600 mt-1">
              Progress: 40%
            </p>
            <button className="mt-3 px-4 py-2 bg-black text-white rounded">
              Continue
            </button>
          </div>

          {/* Course Card */}
          <div className="border p-4 rounded shadow-sm">
            <h3 className="font-bold text-lg">Web Development</h3>
            <p className="text-sm text-gray-600 mt-1">
              Progress: 20%
            </p>
            <button className="mt-3 px-4 py-2 bg-black text-white rounded">
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
