// services/reviewService.ts
import { api } from "@/lib/api";
import { CreateReviewRequest, Review } from "../types/feed";

export const reviewService = {
  createReview: (data: CreateReviewRequest) =>
    api.post<Review>("/reviews/", data),
};
