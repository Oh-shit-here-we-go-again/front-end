"use client";

import { useCallback, createContext, useContext, useEffect, useReducer } from "react";
import { AuthAction, initialState } from "../types/AuthAction";
import { AuthState } from "../types/AuthState";
import { User } from "../types/User";
import { shopService } from "@/features/shop/services/shopService";
import {
  api,
  getTokenFromCookie,
  removeTokenCookie,
  setTokenCookie,
} from "./api";

async function populateUserAvatar(user: User): Promise<User> {
  if (user.avatar) {
    if (user.avatar.startsWith("/") || user.avatar.startsWith("http")) {
      user.avatar_url = user.avatar;
    } else {
      try {
        const products = await shopService.fetchShopItems();
        const equipped = products.find((p) => String(p.avatar_id) === String(user.avatar) || String(p.id) === String(user.avatar) || p.image_url === user.avatar);
        if (equipped && equipped.image_url) {
          user.avatar_url = equipped.image_url;
        }
      } catch (e) {
        console.error("Erro ao popular avatar do usuário:", e);
      }
    }
  }
  return user;
}

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
  updateUser: (user: User) => void | Promise<void>;
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
        const populated = await populateUserAvatar(user);
        dispatch({ type: "RESTORE_STATE", payload: populated });
      } catch {
        removeTokenCookie();
        dispatch({ type: "RESTORE_STATE", payload: null });
      }
    };
    restoreUser();
  }, []);

  const login = async (username: string, password: string) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const { access } = await api.post<{ access: string; refresh: string }>(
        "/auth/login/",
        { username, password },
        { requiresAuth: false },
      );
      setTokenCookie(access);
      const user = await api.get<User>("/auth/me/");
      const populated = await populateUserAvatar(user);
      dispatch({ type: "LOGIN_SUCCESS", payload: populated });
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE" });
      throw error;
    }
  };

  const logout = () => {
    removeTokenCookie();
    dispatch({ type: "LOGOUT" });
    window.location.href = "/login?descarga=true";
  };

  const updateUser = useCallback(async (user: User) => {
    const populated = await populateUserAvatar(user);
    dispatch({ type: "UPDATE_USER", payload: populated });
  }, []);

  const register = async (registerData: any) => {
    await api.post(
      "/auth/register/",
      registerData,
      { requiresAuth: false }
    );
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
