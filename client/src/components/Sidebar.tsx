"use client";

import React, { memo, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Icon components for better performance
const DashboardIcon = memo(() => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
));
DashboardIcon.displayName = "DashboardIcon";

const CoursesIcon = memo(() => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
));
CoursesIcon.displayName = "CoursesIcon";

const AddIcon = memo(() => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
  </svg>
));
AddIcon.displayName = "AddIcon";

const ProfileIcon = memo(() => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
));
ProfileIcon.displayName = "ProfileIcon";

const LogoutIcon = memo(() => (
  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
));
LogoutIcon.displayName = "LogoutIcon";

// Optimized SidebarLink component with memo
const SidebarLink = memo(({ 
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
}) => {
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors duration-150 ${
        isActive 
          ? "bg-blue-50 text-blue-700 shadow-sm" 
          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
      }`}
      title={!isOpen ? label : ""}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className={`truncate transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0 w-0"}`}>
        {label}
      </span>
    </Link>
  );
});
SidebarLink.displayName = "SidebarLink";

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

  // Memoize navigation items
  const navItems = useMemo(() => [
    { href: "/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
    { href: "/courses", label: "Courses", icon: <CoursesIcon /> },
    { href: "/import-playlist", label: "Add Playlist", icon: <AddIcon /> },
    { href: "/profile", label: "Profile", icon: <ProfileIcon /> },
  ], []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (loading) return null;

  const isAuthed = !!user;

  return (
    <aside 
      className={`hidden md:flex fixed inset-y-0 left-0 flex-col bg-white border-r border-gray-200 z-30 transition-[width] duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-20"
      }`}
      style={{ willChange: isOpen ? "auto" : "width" }}
    >
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className={`${isOpen ? "px-6" : "px-4"} py-6 transition-[padding] duration-300`}>
          {/* Toggle Button */}
          <button
            onClick={onToggle}
            className={`flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 active:scale-95 transition-all duration-150 mb-6 ${
              !isOpen && "mx-auto"
            }`}
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <svg 
              className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${!isOpen && "rotate-180"}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>

          {/* Logo */}
          <Link 
            href={user ? "/dashboard" : "/"} 
            className={`flex items-center gap-3 mb-8 group ${!isOpen && "justify-center"}`}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center font-bold text-lg text-white shadow-md flex-shrink-0 group-hover:shadow-lg transition-shadow duration-200">
              <span className="leading-none">🎓</span>
            </div>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"}`}>
              <p className="text-base font-bold leading-none text-gray-900 truncate">Learning Hub</p>
              <p className="text-xs text-gray-500 truncate mt-1">Your path to mastery</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="space-y-1 text-sm">
            {isAuthed && navItems.map((item) => (
              <SidebarLink 
                key={item.href}
                href={item.href} 
                label={item.label} 
                pathname={pathname} 
                isOpen={isOpen}
                icon={item.icon}
              />
            ))}
          </nav>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom section */}
        <div className={`${isOpen ? "px-6" : "px-4"} pb-6 transition-[padding] duration-300`}>
          {isAuthed && (
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-red-50 hover:border-red-200 hover:text-red-600 active:scale-95 transition-all duration-150 ${
                !isOpen && "justify-center"
              }`}
              title={!isOpen ? "Log Out" : ""}
            >
              <LogoutIcon />
              <span className={`font-medium transition-all duration-300 ${isOpen ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"}`}>
                Log Out
              </span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}


