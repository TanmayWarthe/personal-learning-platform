"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Toast, { type ToastType } from "@/components/Toast";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Basic validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ 
          name: fullName, 
          email, 
          password 
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError((data as any).message || "Registration failed");
        return;
      }
      // Token is now set by backend in HTTP-only cookie
      setToast({ message: "Congratulations! Your account has been created.", type: "success" });
      // Give user a moment to read the toast before redirecting
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);

    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="vh-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="w-full max-w-sm mx-auto">
        {/* Logo Section */}
        <div className="text-center mb-6">

          <h1 className="text-xl font-bold text-gray-900">Personal Learning Platform</h1>
          <p className="text-gray-600 mt-1 text-xs">Start your programming journey today</p>
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Create your account</h2>
          
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name Input */}
            <div>
              <label htmlFor="fullName" className="block text-xs font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-gray-900 placeholder-gray-400"
                  placeholder="Tanmay Warthe"
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-gray-900 placeholder-gray-400"
                  placeholder="tanmay@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-gray-900 placeholder-gray-400"
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-gray-900 placeholder-gray-400"
                  placeholder="••••••••"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-600 flex items-center">
                  <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              </div>
            )}


            {/* Create Account Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-sm font-medium text-white rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center text-sm">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Login Link */}
            <div className="pt-3 border-t border-gray-200">
              <p className="text-center text-gray-600 text-xs">
                Already have an account?{" "}
                <a 
                  href="/login" 
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/login");
                  }}
                >
                  Sign in
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}