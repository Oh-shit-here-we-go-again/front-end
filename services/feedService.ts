// services/feedService.ts
import { api } from "@/lib/api";
import { BathroomSession, FeedResponse } from "../types/feed";

export const feedService = {
  getFeed: (page = 1) => api.get<FeedResponse>(`/feed/?page=${page}`),

  getSession: (id: string) => api.get<BathroomSession>(`/feed/${id}/`),
};
