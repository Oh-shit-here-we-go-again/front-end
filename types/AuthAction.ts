import { AuthState } from "./AuthState";
import { User } from "./User";

export type AuthAction =
  | { type: "RESTORE_STATE"; payload: User | null }
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE" }
  | { type: "UPDATE_USER"; payload: User }
  | { type: "LOGOUT" };

export const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};
