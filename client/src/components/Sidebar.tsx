"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  if (loading) return null;

  const isAuthed = !!user;

  return (
    <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 flex-col bg-white border-r border-gray-200">
      <div className="px-6 py-7">
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-lg text-white shadow-sm">
            <span className="leading-none">🎗️</span>
          </div>
          <div>
            <p className="text-base font-semibold leading-none text-gray-900">Personal Learning</p>
            <p className="text-xs text-gray-500">Build your own path</p>
          </div>
        </Link>

        <nav className="space-y-1 text-sm">
          {isAuthed ? (
            <>
              <SidebarLink href="/dashboard" label="Dashboard" pathname={pathname} />
              <SidebarLink href="/courses" label="Courses" pathname={pathname} />
              <SidebarLink href="/import-playlist" label="Add Playlist" pathname={pathname} />
              <SidebarLink href="/profile" label="Profile" pathname={pathname} />
            </>
          ) : (
            <>
              <SidebarLink href="/" label="Home" pathname={pathname} />
              <SidebarLink href="/login" label="Login" pathname={pathname} />
              <SidebarLink href="/register" label="Sign Up" pathname={pathname} />
            </>
          )}
        </nav>
      </div>

      <div className="mt-auto px-6 pb-6">
        <button
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 4h6a2 2 0 012 2v2m0 8v2a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2h6" />
          </svg>
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </aside>
  );
}

function SidebarLink({
  href,
  label,
  pathname,
}: {
  href: string;
  label: string;
  pathname: string;
}) {
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`block rounded-2xl px-4 py-2.5 text-sm transition ${
        active
          ? "bg-white text-purple-600 font-semibold shadow-md"
          : "text-gray-700 hover:bg-white hover:text-purple-600 hover:shadow-md"
      }`}
    >
      {label}
    </Link>
  );
}

