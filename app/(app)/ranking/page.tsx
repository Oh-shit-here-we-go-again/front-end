"use client";

import React, { useState } from "react";
import { Trophy, Medal, Timer, Search, Flame, Users, Info } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function RankingPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"weekly" | "global">("weekly");

  // Mock tournament data
  const rankingList = [
    { rank: 1, name: "João da Silva", company: "Ambev", poops: 24, elo: "👑 Trono Divino III", isCurrentUser: false },
    { rank: 2, name: "Fernanda Costa", company: "Itaú", poops: 22, elo: "🥇 Assento de Ouro II", isCurrentUser: false },
    { rank: 3, name: "Carlos Henrique", company: "Mercado Livre", poops: 19, elo: "🥈 Assento de Prata I", isCurrentUser: false },
    { rank: 4, name: "Você", company: user?.email?.split("@")[1]?.split(".")[0] || "Sua Empresa", poops: 12, elo: "🥉 Lama II", isCurrentUser: true },
    { rank: 5, name: "Mariana Alencar", company: "Stone Co", poops: 10, elo: "Lama I", isCurrentUser: false },
    { rank: 6, name: "Lucas Souza", company: "Nubank", poops: 8, elo: "Lama I", isCurrentUser: false }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 bg-secondary text-secondary-foreground px-4 py-1.5 rounded-full text-xs font-black border border-gold/30 mb-4">
          <Trophy className="size-4 text-gold animate-bounce" />
          <span>Campeonato Semanal CLT</span>
        </div>
        <h1 className="text-3xl font-black text-foreground">Ranking de Produtividade Inversa</h1>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-lg mx-auto">
          Quem passou mais tempo faturando no banheiro esta semana? O Top 3 ganha bônus de ShitCoins na lojinha!
        </p>
      </div>

      {/* Stats Board & Countdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border p-5 rounded-2xl shadow-md text-center">
          <Timer className="size-5 text-accent mx-auto mb-2" />
          <span className="text-xxs font-bold text-muted-foreground uppercase">Tempo Restante</span>
          <p className="text-lg font-black text-foreground mt-1">2 dias, 14 horas</p>
        </div>

        <div className="bg-card border border-border p-5 rounded-2xl shadow-md text-center">
          <Flame className="size-5 text-red-500 mx-auto mb-2 animate-pulse" />
          <span className="text-xxs font-bold text-muted-foreground uppercase">Total de Competidores</span>
          <p className="text-lg font-black text-foreground mt-1">1.248 profissionais</p>
        </div>

        <div className="bg-card border border-border p-5 rounded-2xl shadow-md text-center">
          <Medal className="size-5 text-gold mx-auto mb-2" />
          <span className="text-xxs font-bold text-muted-foreground uppercase">Premiação do Top 3</span>
          <p className="text-lg font-black text-foreground mt-1">500 ShitCoins</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/80 mb-6">
        <button
          onClick={() => setActiveTab("weekly")}
          className={`pb-3 text-sm font-bold border-b-2 px-4 transition-all cursor-pointer ${
            activeTab === "weekly" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Liga Semanal
        </button>
        <button
          onClick={() => setActiveTab("global")}
          className={`pb-3 text-sm font-bold border-b-2 px-4 transition-all cursor-pointer ${
            activeTab === "global" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Ranking Histórico
        </button>
      </div>

      {/* Leaderboard list */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-md">
        <div className="p-4 bg-muted/40 border-b border-border/60 flex items-center justify-between text-xxs font-bold text-muted-foreground uppercase tracking-wider px-6">
          <div className="flex items-center gap-6">
            <span className="w-6 text-center">Pos</span>
            <span>Competidor / Empresa</span>
          </div>
          <div className="flex items-center gap-12">
            <span>Elo</span>
            <span>Idas ao Vaso</span>
          </div>
        </div>

        <div className="divide-y divide-border/60">
          {rankingList.map((competitor) => {
            const isTop3 = competitor.rank <= 3;
            return (
              <div
                key={competitor.rank}
                className={`py-4 px-6 flex items-center justify-between transition-colors ${
                  competitor.isCurrentUser ? "bg-primary/5 font-bold" : "hover:bg-muted/10"
                }`}
              >
                <div className="flex items-center gap-6">
                  <span className={`w-6 text-center text-sm font-black ${
                    isTop3 ? (competitor.rank === 1 ? "text-gold" : competitor.rank === 2 ? "text-gray-400" : "text-amber-600") : "text-muted-foreground"
                  }`}>
                    {competitor.rank === 1 ? "🥇" : competitor.rank === 2 ? "🥈" : competitor.rank === 3 ? "🥉" : competitor.rank}
                  </span>
                  <div>
                    <span className="text-sm font-black text-foreground flex items-center gap-1.5">
                      {competitor.name}
                      {competitor.isCurrentUser && (
                        <span className="text-xxs bg-primary text-primary-foreground px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                          Você
                        </span>
                      )}
                    </span>
                    <span className="text-xxs text-muted-foreground block">{competitor.company}</span>
                  </div>
                </div>

                <div className="flex items-center gap-12">
                  <span className="text-xs bg-muted px-2 py-0.5 rounded text-foreground font-black border border-border/40">
                    {competitor.elo}
                  </span>
                  <span className="text-sm font-black text-foreground w-12 text-center">
                    {competitor.poops}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 mt-6 flex items-start gap-3">
        <Info className="size-4 text-primary shrink-0 mt-0.5" />
        <p className="text-xxs text-muted-foreground leading-relaxed">
          O ranking da Liga Semanal reinicia todo domingo à meia-noite. As idas ao banheiro são validadas automaticamente através da calculadora e das sessões iniciadas no painel. Jogue limpo, nada de laxantes artificiais!
        </p>
      </div>
    </div>
  );
}
