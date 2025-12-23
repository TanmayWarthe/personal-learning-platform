"use client";

import { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/users/me", {
        credentials: "include"
      });
      if (!res.ok) throw new Error("Invalid token");
      const data = await res.json();
      setUser(data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Token is now handled via HTTP-only cookie by backend
    refreshUser();
  }, []);


    function logout() {
    // Call backend logout endpoint to clear cookie
    fetch("http://localhost:5000/auth/logout", {
      method: "POST",
      credentials: "include"
    }).finally(() => {
      setUser(null);
      window.location.href = "/login";
    });
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
