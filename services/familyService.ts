// services/familyService.ts
import { api } from "@/lib/api";
import {
  Family,
  FamilyMember,
  FamilyRegister,
  JoinFamilyRequest,
} from "../types/family";

export const familyService = {
  // Listar todas as famílias (públicas que o usuário pode entrar)
  listFamilies: (page = 1) =>
    api.get<{ results: Family[]; count: number }>("/families/?page=" + page),

  // Buscar detalhes de uma família específica
  getFamily: (id: string) =>
    api.get<Family & { members?: FamilyMember[] }>(`/families/${id}/`),

  // Criar uma nova família
  createFamily: (data: FamilyRegister) => api.post<Family>("/families/", data),

  // Entrar em uma família via código
  joinFamily: (data: JoinFamilyRequest) =>
    api.post<Family>("/families/join/", data),

  // Sair da família (DELETE no member)
  leaveFamily: (familyId: string) => api.delete(`/families/${familyId}/leave/`),

  // Buscar membros da família
  getFamilyMembers: (familyId: string) =>
    api.get<FamilyMember[]>(`/families/${familyId}/members/`),

  // Buscar ranking da família
  getFamilyRanking: (familyId: string) =>
    api.get<FamilyMember[]>(`/families/${familyId}/ranking/`),
};
