"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar({ 
  onToggleSidebar, 
  sidebarOpen 
}: { 
  onToggleSidebar: () => void; 
  sidebarOpen: boolean;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userInitial = user?.name?.charAt(0).toUpperCase() || "U";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  if (loading) return null;

  return (
    <nav className="w-full bg-white/90 backdrop-blur border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-full mx-auto px-4">
        <div className="flex items-center h-16 w-full">
          {/* Sidebar Toggle Button */}
          <button
            onClick={onToggleSidebar}
            className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition mr-3"
            aria-label="Toggle sidebar"
          >
            <span className="text-2xl">☰</span>
          </button>

          {/* Logo (Mobile) */}
          <Link
            href={user ? "/dashboard" : "/"}
            className="flex items-center gap-2 md:hidden"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">PL</span>
            </div>
          </Link>

          {/* Desktop Right Section */}
          <div className="flex-1 flex justify-end items-center gap-3">
            {user ? (
              <div className="hidden md:flex items-center gap-4">
                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setOpen(!open)}
                    className="w-10 h-10 rounded-full bg-linear-to-br from-blue-600 to-indigo-500 text-white font-bold flex items-center justify-center shadow-md border-2 border-white hover:scale-105 transition-transform"
                    aria-label="Open profile menu"
                  >
                    {userInitial}
                  </button>

                  {open && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                      <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
                        <p className="text-base font-semibold text-gray-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>

                      <DropdownItem
                        label="View Profile"
                        onClick={() => {
                          setOpen(false);
                          router.push("/profile");
                        }}
                      />

                      <div className="border-t my-1" />

                      <DropdownItem
                        label="Logout"
                        danger
                        onClick={() => {
                          setOpen(false);
                          logout();
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Open mobile menu"
            >
              <span className="text-2xl text-blue-600">☰</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t pt-3 pb-4 space-y-1 bg-white shadow">
            {user ? (
              <>
                <NavLink href="/dashboard" label="Dashboard" mobile />
                <NavLink href="/courses" label="Courses" mobile />
                <NavLink href="/import-playlist" label="Add Playlist" mobile />
                <NavLink href="/profile" label="Profile" mobile />
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink href="/" label="Home" mobile />
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

/* ---------------- Components ---------------- */

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
          ? "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
          : "text-gray-700 hover:text-blue-600 font-medium transition"
      }
    >
      {label}
    </Link>
  );
}

function DropdownItem({
  label,
  onClick,
  danger,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 text-sm ${
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );
}
