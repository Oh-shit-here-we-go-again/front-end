import { User } from "@/types/User";

export type AuthState = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
};