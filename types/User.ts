export type User = {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  image?: string;

  // Optional fields used by dashboard calculations
  salary?: number;
  weeklyHours?: number;
};
