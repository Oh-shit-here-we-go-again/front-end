import { api } from "@/lib/api-client";
import { RankingSnapshot } from "@/types/api";

export const rankingService = {
  getGlobalRanking: () =>
    api.get<RankingSnapshot[]>("/ranking/global_ranking/"),
  getMonthlyRanking: (year: number, month: number) =>
    api.get<RankingSnapshot[]>(`/ranking/monthly/?year=${year}&month=${month}`),
};
