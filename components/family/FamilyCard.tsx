// components/family/FamilyCard.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Copy, Crown, Globe, Lock, Users } from "lucide-react";

import { AvatarCircles } from "@/components/ui/avatar-circles";
import { cn } from "@/lib/utils";

import { useState } from "react";
import { Family, FamilyMember } from "../../types/family";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface FamilyCardProps {
  family: Family;
  members?: FamilyMember[]; // primeiros membros para o AvatarCircles
  isUserFamily?: boolean;
  onViewDetails?: (id: string) => void;
  onJoin?: (code: string) => void;
  showJoinButton?: boolean;
  showCopyCode?: boolean;
  currentUserId?: string;
}

const COCO_JOKES = [
  "👑 O Trono é lindo!",
  "💩 Essa família solta um barro pesado!",
  "🧻 Papel Higiênico Premium garantido!",
  "🚽 Privada com assento quentinho!",
  "✨ Ar pós-defecação com cheirinho de rosas!",
  "🏆 Campeões de tempo de trono!",
  "💨 Silenciosos mas mortais!",
];

export function FamilyCard({
  family,
  members = [],
  isUserFamily = false,
  onViewDetails,
  onJoin,
  showJoinButton = true,
  showCopyCode = true,
  currentUserId,
}: FamilyCardProps) {
  const [copied, setCopied] = useState(false);
  const [randomJoke] = useState(
    () => COCO_JOKES[Math.floor(Math.random() * COCO_JOKES.length)],
  );

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(family.invite_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const memberCount = parseInt(family.member_count);
  const isCrowded = memberCount > 10;
  const isFull = memberCount >= 20;

  const ownerId = typeof family.owner === "object" && family.owner ? (family.owner as any).id : family.owner;

  const avatarUrls = (members ?? []).slice(0, 5).map((m) => ({
    imageUrl: m.avatar_url || "/default-avatar.png",
    profileUrl: `/profile/${m.id}`,
  }));

  const remainingMembers = Math.max(0, memberCount - avatarUrls.length);

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2",
        isUserFamily
          ? "border-gold/50 bg-gradient-to-br from-gold/5 to-transparent"
          : "border-border",
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {ownerId === currentUserId && <Crown className="size-4 text-gold" />}
            <CardTitle className="text-xl font-black tracking-tight">
              {family.name}
            </CardTitle>
          </div>
          <Badge
            variant={isCrowded ? "destructive" : "secondary"}
            className="gap-1"
          >
            <Users className="size-3" />
            {memberCount}/20
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            {isUserFamily ? (
              <Lock className="size-3" />
            ) : (
              <Globe className="size-3" />
            )}
            <span className="text-xs">
              {isUserFamily ? "Sua família 💩" : "Família pública"}
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground italic line-clamp-1 max-w-[140px]">
            {randomJoke}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {avatarUrls.length > 0 && (
              <AvatarCircles
                avatarUrls={avatarUrls}
                numPeople={remainingMembers > 0 ? remainingMembers : undefined}
                className="justify-start"
              />
            )}
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {memberCount}/20
            </span>
          </div>
        </div>

        {showCopyCode && !isUserFamily && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
            <code className="text-xs font-mono flex-1 text-center tracking-wider">
              {family.invite_code}
            </code>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2"
              onClick={handleCopyCode}
            >
              {copied ? (
                <Check className="size-3" />
              ) : (
                <Copy className="size-3" />
              )}
              <span className="text-xs ml-1">
                {copied ? "Copiado!" : "Código"}
              </span>
            </Button>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {onViewDetails && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onViewDetails(family.id)}
            >
              Ver o Vaso
            </Button>
          )}
          {showJoinButton && !isUserFamily && onJoin && (
            <Button
              size="sm"
              className="flex-1 bg-poop hover:bg-poop/90"
              onClick={() => onJoin(family.invite_code)}
              disabled={isFull}
            >
              {isFull ? "💩 Lotado!" : "🚽 Sentar no Trono"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
