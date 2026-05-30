// components/family/FamilyCard.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Copy, Crown, Globe, Lock, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Family } from "../../types/family";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface FamilyCardProps {
  family: Family;
  isUserFamily?: boolean;
  onViewDetails?: (id: string) => void;
  onJoin?: (code: string) => void;
  showJoinButton?: boolean;
  showCopyCode?: boolean;
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
  isUserFamily = false,
  onViewDetails,
  onJoin,
  showJoinButton = true,
  showCopyCode = true,
}: FamilyCardProps) {
  const [copied, setCopied] = useState(false);
  const randomJoke = COCO_JOKES[0];

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(family.invite_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const memberCount = parseInt(family.member_count);
  const isCrowded = memberCount > 10;
  const isFull = memberCount >= 20;

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
            {family.owner && <Crown className="size-4 text-gold" />}
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
          <span className="text-xs text-muted-foreground italic">
            {randomJoke}
          </span>
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
