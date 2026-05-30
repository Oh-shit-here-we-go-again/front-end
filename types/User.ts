export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  image?: string;

  // Optional fields used by dashboard calculations
  salary?: number;
  weeklyHours?: number;
};
