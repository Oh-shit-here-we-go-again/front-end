// components/feed/ReviewDialog.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { reviewService } from "@/services/reviewService";
import { Review } from "@/types/feed";
import { Award, GlassWater, ShieldAlert, Sparkles } from "lucide-react";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId: string;
}

export function ReviewDialog({
  open,
  onOpenChange,
  sessionId,
}: ReviewDialogProps) {
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && sessionId) {
      setLoading(true);
      reviewService
        .fetchReviewBySession(sessionId)
        .then(setReview)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [open, sessionId]);

  const renderRatingPoops = (rating: number | null) => {
    if (!rating) return null;
    return (
      <div className="flex gap-1 text-xl">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={i < rating ? "filter drop-shadow-md grayscale-0" : "grayscale opacity-25"}
          >
            💩
          </span>
        ))}
      </div>
    );
  };

  const formatReviewText = (rawText: string) => {
    if (!rawText) return null;

    const lines = rawText.split("\n");
    const formattedElements: React.ReactNode[] = [];
    let keyCounter = 0;
    let inIntro = true;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      if (line === "---") {
        inIntro = false;
        formattedElements.push(
          <div key={`hr-${keyCounter++}`} className="border-t border-amber-600/15 my-4" />
        );
        continue;
      }

      const headerMatch = line.match(/^\*\*(.*?):\*\*(.*)$/);
      if (headerMatch) {
        const title = headerMatch[1].trim();
        let content = headerMatch[2].trim();

        if (!content && i + 1 < lines.length) {
          content = lines[i + 1].trim();
          i++;
        }

        const cleanContent = content.replace(/\*\*/g, "");

        let emoji = "📋";
        if (title.includes("Aparência")) emoji = "👁️";
        else if (title.includes("Aroma")) emoji = "👃";
        else if (title.includes("Corpo")) emoji = "📐";
        else if (title.includes("Complexidade")) emoji = "🧠";
        else if (title.includes("Harmonização")) emoji = "🍷";
        else if (title.includes("Nota")) emoji = "⭐";
        else if (title.includes("Veredito")) emoji = "✍️";

        formattedElements.push(
          <div
            key={`section-${keyCounter++}`}
            className="group hover:border-amber-600/35 transition-all duration-300 bg-white/50 dark:bg-stone-900/50 p-4 rounded-2xl border border-amber-600/10 shadow-sm flex flex-col gap-1.5"
          >
            <div className="flex items-center gap-1.5 text-xs font-black tracking-wider uppercase text-amber-700 dark:text-amber-400 font-mono">
              <span className="text-sm select-none">{emoji}</span>
              {title}
            </div>
            <p className="text-xs font-serif text-stone-700 dark:text-stone-300 leading-relaxed pl-5 italic">
              {cleanContent}
            </p>
          </div>
        );
        continue;
      }

      const cleanLine = line.replace(/\*\*/g, "");
      if (inIntro) {
        formattedElements.push(
          <p
            key={`intro-${keyCounter++}`}
            className="text-stone-600 dark:text-stone-400 font-serif italic text-xs leading-relaxed text-center px-4"
          >
            {cleanLine}
          </p>
        );
      } else {
        formattedElements.push(
          <p
            key={`para-${keyCounter++}`}
            className="text-stone-700 dark:text-stone-300 font-serif italic text-xs leading-relaxed pl-5"
          >
            {cleanLine}
          </p>
        );
      }
    }

    return <div className="space-y-3.5 max-h-[50vh] overflow-y-auto pr-1">{formattedElements}</div>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col p-6 rounded-3xl border-4 border-amber-600/35 bg-gradient-to-br from-amber-50/95 via-stone-50/98 to-amber-100/90 dark:from-stone-950 dark:via-stone-900/95 dark:to-amber-950/60 dark:border-amber-700/35 overflow-hidden shadow-2xl backdrop-blur-md">
        <DialogHeader className="pb-3 border-b border-amber-600/20 shrink-0">
          <DialogTitle className="flex items-center gap-2.5 text-lg font-serif italic text-amber-700 dark:text-amber-400">
            <Award className="size-6 text-amber-600 dark:text-amber-500 animate-bounce" />
            Laudo do Sommelier de Dejetos
          </DialogTitle>
          <p className="text-[9px] text-stone-500 dark:text-stone-400 font-mono tracking-widest uppercase">
            DR. CLÉBER AUGUSTO FONSECA — ABSD
          </p>
        </DialogHeader>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {loading ? (
            <div className="text-center py-16 text-xs text-amber-600 dark:text-amber-400 font-bold font-serif animate-pulse flex flex-col items-center justify-center gap-3">
              <span className="text-4xl animate-spin duration-3000">🍷</span>
              Decantando os aromas e analisando a textura...
            </div>
          ) : review ? (
            <div className="space-y-4 font-serif text-sm leading-relaxed text-stone-900 dark:text-stone-100">
              {formatReviewText(review.ai_text)}

              {review.rating && (
                <div className="flex items-center justify-between border-t border-amber-600/20 pt-4 bg-amber-500/5 p-3.5 rounded-xl border border-amber-500/10">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-stone-500 dark:text-stone-400 font-mono">
                      Avaliação de Consistência
                    </span>
                    <span className="text-xs font-serif text-stone-700 dark:text-stone-300 italic">
                      Harmoniosa e expressiva
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {renderRatingPoops(review.rating)}
                    <span className="text-[10px] font-black text-amber-700 dark:text-amber-400 font-mono">
                      {review.rating}/5 PONTOS
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShieldAlert className="size-10 mx-auto mb-3 text-red-500 opacity-80" />
              <p className="text-xs font-serif font-bold text-stone-600 dark:text-stone-400">
                Nenhuma avaliação disponível.
              </p>
              <p className="text-[10px] text-stone-400 mt-1">
                Certifique-se de que a sessão foi concluída com foto e que a IA do Dr. Cléber já processou o laudo.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
