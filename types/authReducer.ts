// lib/authReducer.ts
import { User } from "@/types/User";
import Cookies from "js-cookie";
import { AuthState } from "./AuthState";

// Tipos


type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE" } 
  | { type: "LOGOUT" }
  | { type: "RESTORE_STATE"; payload: User | null };

// Estado inicial
export const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

// Reducer puro
export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isLoading: true };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case "LOGIN_FAILURE":
      return { ...state, isLoading: false };
    case "LOGOUT":
      return { user: null, isAuthenticated: false, isLoading: false };
    case "RESTORE_STATE":
      return {
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
}

// Funções auxiliares para cookies
export function setUserCookie(user: User) {
  Cookies.set("auth_user", JSON.stringify(user), { expires: 7 }); // 7 dias
}

export function clearUserCookie() {
  Cookies.remove("auth_user");
}

export function getUserFromCookie(): User | null {
  const cookie = Cookies.get("auth_user");
  if (!cookie) return null;
  try {
    return JSON.parse(cookie) as User;
  } catch {
    return null;
  }
}