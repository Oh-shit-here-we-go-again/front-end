// hooks/useFeed.ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { feedService } from "@/services/feedService";
import { likeService } from "@/services/likeService";
import { BathroomSession } from "../types/feed";

interface UseFeedReturn {
  sessions: BathroomSession[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  toggleLike: (sessionId: string, currentLikes: number) => Promise<void>;
  updateCommentCount: (sessionId: string, newCount: number) => void;
  refresh: () => Promise<void>;
}

export function useFeed(): UseFeedReturn {
  const [sessions, setSessions] = useState<BathroomSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const fetchFeed = useCallback(async (pageNum: number, append = false) => {
    try {
      const response = await feedService.getFeed(pageNum);
      const newSessions = response.results.map((session: any) => ({
        ...session,
        photo_url: session.photo || session.photo_url,
        likedByUser: !!session.liked_by_user,
      }));

      if (append) {
        setSessions((prev) => [...prev, ...newSessions]);
      } else {
        setSessions(newSessions);
      }

      setHasMore(!!response.next);
    } catch (error) {
      console.error("Erro ao carregar feed:", error);
      toast.error("💩 Não deu pra puxar o feed! O vaso tá entupido.");
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    await fetchFeed(nextPage, true);
    setPage(nextPage);
    setLoadingMore(false);
  }, [loadingMore, hasMore, page, fetchFeed]);

  const refresh = useCallback(async () => {
    setPage(1);
    setHasMore(true);
    setLoading(true);
    await fetchFeed(1, false);
    setLoading(false);
  }, [fetchFeed]);

  const toggleLike = useCallback(
    async (sessionId: string, currentLikes: number) => {
      try {
        // Optimistic update
        setSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId
              ? {
                ...s,
                like_count: String(
                  Number(s.like_count) + (s.likedByUser ? -1 : 1),
                ),
                likedByUser: !s.likedByUser,
              }
              : s,
          ),
        );

        await likeService.toggleLike(sessionId);
      } catch (error) {
        // Revert on error
        setSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId
              ? {
                ...s,
                like_count: String(currentLikes),
                likedByUser: !s.likedByUser,
              }
              : s,
          ),
        );
        toast.error("💩 Não consegui curtir! Tenta de novo.");
      }
    },
    [],
  );


  const updateCommentCount = useCallback((sessionId: string, newCount: number) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId ? { ...s, comment_count: String(newCount) } : s
      )
    );
  }, []);

  // Efeito de montagem: chama refresh de forma segura (sem warning)
  useEffect(() => {
    let active = true;
    const loadInitial = async () => {
      if (!active) return;
      await refresh();
    };
    loadInitial();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // refresh é estável, mas ignoramos dependência para evitar loop

  return {
    sessions,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    toggleLike,
    updateCommentCount,
    refresh,
  };
}
