// components/landing/FeedPreview.tsx
"use client";

import { Eye, Heart, MessageSquare } from "lucide-react";

const feedPosts = [
  {
    author: "Carlão das Fezes",
    content: "Resultado da feijoada de ontem. Consistência de exportação! 💩✨",
    reactions: { poop: 34, flame: 12, heart: 8 },
  },
  {
    author: "Juliana Toalete",
    content: "Pós-café rendeu 18 minutos de puro lucro. Subi de elo! ☕🚽",
    reactions: { poop: 19, flame: 26, heart: 15 },
  },
];

export function FeedPreview() {
  return (
    <section className="mb-20">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black tracking-tight mb-2">
          OnlyFezes – O feed de bosta social
        </h2>
        <p className="text-muted-foreground font-medium max-w-xl mx-auto">
          Compartilhe suas conquistas, veja as obras-primas dos outros e receba análises de 
          saúde por IA. Tudo com spoiler ativável (você decide se quer ver o coco).
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {feedPosts.map((post, idx) => (
          <div key={idx} className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-10 rounded-full bg-secondary flex items-center justify-center text-xl">
                💩
              </div>
              <div>
                <p className="font-extrabold">{post.author}</p>
                <div className="flex items-center gap-2 text-xxs text-muted-foreground">
                  <span>🏆 Lama III</span>
                  <span>• há 2 horas</span>
                </div>
              </div>
            </div>
            <p className="text-sm mb-3">{post.content}</p>
            <div className="relative rounded-xl bg-background p-4 text-center border border-dashed border-border">
              <div className="flex flex-col items-center">
                <Eye className="size-5 text-muted-foreground mb-1" />
                <span className="text-xs font-bold text-muted-foreground">Spoiler de coco</span>
                <button className="mt-2 text-xs bg-secondary px-3 py-1 rounded-full">
                  Revelar obra
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4 text-xs">
              <span>💩 {post.reactions.poop}</span>
              <span>🔥 {post.reactions.flame}</span>
              <span>❤️ {post.reactions.heart}</span>
              <span className="flex items-center gap-1"><MessageSquare className="size-3" /> 3</span>
            </div>
          </div>
        ))}
        <div className="text-center">
          <button className="text-accent text-sm font-bold hover:underline cursor-pointer">
            Ver mais no feed →
          </button>
        </div>
      </div>
    </section>
  );
}