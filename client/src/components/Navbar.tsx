"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function Navbar() {
  const { user, loading, logout } = useAuth();

  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userInitial = user?.name?.charAt(0).toUpperCase();

  // close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        // Add delay to prevent fast closing
        setTimeout(() => {
          setOpen(false);
        }, 150);
      }
    }
    if (open) {
      // Add delay before attaching listener to prevent immediate closing
      const timeoutId = setTimeout(() => {
        document.addEventListener("mousedown", handleClick);
      }, 100);
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("mousedown", handleClick);
      };
    }
  }, [open]);

  if (loading) return null;

  return (
    <nav className="w-full bg-white/80 backdrop-blur border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 14l9-5-9-5-9 5 9 5z"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                Personal Learning
              </span>
              <span className="text-xs text-gray-500 hidden sm:block">
                Build your own learning path
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          {user ? (
            /* Logged in - Show Dashboard, Courses, Import Playlist, Profile */
            <div className="hidden md:flex items-center gap-8">
              <NavLink href="/dashboard" label="Dashboard" />
              <NavLink href="/courses" label="Courses" />
              <NavLink href="/import-playlist" label="Import Playlist" />

              <div className="h-6 w-px bg-gray-200" />

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(!open);
                  }}
                  className="flex items-center gap-3 focus:outline-none group"
                >
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-gray-900 leading-tight">
                      {user?.name || "Learner"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {user?.email}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-sm border border-white">
                    {userInitial || "U"}
                  </div>
                  <Chevron open={open} />
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email}
                      </p>
                    </div>

                    <Link
                      href="/profile"
                      onClick={(e) => {
                        e.preventDefault();
                        // Close dropdown smoothly first
                        setOpen(false);
                        // Then navigate after a delay for smooth transition
                        setTimeout(() => {
                          window.location.href = "/profile";
                        }, 300);
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      View Profile
                    </Link>

                    <div className="border-t my-1" />

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center justify-between px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <span>Logout</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Not logged in - Show Home, Login, Signup */
            <div className="hidden md:flex items-center gap-4">
              <NavLink href="/" label="Home" />
              <Link
                href="/login"
                className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile: menu + avatar */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
              aria-label="Toggle navigation"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(!open);
                  }}
                  className="flex items-center focus:outline-none"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-sm">
                    {userInitial || "U"}
                  </div>
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email}
                      </p>
                    </div>

                    <Link
                      href="/profile"
                      onClick={(e) => {
                        e.preventDefault();
                        // Close dropdown smoothly first
                        setOpen(false);
                        // Then navigate after a delay for smooth transition
                        setTimeout(() => {
                          window.location.href = "/profile";
                        }, 300);
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      View Profile
                    </Link>

                    <div className="border-t my-1" />

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center justify-between px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <span>Logout</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-sm text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 space-y-1">
            {user ? (
              <>
                <NavLink href="/dashboard" label="Dashboard" mobile />
                <NavLink href="/courses" label="Courses" mobile />
                <NavLink href="/import-playlist" label="Import Playlist" mobile />
                <NavLink href="/practice" label="Practice" mobile />
              </>
            ) : (
              <>
                <NavLink href="/" label="Home" mobile />
                <NavLink href="/login" label="Login" mobile />
                <NavLink href="/register" label="Sign Up" mobile />
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}


function NavLink({
  href,
  label,
  mobile,
}: {
  href: string;
  label: string;
  mobile?: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        mobile
          ? "block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
          : "text-gray-700 hover:text-blue-600 font-medium transition"
      }
    >
      {label}
    </Link>
  );
}

function DropdownLink({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      // Small delay to allow navigation to start
      setTimeout(() => {
        onClick();
      }, 100);
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
    >
      {label}
    </Link>
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
