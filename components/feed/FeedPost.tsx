// components/feed/FeedPost.tsx
"use client";

import { useState } from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { BlurRevealDialog } from "./BlurRevealDialog";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BathroomSession } from "../../types/feed";

interface FeedPostProps {
  session: BathroomSession & {
    userDetails?: { username: string; avatar_url?: string };
  };
  onLike: (id: string, currentLikes: number) => Promise<void>;
  onRating: (id: string, rating: number) => Promise<void>;
  onComment?: (id: string) => void;
}

export function FeedPost({
  session,
  onLike,
  onRating,
  onComment,
}: FeedPostProps) {
  const [showRating, setShowRating] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [revealDialogOpen, setRevealDialogOpen] = useState(false);

  const duration = session.duration_seconds
    ? `${Math.floor(session.duration_seconds / 60)}min ${session.duration_seconds % 60}s`
    : "N/A";

  const earnings = session.earnings
    ? new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(parseFloat(session.earnings))
    : "R$ 0,00";

  const createdAt = new Date(session.created_at);
  const timeAgo = formatDistanceToNow(createdAt, {
    addSuffix: true,
    locale: ptBR,
  });

  const handleReveal = () => {
    setIsRevealed(true);
  };

  const handleRatingSubmit = async (rating: number) => {
    setUserRating(rating);
    await onRating(session.id, rating);
    setShowRating(false);
  };

  return (
    <>
      <Card className="overflow-hidden border-border/50 hover:shadow-lg transition-shadow">
        {/* Header */}
        <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-3">
          <Avatar className="size-10">
            <AvatarImage src={session.userDetails?.avatar_url} />
            <AvatarFallback className="bg-poop/20 text-poop">
              {session.userDetails?.username?.slice(0, 2).toUpperCase() || "??"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold text-sm">
              {session.userDetails?.username || "Cagão Anônimo"}
            </p>
            <p className="text-xs text-muted-foreground">{timeAgo}</p>
          </div>
          <div className="flex items-center gap-1 text-poop">
            <Star className="size-3 fill-poop" />
            <span className="text-xs font-bold">{userRating || "?"}</span>
          </div>
        </CardHeader>

        {/* Foto com blur */}
        <div
          className="relative cursor-pointer group"
          onClick={() => !isRevealed && setRevealDialogOpen(true)}
        >
          <div
            className={cn(
              "relative overflow-hidden",
              !isRevealed && "blur-2xl",
            )}
          >
            <img
              src={session.photo_url || "/placeholder.jpg"}
              alt="Sessão no trono"
              className="w-full aspect-video object-cover"
            />
          </div>
          {!isRevealed && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm group-hover:bg-black/40 transition">
              <span className="text-5xl mb-2">💩</span>
              <p className="text-white text-sm font-bold px-4 py-2 rounded-full bg-black/50">
                🔞 Conteúdo adulto - Clique para revelar
              </p>
            </div>
          )}
        </div>

        {/* Stats */}
        <CardContent className="pt-3 pb-2 space-y-2">
          <div className="flex justify-between text-sm">
            <div className="flex gap-4">
              <span className="font-mono">⏱️ {duration}</span>
              <span className="font-mono text-green-600 dark:text-green-400">
                💰 {earnings}
              </span>
            </div>
            <button
              onClick={() => setShowRating(!showRating)}
              className="text-xs text-muted-foreground hover:text-poop"
            >
              Avaliar esta obra
            </button>
          </div>

          {showRating && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
              <span className="text-sm">Avalie:</span>
              {[1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  onClick={() => handleRatingSubmit(r)}
                  className="text-xl transition-transform hover:scale-125"
                >
                  💩
                </button>
              ))}
            </div>
          )}
        </CardContent>

        {/* Action buttons */}
        <CardFooter className="flex justify-between border-t pt-3">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => onLike(session.id, parseInt(session.like_count))}
          >
            <Heart
              className={cn(
                "size-4",
                session.likedByUser && "fill-red-500 text-red-500",
              )}
            />
            <span>{session.like_count}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => onComment?.(session.id)}
          >
            <MessageCircle className="size-4" />
            <span>{session.comment_count}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <Share2 className="size-4" />
            <span>Espalhar</span>
          </Button>
        </CardFooter>
      </Card>

      <BlurRevealDialog
        open={revealDialogOpen}
        onOpenChange={setRevealDialogOpen}
        onConfirm={handleReveal}
        photoUrl={session.photo_url}
      />
    </>
  );
}
