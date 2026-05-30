import { useEffect, useState } from "react";
import { rankingService } from "@/services/rankingService";
import { RankingSnapshot } from "@/types/api";

export function useRanking() {
  const [ranking, setRanking] = useState<RankingSnapshot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    rankingService
      .getGlobalRanking()
      .then((data) => setRanking(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { ranking, loading };
}
