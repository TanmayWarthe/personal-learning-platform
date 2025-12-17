"use client";

import { useState } from "react";



export default function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
 
    function HandleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log(email , password)
    }

        return (
            <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white dark:from-zinc-900 dark:to-zinc-800 py-12 px-4">
                <section className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-zinc-800">
                    <h1 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-6 tracking-tight">Sign in to your account</h1>
                    <form onSubmit={HandleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="block w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 dark:focus:border-blue-600 outline-none text-gray-900 dark:text-gray-100 bg-white dark:bg-zinc-800"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="block w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 dark:focus:border-blue-600 outline-none text-gray-900 dark:text-gray-100 bg-white dark:bg-zinc-800"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-colors"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        );
}
