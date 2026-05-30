import { useAuth } from "@/lib/auth";
import { sessionService } from "@/services/sessionService";
import { userService } from "@/services/userService";
import { useEffect, useState } from "react";

import { DashboardData } from "../types/DashboardData";

export function useDashboardData() {
  const { user: authUser, isAuthenticated } = useAuth();
  const [data, setData] = useState<DashboardData>({
    user: null,
    recentSessions: [],
    totalEarnings: 0,
    totalSessions: 0,
    totalPoints: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!isAuthenticated) return;
    let isMounted = true;

    async function fetchData() {
      try {
        const [user, sessionsRes] = await Promise.all([
          userService.getMe(),
          sessionService.getUserSessions(),
        ]);

        const sessions = sessionsRes.results;
        const totalEarnings = sessions.reduce(
          (sum, s) => sum + parseFloat(s.earnings || "0"),
          0,
        );
        const totalSessions = sessions.length;
        const totalPoints = sessions.reduce(
          (sum, s) => sum + (s.like_count + s.comment_count),
          0,
        ); // exemplo fictício – ajuste conforme sua lógica de pontos

        if (isMounted) {
          const mappedUser = user
            ? {
                ...user,
                // types/api.User tem `username`; types/User.ts espera `name`
                name: (user as { username?: string }).username ?? "",
              }
            : null;

          setData({
            user: mappedUser as unknown as DashboardData["user"],
            recentSessions: sessions.slice(0, 5),
            totalEarnings,
            totalSessions,
            totalPoints,
            loading: false,
            error: null,
          });
        }
      } catch (err) {
        if (isMounted) {
          setData((prev) => ({
            ...prev,
            loading: false,
            error: "Falha ao carregar dados",
          }));
        }
      }
    }

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  return data;
}
