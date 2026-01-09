"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { LoginModal, RegisterModal } from "@/components/AuthModals";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faBook, faPlus, faLink, faCheckCircle, faChartBar, faArrowDown, faStar } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <RegisterModal isOpen={showRegister} onClose={() => setShowRegister(false)} />
      
      <main className="min-h-screen flex flex-col overflow-y-auto bg-linear-to-b from-white via-blue-50/30 to-white">
        {/* Auth Buttons - Fixed Top Right */}
        <div className="fixed top-0 right-0 z-50 p-4 sm:p-6">
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
              >
                Go to Dashboard
                <FontAwesomeIcon icon={faArrowRight} className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <button
                  onClick={() => setShowLogin(true)}
                  className="px-5 py-2.5 text-gray-700 hover:text-blue-600 font-semibold transition-colors hover:bg-white/80 rounded-lg backdrop-blur-sm"
                >
                  Login
                </button>
                <button
                  onClick={() => setShowRegister(true)}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Get Started Free
                </button>
              </>
            )}
          </div>
        </div>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20 mt-8">

          <div className="text-center max-w-4xl mx-auto">
            {/* Main Heading */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-xl">
                  <FontAwesomeIcon icon={faBook} className="w-10 h-10 text-white" />
                </div>
                {/* Decorative dots */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full"></div>
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {user ? `Welcome back, ${user.name || 'Learner'}!` : 'Learn Smarter,'}
              {!user && <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Not Harder</span>}
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              {user 
                ? "Continue your learning journey. Track progress, maintain your streak, and master new skills with your curated YouTube playlists."
                : "Transform any YouTube playlist into your personal learning journey. Track your progress, build streaks, and master new skills—one video at a time."
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="group px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition-all hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    View My Dashboard
                    <FontAwesomeIcon icon={faArrowRight} className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/import-playlist"
                    className="px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                  >
                    <FontAwesomeIcon icon={faPlus} className="w-5 h-5" />
                    Import New Playlist
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowRegister(true)}
                    className="group px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition-all hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    Start Learning Today
                    <FontAwesomeIcon icon={faArrowRight} className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <a
                    href="#features"
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
                  >
                    See How It Works
                    <FontAwesomeIcon icon={faArrowDown} className="w-5 h-5" />
                  </a>
                </>
              )}
            </div>

            {/* Social Proof */}
            {!user && (
              <div className="flex items-center justify-center gap-8 text-sm text-gray-500 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-400 to-blue-600 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-400 to-purple-600 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-green-400 to-green-600 border-2 border-white"></div>
                  </div>
                  <span className="font-medium">Join thousands of learners</span>
                </div>
                <div className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faStar} className="w-5 h-5 text-yellow-400" />
                  <span className="font-medium">Free forever</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Everything You Need to Learn Effectively
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Simple yet powerful tools to organize your learning and stay motivated
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <FontAwesomeIcon icon={faLink} className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Import Any Playlist</h3>
                <p className="text-gray-600 leading-relaxed">
                  Paste a YouTube playlist URL and we'll instantly create a structured course. No manual work—just start learning.
                </p>
              </div>
              
              <div className="group bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-green-200 hover:shadow-xl transition-all">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <FontAwesomeIcon icon={faCheckCircle} className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Track Your Progress</h3>
                <p className="text-gray-600 leading-relaxed">
                  Check off videos as you complete them. Watch your completion rate grow and maintain your learning streak.
                </p>
              </div>
              
              <div className="group bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all">
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <FontAwesomeIcon icon={faChartBar} className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Visual Dashboard</h3>
                <p className="text-gray-600 leading-relaxed">
                  See all your courses at a glance. Get insights on your learning patterns and stay motivated.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 bg-linear-to-br from-blue-500 to-indigo-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Join thousands of learners who are already achieving their goals with structured, trackable learning paths.
            </p>
            <button
              onClick={() => setShowRegister(true)}
              className="inline-flex items-center gap-3 px-10 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all text-lg"
            >
              Create Your Free Account
              <FontAwesomeIcon icon={faArrowRight} className="w-6 h-6" />
            </button>
            <p className="text-blue-200 text-sm mt-6">No credit card required • Free forever</p>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                  <span className="text-white text-lg font-bold">🎗️</span>
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900">Personal Learning Platform</p>
                  <p className="text-xs text-gray-500">Learn at your own pace</p>
                </div>
              </div>
              <p className="text-center text-gray-500 text-sm">
                © {new Date().getFullYear()} All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}