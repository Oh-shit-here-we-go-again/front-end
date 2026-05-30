// lib/auth.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { AuthContextType } from "../types/AuthContextType";
import { User } from "../types/User";
import { apiFetch } from "./api";

// We adjust AuthContextType properties to match register changes if needed
export interface CustomAuthContextType extends Omit<AuthContextType, "login"> {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<CustomAuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const userData = await apiFetch("/api/auth/me/");
      setUser(userData);
    } catch (err) {
      console.error("Falha ao buscar usuário atual:", err);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchCurrentUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await apiFetch("/api/auth/login/", {
        method: "POST",
        body: JSON.stringify({ username, password }), // simplejwt accepts username/password
      });

      localStorage.setItem("token", data.access);
      localStorage.setItem("refresh", data.refresh);
      
      // Fetch details of authenticated user
      await fetchCurrentUser();
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const register = async (registerData: any) => {
    setIsLoading(true);
    try {
      const data = await apiFetch("/api/auth/register/", {
        method: "POST",
        body: JSON.stringify(registerData),
      });

      localStorage.setItem("token", data.access);
      localStorage.setItem("refresh", data.refresh);
      setUser(data.user);
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    window.location.href = "/login?descarga=true";
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        updateUser,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}