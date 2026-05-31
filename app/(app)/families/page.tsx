"use client";

import { useState } from "react";

import { CreateFamilyModal } from "@/components/family/CreateFamilyModal";
import { FamilyCard } from "@/components/family/FamilyCard";
import { FamilyRanking } from "@/components/family/FamilyRanking";
import { JoinFamilyModal } from "@/components/family/JoinFamilyModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { useFamilies } from "@/hooks/useFamilies";
import { AlertCircle, ChevronLeft, Home, UserPlus, Users } from "lucide-react";

export default function FamiliesPage() {
  const {
    families,
    selectedFamily,
    familyMembers,
    familyRanking,
    isLoading,
    isJoining,
    isCreating,
    fetchFamilyDetails,
    createFamily,
    joinFamily,
    leaveFamily,
    resetSelectedFamily,
  } = useFamilies();

  const [activeTab, setActiveTab] = useState<"public" | "my">("public");

  // Placeholder: idealmente viria do backend (ex: /me/families)
  const myFamilies = families.filter((f) => f.owner); // Ajustar com dados reais

  // CreateFamilyModal / JoinFamilyModal esperam Promise<void>
  const createFamilyVoid = async (name: string): Promise<void> => {
    await createFamily(name);
  };

  const joinFamilyVoid = async (code: string): Promise<void> => {
    await joinFamily(code);
  };

  if (selectedFamily) {
    return (
      <div className="container max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={resetSelectedFamily}
            className="shrink-0"
          >
            <ChevronLeft className="size-5" />
          </Button>

          <div>
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
              <Users className="size-7 text-poop" />
              {selectedFamily.name}
            </h1>

            <div className="flex items-center gap-3 mt-1">
              <p className="text-sm text-muted-foreground">
                Código:{" "}
                <code className="font-mono bg-muted px-2 py-0.5 rounded">
                  {selectedFamily.invite_code}
                </code>
              </p>
              <span className="text-xs text-muted-foreground">
                {parseInt(selectedFamily.member_count)}/20 membros
              </span>
            </div>
          </div>

          <div className="flex-1" />

          <Button
            variant="destructive"
            size="sm"
            onClick={leaveFamily}
            className="gap-2"
          >
            <UserPlus className="size-4 rotate-180" />
            Sair da Família
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="size-5" />
                Membros do Trono
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                {familyMembers.map((member) => {
                  const initials = (member.first_name || member.username)
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50"
                    >
                      <div className="size-10 rounded-full bg-poop/20 flex items-center justify-center text-poop font-bold">
                        {initials}
                      </div>

                      <div>
                        <p className="font-medium">
                          {member.first_name
                            ? `${member.first_name} ${member.last_name || ""}`.trim()
                            : member.username}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          @{member.username}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <FamilyRanking members={familyRanking} />
        </div>

        <div className="text-center text-sm text-muted-foreground border-t pt-4 mt-4">
          💩 Lembre-se: na família que caga unida, o entupimento vem dobrado!
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-poop via-amber-600 to-gold bg-clip-text text-transparent">
          Famílias do Trono
        </h1>
        <p className="text-muted-foreground flex items-center justify-center gap-2">
          <span>🚽</span>
          Junte sua galera e caguem juntos!
          <span>💩</span>
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <CreateFamilyModal
          onCreate={createFamilyVoid}
          isCreating={isCreating}
        />
        <JoinFamilyModal onJoin={joinFamilyVoid} isJoining={isJoining} />
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-center gap-3">
          <Button
            type="button"
            variant={activeTab === "public" ? "default" : "outline"}
            onClick={() => setActiveTab("public")}
            className="gap-2"
          >
            <Users className="size-4" />
            Salas Públicas
          </Button>
          <Button
            type="button"
            variant={activeTab === "my" ? "default" : "outline"}
            onClick={() => setActiveTab("my")}
            className="gap-2"
          >
            <Home className="size-4" />
            Minhas Salas
          </Button>
        </div>

        {activeTab === "public" ? (
          <div className="mt-6">
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-48 rounded-xl" />
                ))}
              </div>
            ) : families.length === 0 ? (
              <Card className="border-dashed border-2">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <AlertCircle className="size-12 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-semibold">
                    Nenhuma família pública por aqui...
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    Parece que o vaso tá vazio! Que tal criar a primeira
                    família?
                  </p>

                  <CreateFamilyModal
                    onCreate={createFamilyVoid}
                    isCreating={isCreating}
                    trigger={
                      <Button className="mt-4 bg-poop">
                        💩 Criar Primeira Família
                      </Button>
                    }
                  />
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {families.map((family) => (
                  <FamilyCard
                    key={family.id}
                    family={family}
                    members={[]}
                    onViewDetails={fetchFamilyDetails}
                    onJoin={joinFamilyVoid}
                    showJoinButton
                    showCopyCode
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {myFamilies.map((family) => (
                <FamilyCard
                  key={family.id}
                  family={family}
                  isUserFamily
                  onViewDetails={fetchFamilyDetails}
                  showJoinButton={false}
                  showCopyCode={false}
                />
              ))}
            </div>

            {myFamilies.length === 0 && !isLoading && (
              <Card className="border-dashed border-2">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-muted-foreground">
                    Você ainda não está em nenhuma família. Entre ou crie uma!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      <div className="text-center text-xs text-muted-foreground border-t pt-6 mt-6">
        💩 Dica de ouro: famílias com mais de 10 membros ganham desconto no
        papel higiênico!
      </div>
    </div>
  );
}
