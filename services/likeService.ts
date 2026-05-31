// services/likeService.ts
import { api } from "@/lib/api";
import { LikeToggleResponse } from "../types/feed";

export const likeService = {
  toggleLike: (sessionId: string) =>
    api.post<LikeToggleResponse>("/likes/toggle/", { session: sessionId }),
};
