import { apiFetch } from "@/lib/api";
import { DjangoSession } from "../types/session.types";

export const sessionService = {
  async fetchSessions(): Promise<DjangoSession[]> {
    let allSessions: DjangoSession[] = [];
    let url = "/api/sessions/";
    
    while (url) {
      const data = await apiFetch(url) as any;
      if (Array.isArray(data)) {
        allSessions = [...allSessions, ...data];
        break;
      } else if (data && Array.isArray(data.results)) {
        allSessions = [...allSessions, ...data.results];
        if (data.next) {
          try {
            const parsedUrl = new URL(data.next);
            url = parsedUrl.pathname + parsedUrl.search;
          } catch {
            break;
          }
        } else {
          break;
        }
      } else {
        break;
      }
    }
    return allSessions;
  }
};
