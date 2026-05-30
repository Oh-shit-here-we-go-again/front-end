"use client";

import { createContext, useContext, useEffect, useReducer } from "react";
import { AuthContextType } from "@/types/AuthContextType";
import { authReducer, getUserFromCookie, initialState } from "../../types/authReducer";
import { User } from "../../types/User";


const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
    const savedUser = getUserFromCookie();
    if(savedUser) {
        dispatch({ type: "RESTORE_STATE", payload: savedUser });
    }
    else {
        dispatch({ type: "LOGOUT" });
    }
    }, []);
    const login = async(email: string, password: string) => {
        dispatch({ type: "LOGIN_START" });

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error("Invalid credentials");
            }

            const user: User = await response.json();
            dispatch({ type: "LOGIN_SUCCESS"    , payload: user });
        }
        catch(error) {
            dispatch({ type: "LOGIN_FAILURE" });
            throw error;
        }
    };
    const logout = () => {
        dispatch({ type: "LOGOUT" });
        window.location.href = "/";
    };

    return (
        <AuthContext.Provider value={{  user: state.user,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        login,
        logout,}}>
            {children}
        </AuthContext.Provider>
    );
}

  export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}