"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, loading, logout } = useAuth();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userInitial = user?.name?.charAt(0).toUpperCase();

  // close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (loading) return null;

  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  d="M12 14l9-5-9-5-9 5 9 5z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">
              Personal Learning Platform
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="/dashboard" label="Dashboard" />
            <NavLink href="/courses" label="Courses" />
            <NavLink href="/practice" label="Practice" />
            <NavLink href="/progress" label="Progress" />
          </div>

          {/* Profile */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 focus:outline-none"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-blue-200 flex items-center justify-center">
                <span className="font-semibold text-blue-600">
                  {userInitial}
                </span>
              </div>
              <Chevron open={open} />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow border z-50">
                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>

                <DropdownLink href="/profile" label="View Profile" />
                <DropdownLink href="/my-learning" label="My Learning" />
                <DropdownLink href="/settings" label="Settings" />

                <div className="border-t my-1" />

                <button
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden py-4 border-t space-y-2">
          <NavLink href="/dashboard" label="Dashboard" />
          <NavLink href="/courses" label="Courses" />
          <NavLink href="/practice" label="Practice" />
          <NavLink href="/progress" label="Progress" />
        </div>
      </div>
    </nav>
  );
}

/* ---------- Small Reusable Components ---------- */

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="text-gray-700 hover:text-blue-600 font-medium transition"
    >
      {label}
    </a>
  );
}

function DropdownLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
    >
      {label}
    </a>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-4 h-4 text-gray-500 transition-transform ${
        open ? "rotate-180" : ""
      }`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        d="M19 9l-7 7-7-7" />
    </svg>
  );
}
