"use client";

import { useState, useEffect } from "react";

import { CreateFamilyModal } from "@/components/family/CreateFamilyModal";
import { FamilyCard } from "@/components/family/FamilyCard";
import { FamilyRanking } from "@/components/family/FamilyRanking";
import { JoinFamilyModal } from "@/components/family/JoinFamilyModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { useFamilies } from "@/hooks/useFamilies";
import { useAuth } from "@/lib/auth";
import { AlertCircle, ChevronLeft, Home, UserPlus, Users, Crown, Trash2, UserMinus } from "lucide-react";
import { toast } from "sonner";
import { shopService } from "@/features/shop/services/shopService";
import { getProxiedImageUrl } from "@/lib/media";

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
    transferOwnership,
    deleteFamily,
    removeMember,
    resetSelectedFamily,
  } = useFamilies();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<"public" | "my">("public");
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    shopService.fetchShopItems()
      .then(setProducts)
      .catch((err) => console.error("Erro ao carregar avatares no grupo:", err));
  }, []);

  // Filtra as famílias para mostrar apenas a que o usuário pertence
  const userFamilyId = typeof user?.family === "object" && user?.family ? (user.family as any).id : user?.family;
  const myFamilies = families.filter((f) => f.id === userFamilyId);

  // CreateFamilyModal / JoinFamilyModal esperam Promise<void>
  const createFamilyVoid = async (name: string): Promise<void> => {
    await createFamily(name);
  };

  const joinFamilyVoid = async (code: string): Promise<void> => {
    await joinFamily(code);
  };

  if (selectedFamily) {
    const ownerId = typeof selectedFamily.owner === "object" && selectedFamily.owner
      ? (selectedFamily.owner as any).id
      : selectedFamily.owner;
    const isOwner = ownerId === user?.id;
    const isAlone = familyMembers.length <= 1;

    const handleLeaveOrDelete = async () => {
      if (isOwner) {
        if (isAlone) {
          if (confirm("⚠️ Tem certeza que deseja EXCLUIR esta família? Todos os registros serão perdidos e o grupo deixará de existir.")) {
            await deleteFamily();
          }
        } else {
          toast.error("👑 Você é o dono da família e ainda há outros membros! Transfira a liderança ou remova os membros antes de sair.");
        }
      } else {
        if (confirm("💔 Tem certeza que deseja sair desta família?")) {
          await leaveFamily();
        }
      }
    };

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
            onClick={handleLeaveOrDelete}
            className="gap-2"
          >
            {isOwner && isAlone ? (
              <>
                <Trash2 className="size-4" />
                Excluir Família
              </>
            ) : (
              <>
                <UserPlus className="size-4 rotate-180" />
                Sair da Família
              </>
            )}
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

                  const memberProduct = products.find(
                    (p) => String(p.avatar_id) === String(member.avatar) || String(p.id) === String(member.avatar)
                  );
                  const avatarUrl = memberProduct?.image_url || member.avatar_url;

                  const isMemberOwner = member.id === ownerId;

                  return (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-poop/20 flex items-center justify-center text-poop font-bold relative overflow-hidden">
                          {avatarUrl ? (
                            <img
                              src={getProxiedImageUrl(avatarUrl)}
                              alt={member.username}
                              className="size-full object-cover"
                            />
                          ) : (
                            initials
                          )}
                          {isMemberOwner && (
                            <span className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full p-0.5 z-10" title="Dono da Família">
                              <Crown className="size-3" />
                            </span>
                          )}
                        </div>

                        <div>
                          <p className="font-medium flex items-center gap-1.5">
                            {member.first_name
                              ? `${member.first_name} ${member.last_name || ""}`.trim()
                              : member.username}
                            {member.id === user?.id && (
                              <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded font-normal">
                                Você
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            @{member.username}
                          </p>
                        </div>
                      </div>

                      {/* Ações do Dono */}
                      {isOwner && member.id !== user?.id && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-amber-500 hover:text-amber-600 hover:bg-amber-500/10 rounded-full"
                            title="Transferir liderança (Passar a coroa)"
                            onClick={() => {
                              if (confirm(`👑 Tem certeza que deseja transferir a coroa (liderança) para @${member.username}?`)) {
                                transferOwnership(member.id);
                              }
                            }}
                          >
                            <Crown className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-destructive hover:bg-destructive/10 rounded-full"
                            title="Remover da família (Expulsar)"
                            onClick={() => {
                              if (confirm(`🚽 Tem certeza que deseja remover @${member.username} da família?`)) {
                                removeMember(member.id);
                              }
                            }}
                          >
                            <UserMinus className="size-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <FamilyRanking members={familyRanking} products={products} />
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
        <JoinFamilyModal onJoin={joinFamilyVoid} isJoining={isJoining} disabled={!!userFamilyId} />
      </div>

      {userFamilyId && (
        <p className="text-center text-xs text-amber-600 dark:text-amber-500 font-bold max-w-sm sm:max-w-md mx-auto mt-2 leading-relaxed bg-amber-500/5 border border-amber-500/10 rounded-xl p-3">
          🔒 Seu traseiro já tem dono! Você já está em uma família. A entrada via código foi bloqueada. Para trocar de ares, crie seu próprio grupo.
        </p>
      )}

      <div className="mt-6">
        <div className="flex items-center justify-center gap-3">
          <Button
            type="button"
            variant={activeTab === "public" ? "default" : "outline"}
            onClick={() => setActiveTab("public")}
            className="gap-2"
          >
            <Users className="size-4" />
            Grupos Públicos
          </Button>
          <Button
            type="button"
            variant={activeTab === "my" ? "default" : "outline"}
            onClick={() => setActiveTab("my")}
            className="gap-2"
          >
            <Home className="size-4" />
            Meus Grupos
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
                    isUserFamily={family.id === userFamilyId}
                    onViewDetails={fetchFamilyDetails}
                    onJoin={joinFamilyVoid}
                    showJoinButton={false}
                    showCopyCode={family.id === userFamilyId}
                    currentUserId={user?.id}
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
                  showCopyCode={true}
                  currentUserId={user?.id}
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
