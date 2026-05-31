// app/(app)/feed/page.tsx
"use client";

import { FeedPost } from "@/components/feed/FeedPost";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFeed } from "@/hooks/useFeed";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useCallback, useRef } from "react";

export default function FeedPage() {
  const {
    sessions,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    toggleLike,
    submitRating,
    refresh,
  } = useFeed();

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loadingMore) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [loadingMore, hasMore, loadMore],
  );

  if (loading && sessions.length === 0) {
    return (
      <div className="container max-w-2xl mx-auto p-4 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!loading && sessions.length === 0) {
    return (
      <div className="container max-w-2xl mx-auto p-8 text-center">
        <AlertCircle className="size-12 text-muted-foreground mx-auto mb-3" />
        <h2 className="text-xl font-bold mb-2">Nenhuma cagada por aqui...</h2>
        <p className="text-muted-foreground mb-4">
          Ainda não há sessões finalizadas com foto. Seja o primeiro a publicar
          sua obra-prima!
        </p>
        <Button onClick={refresh}>Recarregar</Button>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-poop to-gold bg-clip-text text-transparent">
            Sommelier de Coco
          </h1>
          <p className="text-sm text-muted-foreground">
            O que rolou nos tronos por aí 💩
          </p>
        </div>
        <Button variant="outline" size="icon" onClick={refresh}>
          <RefreshCw className="size-4" />
        </Button>
      </div>

      {/* Feed posts */}
      {sessions.map((session, index) => {
        // Mock user details (substituir por dados reais do backend quando disponível)
        const user = (session as unknown as { user?: unknown })?.user;
        const username =
          typeof user === "string"
            ? user.split("-")[0] || "Cagão"
            : typeof user === "object" && user !== null
              ? ((user as { username?: string; name?: string }).username ??
                (user as { username?: string; name?: string }).name ??
                "Cagão")
              : "Cagão";

        const userDetails = {
          username,
          avatar_url: undefined,
        };
        return (
          <div
            key={session.id}
            ref={index === sessions.length - 1 ? lastElementRef : undefined}
          >
            <FeedPost
              session={{ ...session, userDetails }}
              onLike={toggleLike}
              onRating={submitRating}
              onComment={(id) => console.log("Comment", id)}
            />
          </div>
        );
      })}

      {/* Loading more indicator */}
      {loadingMore && (
        <div className="flex justify-center py-4">
          <div className="animate-pulse text-muted-foreground">
            Carregando mais 💩...
          </div>
        </div>
      )}

      {/* End of feed */}
      {!hasMore && sessions.length > 0 && (
        <p className="text-center text-sm text-muted-foreground py-4">
          Chegou ao fim. Vá produzir conteúdo. 🚽
        </p>
      )}
    </div>
  );
}
