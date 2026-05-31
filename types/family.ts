// types/api/family.ts
export interface Family {
  id: string; // uuid
  name: string;
  invite_code: string;
  owner: string | { id: string; username: string; avatar_url?: string }; // user id or user object
  member_count: string; // API.yaml says string (readOnly)
  created_at: string;
}

export interface FamilyRegister {
  name: string;
}

// /api/families/join/ request body (API.yaml)
export interface FamilyFlat {
  id: string;
  name: string;
  invite_code: string;
}

// internal helper type for our service/hook usage
export interface JoinFamilyRequest {
  invite_code: string;
}

export interface Paginated<T> {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: T[];
}

// API.yaml references Family for /members/ and FamilyRegister for /ranking/.
// In practice, the backend likely returns richer user/score info.
// We model a "ranking member" as the UI already needs: user fields + earnings/points.
export interface FamilyMember {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;

  // used by FamilyRanking UI
  earnings?: string; // R$ as string (see other schemas like sessions earnings)
  points_balance?: number;
}
