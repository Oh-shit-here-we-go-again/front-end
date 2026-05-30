import { apiFetch } from "@/lib/api";
import { DjangoSession } from "../types/session.types";

export const sessionService = {
  async fetchSessions(): Promise<DjangoSession[]> {
    const data = await apiFetch("/api/sessions/") as any;
    if (Array.isArray(data)) {
      return data;
    } else if (data && Array.isArray(data.results)) {
      return data.results;
    }
    return [];
  }
};
