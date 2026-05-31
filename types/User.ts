export type User = {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  image?: string;

  // Optional fields used by dashboard calculations
  salary?: number;
  weeklyHours?: number;

  // Profile and api compatibility fields
  first_name?: string;
  last_name?: string;
  company?: string;
  monthly_salary?: number;
  avatar_url?: string;
  points_balance?: number;
  family?: string | { id: string; name: string; invite_code: string };
};
