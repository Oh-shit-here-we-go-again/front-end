// services/reviewService.ts
import { api } from "@/lib/api";
import { Review } from "@/types/feed";

export const reviewService = {
  fetchReviewBySession: async (sessionId: string): Promise<Review | null> => {
    const res = await api.get<Review[] | { results: Review[] }>(`/reviews/`, {
      params: { session: sessionId },
    }) as any;
    const list = Array.isArray(res) ? res : res.results || [];
    return list[0] || null;
  }
};
