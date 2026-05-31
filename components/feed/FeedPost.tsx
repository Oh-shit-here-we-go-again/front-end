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
import { proxyImage } from "@/lib/proxy-image";
import { BlurRevealDialog } from "./BlurRevealDialog";
import { ReviewDialog } from "./ReviewDialog";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BathroomSession } from "../../types/feed";

interface FeedPostProps {
  session: BathroomSession & {
    userDetails?: { username: string; avatar_url?: string };
  };
  onLike: (id: string, currentLikes: number) => Promise<void>;
  onComment?: (id: string) => void;
}

const POOP_PHRASES = [
  "Cronograma apertado, intestino também. Entregamos os dois. 🚀",
  "Mais um dever cumprido e remunerado com sucesso. 💼🚽",
  "O café da firma surtiu efeito mais rápido do que o esperado. ☕⚡",
  "Codando no trono. O verdadeiro clean code. 💻💩",
  "Reunião de alinhamento com a cerâmica concluída. 🤝",
  "Mais 15 minutos de pura produtividade analítica. 📈",
  "Garbage Collector executado manualmente com sucesso. 🧹🚮",
  "Deploy feito em produção. O pipeline fluiu sem travar! 🚀📦",
  "Resolvendo bug direto na raiz. A descarga deu merge sem conflitos! 🌿💻",
  "Refatoração concluída: o código antigo desceu redondo. 🛠️🌊",
  "Stack overflow resolvido no trono. Limpando a pilha de execução! 📚🚽",
  "Commit feito diretamente na privada. Histórico limpo! 💾🚿",
  "Limpando o cache da firma. Endpoint respondendo perfeitamente! 🧼⚡",
];

export function FeedPost({
  session,
  onLike,
  onComment,
}: FeedPostProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [revealDialogOpen, setRevealDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

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

  const phraseIndex = session.id
    ? session.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % POOP_PHRASES.length
    : 0;
  const funnyNote = POOP_PHRASES[phraseIndex];

  return (
    <>
      <Card className="overflow-hidden border-border/50 hover:shadow-lg transition-all duration-300">
        {/* Header */}
        <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-3">
          <Avatar className="size-10 border border-border/60">
            <AvatarImage src={proxyImage(session.userDetails?.avatar_url)} />
            <AvatarFallback className="bg-poop/15 text-poop font-bold">
              {session.userDetails?.username?.slice(0, 2).toUpperCase() || "??"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold text-sm text-foreground">
              {session.userDetails?.username || "Cagão Anônimo"}
            </p>
            <p className="text-xs text-muted-foreground">Refluxo Tech · {timeAgo}</p>
          </div>
        </CardHeader>

        {/* Stats Section (Above the photo) */}
        <div className="grid grid-cols-2 border-y border-border/30 py-3.5 px-6 bg-card/40">
          <div className="flex flex-col pr-4 border-r border-border/30">
            <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-black uppercase tracking-wider">
              ⏱️ Duração
            </span>
            <span className="text-lg sm:text-xl font-black font-mono mt-0.5 text-foreground">
              {duration}
            </span>
          </div>
          <div className="flex flex-col pl-6">
            <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-black uppercase tracking-wider">
              💰 Lucrou
            </span>
            <span className="text-lg sm:text-xl font-black font-mono mt-0.5 text-green-600 dark:text-green-400">
              +{earnings}
            </span>
          </div>
        </div>

        {/* Foto com blur */}
        <div
          className="relative cursor-pointer group aspect-video overflow-hidden border-b border-border/30"
          onClick={() => !isRevealed && setRevealDialogOpen(true)}
        >
          <div
            className={cn(
              "w-full h-full relative overflow-hidden transition-all duration-500",
              !isRevealed && "blur-2xl bg-[repeating-linear-gradient(45deg,rgba(139,94,60,0.08)_0px,rgba(139,94,60,0.08)_10px,rgba(0,0,0,0)_10px,rgba(0,0,0,0)_20px)] bg-muted/40",
            )}
          >
            <img
              src={proxyImage(session.photo_url) || "/placeholder.jpg"}
              alt="Sessão no trono"
              className="w-full h-full object-cover"
            />
          </div>
          {!isRevealed && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/35 backdrop-blur-md transition group-hover:bg-black/45">
              <span className="text-5xl mb-2 animate-pulse">🚽</span>
              <p className="text-white/90 text-xxs font-black tracking-widest uppercase select-none">
                [ Registro ]
              </p>
            </div>
          )}
        </div>

        {/* Description/Note */}
        <div className="px-6 py-4 text-sm text-foreground/90 leading-relaxed flex flex-col gap-3">
          <p>
            <span className="font-extrabold mr-1.5 text-foreground">{session.userDetails?.username || "Cagão"}</span>
            {funnyNote}
          </p>

          {/* Sommelier Review Status */}
          {session.review && (
            <div className="mt-1 flex items-center justify-between bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/25 rounded-2xl p-3 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-base select-none">🍷</span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black tracking-wider uppercase text-amber-700 dark:text-amber-400 font-mono">
                    Sommelier de Dejetos
                  </span>
                  <span className="text-xxs text-muted-foreground flex gap-1 items-center">
                    {session.review.status === "completed" && (
                      <>
                        Nota:{" "}
                        <span className="tracking-tighter">
                          {"💩".repeat(session.review.rating || 0)}
                        </span>
                      </>
                    )}
                    {session.review.status === "pending" && "Dr. Cléber está decantando a safra..."}
                    {session.review.status === "failed" && "O sommelier passou mal."}
                  </span>
                </div>
              </div>
              {session.review.status === "completed" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-[10px] font-black border-amber-500/30 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-xl cursor-pointer shadow-sm"
                  onClick={() => setReviewDialogOpen(true)}
                >
                  Ver Laudo
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <CardFooter className="flex justify-around border-t border-border/30 py-2.5 bg-secondary/5">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-xs font-bold cursor-pointer hover:bg-poop/10 hover:text-poop"
            onClick={() => onLike(session.id, parseInt(session.like_count))}
          >
            <Heart
              className={cn(
                "size-4",
                session.likedByUser ? "fill-red-500 text-red-500" : "text-muted-foreground",
              )}
            />
            <span>{session.like_count}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-xs font-bold cursor-pointer hover:bg-poop/10 hover:text-poop"
            onClick={() => onComment?.(session.id)}
          >
            <MessageCircle className="size-4 text-muted-foreground" />
            <span>{session.comment_count}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 text-xs font-bold cursor-pointer hover:bg-poop/10 hover:text-poop">
            <Share2 className="size-4 text-muted-foreground" />
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

      <ReviewDialog
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        sessionId={session.id}
      />
    </>
  );
}
