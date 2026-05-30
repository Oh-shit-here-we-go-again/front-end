// lib/auth.tsx
"use client";

import { createContext, useContext, useEffect, useReducer } from "react";
import { AuthAction, initialState } from "../types/AuthAction";
import { AuthState } from "../types/AuthState";
import { User } from "../types/User";
import {
  api,
  getTokenFromCookie,
  removeTokenCookie,
  setTokenCookie,
} from "./api-client";

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "RESTORE_STATE":
      return {
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      };
    case "LOGIN_START":
      return { ...state, isLoading: true };
    case "LOGIN_SUCCESS":
      return { user: action.payload, isAuthenticated: true, isLoading: false };
    case "LOGIN_FAILURE":
      return { ...state, isLoading: false };
    case "UPDATE_USER":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { user: null, isAuthenticated: false, isLoading: false };
    default:
      return state;
  }
}

const AuthContext = createContext<{
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  register: (registerData: any) => Promise<void>;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const restoreUser = async () => {
      const token = getTokenFromCookie();
      if (!token) {
        dispatch({ type: "RESTORE_STATE", payload: null });
        return;
      }
      try {
        const user = await api.get<User>("/auth/me/");
        dispatch({ type: "RESTORE_STATE", payload: user });
      } catch {
        removeTokenCookie();
        dispatch({ type: "RESTORE_STATE", payload: null });
      }
    };
    restoreUser();
  }, []);
  const login = async (email: string, password: string) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const { access } = await api.post<{ access: string; refresh: string }>(
        "/auth/login/",
        { email, password },
        { requiresAuth: false },
      );
      setTokenCookie(access);
      const user = await api.get<User>("/auth/me/");
      dispatch({ type: "LOGIN_SUCCESS", payload: user });
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE" });
      throw error;
    }
  };
  const logout = () => {
    removeTokenCookie();
    dispatch({ type: "LOGOUT" });
    window.location.href = "/login";
  };
  const updateUser = (user: User) => {
    dispatch({ type: "UPDATE_USER", payload: user });
  };
  const register = async (registerData: any) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const response = await api.post<{ access?: string; refresh?: string }>(
        "/auth/register/",
        registerData,
        { requiresAuth: false }
      );
      let access = response.access;
      if (access) {
        setTokenCookie(access);
      } else {
        const loginRes = await api.post<{ access: string }>(
          "/auth/login/",
          { email: registerData.email, password: registerData.password },
          { requiresAuth: false }
        );
        access = loginRes.access;
        setTokenCookie(access);
      }
      const user = await api.get<User>("/auth/me/");
      dispatch({ type: "LOGIN_SUCCESS", payload: user });
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE" });
      throw error;
    }
  };
  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        login,
        logout,
        updateUser,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
