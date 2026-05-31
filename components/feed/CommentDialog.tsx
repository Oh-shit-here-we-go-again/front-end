// components/feed/CommentDialog.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Send, Trash2 } from "lucide-react";
import { commentService, Comment } from "@/services/commentService";
import { shopService } from "@/features/shop/services/shopService";
import { useAuth } from "@/lib/auth";
import { proxyImage } from "@/lib/proxy-image";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CommentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId: string;
  onCommentCountUpdate?: (newCount: number) => void;
}

export function CommentDialog({
  open,
  onOpenChange,
  sessionId,
  onCommentCountUpdate,
}: CommentDialogProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && sessionId) {
      setLoading(true);
      Promise.all([
        commentService.fetchComments(sessionId),
        shopService.fetchShopItems().catch(() => []),
      ])
        .then(([commentsList, shopProducts]) => {
          setComments(commentsList);
          setProducts(shopProducts);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [open, sessionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || submitting) return;

    setSubmitting(true);
    try {
      const created = await commentService.postComment(sessionId, newCommentText.trim());
      const updatedList = [...comments, created];
      setComments(updatedList);
      setNewCommentText("");
      onCommentCountUpdate?.(updatedList.length);
    } catch (err) {
      console.error("Erro ao postar comentário:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const getAvatarUrl = (author: any) => {
    if (!author) return undefined;
    const authorAvatar = author.avatar;
    if (authorAvatar && (authorAvatar.startsWith("/") || authorAvatar.startsWith("http"))) {
      return authorAvatar;
    }
    const matchingProduct = products.find(
      (p) => String(p.avatar_id) === String(authorAvatar) || String(p.id) === String(authorAvatar)
    );
    return proxyImage(matchingProduct?.image_url) || undefined;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[85vh] flex flex-col p-6 rounded-3xl">
        <DialogHeader className="pb-3 border-b border-border/60">
          <DialogTitle className="flex items-center gap-2 text-lg font-black text-foreground">
            <MessageSquare className="size-5 text-primary" />
            Comentários da Cagada
          </DialogTitle>
        </DialogHeader>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 max-h-[50vh] pr-1">
          {loading ? (
            <div className="text-center py-8 text-xs text-muted-foreground animate-pulse">
              Consultando o sommelier de opiniões...
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-10">
              <span className="text-3xl block mb-2">🧻</span>
              <p className="text-xs font-bold text-muted-foreground">Silêncio no trono.</p>
              <p className="text-[10px] text-muted-foreground/80 mt-1">Seja o primeiro a dar o seu feedback fecal!</p>
            </div>
          ) : (
            comments.map((comment, index) => {
              const displayName = comment.author?.username || "Anônimo";
              const initials = displayName.slice(0, 2).toUpperCase();
              let validDate = new Date();
              if (comment.created_at) {
                const parsed = new Date(comment.created_at);
                if (!isNaN(parsed.getTime())) {
                  validDate = parsed;
                }
              }
              const timeAgo = formatDistanceToNow(validDate, {
                addSuffix: true,
                locale: ptBR,
              });
              const avatarUrl = getAvatarUrl(comment.author);

              return (
                <div key={`comment-${comment.id || index}-${index}`} className="flex gap-3 text-sm items-start">
                  <Avatar className="size-8 border border-border/60 shrink-0">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback className="bg-poop/15 text-poop font-bold text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 bg-secondary/20 border border-border/40 rounded-2xl px-3.5 py-2.5">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-extrabold text-foreground text-xs">@{displayName}</span>
                      <span className="text-[10px] text-muted-foreground">{timeAgo}</span>
                    </div>
                    <p className="text-foreground/90 leading-relaxed text-xs break-all whitespace-pre-wrap">{comment.text}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="pt-3 border-t border-border/60 flex gap-2 items-center">
          <input
            type="text"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Digite sua crítica fecal..."
            className="flex-1 bg-card border border-border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 transition-all text-foreground"
            disabled={submitting}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!newCommentText.trim() || submitting}
            className="size-9 rounded-xl shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center cursor-pointer disabled:opacity-60"
          >
            <Send className="size-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
