// lib/auth.ts
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
  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        login,
        logout,
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
