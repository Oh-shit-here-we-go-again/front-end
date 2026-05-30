"use client";

import React, { useState } from "react";
import { MessageSquare, ShieldAlert, ShieldCheck, Heart, Users, Sparkles, Plus, Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/lib/auth";

interface Post {
  id: number;
  author: string;
  avatar: string;
  rank: string;
  time: string;
  content: string;
  type: string; // consistência
  revealed: boolean;
  poops: number;
  flames: number;
  likes: number;
  comments: { author: string; text: string }[];
}

export default function FeedPage() {
  const { user } = useAuth();
  const [newPostText, setNewPostText] = useState("");
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: "Juliana Toalete",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=juliana",
      rank: "👑 Trono Divino I",
      time: "Há 15 min",
      content: "Uma obra prima tática após o café da manhã. Faturamento líquido de R$ 12,40 em 20 minutos de paz total na cabine 3 da sede.",
      type: "Fezes Tipo 4 (Macia e Lisa)",
      revealed: false,
      poops: 42,
      flames: 12,
      likes: 18,
      comments: [
        { author: "Carlos", text: "Excelente consistência, parabéns pelo avanço!" },
        { author: "Felipe", text: "Isso que é retorno sobre investimento empresarial." }
      ]
    },
    {
      id: 2,
      author: "Carlos Caçador",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=carlos",
      rank: "🥈 Assento de Prata I",
      time: "Há 1 hora",
      content: "Resultado daquela feijoada braba de quarta-feira. Meta batida e elo mantido. A IA de saúde confirmou que a hidratação está excelente.",
      type: "Fezes Tipo 3 (Firme com rachaduras)",
      revealed: false,
      poops: 19,
      flames: 34,
      likes: 8,
      comments: [
        { author: "Juliana", text: "Belo elo! Rumo ao Trono de Ouro." }
      ]
    }
  ]);

  const handleReveal = (id: number) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, revealed: !post.revealed } : post))
    );
  };

  const handleReact = (id: number, type: "poops" | "flames" | "likes") => {
    setPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, [type]: post[type] + 1 } : post))
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost: Post = {
      id: Math.random(),
      author: user?.name || "Você (Simulado)",
      avatar: user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name}`,
      rank: "🥉 Lama I",
      time: "Agora mesmo",
      content: newPostText,
      type: "Fezes Tipo 4 (Macia e Lisa)",
      revealed: false,
      poops: 0,
      flames: 0,
      likes: 0,
      comments: []
    };

    setPosts((prev) => [newPost, ...prev]);
    setNewPostText("");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-black border border-primary/20 mb-3">
          <Sparkles className="size-4 animate-pulse" />
          <span>OnlyFezes — O Feed da Bosta</span>
        </div>
        <h1 className="text-2xl font-black text-foreground">Comunidade do Trono</h1>
        <p className="text-xs text-muted-foreground mt-1">
          A primeira rede social voltada para profissionais que valorizam seu tempo fisiológico
        </p>
      </div>

      {/* Share Post Card */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-md mb-8">
        <form onSubmit={handleCreatePost}>
          <div className="flex gap-3">
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name || "user"}`}
              alt="Avatar"
              className="size-10 rounded-full border border-border bg-secondary"
            />
            <textarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="Como foi sua ida ao banheiro? Compartilhe seus rendimentos e análises..."
              rows={3}
              className="flex-1 bg-transparent border-0 resize-none text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-0 mt-2"
            />
          </div>
          <div className="flex items-center justify-between border-t border-border/60 pt-3 mt-3">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <ImageIcon className="size-4" /> Anexar Amostra
            </button>
            <button
              type="submit"
              className="bg-primary text-primary-foreground font-bold text-xs px-4 py-2 rounded-xl hover:bg-primary/95 transition cursor-pointer"
            >
              Publicar Relatório
            </button>
          </div>
        </form>
      </div>

      {/* Social Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-card border border-border rounded-2xl p-6 shadow-md relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src={post.avatar} alt={post.author} className="size-10 rounded-full bg-secondary border border-border" />
                <div>
                  <h4 className="font-extrabold text-sm text-foreground">{post.author}</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xxs bg-primary/10 text-primary px-1.5 py-0.5 rounded font-black border border-primary/15">
                      {post.rank}
                    </span>
                    <span className="text-xxs text-muted-foreground">{post.time}</span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md flex items-center gap-1">
                <ShieldCheck className="size-3.5 text-green-500" /> Analisado por IA
              </div>
            </div>

            {/* Content */}
            <p className="text-sm text-foreground mb-4 leading-relaxed">{post.content}</p>

            {/* Visual Spoiler Container */}
            <div className="relative rounded-xl border border-border/85 overflow-hidden bg-background mb-4 text-center p-6 flex flex-col items-center justify-center min-h-[140px]">
              {!post.revealed ? (
                <div className="absolute inset-0 bg-secondary/80 backdrop-blur-xl flex flex-col items-center justify-center p-4">
                  <ShieldAlert className="size-8 text-poop mb-2 animate-bounce" />
                  <p className="text-xs font-black text-foreground uppercase tracking-wider mb-2">
                    ⚠️ ALERTA DE SPOILER DE COCO
                  </p>
                  <button
                    onClick={() => handleReveal(post.id)}
                    className="px-4 py-2 text-xxs font-extrabold bg-primary text-primary-foreground rounded-lg hover:bg-primary/95 transition cursor-pointer"
                  >
                    Visualizar Obra
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <span className="text-5xl animate-bounce">💩</span>
                  <span className="text-xs font-extrabold text-muted-foreground mt-2 uppercase tracking-wide">
                    Consistência: {post.type}
                  </span>
                  <button
                    onClick={() => handleReveal(post.id)}
                    className="mt-3 text-xxs font-bold text-muted-foreground underline hover:text-foreground cursor-pointer"
                  >
                    Ocultar imagem
                  </button>
                </div>
              )}
              {/* Sample indicator */}
              <span className="text-sm font-bold text-muted-foreground/30">Visualização de Amostra Sanitária</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 border-t border-border/60 pt-4">
              <button
                onClick={() => handleReact(post.id, "poops")}
                className="flex items-center gap-1.5 text-xs bg-secondary/60 hover:bg-secondary px-3 py-1.5 rounded-full border border-gold/20 transition cursor-pointer"
              >
                <span>💩</span>
                <span className="font-extrabold text-foreground">{post.poops}</span>
              </button>
              <button
                onClick={() => handleReact(post.id, "flames")}
                className="flex items-center gap-1.5 text-xs bg-secondary/60 hover:bg-secondary px-3 py-1.5 rounded-full border border-gold/20 transition cursor-pointer"
              >
                <span>🔥</span>
                <span className="font-extrabold text-foreground">{post.flames}</span>
              </button>
              <button
                onClick={() => handleReact(post.id, "likes")}
                className="flex items-center gap-1.5 text-xs bg-secondary/60 hover:bg-secondary px-3 py-1.5 rounded-full border border-gold/20 transition cursor-pointer"
              >
                <span>❤️</span>
                <span className="font-extrabold text-foreground">{post.likes}</span>
              </button>
            </div>

            {/* Comments List */}
            {post.comments.length > 0 && (
              <div className="mt-4 bg-muted/40 p-4 rounded-xl space-y-2 border border-border/40">
                <p className="text-xxs font-black text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-1">
                  <MessageSquare className="size-3" /> Comentários
                </p>
                {post.comments.map((comment, index) => (
                  <p key={index} className="text-xs text-foreground leading-relaxed flex items-start gap-1">
                    <span className="font-bold shrink-0">{comment.author}:</span>
                    <span className="text-muted-foreground">{comment.text}</span>
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
