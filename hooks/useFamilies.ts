// hooks/useFamilies.ts
"use client";

import { familyService } from "@/services/familyService";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { User } from "../types/User";

import { toast } from "sonner";
import { Family, FamilyMember } from "../types/family";

interface UseFamiliesReturn {
  families: Family[];
  selectedFamily: Family | null;
  familyMembers: FamilyMember[];
  familyRanking: FamilyMember[];
  isLoading: boolean;
  isJoining: boolean;
  isCreating: boolean;
  fetchFamilies: () => Promise<void>;
  fetchFamilyDetails: (id: string) => Promise<void>;
  createFamily: (name: string) => Promise<Family | null>;
  joinFamily: (code: string) => Promise<Family | null>;
  leaveFamily: () => Promise<boolean>;
  transferOwnership: (userId: string) => Promise<boolean>;
  deleteFamily: () => Promise<boolean>;
  removeMember: (userId: string) => Promise<boolean>;
  resetSelectedFamily: () => void;
}

export function useFamilies(): UseFamiliesReturn {
  const { updateUser } = useAuth();
  const [families, setFamilies] = useState<Family[]>([]);
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [familyRanking, setFamilyRanking] = useState<FamilyMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const fetchFamilies = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await familyService.listFamilies();
      setFamilies(response.results || []);
    } catch (error) {
      console.error("Erro ao buscar famílias:", error);
      toast.error(
        "💩 A descarga das famílias travou! Seu navegador tentou, mas o trono não cooperou. Tenta de novo!",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchFamilyDetails = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      const [family, members, ranking] = await Promise.all([
        familyService.getFamily(id),
        familyService.getFamilyMembers(id),
        familyService.getFamilyRanking(id),
      ]);
      setSelectedFamily(family);
      setFamilyMembers(members);
      setFamilyRanking(ranking);
    } catch (error) {
      console.error("Erro ao buscar detalhes da família:", error);

      const maybeStatus = (error as { status?: number | string } | undefined)
        ?.status;
      const maybeData = (error as { data?: unknown } | undefined)?.data;

      console.error("Family details failure payload:", {
        maybeStatus,
        maybeData,
      });

      toast.error(
        `🚽 O vaso entupiu! Falha ao buscar detalhes (status: ${maybeStatus ?? "?"}). Confira o console para o payload do backend.`,
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createFamily = useCallback(
    async (name: string): Promise<Family | null> => {
      try {
        setIsCreating(true);
        const newFamily = await familyService.createFamily({ name });
        toast.success(
          `💩 ${name} foi criada! Agora você é o Rei/Regente do Trono Coletivo!`,
        );
        await fetchFamilies();
        try {
          const refreshedUser = await api.get<User>("/auth/me/");
          updateUser(refreshedUser);
        } catch (authErr) {
          console.error("Erro ao sincronizar usuário após criação de família:", authErr);
        }
        return newFamily;
      } catch (error) {
        const err = error as { status?: number; data?: { detail?: string; message?: string } };
        const status = err?.status;
        const detail = err?.data?.detail || err?.data?.message || "";

        if (status === 400) {
          if (detail.toLowerCase().includes("já") && (detail.toLowerCase().includes("família") || detail.toLowerCase().includes("grupo") || detail.toLowerCase().includes("membro"))) {
            toast.error(
              "🧻 Calma, segura o papel higiênico! Você já tem um trono reservado. Para criar ou entrar em uma nova família, você precisa liberar o assento atual primeiro!",
            );
          } else {
            toast.error(
              "💩 Já existe uma família com esse nome! Seu trono já está ocupado. Inventa outro nome, tipo 'Os Cuié Team 2', e vamos!",
            );
          }
        } else {
          toast.error(
            "💨 Saiu que nem peido! Não consegui criar a família. Se o vaso não colaborou, tenta mais uma vez com força e fé.",
          );
        }
        return null;
      } finally {
        setIsCreating(false);
      }
    },
    [fetchFamilies],
  );

  const joinFamily = useCallback(
    async (code: string): Promise<Family | null> => {
      try {
        setIsJoining(true);
        const family = await familyService.joinFamily({
          invite_code: code,
        });
        toast.success(
          `🎉 Boooaa! Você entrou na família ${family.name}! Agora vocês vão cagar em equipe!`,
        );
        await fetchFamilies();
        try {
          const refreshedUser = await api.get<User>("/auth/me/");
          updateUser(refreshedUser);
        } catch (authErr) {
          console.error("Erro ao sincronizar usuário após entrar na família:", authErr);
        }
        return family;
      } catch (error) {
        const err = error as { status?: number; data?: { detail?: string; message?: string } };
        const status = err?.status;
        const detail = err?.data?.detail || err?.data?.message || "";

        if (status === 404) {
          toast.error(
            "🔍 Esse código de convite tá mais sumido que papel higiênico na hora H! Confere e tenta de novo.",
          );
        } else if (status === 400) {
          if (detail.toLowerCase().includes("já") && (detail.toLowerCase().includes("família") || detail.toLowerCase().includes("grupo") || detail.toLowerCase().includes("membro"))) {
            toast.error(
              "🧻 Calma, segura o papel higiênico! Você já tem um trono reservado. Para criar ou entrar em uma nova família, você precisa liberar o assento atual primeiro!",
            );
          } else {
            toast.error(
              "👥 Você já tá nessa família! Dois peidos no mesmo vaso não rolam: pede pra trocar de equipe ou entra em outra!",
            );
          }
        } else {
          toast.error(
            "🚪 Batemos na porta, mas ninguém atendeu! Código inválido ou expirou. Dá uma revisada aí.",
          );
        }

        return null;
      } finally {
        setIsJoining(false);
      }
    },
    [fetchFamilies],
  );

  const leaveFamily = useCallback(async (): Promise<boolean> => {
    if (!selectedFamily) return false;

    try {
      await familyService.leaveFamily();
      toast.info(
        `💔 Você saiu da família ${selectedFamily.name}. Que a força do 💩 esteja com você!`,
      );
      setSelectedFamily(null);
      setFamilyMembers([]);
      setFamilyRanking([]);
      await fetchFamilies();
      try {
        const refreshedUser = await api.get<User>("/auth/me/");
        updateUser(refreshedUser);
      } catch (authErr) {
        console.error("Erro ao sincronizar usuário após sair da família:", authErr);
      }
      return true;
    } catch (error) {
      const err = error as { status?: number; data?: { detail?: string; message?: string } };
      if (err.status === 400) {
        const errorMsg = err.data?.detail || err.data?.message || "Você não pode sair desta família.";
        toast.error(`⚠️ ${errorMsg}`);
      } else {
        toast.error(
          "😭 Não consegui sair! O encanamento travou e o vaso ficou de drama. Tenta de novo (ou chama um encanador do trono).",
        );
      }
      return false;
    }
  }, [selectedFamily, fetchFamilies, updateUser]);

  const transferOwnership = useCallback(async (userId: string): Promise<boolean> => {
    if (!selectedFamily) return false;

    try {
      const updatedFamily = await familyService.transferOwnership(selectedFamily.id, userId);
      toast.success("👑 Coroa transferida com sucesso! Você não é mais o dono deste trono.");
      setSelectedFamily(updatedFamily);
      await fetchFamilies();
      try {
        const refreshedUser = await api.get<User>("/auth/me/");
        updateUser(refreshedUser);
      } catch (authErr) {
        console.error("Erro ao sincronizar usuário após transferir liderança:", authErr);
      }
      return true;
    } catch (error) {
      const err = error as { status?: number; data?: { detail?: string; message?: string } };
      const errorMsg = err.data?.detail || err.data?.message || "Não foi possível transferir a liderança.";
      toast.error(`⚠️ ${errorMsg}`);
      return false;
    }
  }, [selectedFamily, fetchFamilies, updateUser]);

  const deleteFamily = useCallback(async (): Promise<boolean> => {
    if (!selectedFamily) return false;

    try {
      await familyService.deleteFamily(selectedFamily.id);
      toast.success("💥 Família excluída! O vaso foi implodido e todos foram liberados.");
      setSelectedFamily(null);
      setFamilyMembers([]);
      setFamilyRanking([]);
      await fetchFamilies();
      try {
        const refreshedUser = await api.get<User>("/auth/me/");
        updateUser(refreshedUser);
      } catch (authErr) {
        console.error("Erro ao sincronizar usuário após excluir família:", authErr);
      }
      return true;
    } catch (error) {
      const err = error as { status?: number; data?: { detail?: string; message?: string } };
      const errorMsg = err.data?.detail || err.data?.message || "Não foi possível excluir a família.";
      toast.error(`⚠️ ${errorMsg}`);
      return false;
    }
  }, [selectedFamily, fetchFamilies, updateUser]);

  const removeMember = useCallback(async (userId: string): Promise<boolean> => {
    if (!selectedFamily) return false;

    try {
      await familyService.removeMember(selectedFamily.id, userId);
      toast.info("🚽 Membro removido com sucesso! O trono foi liberado.");
      // Recarrega detalhes da família para atualizar a lista
      const [members, ranking] = await Promise.all([
        familyService.getFamilyMembers(selectedFamily.id),
        familyService.getFamilyRanking(selectedFamily.id),
      ]);
      setFamilyMembers(members);
      setFamilyRanking(ranking);
      // Atualiza a contagem na lista geral
      await fetchFamilies();
      return true;
    } catch (error) {
      const err = error as { status?: number; data?: { detail?: string; message?: string } };
      const errorMsg = err.data?.detail || err.data?.message || "Não foi possível remover o membro.";
      toast.error(`⚠️ ${errorMsg}`);
      return false;
    }
  }, [selectedFamily, fetchFamilies]);

  const resetSelectedFamily = useCallback(() => {
    setSelectedFamily(null);
    setFamilyMembers([]);
    setFamilyRanking([]);
  }, []);

  // Carrega automaticamente a lista ao montar o hook/página.
  useEffect(() => {
    let isActive = true;

    const run = async () => {
      // Evita update de estado se o componente desmontar.
      if (!isActive) return;
      await fetchFamilies();
    };

    run();

    return () => {
      isActive = false;
    };
  }, [fetchFamilies]);

  return {
    families,
    selectedFamily,
    familyMembers,
    familyRanking,
    isLoading,
    isJoining,
    isCreating,
    fetchFamilies,
    fetchFamilyDetails,
    createFamily,
    joinFamily,
    leaveFamily,
    transferOwnership,
    deleteFamily,
    removeMember,
    resetSelectedFamily,
  };
}
