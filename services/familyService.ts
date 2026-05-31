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

  // Endpoint "leave" não existe no API.yaml. Mantemos assinatura, mas o hook não deve depender disso.
  // Se o backend tiver, continua funcionando; se não tiver, vai falhar e o hook vai tratar.
  leaveFamily: (familyId: string) =>
    api.delete<unknown>(`/families/${familyId}/leave/`),

  // /api/families/{id}/members/ → no YAML referencia Family, mas UI usa FamilyMember.
  getFamilyMembers: (familyId: string) =>
    api.get<FamilyMember[]>(`/families/${familyId}/members/`),

  // /api/families/{id}/ranking/ → no YAML referencia FamilyRegister (provavelmente erro).
  getFamilyRanking: (familyId: string) =>
    api.get<FamilyMember[]>(`/families/${familyId}/ranking/`),
};
