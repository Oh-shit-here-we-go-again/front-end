import { BathroomSession } from "./api";
import { User } from "./User";

export interface DashboardData {
  user: User | null;
  recentSessions: BathroomSession[];
  totalEarnings: number;
  totalSessions: number;
  totalPoints: number;
  loading: boolean;
  error: string | null;
}
