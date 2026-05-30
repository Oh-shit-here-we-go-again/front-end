// hooks/useFamilies.ts
"use client";

import { familyService } from "@/services/familyService";
import { useCallback, useState } from "react";

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
  resetSelectedFamily: () => void;
}

export function useFamilies(): UseFamiliesReturn {
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
      toast.error(
        "🚽 O vaso entupiu de novo! Não consegui puxar os detalhes dessa família. Me dá mais uma chance?",
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
        return newFamily;
      } catch (error) {
        const status = (error as { status?: number | string } | undefined)
          ?.status;
        if (status === 400) {
          toast.error(
            "💩 Já existe uma família com esse nome! Seu trono já está ocupado. Inventa outro nome, tipo 'Os Cuié Team 2', e vamos!",
          );
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
          invite_code: code.toUpperCase(),
        });
        toast.success(
          `🎉 Boooaa! Você entrou na família ${family.name}! Agora vocês vão cagar em equipe!`,
        );
        await fetchFamilies();
        return family;
      } catch (error) {
        const status = (error as { status?: number | string } | undefined)
          ?.status;

        if (status === 404) {
          toast.error(
            "🔍 Esse código de convite tá mais sumido que papel higiênico na hora H! Confere e tenta de novo.",
          );
        } else if (status === 400) {
          toast.error(
            "👥 Você já tá nessa família! Dois peidos no mesmo vaso não rolam: pede pra trocar de equipe ou entra em outra!",
          );
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
      await familyService.leaveFamily(selectedFamily.id);
      toast.info(
        `💔 Você saiu da família ${selectedFamily.name}. Que a força do 💩 esteja com você!`,
      );
      setSelectedFamily(null);
      setFamilyMembers([]);
      setFamilyRanking([]);
      await fetchFamilies();
      return true;
    } catch (error) {
      toast.error(
        "😭 Não consegui sair! O encanamento travou e o vaso ficou de drama. Tenta de novo (ou chama um encanador do trono).",
      );
      return false;
    }
  }, [selectedFamily, fetchFamilies]);

  const resetSelectedFamily = useCallback(() => {
    setSelectedFamily(null);
    setFamilyMembers([]);
    setFamilyRanking([]);
  }, []);

  // Evita o warning do React sobre setState dentro de effect: o carregamento inicia em função
  // passada pelo componente (ex: ao montar uma tela). Caso queira manter automatico, remova
  // este comentário e use useEffect com um padrão cancelável.

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
    resetSelectedFamily,
  };
}
