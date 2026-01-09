"use client";

import React, { memo, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons";

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
      <span className="shrink-0">{icon}</span>
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

  const navItems = useMemo(() => [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/courses", label: "Courses", icon: "📚" },
    { href: "/import-playlist", label: "Add Playlist", icon: "➕" },
    { href: "/profile", label: "Profile", icon: "👤" },
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
            <FontAwesomeIcon 
              icon={faAnglesLeft}
              className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${!isOpen && "rotate-180"}`}
            />
          </button>

          {/* Logo */}
          <Link 
            href={user ? "/dashboard" : "/"} 
            className={`flex items-center gap-3 mb-8 group ${!isOpen && "justify-center"}`}
          >
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-600 to-blue-700 flex items-center justify-center font-bold text-lg text-white shadow-md shrink-0 group-hover:shadow-lg transition-shadow duration-200">
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
              <span className="w-5 h-5">🚪</span>
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


