"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// SidebarLink component for navigation links
function SidebarLink({ 
  href, 
  label, 
  pathname, 
  isOpen,
  icon 
}: { 
  href: string; 
  label: string; 
  pathname: string; 
  isOpen: boolean;
  icon: React.ReactNode;
}) {
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all ${
        isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
      }`}
      title={!isOpen ? label : ""}
    >
      <span className="flex-shrink-0">{icon}</span>
      {isOpen && <span className="truncate">{label}</span>}
    </Link>
  );
}

export default function Sidebar({ 
  isOpen, 
  onToggle 
}: { 
  isOpen: boolean; 
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  if (loading) return null;

  const isAuthed = !!user;

  return (
    <aside 
      className={`hidden md:flex fixed inset-y-0 left-0 flex-col bg-white border-r border-gray-200 transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      <div className="flex-1 overflow-y-auto">
        <div className={`${isOpen ? "px-6" : "px-3"} py-7 transition-all duration-300`}>
          {/* Toggle Button */}
          <button
            onClick={onToggle}
            className={`flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition mb-6 ${!isOpen && "mx-auto"}`}
            aria-label="Toggle sidebar"
            title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              )}
            </svg>
          </button>

          {/* Logo */}
          <Link 
            href={user ? "/dashboard" : "/"} 
            className={`flex items-center gap-3 mb-8 ${!isOpen && "justify-center"}`}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-lg text-white shadow-sm flex-shrink-0">
              <span className="leading-none">🎗️</span>
            </div>
            {isOpen && (
              <div className="overflow-hidden">
                <p className="text-base font-semibold leading-none text-gray-900 truncate">Personal Learning</p>
                <p className="text-xs text-gray-500 truncate">Build your own path</p>
              </div>
            )}
          </Link>

          {/* Navigation */}
          <nav className="space-y-1 text-sm">
            {isAuthed ? (
              <>
                <SidebarLink 
                  href="/dashboard" 
                  label="Dashboard" 
                  pathname={pathname} 
                  isOpen={isOpen}
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  }
                />
                <SidebarLink 
                  href="/courses" 
                  label="Courses" 
                  pathname={pathname} 
                  isOpen={isOpen}
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  }
                />
                <SidebarLink 
                  href="/import-playlist" 
                  label="Add Playlist" 
                  pathname={pathname} 
                  isOpen={isOpen}
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  }
                />
                <SidebarLink 
                  href="/profile" 
                  label="Profile" 
                  pathname={pathname} 
                  isOpen={isOpen}
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  }
                />
              </>
            ) : null}
          </nav>
        </div>
      </div>

      {/* Bottom section */}
      <div className={`${isOpen ? "px-6" : "px-3"} pb-6 space-y-2 transition-all duration-300`}>
        {isAuthed && (
          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition ${
              !isOpen && "justify-center"
            }`}
            title={!isOpen ? "Log Out" : ""}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {isOpen && <span className="font-medium">Log Out</span>}
          </button>
        )}
      </div>
    </aside>
  );
}


