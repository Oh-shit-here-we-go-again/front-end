"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useRanking } from "@/hooks/useRanking";
import { familyService } from "@/services/familyService";
import { FamilyMember } from "@/types/family";
import { Trophy, Users, Globe, ArrowRight, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { shopService } from "@/features/shop/services/shopService";
import { proxyImage } from "@/lib/proxy-image";
import Link from "next/link";

export default function RankingPage() {
  const { user } = useAuth();
  const { ranking: globalRanking, loading: globalLoading } = useRanking();
  
  const [activeTab, setActiveTab] = useState<"global" | "group">("global");
  const [groupRanking, setGroupRanking] = useState<FamilyMember[]>([]);
  const [groupLoading, setGroupLoading] = useState(false);
  const [groupError, setGroupError] = useState<string | null>(null);
  const [avatarMap, setAvatarMap] = useState<Record<string, string>>({});

  useEffect(() => {
    shopService
      .fetchShopItems()
      .then((products) => {
        const map: Record<string, string> = {};
        products.forEach((p) => {
          if (p.avatar_id && p.image_url) {
            map[String(p.avatar_id)] = proxyImage(p.image_url);
          }
        });
        setAvatarMap(map);
      })
      .catch((err) => console.error("Erro ao carregar avatares no ranking:", err));
  }, []);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  // Fetch group ranking if user is in a family
  useEffect(() => {
    const familyId = typeof user?.family === "object" && user?.family ? (user.family as any).id : user?.family;
    if (familyId && activeTab === "group") {
      setGroupLoading(true);
      setGroupError(null);
      familyService
        .getFamilyRanking(familyId)
        .then((data) => {
          // Sort by earnings descending
          const sorted = [...data].sort((a, b) => {
            const ea = parseFloat(a.earnings || "0");
            const eb = parseFloat(b.earnings || "0");
            return eb - ea;
          });
          setGroupRanking(sorted);
        })
        .catch((err) => {
          console.error("Erro ao buscar ranking do grupo:", err);
          setGroupError("Não foi possível carregar o ranking do grupo.");
        })
        .finally(() => {
          setGroupLoading(false);
        });
    }
  }, [user, activeTab]);

  // Calculate monthly reset countdown
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      // Reset target: end of current month
      const target = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      const difference = target.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const m = Math.floor((difference / 1000 / 60) % 60);
      const s = Math.floor((difference / 1000) % 60);

      setTimeLeft({
        days: d.toString().padStart(2, "0"),
        hours: h.toString().padStart(2, "0"),
        minutes: m.toString().padStart(2, "0"),
        seconds: s.toString().padStart(2, "0"),
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (val: string | number) => {
    const num = typeof val === "string" ? parseFloat(val) : val;
    return num.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const getInitials = (name: string) => {
    if (!name) return "💩";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Prepare normalized list depending on active tab
  const getNormalizedData = () => {
    if (activeTab === "global") {
      return globalRanking.map((item, index) => {
        const username = (item as any).username || item.user || "";
        const rawAvatar = (item as any).avatar_url || (item as any).avatar;
        const avatarUrl = rawAvatar && rawAvatar.startsWith("/") ? rawAvatar : avatarMap[String(rawAvatar)] || undefined;
        return {
          id: item.id,
          username: username,
          displayName: username,
          earnings: parseFloat(item.total_earnings),
          sessions: item.total_sessions,
          rank: item.rank_position || index + 1,
          avatarUrl: avatarUrl,
          detail: "Global",
          points: item.points || 0,
        };
      });
    } else {
      return groupRanking.map((item, index) => {
        const rawAvatar = item.avatar_url || (item as any).avatar;
        const avatarUrl = rawAvatar && rawAvatar.startsWith("/") ? rawAvatar : avatarMap[String(rawAvatar)] || undefined;
        return {
          id: item.id,
          username: item.username,
          displayName: item.first_name ? `${item.first_name} ${item.last_name || ""}`.trim() : item.username,
          earnings: parseFloat(item.earnings || "0"),
          sessions: undefined, // family ranking API might not have sessions count
          rank: index + 1,
          avatarUrl: avatarUrl,
          detail: "Meu Grupo",
          points: item.points_balance || 0,
        };
      });
    }
  };

  const dataList = getNormalizedData();
  const top1 = dataList.find((d) => d.rank === 1);
  const top2 = dataList.find((d) => d.rank === 2);
  const top3 = dataList.find((d) => d.rank === 3);
  const otherPretenders = dataList.filter((d) => d.rank > 3);

  const isUser = (username: string) => {
    if (!username || !user?.username) return false;
    return user.username.toLowerCase() === username.toLowerCase();
  };

  const isLoading = activeTab === "global" ? globalLoading : groupLoading;
  const userFamilyId = typeof user?.family === "object" && user?.family ? (user.family as any).id : user?.family;
  const hasFamily = !!userFamilyId;

  return (
    <div className="container max-w-lg mx-auto px-4 py-8 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">RANKING</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Quem mais lucrou no trono este mês
          </p>
        </div>
        <div className="bg-amber-500/10 p-2.5 rounded-2xl border border-amber-500/20 text-gold shadow-sm">
          <Trophy className="size-6 text-gold fill-gold/20 animate-pulse" />
        </div>
      </div>

      {/* Selector Tabs */}
      <div className="bg-card border border-border p-1.5 rounded-full flex gap-1 mb-6 shadow-inner">
        <button
          onClick={() => setActiveTab("global")}
          className={`flex-1 py-3 px-4 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            activeTab === "global"
              ? "bg-gold text-poop-dark shadow-md scale-[1.02]"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Globe className="size-4 shrink-0" />
          Global
        </button>
        <button
          onClick={() => setActiveTab("group")}
          className={`flex-1 py-3 px-4 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            activeTab === "group"
              ? "bg-gold text-poop-dark shadow-md scale-[1.02]"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="size-4 shrink-0" />
          Meu grupo
        </button>
      </div>

      {/* Placar Reset Banner */}
      <div className="bg-card border border-border rounded-3xl p-5 text-center shadow-md mb-8 relative overflow-hidden">
        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-3.5">
          ⌛ Reset Mensal do Placar Em
        </span>
        <div className="flex justify-center items-center gap-3 mb-2.5">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-foreground font-mono">{timeLeft.days}</span>
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">Dias</span>
          </div>
          <span className="text-xl font-bold text-muted-foreground/60 font-mono -mt-4">:</span>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-foreground font-mono">{timeLeft.hours}</span>
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">Hrs</span>
          </div>
          <span className="text-xl font-bold text-muted-foreground/60 font-mono -mt-4">:</span>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-foreground font-mono">{timeLeft.minutes}</span>
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">Min</span>
          </div>
          <span className="text-xl font-bold text-muted-foreground/60 font-mono -mt-4">:</span>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-foreground font-mono text-gold">{timeLeft.seconds}</span>
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">Seg</span>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground italic mt-2">
          Depois disso, todo mundo volta a cagar do zero.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p className="text-sm text-muted-foreground">Consultando o encanador dos rankings...</p>
        </div>
      ) : activeTab === "group" && !hasFamily ? (
        /* Empty Group State */
        <div className="bg-card border border-border rounded-3xl p-8 text-center shadow-lg">
          <span className="text-5xl block mb-4">💨</span>
          <h3 className="text-lg font-black text-foreground">Você não está em um grupo!</h3>
          <p className="text-xs text-muted-foreground mt-2 max-w-xs mx-auto leading-relaxed">
            Junte sua galera ou crie uma família para ver o ranking particular e disputar quem lucra mais no trono.
          </p>
          <Link href="/families" passHref>
            <Button className="mt-6 font-black bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2 mx-auto">
              Participar de uma Família <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      ) : groupError && activeTab === "group" ? (
        <div className="bg-card border border-red-500/20 text-red-500 rounded-3xl p-6 text-center shadow-sm">
          <p className="text-sm font-bold">⚠️ {groupError}</p>
        </div>
      ) : dataList.length === 0 ? (
        <div className="bg-card border border-border rounded-3xl p-8 text-center shadow-lg">
          <span className="text-5xl block mb-4">🚽</span>
          <h3 className="text-lg font-black text-foreground">Placar Vazio</h3>
          <p className="text-xs text-muted-foreground mt-1">Nenhuma cagada registrada neste mês ainda!</p>
        </div>
      ) : (
        <>
          {/* Podium (Top 3) */}
          <div className="grid grid-cols-3 gap-2 items-end mb-10 pt-8 px-1">
            {/* 2nd Place */}
            <div className="flex flex-col items-center">
              {top2 ? (
                <>
                  <div className="relative mb-2">
                    <Avatar className="size-16 border-2 border-zinc-400/50 shadow-md">
                      <AvatarImage src={top2.avatarUrl} />
                      <AvatarFallback className="bg-zinc-400/20 text-zinc-600 font-black text-base">
                        {getInitials(top2.displayName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-1.5 -right-1.5 size-6 rounded-full bg-zinc-400 text-white border-2 border-background flex items-center justify-center text-[10px] font-black">
                      2
                    </span>
                  </div>
                  <span className="text-xs font-black truncate max-w-full text-foreground text-center">
                    {isUser(top2.username) ? "Você 👊" : top2.displayName}
                  </span>
                  <span className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {formatCurrency(top2.earnings)}
                  </span>
                </>
              ) : (
                <div className="size-16 rounded-full border-2 border-dashed border-border/40 mb-2" />
              )}
              <div className="w-full bg-zinc-500/10 border-t border-zinc-500/25 h-16 rounded-t-2xl mt-4 flex items-center justify-center text-zinc-500 font-black text-xl shadow-inner">
                2
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center">
              {top1 ? (
                <>
                  <span className="text-2xl mb-1 select-none animate-bounce">👑</span>
                  <div className="relative mb-2">
                    <Avatar className="size-20 border-4 border-gold shadow-lg ring-4 ring-gold/20">
                      <AvatarImage src={top1.avatarUrl} />
                      <AvatarFallback className="bg-gold/20 text-poop font-black text-lg">
                        {getInitials(top1.displayName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-1.5 -right-1.5 size-7 rounded-full bg-gold text-poop-dark border-2 border-background flex items-center justify-center text-xs font-black shadow-md">
                      1
                    </span>
                  </div>
                  <span className="text-sm font-black truncate max-w-full text-foreground text-center">
                    {isUser(top1.username) ? "Você 👊" : top1.displayName}
                  </span>
                  <span className="text-xs font-black text-gold mt-0.5">
                    {formatCurrency(top1.earnings)}
                  </span>
                </>
              ) : (
                <div className="size-20 rounded-full border-2 border-dashed border-border/40 mb-2" />
              )}
              <div className="w-full bg-gold/10 border-t border-gold/40 h-24 rounded-t-2xl mt-4 flex items-center justify-center text-gold font-black text-2xl shadow-md">
                1
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center">
              {top3 ? (
                <>
                  <div className="relative mb-2">
                    <Avatar className="size-14 border-2 border-amber-600/50 shadow-md">
                      <AvatarImage src={top3.avatarUrl} />
                      <AvatarFallback className="bg-amber-600/20 text-amber-800 font-black text-sm">
                        {getInitials(top3.displayName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-1.5 -right-1.5 size-6 rounded-full bg-amber-600 text-white border-2 border-background flex items-center justify-center text-[10px] font-black">
                      3
                    </span>
                  </div>
                  <span className="text-xs font-black truncate max-w-full text-foreground text-center">
                    {isUser(top3.username) ? "Você 👊" : top3.displayName}
                  </span>
                  <span className="text-[10px] font-black text-amber-600 dark:text-amber-500 mt-0.5">
                    {formatCurrency(top3.earnings)}
                  </span>
                </>
              ) : (
                <div className="size-14 rounded-full border-2 border-dashed border-border/40 mb-2" />
              )}
              <div className="w-full bg-amber-700/10 border-t border-amber-700/25 h-12 rounded-t-2xl mt-4 flex items-center justify-center text-amber-700 font-black text-lg shadow-inner">
                3
              </div>
            </div>
          </div>

          {/* List of other pretenders */}
          {otherPretenders.length > 0 && (
            <div className="space-y-3">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-2 px-1">
                Os outros pretendentes ao trono
              </span>
              <div className="bg-card border border-border rounded-3xl divide-y divide-border/40 shadow-sm overflow-hidden">
                {otherPretenders.map((entry) => {
                  const userMatched = isUser(entry.username);
                  return (
                    <div
                      key={entry.id}
                      className={`flex items-center justify-between p-4 transition-colors ${
                        userMatched ? "bg-gold/5" : "hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Position */}
                        <span className={`w-5 text-center text-sm font-black ${userMatched ? "text-gold" : "text-muted-foreground"}`}>
                          {entry.rank}
                        </span>

                        {/* Avatar */}
                        <div className="relative">
                          <Avatar className="size-9 border border-border/60">
                            <AvatarImage src={entry.avatarUrl} />
                            <AvatarFallback className={`font-black text-xs ${userMatched ? "bg-gold/20 text-poop" : "bg-poop/15 text-poop"}`}>
                              {getInitials(entry.displayName)}
                            </AvatarFallback>
                          </Avatar>
                          {userMatched && (
                            <span className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 text-xs select-none leading-none border border-border">
                              💩
                            </span>
                          )}
                        </div>

                        {/* Username & Sessions */}
                        <div>
                          <p className="text-sm font-black text-foreground">
                            {userMatched ? "Você 👊" : entry.displayName}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {entry.sessions !== undefined
                              ? `${entry.detail} · ${entry.sessions} sessões`
                              : `${entry.detail}`}
                          </p>
                        </div>
                      </div>

                      {/* Earnings */}
                      <div className="text-right">
                        <p className={`text-sm font-black ${userMatched ? "text-gold" : "text-foreground"}`}>
                          {formatCurrency(entry.earnings)}
                        </p>
                        {entry.points > 0 && (
                          <div className="flex items-center justify-end gap-0.5 text-[9px] font-bold text-muted-foreground mt-0.5">
                            <Coins className="size-2.5 text-gold shrink-0" />
                            <span>{entry.points} pts</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
