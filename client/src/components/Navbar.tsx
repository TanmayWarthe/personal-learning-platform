"use client";

export default function Navbar() {
  return (
    <nav className="w-full px-6 py-4 border-b flex justify-between">
      <h1 className="font-bold">Learning Platform</h1>

      <div className="space-x-4">
        <a href="/login">Login</a>
        <a href="/dashboard">Dashboard</a>
      </div>
    </nav>
  );
}
