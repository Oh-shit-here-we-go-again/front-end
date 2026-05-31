// types/api/feed.ts
export interface BathroomSession {
  id: string;
  user: string;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number | null;
  earnings: string | null;
  photo_url: string | null;
  is_active: boolean;
  like_count: string; // string conforme API
  comment_count: string; // string conforme API
  created_at: string;
  likedByUser?: boolean;
  review?: Review | null;
}

export interface FeedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: BathroomSession[];
}

export interface LikeToggleRequest {
  session: string;
}

export interface LikeToggleResponse {
  id: string;
  session: string;
  user: string;
  created_at: string;
}

export interface Review {
  id: string;
  session: string;
  status: "pending" | "completed" | "failed";
  rating: number | null;
  ai_text: string;
  created_at: string;
}

export interface CreateReviewRequest {
  session: string;
  rating: number;
}
