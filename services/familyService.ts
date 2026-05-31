// services/familyService.ts
import { api } from "@/lib/api";
import {
  Family,
  FamilyMember,
  FamilyRegister,
  JoinFamilyRequest,
  Paginated,
} from "../types/family";

export const familyService = {
  // /api/families/ → PaginatedFamilyList (API.yaml)
  listFamilies: (page = 1) =>
    api.get<Paginated<Family>>(`/families/?page=${page}`),

  // /api/families/{id}/ → Family
  getFamily: (id: string) => api.get<Family>(`/families/${id}/`),

  // /api/families/ (POST) → FamilyRegister (schema de retorno no YAML está estranho)
  // na prática o backend retorna Family; nosso hook/UX espera nome/código.
  createFamily: (data: FamilyRegister) => api.post<Family>("/families/", data),

  // /api/families/join/ (POST) → Family
  joinFamily: (data: JoinFamilyRequest) =>
    api.post<Family>("/families/join/", data),

  leaveFamily: () =>
    api.post<unknown>("/families/leave/", {}),

  transferOwnership: (familyId: string, userId: string) =>
    api.post<Family>(`/families/${familyId}/transfer/`, { user_id: userId }),

  deleteFamily: (familyId: string) =>
    api.delete<unknown>(`/families/${familyId}/`),

  removeMember: (familyId: string, userId: string) =>
    api.post<unknown>(`/families/${familyId}/remove_member/`, { user_id: userId }),

  // /api/families/{id}/members/ → no YAML referencia Family, mas UI usa FamilyMember.
  getFamilyMembers: (familyId: string) =>
    api.get<FamilyMember[]>(`/families/${familyId}/members/`),

  // /api/families/{id}/ranking/ → no YAML referencia FamilyRegister (provavelmente erro).
  getFamilyRanking: (familyId: string) =>
    api.get<FamilyMember[]>(`/families/${familyId}/ranking/`),
};
