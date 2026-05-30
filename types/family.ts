// types/api/family.ts
export interface Family {
  id: string;
  name: string;
  invite_code: string;
  owner: string;
  member_count: string;
  created_at: string;
}

export interface FamilyRegister {
  name: string;
}

export interface FamilyFlat {
  id: string;
  name: string;
  invite_code: string;
}

export interface JoinFamilyRequest {
  invite_code: string;
}

export interface FamilyMember {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  earnings?: string;
  points_balance?: number;
}
