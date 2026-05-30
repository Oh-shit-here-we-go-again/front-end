// types/api.ts
export interface User {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  hourly_salary?: number;
  avatar_url?: string;
  family?: string;
  created_at: string;
}

export interface RankingSnapshot {
  id: string;
  user: string;
  month: number;
  year: number;
  total_earnings: string;
  total_sessions: number;
  rank_position: number;
  points: number;
}

export interface BathroomSession {
  id: string;
  user: string;
  started_at: string;
  ended_at?: string;
  duration_seconds?: number;
  earnings?: string;
  photo_url?: string;
  is_active: boolean;
  like_count: number;
  comment_count: number;
  created_at: string;
}
