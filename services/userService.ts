import { api } from "@/lib/api-client";
import { User } from "@/types/api";

export const userService = {
  getMe: () => api.get<User>("/auth/me/"),
  updateMe: (data: Partial<User>) => api.patch<User>("/auth/me/", data),
};
