// components/family/FamilyRanking.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, Medal, TrendingUp, Coins } from "lucide-react";

import { cn } from "@/lib/utils";
import { FamilyMember } from "../../types/family";
import { getProxiedImageUrl } from "@/lib/media";

interface FamilyRankingProps {
  members: FamilyMember[];
  products?: any[];
}

const getRankIcon = (position: number) => {
  switch (position) {
    case 0:
      return <Crown className="size-5 text-gold" />;
    case 1:
      return <Medal className="size-5 text-zinc-400" />;
    case 2:
      return <Medal className="size-5 text-amber-600" />;
    default:
      return (
        <span className="text-sm font-bold text-muted-foreground w-5 text-center">
          #{position + 1}
        </span>
      );
  }
};

export function FamilyRanking({ members, products = [] }: FamilyRankingProps) {
  const sortedMembers = [...members].sort((a, b) => {
    const earningsA = parseFloat(a.earnings || "0");
    const earningsB = parseFloat(b.earnings || "0");
    return earningsB - earningsA;
  });

  if (members.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="size-5" />
            Ranking do Trono
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            💨 Ainda não tem ninguém nessa família... <br />
            Parece que o vaso tá vazio!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="size-5" />
          Ranking do Trono - Quem mais arrocha?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sortedMembers.map((member, index) => {
            const earnings = parseFloat(member.earnings || "0");
            const initials = (member.first_name || member.username)
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);

            return (
              <div
                key={member.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-colors",
                  index === 0 && "bg-gold/10 border border-gold/30",
                  "hover:bg-secondary/50",
                )}
              >
                <div className="w-8 flex justify-center">
                  {getRankIcon(index)}
                </div>

                {(() => {
                  const memberProduct = products.find(
                    (p) => String(p.avatar_id) === String(member.avatar) || String(p.id) === String(member.avatar) || String(p.avatar_id) === String(member.avatar_url) || String(p.id) === String(member.avatar_url)
                  );
                  const avatarUrl = memberProduct?.image_url || (member.avatar_url && member.avatar_url.startsWith("/") ? member.avatar_url : undefined);

                  return (
                    <Avatar className="size-10">
                      <AvatarImage src={getProxiedImageUrl(avatarUrl)} />
                      <AvatarFallback className="bg-poop/20 text-poop">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  );
                })()}

                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {member.first_name
                      ? `${member.first_name} ${member.last_name || ""}`.trim()
                      : member.username}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    @{member.username}
                  </p>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 font-bold text-poop">
                    <Coins className="size-3" />
                    <span>{member.points_balance || 0}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {earnings.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
